const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authenticate } = require('../middleware/auth');

// ============================================================================
// FOLDER MANAGEMENT (RoboForm-style organization)
// ============================================================================

// Get all folders for user (tree structure)
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM folder_tree WHERE user_id = $1 ORDER BY path`,
      [req.user.id]
    );
    res.json({ folders: result.rows });
  } catch (error) {
    console.error('Error fetching folders:', error);
    res.status(500).json({ error: 'Failed to fetch folders' });
  }
});

// Get single folder with stats
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get folder
    const folderResult = await pool.query(
      `SELECT f.*, 
        (SELECT COUNT(*) FROM secrets WHERE folder_id = f.id) as secret_count,
        (SELECT COUNT(*) FROM folders WHERE parent_id = f.id) as subfolder_count
       FROM folders f
       WHERE f.id = $1 AND f.user_id = $2`,
      [id, req.user.id]
    );
    
    if (folderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Folder not found' });
    }
    
    // Get breadcrumb path
    const pathResult = await pool.query(
      `WITH RECURSIVE parent_chain AS (
        SELECT id, name, parent_id, 0 as level
        FROM folders
        WHERE id = $1
        UNION ALL
        SELECT f.id, f.name, f.parent_id, pc.level + 1
        FROM folders f
        JOIN parent_chain pc ON f.id = pc.parent_id
      )
      SELECT id, name FROM parent_chain ORDER BY level DESC`,
      [id]
    );
    
    res.json({ 
      folder: folderResult.rows[0],
      breadcrumb: pathResult.rows
    });
  } catch (error) {
    console.error('Error fetching folder:', error);
    res.status(500).json({ error: 'Failed to fetch folder' });
  }
});

// Create new folder
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, parent_id, icon, color } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Folder name is required' });
    }
    
    const result = await pool.query(
      `INSERT INTO folders (user_id, parent_id, name, icon, color)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.user.id, parent_id || null, name, icon || 'folder', color || null]
    );
    
    res.status(201).json({ folder: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'A folder with this name already exists in this location' });
    }
    console.error('Error creating folder:', error);
    res.status(500).json({ error: 'Failed to create folder' });
  }
});

// Update folder
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon, color, is_favorite, parent_id } = req.body;
    
    const result = await pool.query(
      `UPDATE folders 
       SET name = COALESCE($1, name),
           icon = COALESCE($2, icon),
           color = COALESCE($3, color),
           is_favorite = COALESCE($4, is_favorite),
           parent_id = COALESCE($5, parent_id),
           updated_at = NOW()
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [name, icon, color, is_favorite, parent_id, id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Folder not found' });
    }
    
    res.json({ folder: result.rows[0] });
  } catch (error) {
    console.error('Error updating folder:', error);
    res.status(500).json({ error: 'Failed to update folder' });
  }
});

// Delete folder
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { move_secrets_to } = req.query;
    
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // If move_secrets_to is provided, move secrets instead of deleting
      if (move_secrets_to) {
        await client.query(
          `UPDATE secrets SET folder_id = $1 WHERE folder_id = $2 AND user_id = $3`,
          [move_secrets_to, id, req.user.id]
        );
      } else {
        // Otherwise, orphan the secrets (set folder_id to NULL)
        await client.query(
          `UPDATE secrets SET folder_id = NULL WHERE folder_id = $1 AND user_id = $2`,
          [id, req.user.id]
        );
      }
      
      // Delete the folder (subfolders will cascade)
      const result = await client.query(
        `DELETE FROM folders WHERE id = $1 AND user_id = $2 RETURNING *`,
        [id, req.user.id]
      );
      
      if (result.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Folder not found' });
      }
      
      await client.query('COMMIT');
      res.json({ success: true, folder: result.rows[0] });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error deleting folder:', error);
    res.status(500).json({ error: 'Failed to delete folder' });
  }
});

// Move folder to another parent
router.post('/:id/move', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { parent_id } = req.body;
    
    // Prevent moving to self or descendant
    if (parent_id) {
      const checkResult = await pool.query(
        `WITH RECURSIVE descendants AS (
          SELECT id FROM folders WHERE id = $1
          UNION ALL
          SELECT f.id FROM folders f
          JOIN descendants d ON f.parent_id = d.id
        )
        SELECT 1 FROM descendants WHERE id = $2`,
        [id, parent_id]
      );
      
      if (checkResult.rows.length > 0) {
        return res.status(400).json({ error: 'Cannot move folder to itself or its descendant' });
      }
    }
    
    const result = await pool.query(
      `UPDATE folders 
       SET parent_id = $1, updated_at = NOW()
       WHERE id = $2 AND user_id = $3
       RETURNING *`,
      [parent_id || null, id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Folder not found' });
    }
    
    res.json({ folder: result.rows[0] });
  } catch (error) {
    console.error('Error moving folder:', error);
    res.status(500).json({ error: 'Failed to move folder' });
  }
});

// Get all secrets in folder (with subfolders)
router.get('/:id/secrets', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { include_subfolders } = req.query;
    
    let query;
    let params;
    
    if (include_subfolders === 'true') {
      // Get secrets from this folder and all subfolders
      query = `
        WITH RECURSIVE folder_tree AS (
          SELECT id FROM folders WHERE id = $1 AND user_id = $2
          UNION ALL
          SELECT f.id FROM folders f
          JOIN folder_tree ft ON f.parent_id = ft.id
        )
        SELECT s.*, st.label as type_label, st.icon as type_icon
        FROM secrets s
        LEFT JOIN secret_types st ON s.type = st.name
        WHERE s.folder_id IN (SELECT id FROM folder_tree)
          AND s.user_id = $2
        ORDER BY s.is_favorite DESC, s.name ASC
      `;
      params = [id, req.user.id];
    } else {
      // Get secrets only from this folder
      query = `
        SELECT s.*, st.label as type_label, st.icon as type_icon
        FROM secrets s
        LEFT JOIN secret_types st ON s.type = st.name
        WHERE s.folder_id = $1 AND s.user_id = $2
        ORDER BY s.is_favorite DESC, s.name ASC
      `;
      params = [id, req.user.id];
    }
    
    const result = await pool.query(query, params);
    res.json({ secrets: result.rows });
  } catch (error) {
    console.error('Error fetching folder secrets:', error);
    res.status(500).json({ error: 'Failed to fetch secrets' });
  }
});

module.exports = router;

