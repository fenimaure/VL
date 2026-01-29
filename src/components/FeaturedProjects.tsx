
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string;
  tags: string[];
  slug: string;
}

export default function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('is_featured', true)
          .order('created_at', { ascending: false });
        if (error) throw error;
        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  // Intersection Observer for scroll reveal
  useEffect(() => {
    if (loading || projects.length === 0) return;

    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const items = document.querySelectorAll('.stagger-item');
    items.forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, [loading, projects]);

  if (loading && projects.length === 0) {
    return null;
  }

  return (
    <section id="projects" className="py-40 bg-white dark:bg-dark-950 relative overflow-hidden transition-colors duration-500">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-500/5 to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div className="max-w-2xl stagger-item">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-12 h-[1px] bg-primary-500"></span>
              <span className="text-primary-500 font-bold tracking-[0.3em] text-xs uppercase">Portfolio</span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-bold font-display mb-8 leading-none transition-colors duration-300">
              <span className="text-black dark:text-white">Selected </span>
              <span className="text-black/20 dark:text-white/20 italic">Works</span>
            </h2>
            <p className="text-xl text-black/60 dark:text-gray-400 leading-relaxed font-light max-w-lg transition-colors duration-300">
              A curated collection of digital transformations where strategy meets art.
            </p>
          </div>

          <Link
            to="/projects"
            className="stagger-item group flex items-center gap-4 px-8 py-4 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black hover:text-white dark:hover:bg-white text-black dark:text-white dark:hover:text-dark-950 transition-all duration-500 font-bold uppercase tracking-widest text-xs"
          >
            Explore Selection
            <ArrowUpRight className="h-4 w-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>

        <div className="space-y-32 md:space-y-64">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 md:gap-20 items-center relative transition-all duration-1000`}
            >
              {/* Background Project Number */}
              <div className={`absolute -top-20 ${index % 2 === 0 ? 'left-0' : 'right-0'} project-number opacity-5 select-none z-0 hidden lg:block stagger-item text-black dark:text-white transition-colors duration-500`}>
                {String(index + 1).padStart(2, '0')}
              </div>

              {/* Image Container */}
              <div className="w-full md:w-7/12 aspect-[4/5] md:aspect-[16/10] stagger-item">
                <Link
                  to={`/projects/${project.slug}`}
                  className="group block relative w-full h-full overflow-hidden rounded-3xl project-card-premium shadow-2xl shadow-black/5 dark:shadow-none"
                >
                  <div className="absolute inset-0 bg-primary-500/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="parallax-image w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                </Link>
              </div>

              {/* Content Container */}
              <div className="w-full md:w-5/12 stagger-item">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-primary-500 font-bold text-xs uppercase tracking-[0.2em]">
                    <span>{project.category}</span>
                    <span className="w-8 h-[1px] bg-black/20 dark:bg-white/20 transition-colors duration-300"></span>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                  </div>

                  <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black dark:text-white font-display leading-[1.1] transition-colors duration-300">
                    <Link to={`/projects/${project.slug}`} className="hover:text-primary-500 transition-colors">
                      {project.title}
                    </Link>
                  </h3>

                  <p className="text-lg text-black/60 dark:text-gray-400 leading-relaxed font-light transition-colors duration-300">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-3 pt-4">
                    {project.tags?.map((tag, i) => (
                      <span key={i} className="px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase text-black/40 dark:text-white/40 border border-black/10 dark:border-white/10 rounded-full transition-colors duration-300">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-8">
                    <Link
                      to={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-3 text-black dark:text-white font-bold tracking-[0.2em] text-xs uppercase group transition-colors duration-300"
                    >
                      <span className="relative pb-1 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-primary-500 after:transform after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-500 after:origin-left">
                        View Discovery
                      </span>
                      <ArrowUpRight className="h-4 w-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform text-primary-500" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Subtle Decorative Glow for Mobile */}
              <div className="absolute inset-0 bg-primary-500/5 blur-[120px] rounded-full pointer-events-none -z-10 md:hidden"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

