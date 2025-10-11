import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code, Palette, Zap, Users } from 'lucide-react';
import { db, UserProfile } from '@/lib/database';

export default function About() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Initialize default data if needed
    db.initializeDefaultData();
    // Load user profile
    setUserProfile(db.getUserProfile());
  }, []);

  const features = [
    {
      icon: <Code className="w-8 h-8 text-blue-600" />,
      title: 'Clean Code',
      description: 'Writing maintainable, scalable, and efficient code following best practices.'
    },
    {
      icon: <Palette className="w-8 h-8 text-purple-600" />,
      title: 'UI/UX Design',
      description: 'Creating intuitive and beautiful user interfaces with great user experience.'
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      title: 'Performance',
      description: 'Optimizing applications for speed, efficiency, and excellent performance.'
    },
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: 'Collaboration',
      description: 'Working effectively in teams and communicating technical concepts clearly.'
    }
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              About Me
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              I'm a passionate developer with 5+ years of experience creating digital solutions 
              that make a difference. I love turning complex problems into simple, beautiful designs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">My Journey</h3>
              <p className="text-gray-700 leading-relaxed">
                {userProfile?.bio || 'Started as a curious student who loved building things with code. Over the years, I\'ve worked with startups and established companies, helping them bring their ideas to life through web applications, mobile apps, and digital experiences.'}
              </p>
              <p className="text-gray-700 leading-relaxed">
                When I'm not coding, you'll find me exploring new technologies, contributing to open source, 
                or sharing knowledge with the developer community.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Skills & Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {(userProfile?.skills || ['React', 'TypeScript', 'Node.js', 'Python', 'JavaScript', 'HTML/CSS', 'Tailwind CSS', 'MongoDB', 'PostgreSQL', 'Git', 'Docker', 'AWS']).map((skill) => (
                  <Badge key={skill} variant="secondary" className="px-3 py-1 text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="space-y-4">
                  <div className="flex justify-center">{feature.icon}</div>
                  <h4 className="text-xl font-semibold text-gray-900">{feature.title}</h4>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}