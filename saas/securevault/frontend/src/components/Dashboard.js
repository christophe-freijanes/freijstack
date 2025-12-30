import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LogOut, Plus, Eye, EyeOff, Trash2, Edit2, Shield, Clock } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

function Dashboard({ onLogout }) {
  const [secrets, setSecrets] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewingSecret, setViewingSecret] = useState(null);
  const [activeTab, setActiveTab] = useState('secrets');
  const [user, setUser] = useState(null);

  const [newSecret, setNewSecret] = useState({
    name: '',
    value: '',
    description: '',
    expires_at: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    loadSecrets();
    loadAuditLogs();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  };

  const loadSecrets = async () => {
    try {
      const response = await axios.get(`${API_URL}/secrets`, getAuthHeaders());
      setSecrets(response.data.secrets);
    } catch (error) {
      console.error('Error loading secrets:', error);
      if (error.response?.status === 401) {
        onLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const loadAuditLogs = async () => {
    try {
      const response = await axios.get(`${API_URL}/audit?limit=20`, getAuthHeaders());
      setAuditLogs(response.data.logs);
    } catch (error) {
      console.error('Error loading audit logs:', error);
    }
  };

  const handleCreateSecret = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/secrets`, newSecret, getAuthHeaders());
      setNewSecret({ name: '', value: '', description: '', expires_at: '' });
      setShowCreateModal(false);
      loadSecrets();
      loadAuditLogs();
    } catch (error) {
      alert(error.response?.data?.error || 'Erreur lors de la création');
    }
  };

  const handleViewSecret = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/secrets/${id}`, getAuthHeaders());
      setViewingSecret(response.data);
      loadAuditLogs();
    } catch (error) {
      alert(error.response?.data?.error || 'Erreur lors de la récupération');
    }
  };

  const handleDeleteSecret = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce secret ?')) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/secrets/${id}`, getAuthHeaders());
      loadSecrets();
      loadAuditLogs();
    } catch (error) {
      alert(error.response?.data?.error || 'Erreur lors de la suppression');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Jamais';
    return new Date(dateString).toLocaleString('fr-FR');
  };

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <Shield size={32} />
            <h1>SecureVault</h1>
          </div>
          <div className="header-right">
            <span className="user-info">👤 {user?.username}</span>
            <button onClick={onLogout} className="btn btn-secondary">
              <LogOut size={18} />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-tabs">
        <button 
          className={`tab ${activeTab === 'secrets' ? 'active' : ''}`}
          onClick={() => setActiveTab('secrets')}
        >
          🔐 Secrets ({secrets.length})
        </button>
        <button 
          className={`tab ${activeTab === 'audit' ? 'active' : ''}`}
          onClick={() => setActiveTab('audit')}
        >
          📝 Audit Logs ({auditLogs.length})
        </button>
        <button 
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Paramètres
        </button>
      </div>

      <main className="dashboard-content">
        {activeTab === 'settings' && (
          <div className="settings-section">
            <h2>Paramètres du compte</h2>
            <div className="settings-list">
              <div className="settings-item"><strong>Profil utilisateur</strong> (à venir)</div>
              <div className="settings-item"><strong>RBAC</strong> (contrôle d'accès, à venir)</div>
              <div className="settings-item"><strong>MFA</strong> (authentification multi-facteurs, à venir)</div>
              <div className="settings-item"><strong>SSO</strong> (connexion unique, à venir)</div>
              <div className="settings-item"><strong>Préférences</strong> (langue, thème, etc. à venir)</div>
            </div>
            <p style={{marginTop: '2rem', color: '#94a3b8'}}>⚡ Cette section est en construction pour la gestion avancée du profil, des accès et de la sécurité.</p>
          </div>
        )}
        {activeTab === 'secrets' && (
          <div className="secrets-section">
            <div className="section-header">
              <h2>Mes Secrets</h2>
              <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
                <Plus size={18} />
                Nouveau Secret
              </button>
            </div>

            <div className="secrets-grid">
              {secrets.length === 0 ? (
                <div className="empty-state">
                  <Shield size={64} />
                  <p>Aucun secret enregistré</p>
                  <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
                    Créer votre premier secret
                  </button>
                </div>
              ) : (
                secrets.map((secret) => (
                  <div key={secret.id} className="secret-card">
                    <div className="secret-header">
                      <h3>{secret.name}</h3>
                      <div className="secret-actions">
                        <button 
                          onClick={() => handleViewSecret(secret.id)} 
                          className="btn-icon"
                          title="Voir"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteSecret(secret.id)} 
                          className="btn-icon btn-danger"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <p className="secret-description">{secret.description || 'Aucune description'}</p>
                    <div className="secret-footer">
                      <span className="secret-date">
                        <Clock size={14} />
                        {formatDate(secret.created_at)}
                      </span>
                      {secret.expires_at && (
                        <span className="secret-expiry">
                          Expire: {formatDate(secret.expires_at)}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="audit-section">
            <h2>Journal d'Audit</h2>
            <div className="audit-logs">
              {auditLogs.map((log) => (
                <div key={log.id} className="audit-log-item">
                  <span className={`audit-action ${log.action.toLowerCase().replace('_', '-')}`}>
                    {log.action}
                  </span>
                  <span className="audit-details">
                    {log.resource_type} {log.resource_id && `#${log.resource_id}`}
                  </span>
                  <span className="audit-ip">{log.ip_address}</span>
                  <span className="audit-time">{formatDate(log.timestamp)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Create Secret Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Nouveau Secret</h2>
            <form onSubmit={handleCreateSecret}>
              <div className="form-group">
                <label>Nom *</label>
                <input
                  type="text"
                  value={newSecret.name}
                  onChange={(e) => setNewSecret({...newSecret, name: e.target.value})}
                  required
                  placeholder="mon-secret"
                />
              </div>
              <div className="form-group">
                <label>Valeur *</label>
                <textarea
                  value={newSecret.value}
                  onChange={(e) => setNewSecret({...newSecret, value: e.target.value})}
                  required
                  placeholder="Votre secret sécurisé"
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={newSecret.description}
                  onChange={(e) => setNewSecret({...newSecret, description: e.target.value})}
                  placeholder="Description optionnelle"
                />
              </div>
              <div className="form-group">
                <label>Expiration (optionnel)</label>
                <input
                  type="datetime-local"
                  value={newSecret.expires_at}
                  onChange={(e) => setNewSecret({...newSecret, expires_at: e.target.value})}
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-secondary">
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Secret Modal */}
      {viewingSecret && (
        <div className="modal-overlay" onClick={() => setViewingSecret(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{viewingSecret.name}</h2>
            <div className="secret-details">
              <div className="form-group">
                <label>Valeur (chiffrée)</label>
                <div className="secret-value">
                  <code>{viewingSecret.value}</code>
                </div>
              </div>
              {viewingSecret.description && (
                <div className="form-group">
                  <label>Description</label>
                  <p>{viewingSecret.description}</p>
                </div>
              )}
              <div className="secret-metadata">
                <p><strong>Créé:</strong> {formatDate(viewingSecret.created_at)}</p>
                {viewingSecret.expires_at && (
                  <p><strong>Expire:</strong> {formatDate(viewingSecret.expires_at)}</p>
                )}
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={() => setViewingSecret(null)} className="btn btn-primary">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
