import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast, Toaster } from "sonner";
import {
  Users,
  Calendar,
  BookOpen,
  Upload,
  Edit,
  Download,
  Trash2,
  Lock,
  Menu,
  X,
  FileText,
  Video,
  Music,
  Image,
  Archive
} from "lucide-react";
import { apiClient, type Module, type PageContent, type FileItem } from "@/lib/api";

// CÓDIGO HTML Y CSS PARA CRONOGRAMA Y ROADMAP
// Los he integrado directamente aquí para que se rendericen dentro de tu App de React
const roadmapHTML = `
    <style>
        .slide-container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            padding: 30px;
            min-height: 85vh;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #1e3c72;
        }

        .header h1 {
            font-size: 2.2em;
            color: #1e3c72;
            font-weight: 700;
            margin-bottom: 8px;
        }

        .header p {
            font-size: 1.1em;
            color: #666;
            font-weight: 500;
        }

        .roadmap-container {
            position: relative;
            margin: 20px 0;
        }

        .roadmap-path {
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 40px 0;
        }

        .connection-line {
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 20%, #f093fb 40%, #4facfe 60%, #43e97b 80%, #fa709a 100%);
            border-radius: 2px;
            z-index: 1;
        }

        .phase-node {
            position: relative;
            z-index: 2;
            background: white;
            border-radius: 12px;
            padding: 15px 12px;
            text-align: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            cursor: pointer;
            min-width: 150px;
            border: 3px solid;
        }

        .phase-node:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .phase-icon {
            font-size: 2em;
            margin-bottom: 5px;
            display: block;
        }

        .phase-title {
            font-size: 1em;
            font-weight: 700;
            margin-bottom: 4px;
        }

        .phase-date {
            font-size: 0.8em;
            margin-bottom: 8px;
            font-weight: 500;
        }

        .phase-activities {
            font-size: 0.7em;
            line-height: 1.2;
            opacity: 0.9;
        }

        /* Colores específicos para cada fase */
        .phase-1 {
            border-color: #667eea;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .phase-2 {
            border-color: #f093fb;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
        }
        .phase-3 {
            border-color: #4facfe;
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
        }
        .phase-4 {
            border-color: #43e97b;
            background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
            color: white;
        }
        .phase-5 {
            border-color: #fa709a;
            background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
            color: white;
        }
        .phase-6 {
            border-color: #a8edea;
            background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
            color: #333;
        }
        .phase-7 {
            border-color: #ffecd2;
            background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
            color: #333;
        }

        .timeline-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 30px 0;
            padding: 20px;
            background: #f8fafc;
            border-radius: 10px;
            border-left: 5px solid #1e3c72;
        }

        .timeline-start, .timeline-end {
            text-align: center;
            font-weight: 600;
            color: #1e3c72;
        }

        .timeline-duration {
            background: #1e3c72;
            color: white;
            padding: 12px 25px;
            border-radius: 25px;
            font-weight: 600;
            font-size: 1.1em;
        }

        .key-metrics {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin: 30px 0;
        }

        .metric-card {
            background: white;
            border-radius: 10px;
            padding: 20px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            border-top: 4px solid #1e3c72;
        }

        .metric-number {
            font-size: 2.5em;
            font-weight: 700;
            color: #1e3c72;
            margin-bottom: 5px;
        }

        .metric-label {
            font-size: 0.9em;
            color: #666;
            font-weight: 500;
        }

        .phase-details {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-top: 30px;
        }

        .detail-group {
            background: #f8fafc;
            border-radius: 10px;
            padding: 20px;
            border-left: 4px solid #667eea;
        }

        .detail-group h3 {
            color: #1e3c72;
            margin-bottom: 15px;
            font-size: 1.1em;
        }

        .detail-group ul {
            list-style: none;
            padding: 0;
        }

        .detail-group li {
            padding: 6px 0;
            font-size: 0.9em;
            color: #555;
            position: relative;
            padding-left: 20px;
        }

        .detail-group li:before {
            content: '▶';
            position: absolute;
            left: 0;
            color: #667eea;
            font-size: 0.7em;
        }

        .arrows {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            font-size: 1.5em;
            color: #667eea;
            z-index: 3;
        }

        .arrow-1 { left: 13%; }
        .arrow-2 { left: 27%; }
        .arrow-3 { left: 41%; }
        .arrow-4 { left: 55%; }
        .arrow-5 { left: 69%; }
        .arrow-6 { left: 83%; }

        /* Responsive adjustments */
        @media (max-width: 1024px) {
            .roadmap-path {
                flex-wrap: wrap;
                justify-content: center;
                gap: 15px;
            }

            .connection-line {
                display: none;
            }

            .arrows {
                display: none;
            }

            .phase-node {
                min-width: 130px;
                margin: 10px;
            }

            .key-metrics {
                grid-template-columns: repeat(2, 1fr);
            }

            .phase-details {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 768px) {
            .slide-container {
                padding: 20px;
            }

            .header h1 {
                font-size: 1.8em;
            }

            .phase-node {
                min-width: 120px;
                padding: 12px 8px;
            }

            .phase-icon {
                font-size: 1.5em;
            }

            .phase-title {
                font-size: 0.9em;
            }

            .key-metrics {
                grid-template-columns: 1fr;
            }
        }
    </style>
    <div class="slide-container">
        <div class="header">
            <h1>Leadership Skills Formation Program</h1>
            <p>Mapa de Ruta - Julio a Diciembre 2024</p>
        </div>

        <div class="timeline-info">
            <div class="timeline-start">
                <strong>INICIO</strong><br>
                Julio 2024
            </div>
            <div class="timeline-duration">
                6 MESES DE DESARROLLO
            </div>
            <div class="timeline-end">
                <strong>FINALIZACIÓN</strong><br>
                Diciembre 2024
            </div>
        </div>

        <div class="roadmap-container">
            <div class="roadmap-path">
                <div class="connection-line"></div>

                <div class="phase-node phase-1">
                    <span class="phase-icon">🔍</span>
                    <div class="phase-title">Preparación</div>
                    <div class="phase-date">Julio 2024</div>
                    <div class="phase-activities">
                        • Encuesta Engagement<br>
                        • Prep. Materiales
                    </div>
                </div>

                <div class="arrows arrow-1">→</div>

                <div class="phase-node phase-2">
                    <span class="phase-icon">🎯</span>
                    <div class="phase-title">BAMLT</div>
                    <div class="phase-date">Jul-Ago 2024</div>
                    <div class="phase-activities">
                        • Executive Brief<br>
                        • Coaching Directores
                    </div>
                </div>

                <div class="arrows arrow-2">→</div>

                <div class="phase-node phase-3">
                    <span class="phase-icon">📚</span>
                    <div class="phase-title">Módulo 1</div>
                    <div class="phase-date">Agosto 2024</div>
                    <div class="phase-activities">
                        • Grupos 1 y 2<br>
                        • Autoevaluación DISC
                    </div>
                </div>

                <div class="arrows arrow-3">→</div>

                <div class="phase-node phase-4">
                    <span class="phase-icon">🤝</span>
                    <div class="phase-title">Coaching</div>
                    <div class="phase-date">Ago-Sep 2024</div>
                    <div class="phase-activities">
                        • Follow up Grupos<br>
                        • Sesiones individuales
                    </div>
                </div>

                <div class="arrows arrow-4">→</div>

                <div class="phase-node phase-5">
                    <span class="phase-icon">📈</span>
                    <div class="phase-title">Módulo 2</div>
                    <div class="phase-date">Sep 2024</div>
                    <div class="phase-activities">
                        • Grupos 1 y 2<br>
                        • Evaluaciones
                    </div>
                </div>

                <div class="arrows arrow-5">→</div>

                <div class="phase-node phase-6">
                    <span class="phase-icon">🎓</span>
                    <div class="phase-title">Módulo 3</div>
                    <div class="phase-date">Oct-Nov 2024</div>
                    <div class="phase-activities">
                        • Grupos 1 y 2<br>
                        • Eval. Finales
                    </div>
                </div>

                <div class="arrows arrow-6">→</div>

                <div class="phase-node phase-7">
                    <span class="phase-icon">✅</span>
                    <div class="phase-title">Cierre</div>
                    <div class="phase-date">Dic 2024</div>
                    <div class="phase-activities">
                        • Certificación<br>
                        • Eval. Satisfacción
                    </div>
                </div>
            </div>
        </div>

        <div class="key-metrics">
            <div class="metric-card">
                <div class="metric-number">7</div>
                <div class="metric-label">Fases del Programa</div>
            </div>
            <div class="metric-card">
                <div class="metric-number">6</div>
                <div class="metric-label">Meses de Duración</div>
            </div>
            <div class="metric-card">
                <div class="metric-number">3</div>
                <div class="metric-label">Módulos Principales</div>
            </div>
            <div class="metric-card">
                <div class="metric-number">2</div>
                <div class="metric-label">Grupos Participantes</div>
            </div>
        </div>

        <div class="phase-details">
            <div class="detail-group">
                <h3>🎯 Componentes Clave del Programa</h3>
                <ul>
                    <li>Executive Brief Sessions (BAMLT)</li>
                    <li>Coaching personalizado con Directores</li>
                    <li>Módulos de formación estructurados</li>
                    <li>Sesiones de coaching con colaboradores</li>
                    <li>Evaluaciones continuas y feedback</li>
                    <li>Certificación final del programa</li>
                </ul>
            </div>

            <div class="detail-group">
                <h3>📊 Metodología y Herramientas</h3>
                <ul>
                    <li>Encuesta de Engagement inicial</li>
                    <li>Autoevaluación DISC integrada</li>
                    <li>Follow up grupal e individual</li>
                    <li>Evaluaciones parciales por módulo</li>
                    <li>Métricas de satisfacción y efectividad</li>
                    <li>Proceso de certificación formal</li>
                </ul>
            </div>
        </div>
    </div>
`;

const ganttChartHTML = `
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        
        .container {
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            max-width: 100%;
            overflow-x: auto;
        }
        
        h1 {
            color: #2c3e50;
            text-align: center;
            margin-bottom: 30px;
            font-size: 24px;
        }
        
        .gantt-container {
            min-width: 1200px;
            overflow-x: auto;
        }
        
        .gantt-header {
            display: flex;
            border-bottom: 2px solid #34495e;
            margin-bottom: 5px;
        }
        
        .task-column {
            width: 350px;
            font-weight: bold;
            padding: 10px;
            background: #34495e;
            color: white;
            border-right: 1px solid #fff;
        }
        
        .dates-column {
            width: 120px;
            font-weight: bold;
            padding: 10px;
            background: #34495e;
            color: white;
            border-right: 1px solid #fff;
            text-align: center;
        }
        
        .timeline-column {
            flex: 1;
            font-weight: bold;
            padding: 10px;
            background: #34495e;
            color: white;
            text-align: center;
        }
        
        .gantt-row {
            display: flex;
            border-bottom: 1px solid #ecf0f1;
            min-height: 40px;
            position: relative;
        }
        
        .gantt-row:hover {
            background-color: #f8f9fa;
        }
        
        .task-info {
            width: 350px;
            padding: 8px;
            border-right: 1px solid #bdc3c7;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        
        .task-name {
            font-weight: 600;
            font-size: 13px;
            margin-bottom: 2px;
            padding: 2px 6px;
            border-radius: 3px;
            color: white;
        }
        
        .task-name.grupo-preparacion { background: linear-gradient(135deg, #3498db, #2980b9); }
        .task-name.grupo-bamlt { background: linear-gradient(135deg, #e74c3c, #c0392b); }
        .task-name.grupo-modulo1 { background: linear-gradient(135deg, #f39c12, #e67e22); }
        .task-name.grupo-modulo2 { background: linear-gradient(135deg, #27ae60, #229954); }
        .task-name.grupo-modulo3 { background: linear-gradient(135deg, #9b59b6, #8e44ad); }
        .task-name.grupo-coaching { background: linear-gradient(135deg, #1abc9c, #16a085); }
        .task-name.grupo-cierre { background: linear-gradient(135deg, #34495e, #2c3e50); }
        .task-name.grupo-otros { background: linear-gradient(135deg, #95a5a6, #7f8c8d); }
        
        .task-details {
            font-size: 11px;
            color: #7f8c8d;
        }
        
        .task-dates {
            width: 120px;
            padding: 8px;
            border-right: 1px solid #bdc3c7;
            text-align: center;
            font-size: 11px;
            color: #34495e;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        
        .timeline {
            flex: 1;
            position: relative;
            padding: 5px;
        }
        
        .timeline-grid {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image:
                linear-gradient(to right, rgba(189, 195, 199, 0.3) 1px, transparent 1px);
            background-size: 20px 100%;
        }
        
        .task-bar {
            position: absolute;
            height: 20px;
            top: 50%;
            transform: translateY(-50%);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 9px;
            color: white;
            font-weight: bold;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            overflow: hidden;
            white-space: nowrap;
        }
        
        .grupo-preparacion { background: linear-gradient(135deg, #3498db, #2980b9); }
        .grupo-bamlt { background: linear-gradient(135deg, #e74c3c, #c0392b); }
        .grupo-modulo1 { background: linear-gradient(135deg, #f39c12, #e67e22); }
        .grupo-modulo2 { background: linear-gradient(135deg, #27ae60, #229954); }
        .grupo-modulo3 { background: linear-gradient(135deg, #9b59b6, #8e44ad); }
        .grupo-coaching { background: linear-gradient(135deg, #1abc9c, #16a085); }
        .grupo-cierre { background: linear-gradient(135deg, #34495e, #2c3e50); }
        .grupo-otros { background: linear-gradient(135deg, #95a5a6, #7f8c8d); }
        
        .milestone {
            width: 0;
            height: 0;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-bottom: 15px solid #e74c3c;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
        }
        
        .legend {
            margin-top: 20px;
            padding: 15px;
            background: #ecf0f1;
            border-radius: 5px;
        }
        
        .legend h3 {
            margin-top: 0;
            color: #2c3e50;
        }
        
        .legend-item {
            display: inline-block;
            margin: 5px 10px;
            padding: 5px 10px;
            border-radius: 5px;
            color: white;
            font-size: 12px;
            font-weight: bold;
        }
        
        .month-header {
            display: flex;
            border-bottom: 1px solid #bdc3c7;
            background: #ecf0f1;
            font-weight: bold;
            color: #2c3e50;
        }
        
        .month-cell {
            flex: 1;
            padding: 5px;
            text-align: center;
            border-right: 1px solid #bdc3c7;
            font-size: 12px;
        }
        
        .current-date {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 2px;
            background: #e74c3c;
            z-index: 10;
        }
    </style>
    <div class="container">
        <h1>📊 Diagrama de Gantt - Cronograma de Proyecto</h1>
        
        <div class="gantt-container">
            <div class="gantt-header">
                <div class="task-column">Actividad</div>
                <div class="dates-column">Fechas</div>
                <div class="timeline-column">Cronograma (Julio - Diciembre 2025)</div>
            </div>
            
            <div class="month-header">
                <div class="task-column" style="background: transparent; color: #2c3e50;"></div>
                <div class="dates-column" style="background: transparent; color: #2c3e50;"></div>
                <div class="month-cell">Jul</div>
                <div class="month-cell">Ago</div>
                <div class="month-cell">Sep</div>
                <div class="month-cell">Oct</div>
                <div class="month-cell">Nov</div>
                <div class="month-cell">Dic</div>
            </div>
            
            <div id="gantt-rows"></div>
        </div>
        
        <div class="legend">
            <h3>🎨 Leyenda por Grupos</h3>
            <span class="legend-item grupo-preparacion">Preparación</span>
            <span class="legend-item grupo-bamlt">BAMLT</span>
            <span class="legend-item grupo-modulo1">Módulo 1</span>
            <span class="legend-item grupo-modulo2">Módulo 2</span>
            <span class="legend-item grupo-modulo3">Módulo 3</span>
            <span class="legend-item grupo-coaching">Coaching</span>
            <span class="legend-item grupo-cierre">Cierre</span>
            <span class="legend-item grupo-otros">Otros</span>
        </div>
    </div>
`;
const moduleFiles = [
    {
      "id": 1,
      "originalName": "Fundamentos_Liderazgo.pdf",
      "fileType": "application/pdf",
      "fileSize": 2100000,
      "description": "Manual de fundamentos teóricos"
    },
    {
      "id": 2,
      "originalName": "ExecutiveBrief-Bombardier.pptx",
      "fileType": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "fileSize": 5300000,
      "description": "Presentación interactiva del módulo"
    },
    {
      "id": 3,
      "originalName": "Prueba2.pptx",
      "fileType": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "fileSize": 1000000,
      "description": "prueba"
    }
  ];

const resourceData = [
  {
    "id": 1,
    "originalName": "Video_Introduccion.mp4",
    "fileType": "video/mp4",
    "fileSize": 4500000,
    "description": "Video introductorio al programa de liderazgo"
  },
  {
    "id": 2,
    "originalName": "Manual_Participante.pdf",
    "fileType": "application/pdf",
    "fileSize": 3000000,
    "description": "Manual completo para participantes del programa"
  },
  {
    "id": 3,
    "originalName": "7509743a4c89b91099ad34f24a07.pptx",
    "fileType": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "fileSize": 1500000,
    "description": "Presentación del módulo 1"
  }
];

const testimonialData = [
  {
    "id": 1,
    "originalName": "Testimonio_Exito_1.pdf",
    "fileType": "application/pdf",
    "fileSize": 1800000,
    "description": "Caso de éxito: Implementación en equipo de ingeniería"
  }
];

// Tipos de datos para el contenido del repositorio
const repositoryData = [
    {
      "id": 1,
      "title": "Fundamentos del Liderazgo",
      "description": "Objetivo: Establecer las bases conceptuales del liderazgo efectivo y desarrollar la autoconciencia como líder dentro del contexto organizacional de Bombardier.",
      "topics": [
        "Definición y evolución del liderazgo",
        "Estilos de liderazgo y su aplicación",
        "Autoconocimiento e inteligencia emocional",
        "Valores y principios del líder",
        "Liderazgo en el contexto aeroespacial"
      ],
      "objectives": [],
      "duration": "1 día",
      "startDate": "5/8/2025",
      "endDate": "5/8/2025",
      "fileCount": 2,
      "files": [
        {
          "id": 1,
          "originalName": "Fundamentos_Liderazgo.pdf",
          "fileType": "application/pdf",
          "fileSize": 2100000,
          "description": "Manual de fundamentos teóricos"
        },
        {
          "id": 2,
          "originalName": "ExecutiveBrief-Bombardier.pptx",
          "fileType": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "fileSize": 5300000,
          "description": "Presentación interactiva del módulo"
        }
      ]
    },
    {
      "id": 2,
      "title": "Desarrollo de Competencias",
      "description": "Objetivo: Desarrollar habilidades prácticas de liderazgo enfocadas en comunicación efectiva, toma de decisiones y gestión de equipos de alto rendimiento.",
      "topics": [
        "Comunicación asertiva y feedback efectivo",
        "Toma de decisiones bajo presión",
        "Gestión de conflictos y negociación",
        "Motivación y desarrollo del talento",
        "Liderazgo de equipos multiculturales"
      ],
      "objectives": [],
      "duration": "1 día",
      "startDate": "10/9/2025",
      "endDate": "10/9/2025",
      "fileCount": 1,
      "files": [
        {
          "id": 3,
          "originalName": "Desarrollo_Competencias.pptx",
          "fileType": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "fileSize": 4700000,
          "description": "Presentación de competencias clave"
        }
      ]
    },
    {
      "id": 3,
      "title": "Aplicación Práctica",
      "description": "Objetivo: Integrar conocimientos adquiridos mediante simulación práctica en situaciones reales, desarrollando un plan personal de liderazgo sostenible.",
      "topics": [
        "Casos de estudio del sector aeroespacial",
        "Simulaciones de liderazgo en crisis",
        "Plan de desarrollo personal de liderazgo",
        "Mentoring y coaching de equipos",
        "Evaluación y seguimiento de resultados"
      ],
      "objectives": [],
      "duration": "1 día",
      "startDate": "22/10/2025",
      "endDate": "22/10/2025",
      "fileCount": 1,
      "files": [
        {
          "id": 4,
          "originalName": "Aplicacion_Practica.pdf",
          "fileType": "application/pdf",
          "fileSize": 3200000,
          "description": "Guía de aplicación práctica"
        }
      ]
    }
  ];

// Types are now imported from the API client

export default function App() {
  // Estados principales
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('inicio');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Estados de datos
  const [modules, setModules] = useState<Module[]>([]);
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [resourceFiles, setResourceFiles] = useState<FileItem[]>([]);
  const [testimonialFiles, setTestimoniales] = useState<FileItem[]>([]);

  // Estados de formularios
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [editingContent, setEditingContent] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedModuleForUpload, setSelectedModuleForUpload] = useState<string>('');

  // Verificar autenticación al cargar
  useEffect(() => {
    // Cargar datos estáticos para las pruebas
    setModules(repositoryData);
    setResourceFiles(resourceData);
    setTestimoniales(testimonialData);
    setLoading(false);
    // Puedes descomentar el siguiente código si tienes una API funcional
    // checkAuth();
    // loadInitialData();
  }, []);

  const checkAuth = async () => {
    try {
      const result = await apiClient.verifyToken();
      if (result.success && result.user) {
        setIsAuthenticated(true);
        setUser(result.user);
      }
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadInitialData = async () => {
    try {
      // Cargar módulos
      const modulesData = await apiClient.getModules();
      setModules(modulesData);

      // Cargar contenido de página principal
      try {
        const homeContent = await apiClient.getPageContent('home');
        setPageContent(homeContent);
      } catch (error) {
        console.error('Error al cargar contenido de página:', error);
      }

      // Cargar archivos de recursos y testimoniales
      const resources = await apiClient.getFilesByCategory('resources');
      const testimonials = await apiClient.getFilesByCategory('testimonials');
      setResourceFiles(resources);
      setTestimoniales(testimonials);
    } catch (error) {
      console.error('Error al cargar datos iniciales:', error);
      toast.error('Error al cargar datos');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.username || !loginForm.password) {
      toast.error('Usuario y contraseña requeridos');
      return;
    }

    try {
      const result = await apiClient.login(loginForm.username, loginForm.password);
      setIsAuthenticated(true);
      setUser(result.user);
      setLoginForm({ username: '', password: '' });
      toast.success('Sesión iniciada correctamente');
    } catch (error: any) {
      toast.error(error.message || 'Error al iniciar sesión');
    }
  };

  const handleLogout = () => {
    apiClient.logout();
    setIsAuthenticated(false);
    setUser(null);
    setActiveSection('inicio');
    toast.success('Sesión cerrada');
  };

  const handleUpdateContent = async (newContent: Partial<PageContent>) => {
    try {
      await apiClient.updatePageContent('home', newContent);

      // Recargar contenido
      const updatedContent = await apiClient.getPageContent('home');
      setPageContent(updatedContent);

      setEditingContent(false);
      toast.success('Contenido actualizado correctamente');
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar contenido');
    }
  };

  const handleUpdateModule = async (moduleId: string, moduleData: Partial<Module>) => {
    try {
      await apiClient.updateModule(moduleId, moduleData);

      // Recargar módulos
      const updatedModules = await apiClient.getModules();
      setModules(updatedModules);

      setEditingModule(null);
      toast.success('Módulo actualizado correctamente');
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar módulo');
    }
  };

  const handleFileUpload = async (file: File, category: 'module' | 'resources' | 'testimonials', description = '') => {
    if (!file) return;

    setUploadingFile(true);

    try {
      let uploadedFile: FileItem;

      if (category === 'module' && selectedModuleForUpload) {
        uploadedFile = await apiClient.uploadFileToModule(selectedModuleForUpload, file, description);
      } else if (category === 'resources') {
        uploadedFile = await apiClient.uploadFileToResources(file, description);
      } else if (category === 'testimonials') {
        uploadedFile = await apiClient.uploadFileToTestimonials(file, description);
      } else {
        throw new Error('Categoría o módulo no válido');
      }

      // Recargar datos según la categoría
      if (category === 'module') {
        const updatedModules = await apiClient.getModules();
        setModules(updatedModules);
      } else if (category === 'resources') {
        const resources = await apiClient.getFilesByCategory('resources');
        setResourceFiles(resources);
      } else if (category === 'testimonials') {
        const testimonials = await apiClient.getFilesByCategory('testimonials');
        setTestimoniales(testimonials);
      }

      toast.success('Archivo subido correctamente');
    } catch (error: any) {
      toast.error(error.message || 'Error al subir archivo');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleDeleteFile = async (fileId: number, category: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este archivo?')) return;

    try {
      await apiClient.deleteFile(fileId);

      // Recargar archivos según la categoría
      if (category === 'resources') {
        const resources = await apiClient.getFilesByCategory('resources');
        setResourceFiles(resources);
      } else if (category === 'testimonials') {
        const testimonials = await apiClient.getFilesByCategory('testimonials');
        setTestimoniales(testimonials);
      } else {
        // Recargar módulos para archivos de módulos
        const updatedModules = await apiClient.getModules();
        setModules(updatedModules);
      }

      toast.success('Archivo eliminado correctamente');
    } catch (error: any) {
      toast.error(error.message || 'Error al eliminar archivo');
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (fileType.startsWith('video/')) return <Video className="h-4 w-4" />;
    if (fileType.startsWith('audio/')) return <Music className="h-4 w-4" />;
    if (fileType.includes('pdf') || fileType.includes('document') || fileType.includes('presentation') || fileType.includes('spreadsheet')) return <FileText className="h-4 w-4" />;
    if (fileType.includes('zip') || fileType.includes('rar')) return <Archive className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando plataforma...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo y título */}
            <div className="flex items-center">
              <img src="/Logo-Bombardier.png" alt="Bombardier" className="h-8 mr-2" />
              <div className="flex-1 min-w-0">
                <h1 className="text-base font-bold text-gray-900 truncate">Leadership Skills Formation</h1>
                <p className="text-sm text-gray-600 truncate">Bombardier</p>
              </div>
            </div>

            {/* Navegación desktop */}
            <nav className="hidden md:flex items-center space-x-6">
              {['inicio', 'repositorio', 'cronograma', 'roadmap', 'recursos', 'testimoniales'].map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeSection === section
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
            </nav>

            {/* Botón admin y menú móvil */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Cerrar Sesión
                  </Button>
                </div>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Lock className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Acceso de Administrador</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <Label htmlFor="username">Usuario</Label>
                        <Input
                          id="username"
                          type="text"
                          value={loginForm.username}
                          onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                          required
                      </div>
                      <div>
                        <Label htmlFor="password">Contraseña</Label>
                        <Input
                          id="password"
                          type="password"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                          required
                      </div>
                      <Button type="submit" className="w-full">
                        Iniciar Sesión
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              ) : (
                <div className="flex items-center">
                  <Lock className="h-4 w-4 mr-2" />
                  Admin
                </div>
              )}
              <button
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Navegación móvil */}
            {isMobileMenuOpen && (
              <div className="md:hidden py-4 border-t border-gray-200">
                <nav className="flex flex-col space-y-2">
                  {['inicio', 'repositorio', 'cronograma', 'roadmap', 'recursos', 'testimoniales'].map((section) => (
                    <button
                      key={section}
                      onClick={() => {
                        setActiveSection(section);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`px-3 py-2 rounded-md text-left font-medium transition-colors ${
                        activeSection === section
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    >
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                    </button>
                  ))}
              </div>
            )}
        </div>
      </header>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-8">
        {/* Sección Inicio */}
        {activeSection === 'inicio' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div
              className="relative rounded-2xl overflow-hidden min-h-[400px] flex items-center justify-center text-white"
              style={{
                backgroundImage: 'url(/bomb.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              <div className="relative z-10 text-center px-4 max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {pageContent?.title || 'Bienvenido al programa Leadership Skills Formation'}
                </h1>
                <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
                  {pageContent?.description || 'Desarrolla tus competencias de liderazgo a través de nuestro programa integral de 3 módulos diseñado específicamente para los equipos de Bombardier.'}
                </p>
                {isAuthenticated && (
                  <Button
                    onClick={() => setEditingContent(true)}
                    variant="secondary"
                    className="backdrop-blur-sm bg-white/20 hover:bg-white/30"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Contenido
                  </Button>
                )}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Users className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-2xl font-bold">3 Módulos</h3>
                  <p className="text-gray-600">Programa Completo</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-2xl font-bold">6 Meses</h3>
                  <p className="text-gray-600">Julio - Diciembre 2025</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-2xl font-bold">Recursos</h3>
                  <p className="text-gray-600">Material Didáctico</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Sección Repositorio (Módulos) */}
        {activeSection === 'repositorio' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Repositorio de Presentaciones</h2>
              {isAuthenticated && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Upload className="h-4 w-4 mr-2" />
                      Subir Archivo
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Subir Archivo a Módulo</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="module-select">Seleccionar Módulo</Label>
                        <select
                          id="module-select"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          value={selectedModuleForUpload}
                          onChange={(e) => setSelectedModuleForUpload(e.target.value)}
                        >
                          <option value="">Seleccionar módulo...</option>
                          {modules.map((module) => (
                            <option key={module.id} value={module.id.toString()}>
                              {module.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="file-input">Archivo</Label>
                        <Input
                          id="file-input"
                          type="file"
                          accept=".pdf,.pptx,.ppt,.docx,.doc,.xlsx,.xls,.mp4,.avi,.mov,.mp3,.wav,.jpg,.jpeg,.png,.gif"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file && selectedModuleForUpload) {
                              handleFileUpload(file, 'module');
                            }
                          }}
                          disabled={uploadingFile || !selectedModuleForUpload}
                        />
                      </div>
                      {uploadingFile && (
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                          <p className="mt-2 text-sm text-gray-600">Subiendo archivo...</p>
                        </div>
                      )}
                  </div>
                </DialogContent>
              </Dialog>
              ) : (
                <div className="flex items-center">
                  <Lock className="h-4 w-4 mr-2" />
                  Admin
                </div>
              )}
              <button
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Navegación móvil */}
            {isMobileMenuOpen && (
              <div className="md:hidden py-4 border-t border-gray-200">
                <nav className="flex flex-col space-y-2">
                  {['inicio', 'repositorio', 'cronograma', 'roadmap', 'recursos', 'testimoniales'].map((section) => (
                    <button
                      key={section}
                      onClick={() => {
                        setActiveSection(section);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`px-3 py-2 rounded-md text-left font-medium transition-colors ${
                        activeSection === section
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    >
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                    </button>
                  ))}
              </div>
            )}
        </div>
      </header>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-8">
        {/* Sección Inicio */}
        {activeSection === 'inicio' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div
              className="relative rounded-2xl overflow-hidden min-h-[400px] flex items-center justify-center text-white"
              style={{
                backgroundImage: 'url(/bomb.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              <div className="relative z-10 text-center px-4 max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {pageContent?.title || 'Bienvenido al programa Leadership Skills Formation'}
                </h1>
                <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
                  {pageContent?.description || 'Desarrolla tus competencias de liderazgo a través de nuestro programa integral de 3 módulos diseñado específicamente para los equipos de Bombardier.'}
                </p>
                {isAuthenticated && (
                  <Button
                    onClick={() => setEditingContent(true)}
                    variant="secondary"
                    className="backdrop-blur-sm bg-white/20 hover:bg-white/30"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Contenido
                  </Button>
                )}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Users className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-2xl font-bold">3 Módulos</h3>
                  <p className="text-gray-600">Programa Completo</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-2xl font-bold">6 Meses</h3>
                  <p className="text-gray-600">Julio - Diciembre 2025</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-2xl font-bold">Recursos</h3>
                  <p className="text-gray-600">Material Didáctico</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Sección Repositorio (Módulos) */}
        {activeSection === 'repositorio' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Repositorio de Presentaciones</h2>
              {isAuthenticated && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Upload className="h-4 w-4 mr-2" />
                      Subir Archivo
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Subir Archivo a Módulo</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="module-select">Seleccionar Módulo</Label>
                        <select
                          id="module-select"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          value={selectedModuleForUpload}
                          onChange={(e) => setSelectedModuleForUpload(e.target.value)}
                        >
                          <option value="">Seleccionar módulo...</option>
                          {modules.map((module) => (
                            <option key={module.id} value={module.id.toString()}>
                              {module.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="file-input">Archivo</Label>
                        <Input
                          id="file-input"
                          type="file"
                          accept=".pdf,.pptx,.ppt,.docx,.doc,.xlsx,.xls,.mp4,.avi,.mov,.mp3,.wav,.jpg,.jpeg,.png,.gif"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file && selectedModuleForUpload) {
                              handleFileUpload(file, 'module');
                            }
                          }}
                          disabled={uploadingFile || !selectedModuleForUpload}
                        />
                      </div>
                      {uploadingFile && (
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                          <p className="mt-2 text-sm text-gray-600">Subiendo archivo...</p>
                        </div>
                      )}
                  </div>
                </DialogContent>
              </Dialog>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Lock className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Acceso de Administrador</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <Label htmlFor="username">Usuario</Label>
                        <Input
                          id="username"
                          type="text"
                          value={loginForm.username}
                          onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                          required
                      </div>
                      <div>
                        <Label htmlFor="password">Contraseña</Label>
                        <Input
                          id="password"
                          type="password"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                          required
                      </div>
                      <Button type="submit" className="w-full">
                        Iniciar Sesión
                      </Button>
                    </form>
                </Dialog>
              ) : (
                <div className="flex items-center">
                  <Lock className="h-4 w-4 mr-2" />
                  Admin
                </div>
              )}
              <button
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Navegación móvil */}
            {isMobileMenuOpen && (
              <div className="md:hidden py-4 border-t border-gray-200">
                <nav className="flex flex-col space-y-2">
                  {['inicio', 'repositorio', 'cronograma', 'roadmap', 'recursos', 'testimoniales'].map((section) => (
                    <button
                      key={section}
                      onClick={() => {
                        setActiveSection(section);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`px-3 py-2 rounded-md text-left font-medium transition-colors ${
                        activeSection === section
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    >
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                    </button>
                  ))}
              </div>
            )}
        </div>
      </header>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-8">
        {/* Sección Inicio */}
        {activeSection === 'inicio' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div
              className="relative rounded-2xl overflow-hidden min-h-[400px] flex items-center justify-center text-white"
              style={{
                backgroundImage: 'url(/bomb.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              <div className="relative z-10 text-center px-4 max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {pageContent?.title || 'Bienvenido al programa Leadership Skills Formation'}
                </h1>
                <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
                  {pageContent?.description || 'Desarrolla tus competencias de liderazgo a través de nuestro programa integral de 3 módulos diseñado específicamente para los equipos de Bombardier.'}
                </p>
                {isAuthenticated && (
                  <Button
                    onClick={() => setEditingContent(true)}
                    variant="secondary"
                    className="backdrop-blur-sm bg-white/20 hover:bg-white/30"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Contenido
                  </Button>
                )}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Users className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-2xl font-bold">3 Módulos</h3>
                  <p className="text-gray-600">Programa Completo</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-2xl font-bold">6 Meses</h3>
                  <p className="text-gray-600">Julio - Diciembre 2025</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-2xl font-bold">Recursos</h3>
                  <p className="text-gray-600">Material Didáctico</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Sección Repositorio (Módulos) */}
        {activeSection === 'repositorio' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Repositorio de Presentaciones</h2>
              {isAuthenticated && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Upload className="h-4 w-4 mr-2" />
                      Subir Archivo
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Subir Archivo a Módulo</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="module-select">Seleccionar Módulo</Label>
                        <select
                          id="module-select"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          value={selectedModuleForUpload}
                          onChange={(e) => setSelectedModuleForUpload(e.target.value)}
                        >
                          <option value="">Seleccionar módulo...</option>
                          {modules.map((module) => (
                            <option key={module.id} value={module.id.toString()}>
                              {module.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="file-input">Archivo</Label>
                        <Input
                          id="file-input"
                          type="file"
                          accept=".pdf,.pptx,.ppt,.docx,.doc,.xlsx,.xls,.mp4,.avi,.mov,.mp3,.wav,.jpg,.jpeg,.png,.gif"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file && selectedModuleForUpload) {
                              handleFileUpload(file, 'module');
                            }
                          }}
                          disabled={uploadingFile || !selectedModuleForUpload}
                        />
                      </div>
                      {uploadingFile && (
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                          <p className="mt-2 text-sm text-gray-600">Subiendo archivo...</p>
                        </div>
                      )}
                    </div>
                </DialogContent>
              </Dialog>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Lock className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Acceso de Administrador</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <Label htmlFor="username">Usuario</Label>
                        <Input
                          id="username"
                          type="text"
                          value={loginForm.username}
                          onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                          required
                      </div>
                      <div>
                        <Label htmlFor="password">Contraseña</Label>
                        <Input
                          id="password"
                          type="password"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                          required
                      </div>
                      <Button type="submit" className="w-full">
                        Iniciar Sesión
                      </Button>
                    </form>
                </Dialog>
              ) : (
                <div className="flex items-center">
                  <Lock className="h-4 w-4 mr-2" />
                  Admin
                </div>
              )}
              <button
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Navegación móvil */}
            {isMobileMenuOpen && (
              <div className="md:hidden py-4 border-t border-gray-200">
                <nav className="flex flex-col space-y-2">
                  {['inicio', 'repositorio', 'cronograma', 'roadmap', 'recursos', 'testimoniales'].map((section) => (
                    <button
                      key={section}
                      onClick={() => {
                        setActiveSection(section);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`px-3 py-2 rounded-md text-left font-medium transition-colors ${
                        activeSection === section
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    >
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                    </button>
                  ))}
              </div>
            )}
        </div>
      </header>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-8">
        {/* Sección Inicio */}
        {activeSection === 'inicio' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div
              className="relative rounded-2xl overflow-hidden min-h-[400px] flex items-center justify-center text-white"
              style={{
                backgroundImage: 'url(/bomb.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              <div className="relative z-10 text-center px-4 max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {pageContent?.title || 'Bienvenido al programa Leadership Skills Formation'}
                </h1>
                <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
                  {pageContent?.description || 'Desarrolla tus competencias de liderazgo a través de nuestro programa integral de 3 módulos diseñado específicamente para los equipos de Bombardier.'}
                </p>
                {isAuthenticated && (
                  <Button
                    onClick={() => setEditingContent(true)}
                    variant="secondary"
                    className="backdrop-blur-sm bg-white/20 hover:bg-white/30"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Contenido
                  </Button>
                )}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Users className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-2xl font-bold">3 Módulos</h3>
                  <p className="text-gray-600">Programa Completo</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-2xl font-bold">6 Meses</h3>
                  <p className="text-gray-600">Julio - Diciembre 2025</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-2xl font-bold">Recursos</h3>
                  <p className="text-gray-600">Material Didáctico</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Sección Repositorio (Módulos) */}
        {activeSection === 'repositorio' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Repositorio de Presentaciones</h2>
              {isAuthenticated && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Upload className="h-4 w-4 mr-2" />
                      Subir Archivo
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Subir Archivo a Módulo</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="module-select">Seleccionar Módulo</Label>
                        <select
                          id="module-select"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          value={selectedModuleForUpload}
                          onChange={(e) => setSelectedModuleForUpload(e.target.value)}
                        >
                          <option value="">Seleccionar módulo...</option>
                          {modules.map((module) => (
                            <option key={module.id} value={module.id.toString()}>
                              {module.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="file-input">Archivo</Label>
                        <Input
                          id="file-input"
                          type="file"
                          accept=".pdf,.pptx,.ppt,.docx,.doc,.xlsx,.xls,.mp4,.avi,.mov,.mp3,.wav,.jpg,.jpeg,.png,.gif"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file && selectedModuleForUpload) {
                              handleFileUpload(file, 'module');
                            }
                          }}
                          disabled={uploadingFile || !selectedModuleForUpload}
                        />
                      </div>
                      {uploadingFile && (
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                          <p className="mt-2 text-sm text-gray-600">Subiendo archivo...</p>
                        </div>
                      )}
                  </div>
                </DialogContent>
              </Dialog>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Lock className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Acceso de Administrador</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <Label htmlFor="username">Usuario</Label>
                        <Input
                          id="username"
                          type="text"
                          value={loginForm.username}
                          onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                      </div>
                      <div>
                        <Label htmlFor="password">Contraseña</Label>
                        <Input
                          id="password"
                          type="password"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                          required
                      </div>
                      <Button type="submit" className="w-full">
                        Iniciar Sesión
                      </Button>
                    </form>
                </Dialog>
              ) : (
                <div className="flex items-center">
                  <Lock className="h-4 w-4 mr-2" />
                  Admin
                </div>
              )}
              <button
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Navegación móvil */}
            {isMobileMenuOpen && (
              <div className="md:hidden py-4 border-t border-gray-200">
                <nav className="flex flex-col space-y-2">
                  {['inicio', 'repositorio', 'cronograma', 'roadmap', 'recursos', 'testimoniales'].map((section) => (
                    <button
                      key={section}
                      onClick={() => {
                        setActiveSection(section);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`px-3 py-2 rounded-md text-left font-medium transition-colors ${
                        activeSection === section
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    >
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                    </button>
                  ))}
              </div>
            )}
        </div>
      </header>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-8">
        {/* Sección Inicio */}
        {activeSection === 'inicio' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div
              className="relative rounded-2xl overflow-hidden min-h-[400px] flex items-center justify-center text-white"
              style={{
                backgroundImage: 'url(/bomb.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              <div className="relative z-10 text-center px-4 max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {pageContent?.title || 'Bienvenido al programa Leadership Skills Formation'}
                </h1>
                <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
                  {pageContent?.description || 'Desarrolla tus competencias de liderazgo a través de nuestro programa integral de 3 módulos diseñado específicamente para los equipos de Bombardier.'}
                </p>
                {isAuthenticated && (
                  <Button
                    onClick={() => setEditingContent(true)}
                    variant="secondary"
                    className="backdrop-blur-sm bg-white/20 hover:bg-white/30"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Contenido
                  </Button>
                )}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Users className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-2xl font-bold">3 Módulos</h3>
                  <p className="text-gray-600">Programa Completo</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-2xl font-bold">6 Meses</h3>
                  <p className="text-gray-600">Julio - Diciembre 2025</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-2xl font-bold">Recursos</h3>
                  <p className="text-gray-600">Material Didáctico</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Sección Repositorio (Módulos) */}
        {activeSection === 'repositorio' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Repositorio de Presentaciones</h2>
              {isAuthenticated && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Upload className="h-4 w-4 mr-2" />
                      Subir Archivo
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Subir Archivo a Módulo</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="module-select">Seleccionar Módulo</Label>
                        <select
                          id="module-select"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          value={selectedModuleForUpload}
                          onChange={(e) => setSelectedModuleForUpload(e.target.value)}
                        >
                          <option value="">Seleccionar módulo...</option>
                          {modules.map((module) => (
                            <option key={module.id} value={module.id.toString()}>
                              {module.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="file-input">Archivo</Label>
                        <Input
                          id="file-input"
                          type="file"
                          accept=".pdf,.pptx,.ppt,.docx,.doc,.xlsx,.xls,.mp4,.avi,.mov,.mp3,.wav,.jpg,.jpeg,.png,.gif"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file && selectedModuleForUpload) {
                              handleFileUpload(file, 'module');
                            }
                          }}
                          disabled={uploadingFile || !selectedModuleForUpload}
                        />
                      </div>
                      {uploadingFile && (
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                          <p className="mt-2 text-sm text-gray-600">Subiendo archivo...</p>
                        </div>
                      )}
                  </div>
                </DialogContent>
              </Dialog>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Lock className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Acceso de Administrador</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <Label htmlFor="username">Usuario</Label>
                        <Input
                          id="username"
                          type="text"
                          value={loginForm.username}
                          onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                      </div>
                      <div>
                        <Label htmlFor="password">Contraseña</Label>
                        <Input
                          id="password"
                          type="password"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      </div>
                      <Button type="submit" className="w-full">
                        Iniciar Sesión
                      </Button>
                    </form>
                </Dialog>
              ) : (
                <div className="flex items-center">
                  <Lock className="h-4 w-4 mr-2" />
                  Admin
                </div>
              )}
              <button
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Navegación móvil */}
            {isMobileMenuOpen && (
              <div className="md:hidden py-4 border-t border-gray-200">
                <nav className="flex flex-col space-y-2">
                  {['inicio', 'repositorio', 'cronograma', 'roadmap', 'recursos', 'testimoniales'].map((section) => (
                    <button
                      key={section}
                      onClick={() => {
                        setActiveSection(section);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`px-3 py-2 rounded-md text-left font-medium transition-colors ${
                        activeSection === section
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    >
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                    </button>
                  ))}
              </div>
            )}
        </div>
      </header>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-8">
        {/* Sección Inicio */}
        {activeSection === 'inicio' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div
              className="relative rounded-2xl overflow-hidden min-h-[400px] flex items-center justify-center text-white"
              style={{
                backgroundImage: 'url(/bomb.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              <div className="relative z-10 text-center px-4 max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {pageContent?.title || 'Bienvenido al programa Leadership Skills Formation'}
                </h1>
                <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
                  {pageContent?.description || 'Desarrolla tus competencias de liderazgo a través de nuestro programa integral de 3 módulos diseñado específicamente para los equipos de Bombardier.'}
                </p>
                {isAuthenticated && (
                  <Button
                    onClick={() => setEditingContent(true)}
                    variant="secondary"
                    className="backdrop-blur-sm bg-white/20 hover:bg-white/30"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Contenido
                  </Button>
                )}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Users className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-2xl font-bold">3 Módulos</h3>
                  <p className="text-gray-600">Programa Completo</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-2xl font-bold">6 Meses</h3>
                  <p className="text-gray-600">Julio - Diciembre 2025</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-2xl font-bold">Recursos</h3>
                  <p className="text-gray-600">Material Didáctico</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Sección Repositorio (Módulos) */}
        {activeSection === 'repositorio' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Repositorio de Presentaciones</h2>
              {isAuthenticated && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Upload className="h-4 w-4 mr-2" />
                      Subir Archivo
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Subir Archivo a Módulo</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="module-select">Seleccionar Módulo</Label>
                        <select
                          id="module-select"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          value={selectedModuleForUpload}
                          onChange={(e) => setSelectedModuleForUpload(e.target.value)}
                        >
                          <option value="">Seleccionar módulo...</option>
                          {modules.map((module) => (
                            <option key={module.id} value={module.id.toString()}>
                              {module.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="file-input">Archivo</Label>
                        <Input
                          id="file-input"
                          type="file"
                          accept=".pdf,.pptx,.ppt,.docx,.doc,.xlsx,.xls,.mp4,.avi,.mov,.mp3,.wav,.jpg,.jpeg,.png,.gif"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file && selectedModuleForUpload) {
                              handleFileUpload(file, 'module');
                            }
                          }}
                          disabled={uploadingFile || !selectedModuleForUpload}
                        />
                      </div>
                      {uploadingFile && (
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                          <p className="mt-2 text-sm text-gray-600">Subiendo archivo...</p>
                        </div>
                      )}
                    </div>
                </DialogContent>
              </Dialog>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Lock className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Acceso de Administrador</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <Label htmlFor="username">Usuario</Label>
                        <Input
                          id="username"
                          type="text"
                          value={loginForm.username}
                          onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                      </div>
                      <div>
                        <Label htmlFor="password">Contraseña</Label>
                        <Input
                          id="password"
                          type="password"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      </div>
                      <Button type="submit" className="w-full">
                        Iniciar Sesión
                      </Button>
                    </form>
                </Dialog>
              ) : (
                <div className="flex items-center">
                  <Lock className="h-4 w-4 mr-2" />
                  Admin
                </div>
              )}
              <button
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Navegación móvil */}
            {isMobileMenuOpen && (
              <div className="md:hidden py-4 border-t border-gray-200">
                <nav className="flex flex-col space-y-2">
                  {['inicio', 'repositorio', 'cronograma', 'roadmap', 'recursos', 'testimoniales'].map((section) => (
                    <button
                      key={section}
                      onClick={() => {
                        setActiveSection(section);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`px-3 py-2 rounded-md text-left font-medium transition-colors ${
                        activeSection === section
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    >
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                    </button>
                  ))}
              </div>
            )}
        </div>
      </header>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-8">
        {/* Sección Inicio */}
        {activeSection === 'inicio' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div
              className="relative rounded-2xl overflow-hidden min-h-[400px] flex items-center justify-center text-white"
              style={{
                backgroundImage: 'url(/bomb.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              <div className="relative z-10 text-center px-4 max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {pageContent?.title || 'Bienvenido al programa Leadership Skills Formation'}
                </h1>
                <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
                  {pageContent?.description || 'Desarrolla tus competencias de liderazgo a través de nuestro programa integral de 3 módulos diseñado específicamente para los equipos de Bombardier.'}
                </p>
                {isAuthenticated && (
                  <Button
                    onClick={() => setEditingContent(true)}
                    variant="secondary"
                    className="backdrop-blur-sm bg-white/20 hover:bg-white/30"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Contenido
                  </Button>
                )}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Users className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-2xl font-bold">3 Módulos</h3>
                  <p className="text-gray-600">Programa Completo</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-2xl font-bold">6 Meses</h3>
                  <p className="text-gray-600">Julio - Diciembre 2025</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-2xl font-bold">Recursos</h3>
                  <p className="text-gray-600">Material Didáctico</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Sección Repositorio (Módulos) */}
        {activeSection === 'repositorio' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Repositorio de Presentaciones</h2>
              {isAuthenticated && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Upload className="h-4 w-4 mr-2" />
                      Subir Archivo
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Subir Archivo a Módulo</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="module-select">Seleccionar Módulo</Label>
                        <select
                          id="module-select"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          value={selectedModuleForUpload}
                          onChange={(e) => setSelectedModuleForUpload(e.target.value)}
                        >
                          <option value="">Seleccionar módulo...</option>
                          {modules.map((module) => (
                            <option key={module.id} value={module.id.toString()}>
                              {module.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="file-input">Archivo</Label>
                        <Input
                          id="file-input"
                          type="file"
                          accept=".pdf,.pptx,.ppt,.docx,.doc,.xlsx,.xls,.mp4,.avi,.mov,.mp3,.wav,.jpg,.jpeg,.png,.gif"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file && selectedModuleForUpload) {
                              handleFileUpload(file, 'module');
                            }
                          }}
                          disabled={uploadingFile || !selectedModuleForUpload}
                        />
                      </div>
                      {uploadingFile && (
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                          <p className="mt-2 text-sm text-gray-600">Subiendo archivo...</p>
                        </div>
                      )}
                    </div>
                </DialogContent>
              </Dialog>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Lock className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Acceso de Administrador</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <Label htmlFor="username">Usuario</Label>
                        <Input
                          id="username"
                          type="text"
                          value={loginForm.username}
                          onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                      </div>
                      <div>
                        <Label htmlFor="password">Contraseña</Label>
                        <Input
                          id="password"
                          type="password"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      </div>
                      <Button type="submit" className="w-full">
                        Iniciar Sesión
                      </Button>
                    </form>
                </Dialog>
              ) : (
                <div className="flex items-center">
                  <Lock className="h-4 w-4 mr-2" />
                  Admin
                </div>
              )}
              <button
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Navegación móvil */}
            {isMobileMenuOpen && (
              <div className="md:hidden py-4 border-t border-gray-200">
                <nav className="flex flex-col space-y-2">
                  {['inicio', 'repositorio', 'cronograma', 'roadmap', 'recursos', 'testimoniales'].map((section) => (
                    <button
                      key={section}
                      onClick={() => {
                        setActiveSection(section);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`px-3 py-2 rounded-md text-left font-medium transition-colors ${
                        activeSection === section
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    >
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                    </button>
                  ))}
              </div>
            )}
        </div>
      </header>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-8">
        {/* Sección Inicio */}
        {activeSection === 'inicio' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div
              className="relative rounded-2xl overflow-hidden min-h-[400px] flex items-center justify-center text-white"
              style={{
                backgroundImage: 'url(/bomb.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              <div className="relative z-10 text-center px-4 max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {pageContent?.title || 'Bienvenido al programa Leadership Skills Formation'}
                </h1>
                <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
                  {pageContent?.description || 'Desarrolla tus competencias de liderazgo a través de nuestro programa integral de 3 módulos diseñado específicamente para los equipos de Bombardier.'}
                </p>
                {isAuthenticated && (
                  <Button
                    onClick={() => setEditingContent(true)}
                    variant="secondary"
                    className="backdrop-blur-sm bg-white/20 hover:bg-white/30"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Contenido
                  </Button>
                )}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Users className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-2xl font-bold">3 Módulos</h3>
                  <p className="text-gray-600">Programa Completo</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-2xl font-bold">6 Meses</h3>
                  <p className="text-gray-600">Julio - Diciembre 2025</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-2xl font-bold">Recursos</h3>
                  <p className="text-gray-600">Material Didáctico</p>
                </CardContent>
              </Card>
            </div>
          </div>
