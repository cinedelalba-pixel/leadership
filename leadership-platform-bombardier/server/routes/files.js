const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const mime = require('mime-types');
const { requireAuth } = require('./auth');
const { runQuery, getQuery, allQuery } = require('../models/database');

const router = express.Router();

// Configuración de multer para subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = req.body.category === 'background' 
      ? path.join(__dirname, '../uploads/images')
      : path.join(__dirname, '../uploads/files');
    
    // Crear directorio si no existe
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

// Filtro de archivos - aceptar múltiples tipos
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    // Documentos
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PPTX
    'application/vnd.ms-powerpoint', // PPT
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
    'application/msword', // DOC
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
    'application/vnd.ms-excel', // XLS
    
    // Imágenes
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    
    // Videos
    'video/mp4',
    'video/avi',
    'video/mov',
    'video/wmv',
    'video/webm',
    'video/quicktime',
    
    // Audio
    'audio/mp3',
    'audio/wav',
    'audio/ogg',
    'audio/mpeg',
    'audio/mp4',
    
    // Archivos comprimidos
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB límite
  }
});

// Subir archivo a módulo específico
router.post('/upload/module/:moduleId', requireAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se seleccionó ningún archivo' });
    }

    const { moduleId } = req.params;
    const { description = '' } = req.body;

    // Verificar que el módulo existe
    const module = await getQuery('SELECT id FROM modules WHERE id = ?', [moduleId]);
    if (!module) {
      return res.status(404).json({ error: 'Módulo no encontrado' });
    }

    // Guardar información del archivo en la base de datos
    const result = await runQuery(`
      INSERT INTO files (filename, original_name, file_path, file_type, file_size, category, module_id, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      req.file.filename,
      req.file.originalname,
      req.file.path,
      req.file.mimetype,
      req.file.size,
      'module',
      moduleId,
      description
    ]);

    res.json({
      success: true,
      file: {
        id: result.id,
        filename: req.file.filename,
        originalName: req.file.originalname,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        description,
        url: `/uploads/files/${req.file.filename}`,
        uploadedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error al subir archivo:', error);
    res.status(500).json({ error: 'Error al subir archivo' });
  }
});

// Subir archivo a recursos
router.post('/upload/resources', requireAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se seleccionó ningún archivo' });
    }

    const { description = '' } = req.body;

    // Guardar información del archivo en la base de datos
    const result = await runQuery(`
      INSERT INTO files (filename, original_name, file_path, file_type, file_size, category, description)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      req.file.filename,
      req.file.originalname,
      req.file.path,
      req.file.mimetype,
      req.file.size,
      'resources',
      description
    ]);

    res.json({
      success: true,
      file: {
        id: result.id,
        filename: req.file.filename,
        originalName: req.file.originalname,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        description,
        url: `/uploads/files/${req.file.filename}`,
        uploadedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error al subir archivo a recursos:', error);
    res.status(500).json({ error: 'Error al subir archivo' });
  }
});

// Subir archivo a testimoniales
router.post('/upload/testimonials', requireAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se seleccionó ningún archivo' });
    }

    const { description = '' } = req.body;

    // Guardar información del archivo en la base de datos
    const result = await runQuery(`
      INSERT INTO files (filename, original_name, file_path, file_type, file_size, category, description)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      req.file.filename,
      req.file.originalname,
      req.file.path,
      req.file.mimetype,
      req.file.size,
      'testimonials',
      description
    ]);

    res.json({
      success: true,
      file: {
        id: result.id,
        filename: req.file.filename,
        originalName: req.file.originalname,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        description,
        url: `/uploads/files/${req.file.filename}`,
        uploadedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error al subir archivo a testimoniales:', error);
    res.status(500).json({ error: 'Error al subir archivo' });
  }
});

// Subir imagen de fondo
router.post('/upload/background', requireAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se seleccionó ninguna imagen' });
    }

    res.json({
      success: true,
      image: {
        filename: req.file.filename,
        url: `/uploads/images/${req.file.filename}`
      }
    });

  } catch (error) {
    console.error('Error al subir imagen de fondo:', error);
    res.status(500).json({ error: 'Error al subir imagen' });
  }
});

// Obtener archivos por categoría
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { moduleId } = req.query;

    let query = 'SELECT * FROM files WHERE category = ?';
    let params = [category];

    if (moduleId && category === 'module') {
      query += ' AND module_id = ?';
      params.push(moduleId);
    }

    query += ' ORDER BY uploaded_at DESC';

    const files = await allQuery(query, params);

    const filesWithUrls = files.map(file => ({
      id: file.id,
      filename: file.filename,
      originalName: file.original_name,
      fileType: file.file_type,
      fileSize: file.file_size,
      description: file.description,
      moduleId: file.module_id,
      url: file.category === 'background' 
        ? `/uploads/images/${file.filename}`
        : `/uploads/files/${file.filename}`,
      uploadedAt: file.uploaded_at
    }));

    res.json(filesWithUrls);

  } catch (error) {
    console.error('Error al obtener archivos:', error);
    res.status(500).json({ error: 'Error al obtener archivos' });
  }
});

// Eliminar archivo
router.delete('/:fileId', requireAuth, async (req, res) => {
  try {
    const { fileId } = req.params;

    // Obtener información del archivo
    const file = await getQuery('SELECT * FROM files WHERE id = ?', [fileId]);
    
    if (!file) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }

    // Eliminar archivo físico
    if (fs.existsSync(file.file_path)) {
      fs.unlinkSync(file.file_path);
    }

    // Eliminar de la base de datos
    await runQuery('DELETE FROM files WHERE id = ?', [fileId]);

    res.json({ success: true, message: 'Archivo eliminado correctamente' });

  } catch (error) {
    console.error('Error al eliminar archivo:', error);
    res.status(500).json({ error: 'Error al eliminar archivo' });
  }
});

module.exports = router;