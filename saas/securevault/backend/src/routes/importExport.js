const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { encrypt, decrypt } = require('../utils/crypto');
const multer = require('multer');
const csv = require('csv-parser');
const { Readable } = require('stream');

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// ============================================================================
// IMPORT SECRETS
// ============================================================================

// Import from CSV
router.post('/csv', authenticate, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const { folder_id } = req.body;
    const results = [];
    const errors = [];
    
    // Parse CSV
    const stream = Readable.from(req.file.buffer.toString());
    
    await new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on('data', (row) => results.push(row))
        .on('end', resolve)
        .on('error', reject);
    });
    
    if (results.length === 0) {
      return res.status(400).json({ error: 'CSV file is empty' });
    }
    
    const client = await pool.connect();
    let imported = 0;
    let failed = 0;
    
    try {
      await client.query('BEGIN');
      
      // Create import record
      const importRecord = await client.query(
        `INSERT INTO imports (user_id, source, filename, total_secrets, imported_secrets)
         VALUES ($1, 'csv', $2, $3, 0)
         RETURNING id`,
        [req.user.id, req.file.originalname, results.length]
      );
      
      const importId = importRecord.rows[0].id;
      
      // Process each row
      for (const [index, row] of results.entries()) {
        try {
          const name = row.name || row.title || row.Name || row.Title || `Imported ${index + 1}`;
          const value = row.password || row.value || row.Password || row.Value || '';
          const username = row.username || row.login || row.Username || row.Login || '';
          const url = row.url || row.website || row.URL || row.Website || '';
          const notes = row.notes || row.comment || row.Notes || row.Comment || '';
          const type = row.type || row.Type || 'login';
          
          if (!value) {
            errors.push({ row: index + 1, error: 'Missing password/value' });
            failed++;
            continue;
          }
          
          const encryptedValue = encrypt(value);
          
          await client.query(
            `INSERT INTO secrets (
              user_id, name, value, username, url, notes, type, folder_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [req.user.id, name, encryptedValue, username, url, notes, type, folder_id || null]
          );
          
          imported++;
        } catch (error) {
          errors.push({ row: index + 1, error: error.message });
          failed++;
        }
      }
      
      // Update import record
      await client.query(
        `UPDATE imports 
         SET imported_secrets = $1, failed_secrets = $2, errors = $3
         WHERE id = $4`,
        [imported, failed, JSON.stringify(errors), importId]
      );
      
      await client.query('COMMIT');
      
      res.json({
        success: true,
        imported,
        failed,
        total: results.length,
        errors: errors.length > 0 ? errors.slice(0, 10) : []
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error importing CSV:', error);
    res.status(500).json({ error: 'Failed to import CSV' });
  }
});

// Import from JSON (generic format)
router.post('/json', authenticate, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const { folder_id } = req.body;
    const data = JSON.parse(req.file.buffer.toString());
    
    if (!Array.isArray(data)) {
      return res.status(400).json({ error: 'JSON must be an array of secrets' });
    }
    
    const client = await pool.connect();
    let imported = 0;
    let failed = 0;
    const errors = [];
    
    try {
      await client.query('BEGIN');
      
      // Create import record
      const importRecord = await client.query(
        `INSERT INTO imports (user_id, source, filename, total_secrets, imported_secrets)
         VALUES ($1, 'json', $2, $3, 0)
         RETURNING id`,
        [req.user.id, req.file.originalname, data.length]
      );
      
      const importId = importRecord.rows[0].id;
      
      // Process each secret
      for (const [index, item] of data.entries()) {
        try {
          const name = item.name || `Imported ${index + 1}`;
          const value = item.password || item.value || item.secret || '';
          const username = item.username || item.login || '';
          const url = item.url || item.website || '';
          const notes = item.notes || item.comment || '';
          const description = item.description || '';
          const type = item.type || 'login';
          const customFields = item.custom_fields || item.customFields || [];
          
          if (!value) {
            errors.push({ index: index + 1, error: 'Missing password/value' });
            failed++;
            continue;
          }
          
          const encryptedValue = encrypt(value);
          
          await client.query(
            `INSERT INTO secrets (
              user_id, name, value, username, url, notes, description, type, 
              folder_id, custom_fields
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [
              req.user.id, name, encryptedValue, username, url, notes, 
              description, type, folder_id || null, JSON.stringify(customFields)
            ]
          );
          
          imported++;
        } catch (error) {
          errors.push({ index: index + 1, error: error.message });
          failed++;
        }
      }
      
      // Update import record
      await client.query(
        `UPDATE imports 
         SET imported_secrets = $1, failed_secrets = $2, errors = $3
         WHERE id = $4`,
        [imported, failed, JSON.stringify(errors), importId]
      );
      
      await client.query('COMMIT');
      
      res.json({
        success: true,
        imported,
        failed,
        total: data.length,
        errors: errors.length > 0 ? errors.slice(0, 10) : []
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error importing JSON:', error);
    res.status(500).json({ error: 'Failed to import JSON' });
  }
});

// Import from KeePass XML (simplified)
router.post('/keepass', authenticate, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Parse XML using a simple regex (for production, use xml2js library)
    const xmlContent = req.file.buffer.toString();
    const entries = [];
    
    // Extract entries (simplified - assumes KeePass 2.x XML format)
    const entryRegex = /<Entry>(.*?)<\/Entry>/gs;
    const matches = xmlContent.matchAll(entryRegex);
    
    for (const match of matches) {
      const entryXml = match[1];
      
      const getName = (key) => {
        const regex = new RegExp(`<Key>${key}</Key>\\s*<Value>(.*?)</Value>`, 's');
        const m = entryXml.match(regex);
        return m ? m[1].trim() : '';
      };
      
      entries.push({
        name: getName('Title') || 'Untitled',
        username: getName('UserName'),
        password: getName('Password'),
        url: getName('URL'),
        notes: getName('Notes')
      });
    }
    
    if (entries.length === 0) {
      return res.status(400).json({ error: 'No entries found in KeePass file' });
    }
    
    const { folder_id } = req.body;
    const client = await pool.connect();
    let imported = 0;
    let failed = 0;
    const errors = [];
    
    try {
      await client.query('BEGIN');
      
      // Create import record
      const importRecord = await client.query(
        `INSERT INTO imports (user_id, source, filename, total_secrets, imported_secrets)
         VALUES ($1, 'keepass', $2, $3, 0)
         RETURNING id`,
        [req.user.id, req.file.originalname, entries.length]
      );
      
      const importId = importRecord.rows[0].id;
      
      // Process entries
      for (const [index, entry] of entries.entries()) {
        try {
          if (!entry.password) {
            errors.push({ index: index + 1, error: 'Missing password' });
            failed++;
            continue;
          }
          
          const encryptedValue = encrypt(entry.password);
          
          await client.query(
            `INSERT INTO secrets (
              user_id, name, value, username, url, notes, type, folder_id
            ) VALUES ($1, $2, $3, $4, $5, $6, 'login', $7)`,
            [
              req.user.id, entry.name, encryptedValue, entry.username, 
              entry.url, entry.notes, folder_id || null
            ]
          );
          
          imported++;
        } catch (error) {
          errors.push({ index: index + 1, error: error.message });
          failed++;
        }
      }
      
      // Update import record
      await client.query(
        `UPDATE imports 
         SET imported_secrets = $1, failed_secrets = $2, errors = $3
         WHERE id = $4`,
        [imported, failed, JSON.stringify(errors), importId]
      );
      
      await client.query('COMMIT');
      
      res.json({
        success: true,
        imported,
        failed,
        total: entries.length,
        errors: errors.length > 0 ? errors.slice(0, 10) : []
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error importing KeePass:', error);
    res.status(500).json({ error: 'Failed to import KeePass file' });
  }
});

// ============================================================================
// EXPORT SECRETS
// ============================================================================

// Export to CSV
router.get('/csv', authenticate, async (req, res) => {
  try {
    const { folder_id, include_subfolders } = req.query;
    
    let query = `
      SELECT 
        s.name, 
        s.value, 
        s.username, 
        s.url, 
        s.notes,
        s.description,
        s.type,
        f.name as folder
      FROM secrets s
      LEFT JOIN folders f ON s.folder_id = f.id
      WHERE s.user_id = $1
    `;
    
    const params = [req.user.id];
    
    if (folder_id) {
      if (include_subfolders === 'true') {
        query += ` AND s.folder_id IN (
          WITH RECURSIVE folder_tree AS (
            SELECT id FROM folders WHERE id = $2 AND user_id = $1
            UNION ALL
            SELECT f.id FROM folders f
            JOIN folder_tree ft ON f.parent_id = ft.id
          )
          SELECT id FROM folder_tree
        )`;
      } else {
        query += ` AND s.folder_id = $2`;
      }
      params.push(folder_id);
    }
    
    query += ` ORDER BY s.name`;
    
    const result = await pool.query(query, params);
    
    // Decrypt passwords
    const secrets = result.rows.map(s => ({
      ...s,
      password: decrypt(s.value)
    }));
    
    // Generate CSV
    const headers = ['name', 'username', 'password', 'url', 'notes', 'description', 'type', 'folder'];
    const csvLines = [headers.join(',')];
    
    for (const secret of secrets) {
      const row = headers.map(h => {
        const value = secret[h] || '';
        // Escape quotes and wrap in quotes if contains comma
        return value.includes(',') || value.includes('"') 
          ? `"${value.replace(/"/g, '""')}"` 
          : value;
      });
      csvLines.push(row.join(','));
    }
    
    const csv = csvLines.join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="securevault-export-${Date.now()}.csv"`);
    res.send(csv);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    res.status(500).json({ error: 'Failed to export CSV' });
  }
});

// Export to JSON
router.get('/json', authenticate, async (req, res) => {
  try {
    const { folder_id, include_subfolders } = req.query;
    
    let query = `
      SELECT 
        s.id,
        s.name, 
        s.value, 
        s.username, 
        s.url, 
        s.notes,
        s.description,
        s.type,
        s.custom_fields,
        s.is_favorite,
        s.expires_at,
        f.name as folder_name,
        ARRAY_AGG(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL) as tags
      FROM secrets s
      LEFT JOIN folders f ON s.folder_id = f.id
      LEFT JOIN secret_tags st ON s.id = st.secret_id
      LEFT JOIN tags t ON st.tag_id = t.id
      WHERE s.user_id = $1
    `;
    
    const params = [req.user.id];
    
    if (folder_id) {
      if (include_subfolders === 'true') {
        query += ` AND s.folder_id IN (
          WITH RECURSIVE folder_tree AS (
            SELECT id FROM folders WHERE id = $2 AND user_id = $1
            UNION ALL
            SELECT f.id FROM folders f
            JOIN folder_tree ft ON f.parent_id = ft.id
          )
          SELECT id FROM folder_tree
        )`;
      } else {
        query += ` AND s.folder_id = $2`;
      }
      params.push(folder_id);
    }
    
    query += ` GROUP BY s.id, f.name ORDER BY s.name`;
    
    const result = await pool.query(query, params);
    
    // Decrypt passwords
    const secrets = result.rows.map(s => ({
      name: s.name,
      password: decrypt(s.value),
      username: s.username,
      url: s.url,
      notes: s.notes,
      description: s.description,
      type: s.type,
      custom_fields: s.custom_fields,
      is_favorite: s.is_favorite,
      expires_at: s.expires_at,
      folder: s.folder_name,
      tags: s.tags || []
    }));
    
    const exportData = {
      exported_at: new Date().toISOString(),
      version: '1.0',
      source: 'SecureVault',
      secrets
    };
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="securevault-export-${Date.now()}.json"`);
    res.json(exportData);
  } catch (error) {
    console.error('Error exporting JSON:', error);
    res.status(500).json({ error: 'Failed to export JSON' });
  }
});

// Export to KeePass CSV format
router.get('/keepass-csv', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        s.name as "Title", 
        s.username as "User Name",
        s.value as "Password",
        s.url as "URL",
        s.notes as "Notes",
        f.name as "Group"
       FROM secrets s
       LEFT JOIN folders f ON s.folder_id = f.id
       WHERE s.user_id = $1
       ORDER BY s.name`,
      [req.user.id]
    );
    
    // Decrypt passwords
    const secrets = result.rows.map(s => ({
      ...s,
      Password: decrypt(s.Password)
    }));
    
    // Generate KeePass CSV format
    const headers = ['Group', 'Title', 'User Name', 'Password', 'URL', 'Notes'];
    const csvLines = [headers.join(',')];
    
    for (const secret of secrets) {
      const row = headers.map(h => {
        const value = secret[h] || '';
        return value.includes(',') || value.includes('"') 
          ? `"${value.replace(/"/g, '""')}"` 
          : value;
      });
      csvLines.push(row.join(','));
    }
    
    const csv = csvLines.join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="keepass-import-${Date.now()}.csv"`);
    res.send(csv);
  } catch (error) {
    console.error('Error exporting KeePass CSV:', error);
    res.status(500).json({ error: 'Failed to export KeePass CSV' });
  }
});

// Get import history
router.get('/history', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM imports 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 50`,
      [req.user.id]
    );
    
    res.json({ imports: result.rows });
  } catch (error) {
    console.error('Error fetching import history:', error);
    res.status(500).json({ error: 'Failed to fetch import history' });
  }
});

module.exports = router;

