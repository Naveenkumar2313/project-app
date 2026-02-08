
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Shield, Lock, RotateCcw, BookOpen, AlertCircle } from 'lucide-react';

const Legal = () => {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'terms';

  const sections = [
    { id: 'terms', title: 'Terms & Conditions', icon: Shield },
    { id: 'privacy', title: 'Privacy Policy', icon: Lock },
    { id: 'refund', title: 'Refund Policy', icon: RotateCcw },
    { id: 'academic', title: 'Academic Integrity', icon: BookOpen },
  ];

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 min-h-[600px]">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h2 className="font-bold text-slate-900">Legal Center</h2>
          </div>
          <nav className="p-2 space-y-1">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#/legal?tab=${section.id}`}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === section.id 
                    ? 'bg-orange-50 text-orange-700' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <section.icon className={`w-4 h-4 mr-3 ${activeTab === section.id ? 'text-orange-500' : 'text-slate-400'}`} />
                {section.title}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-8 md:p-12">
        {activeTab === 'terms' && (
          <div className="prose prose-slate max-w-none">
            <h1>Terms and Conditions</h1>
            <p className="text-sm text-slate-500">Last updated: November 15, 2024</p>
            
            <h3>1. Introduction</h3>
            <p>Welcome to Pygenicarc Technologies. By accessing our website and purchasing our engineering project kits ("Products"), you agree to be bound by these Terms and Conditions.</p>

            <h3>2. Intellectual Property</h3>
            <p>All content on this platform, including project code, documentation, images, and videos, is the intellectual property of Pygenicarc Technologies. You are granted a limited license to use these materials for educational purposes only.</p>

            <h3>3. Usage Restrictions</h3>
            <p>You may not redistribute, resell, or claim ownership of our source code or project reports. These materials are intended to aid your personal learning and academic requirements.</p>

            <h3>4. Limitation of Liability</h3>
            <p>Pygenicarc Technologies shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products. While we ensure safety, handling electronic components involves inherent risks.</p>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="prose prose-slate max-w-none">
            <h1>Privacy Policy</h1>
            <p className="text-sm text-slate-500">Effective Date: November 15, 2024</p>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 not-prose mb-6 flex items-start">
               <Lock className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
               <p className="text-sm text-blue-800 m-0">We are GDPR compliant and committed to protecting your personal data.</p>
            </div>

            <h3>1. Information We Collect</h3>
            <p>We collect information you provide directly to us, such as your name, email address, shipping address, and payment information when you make a purchase.</p>

            <h3>2. How We Use Your Data</h3>
            <ul>
              <li>To process and deliver your orders.</li>
              <li>To send you order confirmations and invoices.</li>
              <li>To provide customer support.</li>
              <li>To improve our website and product offerings.</li>
            </ul>

            <h3>3. Cookies</h3>
            <p>We use cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings, though this may affect site functionality.</p>

            <h3>4. Data Security</h3>
            <p>We implement industry-standard security measures, including SSL encryption, to protect your personal information during transmission and storage.</p>
          </div>
        )}

        {activeTab === 'refund' && (
          <div className="prose prose-slate max-w-none">
            <h1>Return & Refund Policy</h1>
            
            <h3>1. Hardware Kits</h3>
            <p>We offer a <strong>7-Day Replacement Guarantee</strong> for all hardware components. If you receive a defective or damaged component, please report it via the Dashboard within 48 hours of delivery.</p>
            <p>Returns for "change of mind" are not accepted once the seal is broken due to the sensitive nature of electronic components.</p>

            <h3>2. Digital Products</h3>
            <p>Due to the nature of digital goods (source code, reports), <strong>all sales of Digital-Only packages are final and non-refundable</strong> once the download link has been accessed.</p>

            <h3>3. Cancellations</h3>
            <p>Orders can be cancelled within 12 hours of placement if they have not yet been dispatched. A full refund will be processed to the original payment method.</p>
          </div>
        )}

        {activeTab === 'academic' && (
          <div className="prose prose-slate max-w-none">
            <div className="flex items-center text-red-600 mb-4">
               <AlertCircle className="w-8 h-8 mr-3" />
               <h1 className="m-0 text-red-600">Academic Integrity Policy</h1>
            </div>
            
            <p className="lead font-medium text-slate-700">Pygenicarc Technologies supports ethical learning and strictly opposes academic dishonesty.</p>

            <h3>Our Stance</h3>
            <p>Our projects and kits are designed as educational aids to help students understand engineering concepts, coding logic, and hardware implementation. They are <strong>Reference Materials</strong>.</p>

            <h3>Student Responsibility</h3>
            <ul>
              <li><strong>Do Not Plagiarize:</strong> You should not submit our project reports or code verbatim as your own work without understanding or modification.</li>
              <li><strong>Understand Your Work:</strong> It is your responsibility to study the provided code and documentation to answer viva questions and explain the project logic.</li>
              <li><strong>Customization:</strong> We encourage you to modify, enhance, and customize the base projects to add your own unique value and innovation.</li>
            </ul>

            <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200 not-prose mt-8">
               <h4 className="font-bold text-yellow-800 mb-2">Notice to Universities</h4>
               <p className="text-sm text-yellow-700">
                  We provide plagiarism-check tools and generate unique code variations where possible to help students avoid accidental duplication. However, the final submission ethics lie with the student.
               </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Legal;
