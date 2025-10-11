import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import { db, UserProfile } from '@/lib/database';

export default function Hero() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Initialize default data if needed
    db.initializeDefaultData();
    // Load user profile
    setUserProfile(db.getUserProfile());
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              {userProfile?.name || 'John Doe'}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 font-light">
              {userProfile?.title || 'Full Stack Developer & UI/UX Designer'}
            </p>
          </div>
          
          <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            {userProfile?.bio || 'I create beautiful, functional, and user-centered digital experiences. Passionate about clean code, innovative design, and solving complex problems.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => scrollToSection('projects')}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
            >
              View My Work
            </Button>
            <Button 
              onClick={() => scrollToSection('contact')}
              variant="outline" 
              size="lg"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 text-lg"
            >
              Get In Touch
            </Button>
          </div>

          <div className="flex justify-center space-x-6 pt-8">
            <a 
              href={userProfile?.socialLinks.github || '#'} 
              className="text-gray-600 hover:text-blue-600 transition-colors transform hover:scale-110"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={24} />
            </a>
            <a 
              href={userProfile?.socialLinks.linkedin || '#'} 
              className="text-gray-600 hover:text-blue-600 transition-colors transform hover:scale-110"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin size={24} />
            </a>
            <a 
              href={`mailto:${userProfile?.socialLinks.email || 'john.doe@example.com'}`} 
              className="text-gray-600 hover:text-blue-600 transition-colors transform hover:scale-110"
            >
              <Mail size={24} />
            </a>
          </div>

          <div className="pt-12 animate-bounce">
            <button onClick={() => scrollToSection('about')}>
              <ArrowDown className="text-gray-400 hover:text-blue-600 transition-colors" size={32} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}