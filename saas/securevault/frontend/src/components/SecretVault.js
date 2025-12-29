import React, { useState, useEffect } from 'react';
import FolderTree from './FolderTree';
import SecretForm from './SecretForm';
import './SecretVault.css';

const SecretVault = () => {
  const [secrets, setSecrets] = useState([]);
  const [folders, setFolders] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedSecret, setSelectedSecret] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [showSecretForm, setShowSecretForm] = useState(false);
  const [editingSecret, setEditingSecret] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    loadSecrets();
    loadFolders();
    loadTypes();
  }, [selectedFolder, searchQuery, filterType]);

  const loadSecrets = async () => {
    try {
      const params = new URLSearchParams();
      
      if (selectedFolder) {
        if (selectedFolder.id === 'favorites') {
          params.append('is_favorite', 'true');
        } else if (selectedFolder.id === 'no-folder') {
          params.append('folder_id', 'null');
        } else if (selectedFolder.id !== 'recent') {
          params.append('folder_id', selectedFolder.id);
        }
      }
      
      if (searchQuery) params.append('search', searchQuery);
      if (filterType) params.append('type', filterType);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/secrets-pro?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        if (selectedFolder?.id === 'recent') {
          // Sort by last_accessed_at for recent
          data.secrets.sort((a, b) => 
            new Date(b.last_accessed_at || b.updated_at) - new Date(a.last_accessed_at || a.updated_at)
          );
          setSecrets(data.secrets.slice(0, 20));
        } else {
          setSecrets(data.secrets);
        }
      }
    } catch (error) {
      console.error('Error loading secrets:', error);
    }
  };

  const loadFolders = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/folders`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setFolders(data.folders);
      }
    } catch (error) {
      console.error('Error loading folders:', error);
    }
  };

  const loadTypes = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/secrets-pro/types`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTypes(data.types);
      }
    } catch (error) {
      console.error('Error loading types:', error);
    }
  };

  const handleSaveSecret = async (secretData) => {
    try {
      const url = editingSecret
        ? `${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/secrets-pro/${editingSecret.id}`
        : `${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/secrets-pro`;
      
      const method = editingSecret ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(secretData)
      });

      if (response.ok) {
        setShowSecretForm(false);
        setEditingSecret(null);
        loadSecrets();
      }
    } catch (error) {
      console.error('Error saving secret:', error);
    }
  };

  const handleDeleteSecret = async (secretId) => {
    if (!window.confirm('Delete this secret permanently?')) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/secrets-pro/${secretId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.ok) {
        setSelectedSecret(null);
        loadSecrets();
      }
    } catch (error) {
      console.error('Error deleting secret:', error);
    }
  };

  const handleToggleFavorite = async (secret) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/secrets-pro/${secret.id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ is_favorite: !secret.is_favorite })
        }
      );

      if (response.ok) {
        loadSecrets();
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const copyToClipboard = async (text, fieldName) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const handleExport = async (format) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/import-export/${format}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `securevault-export.${format}`;
        a.click();
      }
    } catch (error) {
      console.error('Error exporting:', error);
    }
  };

  return (
    <div className="secret-vault">
      {/* Sidebar */}
      <aside className="vault-sidebar">
        <FolderTree
          onFolderSelect={setSelectedFolder}
          selectedFolderId={selectedFolder?.id}
        />
      </aside>

      {/* Main Content */}
      <main className="vault-main">
        {/* Toolbar */}
        <div className="vault-toolbar">
          <div className="toolbar-left">
            <h1 className="vault-title">
              {selectedFolder ? `${selectedFolder.icon || '📁'} ${selectedFolder.name}` : '🏠 All Secrets'}
            </h1>
            <span className="vault-count">{secrets.length} items</span>
          </div>

          <div className="toolbar-center">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search secrets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="">All types</option>
              {types.map(t => (
                <option key={t.name} value={t.name}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="toolbar-right">
            <button
              className="btn-view"
              onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
              title={viewMode === 'list' ? 'Grid View' : 'List View'}
            >
              {viewMode === 'list' ? '⊞' : '☰'}
            </button>

            <div className="btn-group">
              <button
                className="btn-primary"
                onClick={() => {
                  setEditingSecret(null);
                  setShowSecretForm(true);
                }}
              >
                ➕ New Secret
              </button>
              
              <button
                className="btn-secondary dropdown-toggle"
                onClick={() => setShowImportModal(!showImportModal)}
              >
                ⚙️
              </button>
            </div>
          </div>
        </div>

        {/* Secrets List */}
        <div className={`secrets-container ${viewMode}`}>
          {secrets.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔐</div>
              <h3>No secrets yet</h3>
              <p>Create your first secret to get started</p>
              <button
                className="btn-primary"
                onClick={() => setShowSecretForm(true)}
              >
                ➕ Create Secret
              </button>
            </div>
          ) : (
            secrets.map(secret => (
              <div
                key={secret.id}
                className={`secret-card ${selectedSecret?.id === secret.id ? 'selected' : ''}`}
                onClick={() => setSelectedSecret(secret)}
              >
                <div className="secret-header">
                  <span className="secret-type-icon">{secret.type_icon || '🔑'}</span>
                  <div className="secret-info">
                    <h3 className="secret-name">{secret.name}</h3>
                    {secret.description && (
                      <p className="secret-description">{secret.description}</p>
                    )}
                    {secret.username && (
                      <p className="secret-username">👤 {secret.username}</p>
                    )}
                  </div>
                  <button
                    className="btn-favorite"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(secret);
                    }}
                  >
                    {secret.is_favorite ? '⭐' : '☆'}
                  </button>
                </div>

                {secret.url && (
                  <div className="secret-url">
                    <span>🌐</span>
                    <a href={secret.url} target="_blank" rel="noopener noreferrer">
                      {secret.url}
                    </a>
                  </div>
                )}

                {secret.tags && secret.tags.length > 0 && (
                  <div className="secret-tags">
                    {secret.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                )}

                <div className="secret-meta">
                  <span className="secret-type-label">{secret.type_label}</span>
                  {secret.folder_name && (
                    <span className="secret-folder">📁 {secret.folder_name}</span>
                  )}
                  <span className="secret-date">
                    {new Date(secret.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Detail Panel */}
      {selectedSecret && !showSecretForm && (
        <aside className="vault-detail">
          <div className="detail-header">
            <h2>{selectedSecret.name}</h2>
            <div className="detail-actions">
              <button
                className="btn-icon"
                onClick={() => {
                  setEditingSecret(selectedSecret);
                  setShowSecretForm(true);
                }}
                title="Edit"
              >
                ✏️
              </button>
              <button
                className="btn-icon"
                onClick={() => handleDeleteSecret(selectedSecret.id)}
                title="Delete"
              >
                🗑️
              </button>
              <button
                className="btn-icon"
                onClick={() => setSelectedSecret(null)}
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="detail-content">
            <div className="detail-section">
              <label>Type</label>
              <p>{selectedSecret.type_icon} {selectedSecret.type_label}</p>
            </div>

            {selectedSecret.description && (
              <div className="detail-section">
                <label>Description</label>
                <p>{selectedSecret.description}</p>
              </div>
            )}

            {selectedSecret.username && (
              <div className="detail-section">
                <label>Username</label>
                <div className="copyable-field">
                  <p>{selectedSecret.username}</p>
                  <button
                    onClick={() => copyToClipboard(selectedSecret.username, 'username')}
                    className="btn-copy"
                  >
                    {copiedField === 'username' ? '✓' : '📋'}
                  </button>
                </div>
              </div>
            )}

            <div className="detail-section">
              <label>Password</label>
              <div className="copyable-field">
                <p className="password-hidden">••••••••</p>
                <button
                  onClick={async () => {
                    // Fetch full secret with decrypted value
                    const response = await fetch(
                      `${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/secrets-pro/${selectedSecret.id}`,
                      {
                        headers: {
                          'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                      }
                    );
                    if (response.ok) {
                      const data = await response.json();
                      copyToClipboard(data.secret.value, 'password');
                    }
                  }}
                  className="btn-copy"
                >
                  {copiedField === 'password' ? '✓' : '📋'}
                </button>
              </div>
            </div>

            {selectedSecret.url && (
              <div className="detail-section">
                <label>URL</label>
                <div className="copyable-field">
                  <a href={selectedSecret.url} target="_blank" rel="noopener noreferrer">
                    {selectedSecret.url}
                  </a>
                  <button
                    onClick={() => copyToClipboard(selectedSecret.url, 'url')}
                    className="btn-copy"
                  >
                    {copiedField === 'url' ? '✓' : '📋'}
                  </button>
                </div>
              </div>
            )}

            {selectedSecret.notes && (
              <div className="detail-section">
                <label>Notes</label>
                <p className="notes-text">{selectedSecret.notes}</p>
              </div>
            )}

            <div className="detail-section">
              <label>Last Updated</label>
              <p>{new Date(selectedSecret.updated_at).toLocaleString()}</p>
            </div>

            {selectedSecret.access_count > 0 && (
              <div className="detail-section">
                <label>Access Count</label>
                <p>{selectedSecret.access_count} times</p>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* Secret Form Modal */}
      {showSecretForm && (
        <div className="modal-overlay">
          <div className="modal-large">
            <SecretForm
              secret={editingSecret}
              onSave={handleSaveSecret}
              onCancel={() => {
                setShowSecretForm(false);
                setEditingSecret(null);
              }}
              folders={folders}
              types={types}
            />
          </div>
        </div>
      )}

      {/* Import/Export Menu */}
      {showImportModal && (
        <div className="dropdown-menu">
          <button onClick={() => handleExport('csv')}>
            📥 Export to CSV
          </button>
          <button onClick={() => handleExport('json')}>
            📥 Export to JSON
          </button>
          <button onClick={() => handleExport('keepass-csv')}>
            📥 Export to KeePass CSV
          </button>
          <div className="dropdown-divider" />
          <button onClick={() => alert('Import feature - coming soon!')}>
            📤 Import from CSV
          </button>
          <button onClick={() => alert('Import feature - coming soon!')}>
            📤 Import from JSON
          </button>
          <button onClick={() => alert('Import feature - coming soon!')}>
            📤 Import from KeePass
          </button>
        </div>
      )}
    </div>
  );
};

export default SecretVault;
