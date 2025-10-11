// Local Storage Database with CRUD operations
export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'read' | 'replied';
}

export interface UserProfile {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  skills: string[];
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
    email: string;
  };
  updatedAt: string;
}

class LocalDatabase {
  private getStorageKey(table: string): string {
    return `portfolio_${table}`;
  }

  // Generic CRUD operations
  private getAll<T>(table: string): T[] {
    const data = localStorage.getItem(this.getStorageKey(table));
    return data ? JSON.parse(data) : [];
  }

  private save<T>(table: string, data: T[]): void {
    localStorage.setItem(this.getStorageKey(table), JSON.stringify(data));
  }

  // Projects CRUD
  getAllProjects(): Project[] {
    return this.getAll<Project>('projects');
  }

  getProjectById(id: string): Project | null {
    const projects = this.getAllProjects();
    return projects.find(project => project.id === id) || null;
  }

  createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
    const projects = this.getAllProjects();
    const newProject: Project = {
      ...projectData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    projects.push(newProject);
    this.save('projects', projects);
    return newProject;
  }

  updateProject(id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>): Project | null {
    const projects = this.getAllProjects();
    const index = projects.findIndex(project => project.id === id);
    
    if (index === -1) return null;
    
    projects[index] = {
      ...projects[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.save('projects', projects);
    return projects[index];
  }

  deleteProject(id: string): boolean {
    const projects = this.getAllProjects();
    const filteredProjects = projects.filter(project => project.id !== id);
    
    if (filteredProjects.length === projects.length) return false;
    
    this.save('projects', filteredProjects);
    return true;
  }

  // Contact Messages CRUD
  getAllContactMessages(): ContactMessage[] {
    return this.getAll<ContactMessage>('contact_messages');
  }

  getContactMessageById(id: string): ContactMessage | null {
    const messages = this.getAllContactMessages();
    return messages.find(message => message.id === id) || null;
  }

  createContactMessage(messageData: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): ContactMessage {
    const messages = this.getAllContactMessages();
    const newMessage: ContactMessage = {
      ...messageData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      status: 'unread'
    };
    messages.push(newMessage);
    this.save('contact_messages', messages);
    return newMessage;
  }

  updateContactMessageStatus(id: string, status: ContactMessage['status']): ContactMessage | null {
    const messages = this.getAllContactMessages();
    const index = messages.findIndex(message => message.id === id);
    
    if (index === -1) return null;
    
    messages[index].status = status;
    this.save('contact_messages', messages);
    return messages[index];
  }

  deleteContactMessage(id: string): boolean {
    const messages = this.getAllContactMessages();
    const filteredMessages = messages.filter(message => message.id !== id);
    
    if (filteredMessages.length === messages.length) return false;
    
    this.save('contact_messages', filteredMessages);
    return true;
  }

  // User Profile CRUD
  getUserProfile(): UserProfile | null {
    const profiles = this.getAll<UserProfile>('user_profile');
    return profiles.length > 0 ? profiles[0] : null;
  }

  createOrUpdateUserProfile(profileData: Omit<UserProfile, 'id' | 'updatedAt'>): UserProfile {
    const profiles = this.getAll<UserProfile>('user_profile');
    const profile: UserProfile = {
      ...profileData,
      id: profiles.length > 0 ? profiles[0].id : this.generateId(),
      updatedAt: new Date().toISOString()
    };
    
    this.save('user_profile', [profile]);
    return profile;
  }

  // Utility methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Initialize with default data
  initializeDefaultData(): void {
    // Initialize projects if none exist
    if (this.getAllProjects().length === 0) {
      const defaultProjects = [
        {
          title: 'E-Commerce Platform',
          description: 'A full-stack e-commerce solution with user authentication, payment processing, and admin dashboard.',
          image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=300&fit=crop',
          technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
          liveUrl: '#',
          githubUrl: '#'
        },
        {
          title: 'Task Management App',
          description: 'A collaborative task management application with real-time updates and team collaboration features.',
          image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500&h=300&fit=crop',
          technologies: ['Vue.js', 'Firebase', 'Tailwind CSS'],
          liveUrl: '#',
          githubUrl: '#'
        },
        {
          title: 'Weather Dashboard',
          description: 'A beautiful weather dashboard with location-based forecasts and interactive charts.',
          image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=500&h=300&fit=crop',
          technologies: ['React', 'TypeScript', 'Chart.js', 'API Integration'],
          liveUrl: '#',
          githubUrl: '#'
        }
      ];

      defaultProjects.forEach(project => this.createProject(project));
    }

    // Initialize user profile if none exists
    if (!this.getUserProfile()) {
      this.createOrUpdateUserProfile({
        name: 'John Doe',
        title: 'Full Stack Developer & UI/UX Designer',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        bio: 'I create beautiful, functional, and user-centered digital experiences. Passionate about clean code, innovative design, and solving complex problems.',
        skills: ['React', 'TypeScript', 'Node.js', 'Python', 'JavaScript', 'HTML/CSS', 'Tailwind CSS', 'MongoDB', 'PostgreSQL', 'Git', 'Docker', 'AWS'],
        socialLinks: {
          github: '#',
          linkedin: '#',
          twitter: '#',
          email: 'john.doe@example.com'
        }
      });
    }
  }

  // Export/Import functionality
  exportData(): string {
    const data = {
      projects: this.getAllProjects(),
      contactMessages: this.getAllContactMessages(),
      userProfile: this.getUserProfile(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.projects) {
        this.save('projects', data.projects);
      }
      if (data.contactMessages) {
        this.save('contact_messages', data.contactMessages);
      }
      if (data.userProfile) {
        this.save('user_profile', [data.userProfile]);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  // Clear all data
  clearAllData(): void {
    localStorage.removeItem(this.getStorageKey('projects'));
    localStorage.removeItem(this.getStorageKey('contact_messages'));
    localStorage.removeItem(this.getStorageKey('user_profile'));
  }
}

export const db = new LocalDatabase();