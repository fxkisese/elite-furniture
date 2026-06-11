import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { MapPin } from 'lucide-react';

export default function About() {
  const stats = [
    { label: 'Orders Completed', value: '300+' },
    { label: 'Showroom Branches', value: '2' },
    { label: 'Founded In', value: '2024' },
    { label: 'Custom Designs', value: '100%' },
  ];

  const values = [
    { num: '01', title: 'Craftsmanship', desc: 'Every piece is built by skilled artisans who take pride in their work.' },
    { num: '02', title: 'Quality Materials', desc: 'We source only the finest sustainable woods and premium fabrics.' },
    { num: '03', title: 'Customer First', desc: 'Your vision guides our process from the first sketch to final delivery.' },
    { num: '04', title: 'Innovation', desc: 'Blending traditional techniques with modern design aesthetics.' },
  ];

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">Our Story</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Elite Furniture was born from a passion for exceptional craftsmanship and a desire to bring bespoke, premium furniture to homes across Kenya. We don't just build furniture; we create heirlooms.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
          {stats.map((stat, i) => (
            <div key={i} className="text-center p-6 bg-secondary/50 rounded-2xl border">
              <div className="text-4xl md:text-5xl font-black text-primary mb-2">{stat.value}</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Values Section */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold mb-10 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="border-none shadow-md bg-card hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden">
                <div className="p-8">
                  <div className="text-5xl font-black text-primary/20 mb-4">{v.num}</div>
                  <h3 className="text-xl font-bold mb-3">{v.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Branches Section */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold mb-10 text-center">Visit Our Showrooms</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl overflow-hidden shadow-lg group relative">
              <div className="aspect-video bg-muted flex items-center justify-center">
                <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800" alt="Kyumbi Branch" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">Kyumbi Branch</h3>
                <p className="flex items-center text-white/80"><MapPin className="w-4 h-4 mr-2" /> Mombasa Road, Kyumbi</p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg group relative">
              <div className="aspect-video bg-muted flex items-center justify-center">
                <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800" alt="Tena Branch" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">Tena Branch</h3>
                <p className="flex items-center text-white/80"><MapPin className="w-4 h-4 mr-2" /> Manyanja Road, Tena Estate</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-primary text-primary-foreground rounded-3xl p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Ready to transform your space?</h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto relative z-10">
            Let's work together to create the perfect custom pieces for your home or office.
          </p>
          <div className="flex justify-center gap-4 relative z-10">
            <Link to="/custom-orders" className="inline-flex items-center justify-center h-11 px-8 rounded-md text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
              Request a Quote
            </Link>
            <Link to="/contact" className="inline-flex items-center justify-center h-11 px-8 rounded-md text-sm font-medium border border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
