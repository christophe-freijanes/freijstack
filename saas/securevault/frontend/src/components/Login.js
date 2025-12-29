import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, User, LogIn } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [samlEnabled, setSamlEnabled] = useState(false);
  const [samlProvider, setSamlProvider] = useState('');
  const navigate = useNavigate();

  // Check if SSO/SAML is enabled
  useEffect(() => {
    const checkSamlStatus = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/saml/enabled`);
        setSamlEnabled(response.data.enabled);
        setSamlProvider(response.data.provider);
      } catch (err) {
        // SAML not available, continue with regular auth
        setSamlEnabled(false);
      }
    };
    checkSamlStatus();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, formData);
      onLogin(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Erreur lors de la connexion'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSamlLogin = () => {
    // Redirect to SAML login endpoint
    window.location.href = `${API_URL}/auth/saml/login`;
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <Lock size={48} className="auth-icon" />
          <h1>SecureVault</h1>
          <p>Gestionnaire de secrets sécurisé</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">
              <User size={20} />
              Nom d'utilisateur
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="johndoe"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <Lock size={20} />
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>

        {samlEnabled && (
          <>
            <div className="auth-divider">
              <span>OU</span>
            </div>

            <button 
              type="button"
              className="btn btn-sso" 
              onClick={handleSamlLogin}
              disabled={loading}
            >
              <LogIn size={20} />
              Se connecter avec {samlProvider || 'SSO'}
            </button>
          </>
        )}
        </form>

        <div className="auth-footer">
          <p>
            Pas encore de compte ? <Link to="/register">S'inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
