
import React from 'react';
import { TESTIMONIALS, PROJECTS } from '../services/mockData';
import { Star, Quote } from 'lucide-react';

const SuccessStories = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-bold text-slate-900">Celebrating Student Innovation</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg">
          Over 5,000 students have built their final year projects with Pygenicarc. Here are their stories.
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {TESTIMONIALS.map((testimonial) => (
          <div key={testimonial.id} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative">
            <Quote className="absolute top-6 right-6 w-8 h-8 text-orange-100" />
            <div className="flex items-center mb-6">
              <img src={testimonial.image} alt={testimonial.name} loading="lazy" className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-orange-100" />
              <div>
                <h3 className="font-bold text-slate-900">{testimonial.name}</h3>
                <p className="text-xs text-slate-500">{testimonial.college}</p>
              </div>
            </div>
            <div className="flex text-yellow-400 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'fill-current' : 'text-slate-200'}`} />
              ))}
            </div>
            <p className="text-slate-600 italic leading-relaxed">"{testimonial.quote}"</p>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <span className="text-xs font-semibold text-orange-600 uppercase tracking-wide">Project Built</span>
              <p className="text-sm font-medium text-slate-800">{testimonial.projectTitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Project Showcase / Hall of Fame */}
      <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-8 text-center">Hall of Fame: Real Projects, Real Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROJECTS.slice(0, 3).map((project, idx) => (
              <div key={project.id} className="group relative rounded-xl overflow-hidden aspect-video">
                <img src={project.imageUrl} alt={project.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                  <span className="text-orange-400 text-xs font-bold uppercase tracking-wider mb-1">Completed by 120+ Students</span>
                  <h3 className="font-bold text-lg">{project.title}</h3>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <p className="text-slate-300 mb-6">Join thousands of successful graduates. Start your journey today.</p>
            <a href="/#/" className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:-translate-y-1 inline-block">
              Browse Projects
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessStories;
