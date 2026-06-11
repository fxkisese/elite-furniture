import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

const FURNITURE_TYPES = ['Sofa', 'Bed', 'Dining Table', 'Wardrobe', 'Office Desk', 'Coffee Table', 'TV Stand', 'Other'];
const MATERIALS = ['Mahogany', 'Mvuli', 'Pine', 'Cypress', 'MDF', 'Metal', 'Fabric', 'Leather', 'Glass', 'Other'];
const BUDGET_RANGES = ['Below 50k', '50k - 100k', '100k - 200k', '200k+'];
const TIMELINES = ['ASAP (Rushed)', '2-4 Weeks', '1-2 Months', 'Flexible'];

export default function CustomOrders() {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    materials: [],
    budget: '',
    timeline: ''
  });

  const toggleMaterial = (material) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.includes(material) 
        ? prev.materials.filter(m => m !== material)
        : [...prev.materials, material]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.type) {
      toast.error('Please select a furniture type.');
      return;
    }
    setLoading(true);
    
    const form = new FormData(e.target);
    const measurements = `${form.get('width') || '?'}W x ${form.get('height') || '?'}H x ${form.get('depth') || '?'}D cm`;
    const notes = `Materials: ${formData.materials.join(', ')}\nBudget: ${formData.budget}\nTimeline: ${formData.timeline}\nDescription: ${form.get('description')}\nReference: ${form.get('reference')}`.trim();

    const data = {
      name: form.get('name'),
      email: form.get('email'),
      phone: form.get('phone'),
      furniture_type: formData.type,
      measurements: measurements,
      notes: notes
    };

    const { error } = await supabase.from('quotes').insert([data]);

    if (error) {
      toast.error('Failed to submit brief. Please try again.');
      console.error(error);
    } else {
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setLoading(false);
  };

  const steps = [
    { title: 'The Brief', desc: 'Tell us what you want to build' },
    { title: 'The Quote', desc: 'We provide pricing & 3D mockups' },
    { title: 'The Deposit', desc: '60% downpayment to start' },
    { title: 'Delivery', desc: 'Free delivery within Nairobi' }
  ];

  if (success) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-24 max-w-3xl text-center">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Brief Received!</h1>
          <p className="text-xl text-muted-foreground mb-10">
            Thank you for trusting Elite Furniture with your custom piece. Our design team is reviewing your brief and will contact you within 24 hours with a preliminary quote.
          </p>
          <button onClick={() => setSuccess(false)} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8">Submit Another Brief</button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-gray-900">Request a Custom Quote</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From imagination to reality. Fill out the brief below and let our craftsmen bring your vision to life.
          </p>
        </div>

        {/* 4-Step Process */}
        <div className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {steps.map((step, idx) => (
              <div key={idx} className="relative p-6 rounded-2xl bg-[#faf7f0] border border-gray-200 text-center shadow-sm">
                <div className="w-8 h-8 rounded-full bg-[#b8903a] text-white flex items-center justify-center font-bold absolute -top-4 left-1/2 -translate-x-1/2">
                  {idx + 1}
                </div>
                <h3 className="font-bold mb-2 mt-2 text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
                {idx < steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6 z-10" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-12">
              
              {/* Personal Details */}
              <section className="space-y-6">
                <h2 className="text-2xl font-bold border-b pb-2">1. Contact Details</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2 flex flex-col">
                    <label htmlFor="name" className="text-sm font-medium">Full Name *</label>
                    <input id="name" name="name" required placeholder="John Doe" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                  </div>
                  <div className="space-y-2 flex flex-col">
                    <label htmlFor="phone" className="text-sm font-medium">Phone Number *</label>
                    <input id="phone" name="phone" type="tel" required placeholder="+254 700 000 000" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                  </div>
                  <div className="space-y-2 md:col-span-2 flex flex-col">
                    <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                    <input id="email" name="email" type="email" placeholder="john@example.com" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                  </div>
                </div>
              </section>

              {/* Furniture Type */}
              <section className="space-y-6">
                <h2 className="text-2xl font-bold border-b pb-2">2. What are we building? *</h2>
                <div className="flex flex-wrap gap-3">
                  {FURNITURE_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type }))}
                      className={cn(
                        "px-5 py-2.5 rounded-full border text-sm font-medium transition-all",
                        formData.type === type 
                          ? "bg-primary text-primary-foreground border-primary shadow-md" 
                          : "bg-background hover:bg-secondary"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </section>

              {/* Materials */}
              <section className="space-y-6">
                <h2 className="text-2xl font-bold border-b pb-2">3. Preferred Materials</h2>
                <div className="flex flex-wrap gap-3">
                  {MATERIALS.map((material) => (
                    <button
                      key={material}
                      type="button"
                      onClick={() => toggleMaterial(material)}
                      className={cn(
                        "px-5 py-2.5 rounded-full border text-sm font-medium transition-all",
                        formData.materials.includes(material)
                          ? "bg-amber-100 text-amber-900 border-amber-300 shadow-sm" 
                          : "bg-background hover:bg-secondary"
                      )}
                    >
                      {material}
                    </button>
                  ))}
                </div>
              </section>

              {/* Dimensions */}
              <section className="space-y-6">
                <h2 className="text-2xl font-bold border-b pb-2">4. Approximate Dimensions (cm)</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2 flex flex-col">
                    <label htmlFor="width" className="text-sm font-medium">Width (W)</label>
                    <input id="width" name="width" type="number" placeholder="e.g. 120" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                  </div>
                  <div className="space-y-2 flex flex-col">
                    <label htmlFor="height" className="text-sm font-medium">Height (H)</label>
                    <input id="height" name="height" type="number" placeholder="e.g. 80" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                  </div>
                  <div className="space-y-2 flex flex-col">
                    <label htmlFor="depth" className="text-sm font-medium">Depth (D)</label>
                    <input id="depth" name="depth" type="number" placeholder="e.g. 60" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                  </div>
                </div>
              </section>

              {/* Details */}
              <section className="space-y-6">
                <h2 className="text-2xl font-bold border-b pb-2">5. Description & References</h2>
                <div className="space-y-4">
                  <div className="space-y-2 flex flex-col">
                    <label htmlFor="description" className="text-sm font-medium">Detailed Description *</label>
                    <textarea 
                      id="description" 
                      name="description"
                      required 
                      placeholder="Describe the design, colors, finish, and any specific requirements..." 
                      className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                    />
                  </div>
                  <div className="space-y-2 flex flex-col">
                    <label htmlFor="reference" className="text-sm font-medium">Reference Image Link</label>
                    <input id="reference" name="reference" type="url" placeholder="Paste a Pinterest, Instagram, or image URL..." className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                  </div>
                </div>
              </section>

              {/* Logistics */}
              <section className="space-y-6">
                <h2 className="text-2xl font-bold border-b pb-2">6. Logistics</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-base font-medium">Estimated Budget (KES)</label>
                    <div className="grid gap-2">
                      {BUDGET_RANGES.map(range => (
                        <div key={range} className="flex items-center space-x-2">
                          <input type="radio" name="budget" value={range} id={`budget-${range}`} checked={formData.budget === range} onChange={(e) => setFormData(prev => ({...prev, budget: e.target.value}))} className="w-4 h-4 text-primary focus:ring-primary border-gray-300" />
                          <label htmlFor={`budget-${range}`} className="font-normal text-sm">{range}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-base font-medium">Delivery Timeline</label>
                    <div className="grid gap-2">
                      {TIMELINES.map(time => (
                        <div key={time} className="flex items-center space-x-2">
                          <input type="radio" name="timeline" value={time} id={`time-${time}`} checked={formData.timeline === time} onChange={(e) => setFormData(prev => ({...prev, timeline: e.target.value}))} className="w-4 h-4 text-primary focus:ring-primary border-gray-300" />
                          <label htmlFor={`time-${time}`} className="font-normal text-sm">{time}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <div className="pt-6">
                <button type="submit" disabled={loading} className="inline-flex items-center justify-center rounded-xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-14 w-full text-lg">
                  {loading ? 'Submitting Brief...' : 'Submit Custom Order Brief'}
                </button>
                <p className="text-center text-sm text-muted-foreground mt-4">
                  By submitting this form, you agree to our Custom Order terms and conditions.
                </p>
              </div>

            </form>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
