import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Eye, Download, Upload, RefreshCw } from 'lucide-react';
import { db, Project, ContactMessage, UserProfile } from '@/lib/database';
import { toast } from 'sonner';

export default function AdminPanel() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form states
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    image: '',
    technologies: '',
    liveUrl: '',
    githubUrl: ''
  });

  const [profileForm, setProfileForm] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    skills: '',
    github: '',
    linkedin: '',
    twitter: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setProjects(db.getAllProjects());
    setContactMessages(db.getAllContactMessages());
    setUserProfile(db.getUserProfile());
    
    const profile = db.getUserProfile();
    if (profile) {
      setProfileForm({
        name: profile.name,
        title: profile.title,
        email: profile.email,
        phone: profile.phone,
        location: profile.location,
        bio: profile.bio,
        skills: profile.skills.join(', '),
        github: profile.socialLinks.github,
        linkedin: profile.socialLinks.linkedin,
        twitter: profile.socialLinks.twitter
      });
    }
  };

  const handleCreateProject = () => {
    if (!projectForm.title || !projectForm.description) {
      toast.error('Please fill in required fields');
      return;
    }

    const projectData = {
      ...projectForm,
      technologies: projectForm.technologies.split(',').map(tech => tech.trim())
    };

    if (editingProject) {
      db.updateProject(editingProject.id, projectData);
      toast.success('Project updated successfully');
    } else {
      db.createProject(projectData);
      toast.success('Project created successfully');
    }

    setProjectForm({
      title: '',
      description: '',
      image: '',
      technologies: '',
      liveUrl: '',
      githubUrl: ''
    });
    setEditingProject(null);
    setIsProjectDialogOpen(false);
    loadData();
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      image: project.image,
      technologies: project.technologies.join(', '),
      liveUrl: project.liveUrl,
      githubUrl: project.githubUrl
    });
    setIsProjectDialogOpen(true);
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      db.deleteProject(id);
      toast.success('Project deleted successfully');
      loadData();
    }
  };

  const handleUpdateProfile = () => {
    const profileData = {
      name: profileForm.name,
      title: profileForm.title,
      email: profileForm.email,
      phone: profileForm.phone,
      location: profileForm.location,
      bio: profileForm.bio,
      skills: profileForm.skills.split(',').map(skill => skill.trim()),
      socialLinks: {
        github: profileForm.github,
        linkedin: profileForm.linkedin,
        twitter: profileForm.twitter,
        email: profileForm.email
      }
    };

    db.createOrUpdateUserProfile(profileData);
    toast.success('Profile updated successfully');
    setIsProfileDialogOpen(false);
    loadData();
  };

  const handleMessageStatusChange = (id: string, status: ContactMessage['status']) => {
    db.updateContactMessageStatus(id, status);
    toast.success('Message status updated');
    loadData();
  };

  const handleDeleteMessage = (id: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      db.deleteContactMessage(id);
      toast.success('Message deleted successfully');
      loadData();
    }
  };

  const handleExportData = () => {
    const data = db.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully');
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result as string;
        if (db.importData(data)) {
          toast.success('Data imported successfully');
          loadData();
        } else {
          toast.error('Failed to import data');
        }
      } catch (error) {
        toast.error('Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <div className="flex gap-2">
          <Button onClick={handleExportData} variant="outline">
            <Download size={16} className="mr-2" />
            Export Data
          </Button>
          <label>
            <Button variant="outline" className="cursor-pointer">
              <Upload size={16} className="mr-2" />
              Import Data
            </Button>
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
            />
          </label>
          <Button onClick={loadData} variant="outline">
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="projects">Projects ({projects.length})</TabsTrigger>
          <TabsTrigger value="messages">Messages ({contactMessages.filter(m => m.status === 'unread').length})</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Manage Projects</h2>
            <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingProject(null);
                  setProjectForm({
                    title: '',
                    description: '',
                    image: '',
                    technologies: '',
                    liveUrl: '',
                    githubUrl: ''
                  });
                }}>
                  <Plus size={16} className="mr-2" />
                  Add Project
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                        placeholder="Project title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="image">Image URL</Label>
                      <Input
                        id="image"
                        value={projectForm.image}
                        onChange={(e) => setProjectForm({...projectForm, image: e.target.value})}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                      placeholder="Project description"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="technologies">Technologies (comma-separated)</Label>
                    <Input
                      id="technologies"
                      value={projectForm.technologies}
                      onChange={(e) => setProjectForm({...projectForm, technologies: e.target.value})}
                      placeholder="React, Node.js, MongoDB"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="liveUrl">Live URL</Label>
                      <Input
                        id="liveUrl"
                        value={projectForm.liveUrl}
                        onChange={(e) => setProjectForm({...projectForm, liveUrl: e.target.value})}
                        placeholder="https://project-demo.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="githubUrl">GitHub URL</Label>
                      <Input
                        id="githubUrl"
                        value={projectForm.githubUrl}
                        onChange={(e) => setProjectForm({...projectForm, githubUrl: e.target.value})}
                        placeholder="https://github.com/user/repo"
                      />
                    </div>
                  </div>
                  <Button onClick={handleCreateProject} className="w-full">
                    {editingProject ? 'Update Project' : 'Create Project'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Card key={project.id} className="relative">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => handleEditProject(project)}>
                        <Edit size={14} />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteProject(project.id)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {project.image && (
                    <img src={project.image} alt={project.title} className="w-full h-32 object-cover rounded mb-2" />
                  )}
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500">
                    Updated: {new Date(project.updatedAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <h2 className="text-2xl font-semibold">Contact Messages</h2>
          <div className="space-y-4">
            {contactMessages.map((message) => (
              <Card key={message.id} className={message.status === 'unread' ? 'border-blue-500' : ''}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{message.subject}</CardTitle>
                      <p className="text-sm text-gray-600">{message.name} - {message.email}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Select
                        value={message.status}
                        onValueChange={(value) => handleMessageStatusChange(message.id, value as ContactMessage['status'])}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unread">Unread</SelectItem>
                          <SelectItem value="read">Read</SelectItem>
                          <SelectItem value="replied">Replied</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteMessage(message.id)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">{message.message}</p>
                  <div className="text-xs text-gray-500">
                    Received: {new Date(message.createdAt).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            ))}
            {contactMessages.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">No messages yet</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Profile Settings</h2>
            <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Edit size={16} className="mr-2" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={profileForm.title}
                        onChange={(e) => setProfileForm({...profileForm, title: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profileForm.location}
                      onChange={(e) => setProfileForm({...profileForm, location: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="skills">Skills (comma-separated)</Label>
                    <Textarea
                      id="skills"
                      value={profileForm.skills}
                      onChange={(e) => setProfileForm({...profileForm, skills: e.target.value})}
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="github">GitHub URL</Label>
                      <Input
                        id="github"
                        value={profileForm.github}
                        onChange={(e) => setProfileForm({...profileForm, github: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="linkedin">LinkedIn URL</Label>
                      <Input
                        id="linkedin"
                        value={profileForm.linkedin}
                        onChange={(e) => setProfileForm({...profileForm, linkedin: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="twitter">Twitter URL</Label>
                      <Input
                        id="twitter"
                        value={profileForm.twitter}
                        onChange={(e) => setProfileForm({...profileForm, twitter: e.target.value})}
                      />
                    </div>
                  </div>
                  <Button onClick={handleUpdateProfile} className="w-full">
                    Update Profile
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {userProfile && (
            <Card>
              <CardHeader>
                <CardTitle>{userProfile.name}</CardTitle>
                <p className="text-gray-600">{userProfile.title}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Contact Information</h4>
                  <p>Email: {userProfile.email}</p>
                  <p>Phone: {userProfile.phone}</p>
                  <p>Location: {userProfile.location}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Bio</h4>
                  <p className="text-sm">{userProfile.bio}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Last updated: {new Date(userProfile.updatedAt).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}