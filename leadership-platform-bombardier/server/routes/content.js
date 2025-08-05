const express = require('express');
const { requireAuth } = require('./auth');
const { runQuery, getQuery, allQuery } = require('../models/database');

const router = express.Router();

// Obtener contenido de página principal
router.get('/page/:section', async (req, res) => {
  try {
    const { section } = req.params;
    
    const content = await getQuery(
      'SELECT * FROM page_content WHERE section = ?',
      [section]
    );

    if (!content) {
      return res.status(404).json({ error: 'Contenido no encontrado' });
    }

    // Parsear data JSON si existe
    let parsedData = null;
    if (content.data) {
      try {
        parsedData = JSON.parse(content.data);
      } catch (e) {
        parsedData = content.data;
      }
    }

    res.json({
      id: content.id,
      section: content.section,
      title: content.title,
      description: content.description,
      backgroundImage: content.background_image,
      data: parsedData,
      updatedAt: content.updated_at
    });

  } catch (error) {
    console.error('Error al obtener contenido:', error);
    res.status(500).json({ error: 'Error al obtener contenido' });
  }
});

// Actualizar contenido de página
router.put('/page/:section', requireAuth, async (req, res) => {
  try {
    const { section } = req.params;
    const { title, description, backgroundImage, data } = req.body;

    // Convertir data a JSON string si es objeto
    const dataString = typeof data === 'object' ? JSON.stringify(data) : data;

    const result = await runQuery(`
      UPDATE page_content 
      SET title = ?, description = ?, background_image = ?, data = ?, updated_at = CURRENT_TIMESTAMP
      WHERE section = ?
    `, [title, description, backgroundImage, dataString, section]);

    if (result.changes === 0) {
      // Si no existe, crear nuevo
      await runQuery(`
        INSERT INTO page_content (section, title, description, background_image, data)
        VALUES (?, ?, ?, ?, ?)
      `, [section, title, description, backgroundImage, dataString]);
    }

    res.json({ success: true, message: 'Contenido actualizado correctamente' });

  } catch (error) {
    console.error('Error al actualizar contenido:', error);
    res.status(500).json({ error: 'Error al actualizar contenido' });
  }
});

// Obtener todos los módulos
router.get('/modules', async (req, res) => {
  try {
    const modules = await allQuery(`
      SELECT m.*, 
             COUNT(f.id) as file_count
      FROM modules m
      LEFT JOIN files f ON m.id = f.module_id
      GROUP BY m.id
      ORDER BY m.id ASC
    `);

    const modulesWithParsedData = modules.map(module => ({
      id: module.id,
      title: module.title,
      description: module.description,
      topics: module.topics ? JSON.parse(module.topics) : [],
      objectives: module.objectives ? JSON.parse(module.objectives) : [],
      duration: module.duration,
      startDate: module.start_date,
      endDate: module.end_date,
      fileCount: module.file_count,
      createdAt: module.created_at,
      updatedAt: module.updated_at
    }));

    res.json(modulesWithParsedData);

  } catch (error) {
    console.error('Error al obtener módulos:', error);
    res.status(500).json({ error: 'Error al obtener módulos' });
  }
});

// Obtener módulo específico
router.get('/modules/:moduleId', async (req, res) => {
  try {
    const { moduleId } = req.params;
    
    const module = await getQuery('SELECT * FROM modules WHERE id = ?', [moduleId]);
    
    if (!module) {
      return res.status(404).json({ error: 'Módulo no encontrado' });
    }

    // Obtener archivos del módulo
    const files = await allQuery(
      'SELECT * FROM files WHERE module_id = ? ORDER BY uploaded_at DESC',
      [moduleId]
    );

    const moduleWithFiles = {
      id: module.id,
      title: module.title,
      description: module.description,
      topics: module.topics ? JSON.parse(module.topics) : [],
      objectives: module.objectives ? JSON.parse(module.objectives) : [],
      duration: module.duration,
      startDate: module.start_date,
      endDate: module.end_date,
      files: files.map(file => ({
        id: file.id,
        filename: file.filename,
        originalName: file.original_name,
        fileType: file.file_type,
        fileSize: file.file_size,
        description: file.description,
        url: `/uploads/files/${file.filename}`,
        uploadedAt: file.uploaded_at
      })),
      createdAt: module.created_at,
      updatedAt: module.updated_at
    };

    res.json(moduleWithFiles);

  } catch (error) {
    console.error('Error al obtener módulo:', error);
    res.status(500).json({ error: 'Error al obtener módulo' });
  }
});

// Actualizar módulo
router.put('/modules/:moduleId', requireAuth, async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { title, description, topics, objectives, duration, startDate, endDate } = req.body;

    // Convertir arrays a JSON strings
    const topicsString = Array.isArray(topics) ? JSON.stringify(topics) : topics;
    const objectivesString = Array.isArray(objectives) ? JSON.stringify(objectives) : objectives;

    await runQuery(`
      UPDATE modules 
      SET title = ?, description = ?, topics = ?, objectives = ?, duration = ?, 
          start_date = ?, end_date = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [title, description, topicsString, objectivesString, duration, startDate, endDate, moduleId]);

    res.json({ success: true, message: 'Módulo actualizado correctamente' });

  } catch (error) {
    console.error('Error al actualizar módulo:', error);
    res.status(500).json({ error: 'Error al actualizar módulo' });
  }
});

// Crear nuevo módulo
router.post('/modules', requireAuth, async (req, res) => {
  try {
    const { title, description, topics, objectives, duration, startDate, endDate } = req.body;

    // Convertir arrays a JSON strings
    const topicsString = Array.isArray(topics) ? JSON.stringify(topics) : JSON.stringify([]);
    const objectivesString = Array.isArray(objectives) ? JSON.stringify(objectives) : JSON.stringify([]);

    const result = await runQuery(`
      INSERT INTO modules (title, description, topics, objectives, duration, start_date, end_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [title, description, topicsString, objectivesString, duration, startDate, endDate]);

    res.json({ 
      success: true, 
      moduleId: result.id,
      message: 'Módulo creado correctamente' 
    });

  } catch (error) {
    console.error('Error al crear módulo:', error);
    res.status(500).json({ error: 'Error al crear módulo' });
  }
});

// Eliminar módulo
router.delete('/modules/:moduleId', requireAuth, async (req, res) => {
  try {
    const { moduleId } = req.params;

    // Eliminar archivos asociados primero
    await runQuery('DELETE FROM files WHERE module_id = ?', [moduleId]);
    
    // Eliminar módulo
    await runQuery('DELETE FROM modules WHERE id = ?', [moduleId]);

    res.json({ success: true, message: 'Módulo eliminado correctamente' });

  } catch (error) {
    console.error('Error al eliminar módulo:', error);
    res.status(500).json({ error: 'Error al eliminar módulo' });
  }
});

module.exports = router;