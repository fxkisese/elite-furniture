import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { sanitizeText, sanitizeEmail, sanitizePhone } from '@/lib/sanitize';

export default function Contact() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.target);
    const data = {
      name: sanitizeText(formData.get('name') || ''),
      email: sanitizeEmail(formData.get('email') || '') || null,
      phone: sanitizePhone(formData.get('phone') || '') || null,
      message: sanitizeText(formData.get('message') || ''),
    };

    if (!data.name || !data.message) {
      toast.error('Please fill in your name and message.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('messages').insert([data]);
    
    if (error) {
      toast.error('Failed to send message. Please try again.');
      console.error(error);
    } else {
      toast.success('Message sent successfully! We will get back to you soon.');
      e.target.reset();
    }
    setLoading(false);
  };

  const branches = [
    {
      name: 'Nairobi Main Branch',
      address: 'Nairobi',
      phone: '+254 141 484 249',
      email: 'sales@furnitureelitespace.co.ke',
      hours: 'Mon-Sat: 8:00 AM - 6:00 PM',
      mapUrl: 'https://maps.google.com/maps?q=PV6W%2B4Q,Nairobi'
    },
    {
      name: 'Tena Estate Branch',
      address: 'Manyanja Road, Tena Estate',
      phone: '+254 141 484 249',
      email: 'sales@furnitureelitespace.co.ke',
      hours: 'Mon-Sun: 9:00 AM - 7:00 PM',
      mapUrl: 'https://maps.google.com/?q=Manyanja+Road,Tena+Estate'
    }
  ];

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">Get in Touch</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Visit our showrooms, give us a call, or send us a message. We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* Branch Information */}
          <div className="space-y-10">
            <h2 className="text-3xl font-bold">Our Locations</h2>
            
            <div className="grid gap-8">
              {branches.map((branch, idx) => (
                <div key={idx} className="p-8 bg-secondary/50 rounded-2xl border hover:shadow-lg transition-shadow duration-300">
                  <h3 className="text-2xl font-bold mb-6 text-foreground">{branch.name}</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 mr-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p>{branch.address}</p>
                        <a href={branch.mapUrl} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline mt-1 inline-block">View on Google Maps</a>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 mr-4 text-primary shrink-0" />
                      <a href={`tel:${branch.phone.replace(/\\s/g, '')}`} className="hover:text-primary transition-colors">{branch.phone}</a>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 mr-4 text-primary shrink-0" />
                      <a href={`mailto:${branch.email}`} className="hover:text-primary transition-colors">{branch.email}</a>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-4 text-primary shrink-0" />
                      <span>{branch.hours}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Light Contact Form */}
          <div className="bg-white border-2 border-[#D4AF37] text-gray-900 p-8 md:p-12 rounded-3xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            
            <h2 className="text-3xl font-bold mb-2 relative z-10 text-gray-900">Send us a message</h2>
            <p className="text-gray-600 mb-8 relative z-10">Fill out the form below and we'll get back to you shortly.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2 flex flex-col">
                  <label htmlFor="name" className="text-sm font-medium text-gray-900">Full Name</label>
                  <input id="name" name="name" required placeholder="John Doe" className="flex h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black disabled:cursor-not-allowed disabled:opacity-50" />
                </div>
                <div className="space-y-2 flex flex-col">
                  <label htmlFor="email" className="text-sm font-medium text-gray-900">Email Address</label>
                  <input id="email" name="email" type="email" required placeholder="john@example.com" className="flex h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black disabled:cursor-not-allowed disabled:opacity-50" />
                </div>
              </div>
              
              <div className="space-y-2 flex flex-col">
                <label htmlFor="phone" className="text-sm font-medium text-gray-900">Phone Number (Optional)</label>
                <input id="phone" name="phone" type="tel" placeholder="+254 141 484 249" className="flex h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black disabled:cursor-not-allowed disabled:opacity-50" />
              </div>
              
              <div className="space-y-2 flex flex-col">
                <label htmlFor="message" className="text-sm font-medium text-gray-900">Message</label>
                <textarea 
                  id="message" 
                  name="message"
                  required 
                  placeholder="How can we help you?" 
                  className="flex min-h-[150px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black disabled:cursor-not-allowed disabled:opacity-50 resize-y" 
                />
              </div>
              
              <button type="submit" disabled={loading} className="inline-flex items-center justify-center rounded-md text-sm font-bold transition-colors disabled:opacity-50 bg-black text-white hover:bg-gray-800 h-12 px-8 py-2 w-full text-lg">
                {loading ? 'Sending...' : (
                  <>
                    Send Message
                    <Send className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
