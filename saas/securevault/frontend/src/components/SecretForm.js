import React, { useState, useEffect } from 'react';
import './SecretForm.css';

const SecretForm = ({ 
  secret = null, 
  onSave, 
  onCancel, 
  folders = [],
  types = []
}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'login',
    folder_id: null,
    description: '',
    url: '',
    username: '',
    notes: '',
    custom_fields: [],
    is_favorite: false,
    expires_at: '',
    auto_rotate: false,
    rotation_interval_days: null,
    tags: []
  });

  const [currentType, setCurrentType] = useState(null);
  const [template, setTemplate] = useState(null);
  const [fieldValues, setFieldValues] = useState({});
  const [newTag, setNewTag] = useState('');
  const [showPassword, setShowPassword] = useState({});
  const [generating, setGenerating] = useState(false);

  // Load secret data if editing
  useEffect(() => {
    if (secret) {
      setFormData({
        ...secret,
        tags: secret.tags || []
      });
      setFieldValues(secret.custom_fields || {});
    }
  }, [secret]);

  // Load template when type changes
  useEffect(() => {
    const loadTemplate = async () => {
      if (!formData.type) return;
      
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/secrets-pro/types/${formData.type}/template`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          setTemplate(data.template);
          
          // Initialize field values from template
          const typeInfo = types.find(t => t.name === formData.type);
          setCurrentType(typeInfo);
        }
      } catch (error) {
        console.error('Error loading template:', error);
      }
    };
    
    loadTemplate();
  }, [formData.type, types]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFieldChange = (fieldName, value) => {
    setFieldValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const generatePassword = async (fieldName, length = 16) => {
    setGenerating(true);
    try {
      const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
      let password = '';
      const array = new Uint8Array(length);
      window.crypto.getRandomValues(array);
      
      for (let i = 0; i < length; i++) {
        password += charset[array[i] % charset.length];
      }
      
      handleFieldChange(fieldName, password);
    } catch (error) {
      console.error('Error generating password:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Get the main value from template fields (usually password field)
    const passwordField = template?.fields?.find(f => f.type === 'password');
    const mainValue = fieldValues[passwordField?.name || 'password'] || '';
    
    const secretData = {
      ...formData,
      value: mainValue,
      username: fieldValues.username || formData.username,
      url: fieldValues.url || formData.url,
      custom_fields: Object.entries(fieldValues).map(([name, value]) => ({
        name,
        value,
        type: template?.fields?.find(f => f.name === name)?.type || 'text'
      }))
    };
    
    onSave(secretData);
  };

  const renderField = (field) => {
    const value = fieldValues[field.name] || '';
    const fieldId = `field-${field.name}`;
    
    switch (field.type) {
      case 'password':
        return (
          <div key={field.name} className="form-field">
            <label htmlFor={fieldId}>
              {field.icon && <span className="field-icon">🔒</span>}
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <div className="password-field-group">
              <input
                id={fieldId}
                type={showPassword[field.name] ? 'text' : 'password'}
                value={value}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                required={field.required}
                className="form-input"
              />
              <button
                type="button"
                className="btn-icon"
                onClick={() => setShowPassword(prev => ({
                  ...prev,
                  [field.name]: !prev[field.name]
                }))}
                title={showPassword[field.name] ? 'Hide' : 'Show'}
              >
                {showPassword[field.name] ? '👁️' : '🙈'}
              </button>
              {field.generate && (
                <button
                  type="button"
                  className="btn-icon"
                  onClick={() => generatePassword(field.name)}
                  disabled={generating}
                  title="Generate Password"
                >
                  🎲
                </button>
              )}
            </div>
          </div>
        );
      
      case 'textarea':
        return (
          <div key={field.name} className="form-field">
            <label htmlFor={fieldId}>
              {field.icon && <span className="field-icon">📝</span>}
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <textarea
              id={fieldId}
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              required={field.required}
              className="form-textarea"
              rows={4}
            />
          </div>
        );
      
      case 'select':
        return (
          <div key={field.name} className="form-field">
            <label htmlFor={fieldId}>
              {field.icon && <span className="field-icon">📋</span>}
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <select
              id={fieldId}
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              required={field.required}
              className="form-select"
            >
              <option value="">Select...</option>
              {field.options?.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        );
      
      case 'url':
        return (
          <div key={field.name} className="form-field">
            <label htmlFor={fieldId}>
              {field.icon && <span className="field-icon">🌐</span>}
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <input
              id={fieldId}
              type="url"
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              required={field.required}
              className="form-input"
              placeholder="https://..."
            />
          </div>
        );
      
      case 'email':
        return (
          <div key={field.name} className="form-field">
            <label htmlFor={fieldId}>
              {field.icon && <span className="field-icon">📧</span>}
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <input
              id={fieldId}
              type="email"
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              required={field.required}
              className="form-input"
            />
          </div>
        );
      
      case 'number':
        return (
          <div key={field.name} className="form-field">
            <label htmlFor={fieldId}>
              {field.icon && <span className="field-icon">🔢</span>}
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <input
              id={fieldId}
              type="number"
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              required={field.required}
              className="form-input"
            />
          </div>
        );
      
      case 'totp':
        return (
          <div key={field.name} className="form-field">
            <label htmlFor={fieldId}>
              {field.icon && <span className="field-icon">🛡️</span>}
              {field.label}
            </label>
            <input
              id={fieldId}
              type="text"
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className="form-input"
              placeholder="otpauth://..."
            />
            <small className="field-hint">TOTP secret for 2FA</small>
          </div>
        );
      
      default:
        return (
          <div key={field.name} className="form-field">
            <label htmlFor={fieldId}>
              {field.icon && <span className="field-icon">📌</span>}
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <input
              id={fieldId}
              type="text"
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              required={field.required}
              className="form-input"
              autoComplete={field.mask ? 'off' : 'on'}
            />
          </div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="secret-form">
      <div className="form-header">
        <h2>{secret ? 'Edit Secret' : 'New Secret'}</h2>
        {currentType && (
          <div className="type-badge">
            <span className="type-icon">{currentType.icon}</span>
            {currentType.label}
          </div>
        )}
      </div>

      {/* Basic Info */}
      <div className="form-section">
        <h3>Basic Information</h3>
        
        <div className="form-field">
          <label htmlFor="name">Name <span className="required">*</span></label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="My secret name"
          />
        </div>

        <div className="form-field">
          <label htmlFor="type">Type</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="form-select"
          >
            {types.map(t => (
              <option key={t.name} value={t.name}>
                {t.icon} {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="folder_id">Folder</label>
          <select
            id="folder_id"
            name="folder_id"
            value={formData.folder_id || ''}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">No folder</option>
            {folders.map(f => (
              <option key={f.id} value={f.id}>
                {'  '.repeat(f.depth || 0)}{f.icon || '📁'} {f.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="description">Description</label>
          <input
            id="description"
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-input"
            placeholder="Brief description..."
          />
        </div>
      </div>

      {/* Template Fields */}
      {template && (
        <div className="form-section">
          <h3>Details</h3>
          {template.fields?.map(field => renderField(field))}
        </div>
      )}

      {/* Additional Info */}
      <div className="form-section">
        <h3>Additional Information</h3>
        
        <div className="form-field">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="form-textarea"
            rows={3}
            placeholder="Private notes..."
          />
        </div>

        <div className="form-field">
          <label htmlFor="tags">Tags</label>
          <div className="tags-input">
            <div className="tags-list">
              {formData.tags.map(tag => (
                <span key={tag} className="tag">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="tag-remove"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="tag-add">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Add tag..."
                className="form-input-sm"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="btn-sm"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="form-field-checkbox">
          <input
            id="is_favorite"
            type="checkbox"
            name="is_favorite"
            checked={formData.is_favorite}
            onChange={handleChange}
          />
          <label htmlFor="is_favorite">⭐ Mark as favorite</label>
        </div>
      </div>

      {/* Advanced Options */}
      <details className="form-section-collapsible">
        <summary>Advanced Options</summary>
        
        <div className="form-field">
          <label htmlFor="expires_at">Expiration Date</label>
          <input
            id="expires_at"
            type="date"
            name="expires_at"
            value={formData.expires_at ? formData.expires_at.split('T')[0] : ''}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-field-checkbox">
          <input
            id="auto_rotate"
            type="checkbox"
            name="auto_rotate"
            checked={formData.auto_rotate}
            onChange={handleChange}
          />
          <label htmlFor="auto_rotate">🔄 Enable automatic rotation</label>
        </div>

        {formData.auto_rotate && (
          <div className="form-field">
            <label htmlFor="rotation_interval_days">Rotation Interval (days)</label>
            <input
              id="rotation_interval_days"
              type="number"
              name="rotation_interval_days"
              value={formData.rotation_interval_days || ''}
              onChange={handleChange}
              className="form-input"
              min="1"
              max="365"
            />
          </div>
        )}
      </details>

      {/* Actions */}
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {secret ? 'Save Changes' : 'Create Secret'}
        </button>
      </div>
    </form>
  );
};

export default SecretForm;
