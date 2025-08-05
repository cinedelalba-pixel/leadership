const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.join(__dirname, '../database.db');
const db = new sqlite3.Database(dbPath);

// Función para ejecutar queries con promesas
function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
}

// Función para obtener datos
function getQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

// Función para obtener múltiples filas
function allQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Inicializar base de datos
async function initializeDatabase() {
  try {
    // Crear tabla de usuarios
    await runQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'admin',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear tabla de contenido de página
    await runQuery(`
      CREATE TABLE IF NOT EXISTS page_content (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        section TEXT NOT NULL,
        title TEXT,
        description TEXT,
        background_image TEXT,
        data TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear tabla de módulos
    await runQuery(`
      CREATE TABLE IF NOT EXISTS modules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        topics TEXT,
        objectives TEXT,
        duration TEXT,
        start_date TEXT,
        end_date TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear tabla de archivos
    await runQuery(`
      CREATE TABLE IF NOT EXISTS files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL,
        original_name TEXT NOT NULL,
        file_path TEXT NOT NULL,
        file_type TEXT NOT NULL,
        file_size INTEGER,
        category TEXT NOT NULL,
        module_id INTEGER,
        description TEXT,
        uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (module_id) REFERENCES modules (id)
      )
    `);

    // Insertar usuario admin por defecto
    const adminExists = await getQuery('SELECT id FROM users WHERE username = ?', ['admin']);
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('bombardier2024', 10);
      await runQuery(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        ['admin', hashedPassword, 'admin']
      );
      console.log('✅ Usuario admin creado: admin / bombardier2024');
    }

    // Insertar contenido inicial
    const homeContent = await getQuery('SELECT id FROM page_content WHERE section = ?', ['home']);
    if (!homeContent) {
      await runQuery(`
        INSERT INTO page_content (section, title, description, data) VALUES 
        ('home', 'Bienvenido al programa Leadership Skills Formation', 
         'Desarrolla tus competencias de liderazgo a través de nuestro programa integral de 3 módulos diseñado específicamente para los equipos de Bombardier.',
         '{"stats": [{"title": "3 Módulos", "subtitle": "Programa Completo"}, {"title": "6 Meses", "subtitle": "Julio - Diciembre 2025"}, {"title": "Recursos", "subtitle": "Material Didáctico"}]}')
      `);
    }

    // Insertar módulos por defecto
    const modulesExist = await getQuery('SELECT id FROM modules LIMIT 1');
    if (!modulesExist) {
      const defaultModules = [
        {
          title: 'Fundamentos de Liderazgo',
          description: 'Conceptos básicos y principios fundamentales del liderazgo efectivo',
          topics: JSON.stringify([
            'Definición y tipos de liderazgo',
            'Características del líder efectivo',
            'Autoconocimiento y desarrollo personal',
            'Comunicación efectiva'
          ]),
          objectives: JSON.stringify([
            'Comprender los fundamentos del liderazgo',
            'Identificar el propio estilo de liderazgo',
            'Desarrollar habilidades de comunicación',
            'Crear un plan de desarrollo personal'
          ]),
          duration: '8 semanas',
          start_date: 'Julio 2025',
          end_date: 'Agosto 2025'
        },
        {
          title: 'Comunicación en Equipos',
          description: 'Técnicas avanzadas de comunicación y trabajo en equipo',
          topics: JSON.stringify([
            'Comunicación asertiva',
            'Manejo de conflictos',
            'Dinámicas de grupo',
            'Feedback efectivo'
          ]),
          objectives: JSON.stringify([
            'Dominar técnicas de comunicación asertiva',
            'Resolver conflictos de manera constructiva',
            'Facilitar dinámicas de equipo efectivas',
            'Proporcionar feedback constructivo'
          ]),
          duration: '8 semanas',
          start_date: 'Septiembre 2025',
          end_date: 'Octubre 2025'
        },
        {
          title: 'Liderazgo Estratégico',
          description: 'Desarrollo de visión estratégica y toma de decisiones',
          topics: JSON.stringify([
            'Pensamiento estratégico',
            'Toma de decisiones',
            'Gestión del cambio',
            'Liderazgo transformacional'
          ]),
          objectives: JSON.stringify([
            'Desarrollar pensamiento estratégico',
            'Mejorar la toma de decisiones',
            'Liderar procesos de cambio',
            'Implementar liderazgo transformacional'
          ]),
          duration: '8 semanas',
          start_date: 'Noviembre 2025',
          end_date: 'Diciembre 2025'
        }
      ];

      for (const module of defaultModules) {
        await runQuery(`
          INSERT INTO modules (title, description, topics, objectives, duration, start_date, end_date)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          module.title,
          module.description,
          module.topics,
          module.objectives,
          module.duration,
          module.start_date,
          module.end_date
        ]);
      }
      console.log('✅ Módulos por defecto creados');
    }

    console.log('✅ Base de datos inicializada correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar base de datos:', error);
    throw error;
  }
}

module.exports = {
  db,
  runQuery,
  getQuery,
  allQuery,
  initializeDatabase
};