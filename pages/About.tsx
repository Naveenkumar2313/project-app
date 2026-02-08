
import React from 'react';
import { TEAM_MEMBERS } from '../services/mockData';
import { ShieldCheck, Clock, Award, Users, Linkedin } from 'lucide-react';

const About = () => {
  return (
    <div className="space-y-16">
      {/* Mission Section */}
      <section className="text-center space-y-6 py-8">
        <h1 className="text-4xl font-bold text-slate-900">Empowering the Next Gen of Engineers</h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Pygenicarc Technologies was founded with a single mission: to bridge the gap between theoretical learning and practical implementation. We provide engineering students with high-quality, industry-standard projects and the mentorship needed to build them.
        </p>
      </section>

      {/* Trust Badges */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">100% Original</h3>
          <p className="text-slate-500">Every project is designed in-house. We guarantee unique code and plagiarism-free reports.</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">7-Day Support</h3>
          <p className="text-slate-500">Stuck on a bug? Our dedicated technical team is available 7 days a week to assist you.</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
          <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Industry Standard</h3>
          <p className="text-slate-500">We use components and coding standards that are used in the actual industry, not just toys.</p>
        </div>
      </section>

      {/* Team Section */}
      <section>
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Meet the Minds Behind Pygenicarc</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TEAM_MEMBERS.map((member) => (
            <div key={member.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden text-center group">
              <div className="h-64 overflow-hidden">
                <img src={member.image} alt={member.name} loading="lazy" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
                <p className="text-orange-600 font-medium text-sm mb-3">{member.role}</p>
                <p className="text-slate-500 text-sm mb-4">{member.bio}</p>
                {member.linkedin && (
                  <a href={member.linkedin} className="inline-flex items-center text-slate-400 hover:text-blue-700 transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Partnerships */}
      <section className="bg-slate-50 rounded-3xl p-12 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center justify-center">
          <Users className="w-6 h-6 mr-3 text-slate-400" /> Trusted by Students From
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale">
           {/* Mock Logos - represented by text for simplicity */}
           <span className="text-xl font-black text-slate-800">IIT MADRAS</span>
           <span className="text-xl font-black text-slate-800">BITS PILANI</span>
           <span className="text-xl font-black text-slate-800">VIT</span>
           <span className="text-xl font-black text-slate-800">ANNA UNIVERSITY</span>
           <span className="text-xl font-black text-slate-800">NIT TRICHY</span>
        </div>
      </section>
    </div>
  );
};

export default About;
