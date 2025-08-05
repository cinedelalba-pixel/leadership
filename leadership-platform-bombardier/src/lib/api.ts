// Tipos TypeScript
export interface User {
  id: number;
  username: string;
  role: string;
}

export interface Module {
  id: number;
  title: string;
  description: string;
  topics: string[];
  objectives: string[];
  duration: string;
  startDate: string;
  endDate: string;
  fileCount?: number;
  files?: FileItem[];
  createdAt: string;
  updatedAt: string;
}

export interface FileItem {
  id: number;
  filename: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  description: string;
  moduleId?: number;
  url: string;
  uploadedAt: string;
}

export interface PageContent {
  id: number;
  section: string;
  title: string;
  description: string;
  backgroundImage?: string;
  data?: any;
  updatedAt: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
}

// Cliente API
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = import.meta.env.PROD 
      ? '' // En producción usar la misma URL
      : 'http://localhost:3001'; // En desarrollo usar puerto del servidor
    
    // Recuperar token del localStorage
    this.token = localStorage.getItem('auth_token');
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token && !headers.Authorization) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Si el token expiró, limpiar y redirigir
    if (response.status === 401) {
      this.logout();
    }

    return response;
  }

  // Autenticación
  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al iniciar sesión');
    }

    const data: LoginResponse = await response.json();
    this.token = data.token;
    localStorage.setItem('auth_token', data.token);
    return data;
  }

  async verifyToken(): Promise<{ success: boolean; user?: User }> {
    if (!this.token) return { success: false };

    try {
      const response = await this.request('/api/auth/verify');
      if (response.ok) {
        const data = await response.json();
        return { success: true, user: data.user };
      }
    } catch (error) {
      console.error('Error al verificar token:', error);
    }
    
    return { success: false };
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
    window.location.reload();
  }

  // Contenido
  async getPageContent(section: string): Promise<PageContent> {
    const response = await this.request(`/api/content/page/${section}`);
    
    if (!response.ok) {
      throw new Error('Error al obtener contenido');
    }

    return await response.json();
  }

  async updatePageContent(section: string, content: Partial<PageContent>): Promise<void> {
    const response = await this.request(`/api/content/page/${section}`, {
      method: 'PUT',
      body: JSON.stringify(content),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al actualizar contenido');
    }
  }

  // Módulos
  async getModules(): Promise<Module[]> {
    const response = await this.request('/api/content/modules');
    
    if (!response.ok) {
      throw new Error('Error al obtener módulos');
    }

    return await response.json();
  }

  async getModule(moduleId: string): Promise<Module> {
    const response = await this.request(`/api/content/modules/${moduleId}`);
    
    if (!response.ok) {
      throw new Error('Error al obtener módulo');
    }

    return await response.json();
  }

  async updateModule(moduleId: string, moduleData: Partial<Module>): Promise<void> {
    const response = await this.request(`/api/content/modules/${moduleId}`, {
      method: 'PUT',
      body: JSON.stringify(moduleData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al actualizar módulo');
    }
  }

  async createModule(moduleData: Partial<Module>): Promise<{ success: boolean; moduleId: number }> {
    const response = await this.request('/api/content/modules', {
      method: 'POST',
      body: JSON.stringify(moduleData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al crear módulo');
    }

    return await response.json();
  }

  async deleteModule(moduleId: string): Promise<void> {
    const response = await this.request(`/api/content/modules/${moduleId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al eliminar módulo');
    }
  }

  // Archivos
  async uploadFileToModule(moduleId: string, file: File, description: string = ''): Promise<FileItem> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);

    const response = await fetch(`${this.baseURL}/api/files/upload/module/${moduleId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al subir archivo');
    }

    const data = await response.json();
    return data.file;
  }

  async uploadFileToResources(file: File, description: string = ''): Promise<FileItem> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);

    const response = await fetch(`${this.baseURL}/api/files/upload/resources`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al subir archivo');
    }

    const data = await response.json();
    return data.file;
  }

  async uploadFileToTestimonials(file: File, description: string = ''): Promise<FileItem> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);

    const response = await fetch(`${this.baseURL}/api/files/upload/testimonials`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al subir archivo');
    }

    const data = await response.json();
    return data.file;
  }

  async uploadBackgroundImage(file: File): Promise<{ filename: string; url: string }> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('category', 'background');

    const response = await fetch(`${this.baseURL}/api/files/upload/background`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al subir imagen');
    }

    const data = await response.json();
    return data.image;
  }

  async getFilesByCategory(category: string, moduleId?: string): Promise<FileItem[]> {
    let url = `/api/files/category/${category}`;
    if (moduleId) {
      url += `?moduleId=${moduleId}`;
    }

    const response = await this.request(url);
    
    if (!response.ok) {
      throw new Error('Error al obtener archivos');
    }

    return await response.json();
  }

  async deleteFile(fileId: number): Promise<void> {
    const response = await this.request(`/api/files/${fileId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al eliminar archivo');
    }
  }

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Obtener URL completa para archivos
  getFileUrl(path: string): string {
    return `${this.baseURL}${path}`;
  }
}

// Instancia única del cliente API
export const apiClient = new ApiClient();