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
  const [testimonialFiles, setTestimonialFiles] = useState<FileItem[]>([]);

  // Estados de formularios
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [editingContent, setEditingContent] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedModuleForUpload, setSelectedModuleForUpload] = useState<string>('');

  // Verificar autenticación al cargar
  useEffect(() => {
    checkAuth();
    loadInitialData();
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
      setTestimonialFiles(testimonials);
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
        setTestimonialFiles(testimonials);
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
        setTestimonialFiles(testimonials);
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
            <div className="flex items-center space-x-4">
              <img src="/Logo-Bombardier.png" alt="Bombardier" className="h-8" />
              <img src="/logo.jpg" alt="Leadership Skills Formation" className="h-8" />
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-gray-900">Leadership Skills Formation</h1>
                <p className="text-sm text-gray-600">Bombardier</p>
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
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Contraseña</Label>
                        <Input
                          id="password"
                          type="password"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Iniciar Sesión
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}

              {/* Menú móvil */}
              <button
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
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
              </nav>
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
              <h2 className="text-3xl font-bold">Módulos del Programa</h2>
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
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {modules.map((module) => (
                <Card key={module.id} className="h-fit">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{module.title}</CardTitle>
                        <CardDescription>{module.description}</CardDescription>
                      </div>
                      {isAuthenticated && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingModule(module)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Temas:</h4>
                      <div className="flex flex-wrap gap-1">
                        {module.topics.map((topic, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Objetivos:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {module.objectives.map((objective, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-blue-600 mr-2">•</span>
                            {objective}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Duración: {module.duration}</span>
                      <span>Archivos: {module.fileCount || 0}</span>
                    </div>

                    <div className="text-xs text-gray-500">
                      {module.startDate} - {module.endDate}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Sección Recursos */}
        {activeSection === 'recursos' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Recursos Adicionales</h2>
              {isAuthenticated && (
                <div className="space-x-2">
                  <input
                    type="file"
                    id="resource-file"
                    className="hidden"
                    accept=".pdf,.pptx,.ppt,.docx,.doc,.xlsx,.xls,.mp4,.avi,.mov,.mp3,.wav,.jpg,.jpeg,.png,.gif"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(file, 'resources');
                      }
                    }}
                  />
                  <Button
                    onClick={() => document.getElementById('resource-file')?.click()}
                    disabled={uploadingFile}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Subir Recurso
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resourceFiles.map((file) => (
                <Card key={file.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        {getFileIcon(file.fileType)}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{file.originalName}</h4>
                          <p className="text-sm text-gray-600">{formatFileSize(file.fileSize)}</p>
                          {file.description && (
                            <p className="text-xs text-gray-500 mt-1">{file.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-1 ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                        >
                          <a href={apiClient.getFileUrl(file.url)} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                        {isAuthenticated && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteFile(file.id, 'resources')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {resourceFiles.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No hay recursos disponibles aún.</p>
                {isAuthenticated && (
                  <p className="text-sm text-gray-500 mt-2">Sube el primer recurso usando el botón de arriba.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Sección Testimoniales */}
        {activeSection === 'testimoniales' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Testimoniales de Éxito</h2>
              {isAuthenticated && (
                <div className="space-x-2">
                  <input
                    type="file"
                    id="testimonial-file"
                    className="hidden"
                    accept=".pdf,.pptx,.ppt,.docx,.doc,.xlsx,.xls,.mp4,.avi,.mov,.mp3,.wav,.jpg,.jpeg,.png,.gif"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(file, 'testimonials');
                      }
                    }}
                  />
                  <Button
                    onClick={() => document.getElementById('testimonial-file')?.click()}
                    disabled={uploadingFile}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Subir Testimonial
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {testimonialFiles.map((file) => (
                <Card key={file.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        {getFileIcon(file.fileType)}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{file.originalName}</h4>
                          <p className="text-sm text-gray-600">{formatFileSize(file.fileSize)}</p>
                          {file.description && (
                            <p className="text-xs text-gray-500 mt-1">{file.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-1 ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                        >
                          <a href={apiClient.getFileUrl(file.url)} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                        {isAuthenticated && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteFile(file.id, 'testimonials')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {testimonialFiles.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No hay testimoniales disponibles aún.</p>
                {isAuthenticated && (
                  <p className="text-sm text-gray-500 mt-2">Sube el primer testimonial usando el botón de arriba.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Otras secciones - placeholder */}
        {(activeSection === 'cronograma' || activeSection === 'roadmap') && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              {activeSection === 'cronograma' ? 'Cronograma' : 'Roadmap'}
            </h2>
            <p className="text-gray-600">Sección en desarrollo</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="flex justify-center items-center space-x-4 mb-4">
            <img src="/Logo-Bombardier.png" alt="Bombardier" className="h-6" />
          </div>
          <p className="text-gray-600">© 2025 Bombardier. Leadership Skills Formation Program.</p>
        </div>
      </footer>

      {/* Diálogos de edición */}
      {editingContent && pageContent && (
        <Dialog open={editingContent} onOpenChange={setEditingContent}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Contenido Principal</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleUpdateContent({
                  title: formData.get('title') as string,
                  description: formData.get('description') as string,
                });
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="title">Título Principal</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={pageContent.title}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={pageContent.description}
                  rows={4}
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setEditingContent(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Guardar Cambios</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {editingModule && (
        <Dialog open={!!editingModule} onOpenChange={() => setEditingModule(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Módulo</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const topics = (formData.get('topics') as string).split('\n').filter(t => t.trim());
                const objectives = (formData.get('objectives') as string).split('\n').filter(o => o.trim());
                
                handleUpdateModule(editingModule.id.toString(), {
                  title: formData.get('title') as string,
                  description: formData.get('description') as string,
                  topics,
                  objectives,
                  duration: formData.get('duration') as string,
                  startDate: formData.get('startDate') as string,
                  endDate: formData.get('endDate') as string,
                });
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={editingModule.title}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duración</Label>
                  <Input
                    id="duration"
                    name="duration"
                    defaultValue={editingModule.duration}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingModule.description}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Fecha de Inicio</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    defaultValue={editingModule.startDate}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Fecha de Fin</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    defaultValue={editingModule.endDate}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="topics">Temas (uno por línea)</Label>
                <Textarea
                  id="topics"
                  name="topics"
                  defaultValue={editingModule.topics.join('\n')}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="objectives">Objetivos (uno por línea)</Label>
                <Textarea
                  id="objectives"
                  name="objectives"
                  defaultValue={editingModule.objectives.join('\n')}
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setEditingModule(null)}>
                  Cancelar
                </Button>
                <Button type="submit">Guardar Cambios</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}