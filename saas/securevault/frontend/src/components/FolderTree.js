import React, { useState, useEffect } from 'react';
import './FolderTree.css';

const FolderTree = ({ 
  onFolderSelect, 
  selectedFolderId = null,
  showCounts = true,
  allowActions = true
}) => {
  const [folders, setFolders] = useState([]);
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [contextMenu, setContextMenu] = useState(null);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);

  useEffect(() => {
    loadFolders();
  }, []);

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
        
        // Auto-expand root folders
        const rootFolders = data.folders.filter(f => !f.parent_id).map(f => f.id);
        setExpandedFolders(new Set(rootFolders));
      }
    } catch (error) {
      console.error('Error loading folders:', error);
    }
  };

  const toggleFolder = (folderId) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const handleFolderClick = (folder) => {
    onFolderSelect(folder);
  };

  const handleContextMenu = (e, folder) => {
    if (!allowActions) return;
    
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      folder
    });
  };

  const handleRenameFolder = async (folder, newName) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/folders/${folder.id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name: newName })
        }
      );

      if (response.ok) {
        loadFolders();
      }
    } catch (error) {
      console.error('Error renaming folder:', error);
    }
  };

  const handleDeleteFolder = async (folder) => {
    if (!window.confirm(`Delete folder "${folder.name}"? Secrets will be moved to root.`)) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/folders/${folder.id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.ok) {
        loadFolders();
        if (selectedFolderId === folder.id) {
          onFolderSelect(null);
        }
      }
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  };

  const handleToggleFavorite = async (folder) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/folders/${folder.id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ is_favorite: !folder.is_favorite })
        }
      );

      if (response.ok) {
        loadFolders();
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleCreateFolder = async (name, parentId = null, icon = 'folder', color = null) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/folders`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, parent_id: parentId, icon, color })
        }
      );

      if (response.ok) {
        loadFolders();
        if (parentId) {
          setExpandedFolders(prev => new Set([...prev, parentId]));
        }
      }
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const renderFolder = (folder, depth = 0) => {
    const hasChildren = folders.some(f => f.parent_id === folder.id);
    const isExpanded = expandedFolders.has(folder.id);
    const isSelected = selectedFolderId === folder.id;

    return (
      <div key={folder.id} className="folder-item-wrapper">
        <div
          className={`folder-item ${isSelected ? 'selected' : ''}`}
          style={{ 
            paddingLeft: `${depth * 20 + 8}px`,
            borderLeft: folder.color ? `4px solid ${folder.color}` : 'none'
          }}
          onClick={() => handleFolderClick(folder)}
          onContextMenu={(e) => handleContextMenu(e, folder)}
        >
          {hasChildren && (
            <span
              className="folder-toggle"
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(folder.id);
              }}
            >
              {isExpanded ? '▼' : '▶'}
            </span>
          )}
          {!hasChildren && <span className="folder-spacer" />}
          
          <span className="folder-icon">{folder.icon || '📁'}</span>
          
          <span className="folder-name">{folder.name}</span>
          
          {folder.is_favorite && <span className="folder-favorite">⭐</span>}
          
          {showCounts && (
            <span className="folder-count">{folder.secret_count || 0}</span>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="folder-children">
            {folders
              .filter(f => f.parent_id === folder.id)
              .map(child => renderFolder(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    if (contextMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu]);

  return (
    <div className="folder-tree">
      <div className="folder-tree-header">
        <h3>📂 Folders</h3>
        {allowActions && (
          <button
            className="btn-icon-sm"
            onClick={() => setShowNewFolderModal(true)}
            title="New Folder"
          >
            ➕
          </button>
        )}
      </div>

      {/* Special folders */}
      <div className="folder-special">
        <div
          className={`folder-item ${selectedFolderId === null ? 'selected' : ''}`}
          onClick={() => onFolderSelect(null)}
        >
          <span className="folder-icon">🏠</span>
          <span className="folder-name">All Secrets</span>
        </div>
        
        <div
          className={`folder-item ${selectedFolderId === 'favorites' ? 'selected' : ''}`}
          onClick={() => onFolderSelect({ id: 'favorites', name: 'Favorites' })}
        >
          <span className="folder-icon">⭐</span>
          <span className="folder-name">Favorites</span>
        </div>
        
        <div
          className={`folder-item ${selectedFolderId === 'recent' ? 'selected' : ''}`}
          onClick={() => onFolderSelect({ id: 'recent', name: 'Recent' })}
        >
          <span className="folder-icon">🕒</span>
          <span className="folder-name">Recent</span>
        </div>

        <div
          className={`folder-item ${selectedFolderId === 'no-folder' ? 'selected' : ''}`}
          onClick={() => onFolderSelect({ id: 'no-folder', name: 'Unfiled' })}
        >
          <span className="folder-icon">📄</span>
          <span className="folder-name">Unfiled</span>
        </div>
      </div>

      <div className="folder-divider" />

      {/* User folders */}
      <div className="folder-list">
        {folders
          .filter(f => !f.parent_id)
          .map(folder => renderFolder(folder, 0))}
      </div>

      {folders.length === 0 && (
        <div className="folder-empty">
          <p>No folders yet</p>
          {allowActions && (
            <button
              className="btn-create-folder"
              onClick={() => setShowNewFolderModal(true)}
            >
              Create your first folder
            </button>
          )}
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button onClick={() => {
            setEditingFolder(contextMenu.folder);
            setContextMenu(null);
          }}>
            ✏️ Rename
          </button>
          <button onClick={() => {
            handleToggleFavorite(contextMenu.folder);
            setContextMenu(null);
          }}>
            {contextMenu.folder.is_favorite ? '☆' : '⭐'} 
            {contextMenu.folder.is_favorite ? ' Unfavorite' : ' Favorite'}
          </button>
          <button onClick={() => {
            setShowNewFolderModal({ parent: contextMenu.folder });
            setContextMenu(null);
          }}>
            ➕ New subfolder
          </button>
          <button
            className="context-menu-danger"
            onClick={() => {
              handleDeleteFolder(contextMenu.folder);
              setContextMenu(null);
            }}
          >
            🗑️ Delete
          </button>
        </div>
      )}

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <NewFolderModal
          parent={showNewFolderModal.parent || null}
          onSave={(name, icon, color) => {
            handleCreateFolder(name, showNewFolderModal.parent?.id, icon, color);
            setShowNewFolderModal(false);
          }}
          onCancel={() => setShowNewFolderModal(false)}
        />
      )}

      {/* Edit Folder Modal */}
      {editingFolder && (
        <EditFolderModal
          folder={editingFolder}
          onSave={(newName) => {
            handleRenameFolder(editingFolder, newName);
            setEditingFolder(null);
          }}
          onCancel={() => setEditingFolder(null)}
        />
      )}
    </div>
  );
};

// New Folder Modal Component
const NewFolderModal = ({ parent, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('📁');
  const [color, setColor] = useState('#2196F3');

  const commonIcons = ['📁', '📂', '🏠', '💼', '🏦', '🔐', '🌐', '🎮', '🎵', '📱', '💻', '🚀'];
  const commonColors = ['#2196F3', '#4CAF50', '#FF9800', '#F44336', '#9C27B0', '#607D8B'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim(), icon, color);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>New Folder {parent && `in "${parent.name}"`}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Folder Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter folder name..."
              autoFocus
            />
          </div>

          <div className="form-field">
            <label>Icon</label>
            <div className="icon-picker">
              {commonIcons.map(ic => (
                <button
                  key={ic}
                  type="button"
                  className={`icon-option ${icon === ic ? 'selected' : ''}`}
                  onClick={() => setIcon(ic)}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div className="form-field">
            <label>Color</label>
            <div className="color-picker">
              {commonColors.map(c => (
                <button
                  key={c}
                  type="button"
                  className={`color-option ${color === c ? 'selected' : ''}`}
                  style={{ background: c }}
                  onClick={() => setColor(c)}
                />
              ))}
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="color-input"
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Folder Modal Component
const EditFolderModal = ({ folder, onSave, onCancel }) => {
  const [name, setName] = useState(folder.name);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && name !== folder.name) {
      onSave(name.trim());
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Rename Folder</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Folder Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FolderTree;
