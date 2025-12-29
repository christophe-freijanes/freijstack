const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { encrypt, decrypt } = require('../utils/crypto');

// ============================================================================
// SECRET TYPES
// ============================================================================

// Get all secret types
router.get('/types', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM secret_types ORDER BY name`
    );
    res.json({ types: result.rows });
  } catch (error) {
    console.error('Error fetching secret types:', error);
    res.status(500).json({ error: 'Failed to fetch secret types' });
  }
});

// Get template for a secret type
router.get('/types/:name/template', authenticateToken, async (req, res) => {
  try {
    const { name } = req.params;
    const result = await pool.query(
      `SELECT template FROM secret_types WHERE name = $1`,
      [name]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Secret type not found' });
    }
    
    res.json({ template: result.rows[0].template });
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ error: 'Failed to fetch template' });
  }
});

// ============================================================================
// ENHANCED SECRET OPERATIONS
// ============================================================================

// Get all secrets (with filters)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { 
      folder_id, 
      type, 
      is_favorite, 
      tag, 
      search,
      sort = 'name',
      order = 'asc',
      limit = 100,
      offset = 0
    } = req.query;
    
    let query = `
      SELECT s.*, 
        st.label as type_label, 
        st.icon as type_icon,
        f.name as folder_name,
        f.color as folder_color,
        ARRAY_AGG(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL) as tags
      FROM secrets s
      LEFT JOIN secret_types st ON s.type = st.name
      LEFT JOIN folders f ON s.folder_id = f.id
      LEFT JOIN secret_tags st2 ON s.id = st2.secret_id
      LEFT JOIN tags t ON st2.tag_id = t.id
      WHERE s.user_id = $1
    `;
    
    const params = [req.user.id];
    let paramIndex = 2;
    
    // Apply filters
    if (folder_id === 'null' || folder_id === 'none') {
      query += ` AND s.folder_id IS NULL`;
    } else if (folder_id) {
      query += ` AND s.folder_id = $${paramIndex}`;
      params.push(folder_id);
      paramIndex++;
    }
    
    if (type) {
      query += ` AND s.type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }
    
    if (is_favorite === 'true') {
      query += ` AND s.is_favorite = true`;
    }
    
    if (tag) {
      query += ` AND EXISTS (
        SELECT 1 FROM secret_tags st2
        JOIN tags t ON st2.tag_id = t.id
        WHERE st2.secret_id = s.id AND t.name = $${paramIndex}
      )`;
      params.push(tag);
      paramIndex++;
    }
    
    if (search) {
      query += ` AND (
        s.name ILIKE $${paramIndex} OR
        s.description ILIKE $${paramIndex} OR
        s.username ILIKE $${paramIndex} OR
        s.url ILIKE $${paramIndex} OR
        s.notes ILIKE $${paramIndex}
      )`;
      params.push(`%${search}%`);
      paramIndex++;
    }
    
    query += ` GROUP BY s.id, st.label, st.icon, f.name, f.color`;
    
    // Sorting
    const validSortFields = ['name', 'created_at', 'updated_at', 'last_accessed_at', 'access_count', 'type'];
    const sortField = validSortFields.includes(sort) ? sort : 'name';
    const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
    
    query += ` ORDER BY s.is_favorite DESC, s.${sortField} ${sortOrder}`;
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    // Get total count
    const countResult = await pool.query(
      `SELECT COUNT(*) as total FROM secrets WHERE user_id = $1`,
      [req.user.id]
    );
    
    res.json({ 
      secrets: result.rows,
      total: parseInt(countResult.rows[0].total),
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching secrets:', error);
    res.status(500).json({ error: 'Failed to fetch secrets' });
  }
});

// Get single secret (with history)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { include_history } = req.query;
    
    // Get secret
    const secretResult = await pool.query(
      `SELECT s.*, 
        st.label as type_label, 
        st.icon as type_icon,
        st.template,
        f.name as folder_name,
        ARRAY_AGG(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL) as tags
       FROM secrets s
       LEFT JOIN secret_types st ON s.type = st.name
       LEFT JOIN folders f ON s.folder_id = f.id
       LEFT JOIN secret_tags st2 ON s.id = st2.secret_id
       LEFT JOIN tags t ON st2.tag_id = t.id
       WHERE s.id = $1 AND s.user_id = $2
       GROUP BY s.id, st.label, st.icon, st.template, f.name`,
      [id, req.user.id]
    );
    
    if (secretResult.rows.length === 0) {
      return res.status(404).json({ error: 'Secret not found' });
    }
    
    const secret = secretResult.rows[0];
    
    // Decrypt value
    secret.value = decrypt(secret.value);
    
    // Update access stats
    await pool.query(
      `UPDATE secrets 
       SET access_count = access_count + 1, last_accessed_at = NOW()
       WHERE id = $1`,
      [id]
    );
    
    // Get history if requested
    let history = [];
    if (include_history === 'true') {
      const historyResult = await pool.query(
        `SELECT id, version, changed_fields, change_reason, created_at
         FROM secret_history
         WHERE secret_id = $1
         ORDER BY version DESC
         LIMIT 20`,
        [id]
      );
      history = historyResult.rows;
    }
    
    res.json({ 
      secret,
      history
    });
  } catch (error) {
    console.error('Error fetching secret:', error);
    res.status(500).json({ error: 'Failed to fetch secret' });
  }
});

// Create new secret (enhanced)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      value,
      type = 'login',
      folder_id,
      description,
      url,
      username,
      notes,
      custom_fields = [],
      is_favorite = false,
      expires_at,
      auto_rotate = false,
      rotation_interval_days,
      tags = []
    } = req.body;
    
    if (!name || !value) {
      return res.status(400).json({ error: 'Name and value are required' });
    }
    
    const encryptedValue = encrypt(value);
    
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Create secret
      const secretResult = await client.query(
        `INSERT INTO secrets (
          user_id, name, value, type, folder_id, description, url, username,
          notes, custom_fields, is_favorite, expires_at, auto_rotate, rotation_interval_days
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *`,
        [
          req.user.id, name, encryptedValue, type, folder_id || null,
          description, url, username, notes, JSON.stringify(custom_fields),
          is_favorite, expires_at, auto_rotate, rotation_interval_days
        ]
      );
      
      const secret = secretResult.rows[0];
      
      // Add tags
      if (tags.length > 0) {
        for (const tagName of tags) {
          // Create tag if it doesn't exist
          const tagResult = await client.query(
            `INSERT INTO tags (user_id, name)
             VALUES ($1, $2)
             ON CONFLICT (user_id, name) DO UPDATE SET name = EXCLUDED.name
             RETURNING id`,
            [req.user.id, tagName]
          );
          
          // Link tag to secret
          await client.query(
            `INSERT INTO secret_tags (secret_id, tag_id)
             VALUES ($1, $2)
             ON CONFLICT DO NOTHING`,
            [secret.id, tagResult.rows[0].id]
          );
        }
      }
      
      await client.query('COMMIT');
      
      // Log action
      await pool.query(
        `INSERT INTO audit_logs (user_id, action, resource, details)
         VALUES ($1, 'secret_created', 'secret', $2)`,
        [req.user.id, JSON.stringify({ secret_id: secret.id, name, type })]
      );
      
      res.status(201).json({ secret });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating secret:', error);
    res.status(500).json({ error: 'Failed to create secret' });
  }
});

// Update secret (enhanced with history tracking)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      value,
      type,
      folder_id,
      description,
      url,
      username,
      notes,
      custom_fields,
      is_favorite,
      expires_at,
      auto_rotate,
      rotation_interval_days,
      change_reason
    } = req.body;
    
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Build update query dynamically
      const updates = [];
      const params = [];
      let paramIndex = 1;
      
      if (name !== undefined) {
        updates.push(`name = $${paramIndex}`);
        params.push(name);
        paramIndex++;
      }
      if (value !== undefined) {
        updates.push(`value = $${paramIndex}`);
        params.push(encrypt(value));
        paramIndex++;
      }
      if (type !== undefined) {
        updates.push(`type = $${paramIndex}`);
        params.push(type);
        paramIndex++;
      }
      if (folder_id !== undefined) {
        updates.push(`folder_id = $${paramIndex}`);
        params.push(folder_id);
        paramIndex++;
      }
      if (description !== undefined) {
        updates.push(`description = $${paramIndex}`);
        params.push(description);
        paramIndex++;
      }
      if (url !== undefined) {
        updates.push(`url = $${paramIndex}`);
        params.push(url);
        paramIndex++;
      }
      if (username !== undefined) {
        updates.push(`username = $${paramIndex}`);
        params.push(username);
        paramIndex++;
      }
      if (notes !== undefined) {
        updates.push(`notes = $${paramIndex}`);
        params.push(notes);
        paramIndex++;
      }
      if (custom_fields !== undefined) {
        updates.push(`custom_fields = $${paramIndex}`);
        params.push(JSON.stringify(custom_fields));
        paramIndex++;
      }
      if (is_favorite !== undefined) {
        updates.push(`is_favorite = $${paramIndex}`);
        params.push(is_favorite);
        paramIndex++;
      }
      if (expires_at !== undefined) {
        updates.push(`expires_at = $${paramIndex}`);
        params.push(expires_at);
        paramIndex++;
      }
      if (auto_rotate !== undefined) {
        updates.push(`auto_rotate = $${paramIndex}`);
        params.push(auto_rotate);
        paramIndex++;
      }
      if (rotation_interval_days !== undefined) {
        updates.push(`rotation_interval_days = $${paramIndex}`);
        params.push(rotation_interval_days);
        paramIndex++;
      }
      
      updates.push(`updated_at = NOW()`);
      
      params.push(id, req.user.id);
      
      const result = await client.query(
        `UPDATE secrets 
         SET ${updates.join(', ')}
         WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
         RETURNING *`,
        params
      );
      
      if (result.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Secret not found' });
      }
      
      await client.query('COMMIT');
      
      // Log action
      await pool.query(
        `INSERT INTO audit_logs (user_id, action, resource, details)
         VALUES ($1, 'secret_updated', 'secret', $2)`,
        [req.user.id, JSON.stringify({ secret_id: id, name, change_reason })]
      );
      
      res.json({ secret: result.rows[0] });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error updating secret:', error);
    res.status(500).json({ error: 'Failed to update secret' });
  }
});

// Get secret history version
router.get('/:id/history/:version', authenticateToken, async (req, res) => {
  try {
    const { id, version } = req.params;
    
    // Verify secret ownership
    const ownerCheck = await pool.query(
      `SELECT 1 FROM secrets WHERE id = $1 AND user_id = $2`,
      [id, req.user.id]
    );
    
    if (ownerCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Secret not found' });
    }
    
    // Get history version
    const result = await pool.query(
      `SELECT * FROM secret_history 
       WHERE secret_id = $1 AND version = $2`,
      [id, version]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Version not found' });
    }
    
    const historyEntry = result.rows[0];
    
    // Decrypt value
    if (historyEntry.value) {
      historyEntry.value = decrypt(historyEntry.value);
    }
    
    res.json({ history: historyEntry });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Restore secret from history
router.post('/:id/history/:version/restore', authenticateToken, async (req, res) => {
  try {
    const { id, version } = req.params;
    
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Get history version
      const historyResult = await client.query(
        `SELECT * FROM secret_history 
         WHERE secret_id = $1 AND version = $2`,
        [id, version]
      );
      
      if (historyResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Version not found' });
      }
      
      const historyEntry = historyResult.rows[0];
      
      // Restore to secret
      const result = await client.query(
        `UPDATE secrets 
         SET name = $1, value = $2, description = $3, url = $4, 
             username = $5, notes = $6, custom_fields = $7, updated_at = NOW()
         WHERE id = $8 AND user_id = $9
         RETURNING *`,
        [
          historyEntry.name,
          historyEntry.value,
          historyEntry.description,
          historyEntry.url,
          historyEntry.username,
          historyEntry.notes,
          historyEntry.custom_fields,
          id,
          req.user.id
        ]
      );
      
      if (result.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Secret not found' });
      }
      
      await client.query('COMMIT');
      
      // Log action
      await pool.query(
        `INSERT INTO audit_logs (user_id, action, resource, details)
         VALUES ($1, 'secret_restored', 'secret', $2)`,
        [req.user.id, JSON.stringify({ secret_id: id, from_version: version })]
      );
      
      res.json({ 
        success: true, 
        secret: result.rows[0],
        message: `Restored to version ${version}`
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error restoring secret:', error);
    res.status(500).json({ error: 'Failed to restore secret' });
  }
});

// Delete secret
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `DELETE FROM secrets WHERE id = $1 AND user_id = $2 RETURNING name`,
      [id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Secret not found' });
    }
    
    // Log action
    await pool.query(
      `INSERT INTO audit_logs (user_id, action, resource, details)
       VALUES ($1, 'secret_deleted', 'secret', $2)`,
      [req.user.id, JSON.stringify({ secret_id: id, name: result.rows[0].name })]
    );
    
    res.json({ success: true, message: 'Secret deleted successfully' });
  } catch (error) {
    console.error('Error deleting secret:', error);
    res.status(500).json({ error: 'Failed to delete secret' });
  }
});

module.exports = router;
