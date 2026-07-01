import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { MapPin, ChevronDown, ChevronUp, Star, ArrowRight } from 'lucide-react';

// ─── DATA ────────────────────────────────────────────────────────────────────

const stats = [
  { label: 'Projects Completed', value: '300+' },
  { label: 'Locations', value: '2' },
  { label: 'Craftsmanship', value: 'Quality' },
  { label: 'Custom Designs', value: '100%' },
];

const values = [
  { num: '01', title: 'Quality', desc: 'We use durable materials and pay attention to every detail.' },
  { num: '02', title: 'Craftsmanship', desc: 'Every piece is carefully made to meet high standards.' },
  { num: '03', title: 'Customer First', desc: 'We work closely with our clients to bring their ideas to life.' },
  { num: '04', title: 'Reliability', desc: 'We deliver furniture built for everyday living.' },
];

const processSteps = [
  {
    step: '01',
    title: 'Consultation',
    desc: 'We sit down with you — in-person or via WhatsApp — to understand your space, style, and budget.',
    icon: '💬',
  },
  {
    step: '02',
    title: 'Design',
    desc: 'Our team sketches out options and presents materials, finishes, and dimensions tailored to your needs.',
    icon: '✏️',
  },
  {
    step: '03',
    title: 'Build',
    desc: 'Skilled craftsmen bring your piece to life in our workshop using quality materials and precision tools.',
    icon: '🔨',
  },
  {
    step: '04',
    title: 'Delivery',
    desc: 'We deliver and install your furniture, making sure everything fits perfectly before we leave.',
    icon: '🚚',
  },
];

const gallery = [
  {
    src: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
    label: 'Living Room Set',
  },
  {
    src: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800',
    label: 'Custom Wardrobe',
  },
  {
    src: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800',
    label: 'Dining Table',
  },
  {
    src: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800',
    label: 'Glass Coffee Table',
  },
  {
    src: 'https://images.unsplash.com/photo-1565791380713-1756b9a05343?auto=format&fit=crop&q=80&w=800',
    label: 'Office Desk',
  },
  {
    src: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=800',
    label: 'Bedroom Suite',
  },
];

const beforeAfter = [
  {
    before: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600',
    after: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600',
    label: 'Living Room Transformation',
    client: 'Nairobi Client',
  },
  {
    before: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&q=80&w=600',
    after: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=600',
    label: 'Dining Room Makeover',
    client: 'Machakos Client',
  },
];

const testimonials = [
  {
    name: 'James Mutua',
    location: 'Machakos',
    rating: 5,
    text: 'Elite Furniture delivered exactly what I envisioned. The quality of the wardrobe is exceptional — solid build, smooth finish. Would recommend to anyone.',
    avatar: 'JM',
  },
  {
    name: 'Aisha Wanjiru',
    location: 'Nairobi',
    rating: 5,
    text: 'From the consultation to delivery, the whole experience was smooth. My dining set is the centrepiece of my home now. Great work!',
    avatar: 'AW',
  },
  {
    name: 'Peter Otieno',
    location: 'Tena Estate',
    rating: 5,
    text: 'The custom glass table they made for my office looks premium. Even my clients comment on it. Very professional team.',
    avatar: 'PO',
  },
  {
    name: 'Grace Njeri',
    location: 'Nairobi',
    rating: 5,
    text: 'I walked into the Tena branch not sure what I wanted, and they helped me pick the perfect bedroom set. Delivery was fast and installation was clean.',
    avatar: 'GN',
  },
];

const faqs = [
  {
    q: 'Do you offer custom furniture?',
    a: 'Yes — custom furniture is our specialty. We work with you from design to delivery. Bring your idea, a photo, or just a vibe and we\'ll make it happen.',
  },
  {
    q: 'Where are your branches located?',
    a: 'We have two locations in Nairobi: Our Main Branch and our Tena Estate Branch at Manyanja Road, Whitehouse Footbridge.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept M-PESA, cash, and bank transfer. For custom orders, a 40% deposit is required to begin work.',
  },
  {
    q: 'How long does a custom order take?',
    a: 'Timelines vary depending on the piece. Simple items take 1–2 weeks; larger custom projects can take 3–4 weeks. We\'ll give you a clear timeline upfront.',
  },
  {
    q: 'Do you deliver?',
    a: 'Yes, we deliver across Nairobi and surrounding areas. Delivery charges depend on your location and order size.',
  },
  {
    q: 'Can I visit the workshop?',
    a: 'Absolutely. Visit either of our showroom branches during business hours and our team will walk you through available pieces and custom options.',
  },
];

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function StarRating({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 hover:text-primary transition-colors"
      >
        <span className="font-semibold text-base">{q}</span>
        {open ? <ChevronUp className="w-5 h-5 shrink-0" /> : <ChevronDown className="w-5 h-5 shrink-0" />}
      </button>
      {open && (
        <p className="text-muted-foreground text-sm leading-relaxed pb-5">{a}</p>
      )}
    </div>
  );
}

function BeforeAfterCard({ item }) {
  const [hover, setHover] = useState(false);
  return (
    <div className="rounded-2xl overflow-hidden shadow-lg">
      <div className="relative aspect-video" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        <img
          src={hover ? item.after : item.before}
          alt={item.label}
          className="w-full h-full object-cover transition-all duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${hover ? 'bg-primary text-primary-foreground' : 'bg-black/60 text-white'}`}>
            {hover ? 'After' : 'Before'}
          </span>
        </div>
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <p className="text-white font-semibold">{item.label}</p>
          <p className="text-white/70 text-sm">{item.client}</p>
        </div>
      </div>
      <div className="bg-secondary/50 p-3 text-center text-xs text-muted-foreground font-medium tracking-wide uppercase">
        Hover to see the transformation
      </div>
    </div>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────

function TikTokEmbed() {
  const ref = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.tiktok.com/embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src="https://www.tiktok.com/embed.js"]');
      if (existingScript) existingScript.remove();
    };
  }, []);

  return (
    <blockquote
      ref={ref}
      className="tiktok-embed"
      cite="https://www.tiktok.com/@elitespacefurniture"
      data-unique-id="elitespacefurniture"
      data-embed-from="embed_page"
      data-embed-type="creator"
      style={{ maxWidth: '1100px', minWidth: '288px', width: '100%' }}
    >
      <section>
        <a target="_blank" rel="noreferrer" href="https://www.tiktok.com/@elitespacefurniture?refer=creator_embed">
          @elitespacefurniture
        </a>
      </section>
    </blockquote>
  );
}

export default function About() {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16 max-w-6xl">

        {/* ── Hero ── */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">Our Story</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            At Elite Furniture, we believe furniture should do more than fill a room — it should make a house feel like home. From custom designs to everyday essentials, we create pieces that combine comfort, style, and lasting quality. Every item is carefully crafted with attention to detail and built to fit your space and lifestyle.
          </p>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
          {stats.map((stat, i) => (
            <div key={i} className="text-center p-6 bg-secondary/50 rounded-2xl border">
              <div className="text-4xl md:text-5xl font-black text-primary mb-2">{stat.value}</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── Values ── */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold mb-10 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="text-center p-6 bg-secondary/50 rounded-2xl border hover:shadow-lg transition-shadow duration-300">
                <div className="text-5xl font-black text-primary/20 mb-4">{v.num}</div>
                <h3 className="text-xl font-bold mb-3">{v.title}</h3>
                <p className="text-sm font-medium text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── How We Work ── */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold mb-4 text-center">How We Work</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            From your first message to the final installation — here's what working with us looks like.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, i) => (
              <div key={i} className="relative p-6 bg-secondary/50 rounded-2xl border hover:border-primary/40 transition-colors duration-300">
                <div className="text-4xl mb-4">{step.icon}</div>
                <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">{step.step}</div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                {i < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 z-10 text-primary/40">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Product Gallery ── */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold mb-4 text-center">Our Work</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            A glimpse at some of the pieces we've built. Every item you see was made to order.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.map((item, i) => (
              <div key={i} className="group relative rounded-xl overflow-hidden aspect-square shadow-md">
                <img
                  src={item.src}
                  alt={item.label}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-end">
                  <span className="w-full translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 text-white text-sm font-semibold p-4">
                    {item.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
            >
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ── Before & After ── */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold mb-4 text-center">Before & After</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            See the difference a well-crafted piece makes. Hover over each image to reveal the transformation.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {beforeAfter.map((item, i) => (
              <BeforeAfterCard key={i} item={item} />
            ))}
          </div>
        </div>

        {/* ── Testimonials ── */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold mb-4 text-center">What Our Clients Say</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Real feedback from real customers across Nairobi and Machakos.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="p-6 bg-secondary/50 rounded-2xl border hover:shadow-lg transition-shadow duration-300">
                <StarRating count={t.rating} />
                <p className="text-sm text-muted-foreground leading-relaxed my-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {t.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Branches / Google Maps ── */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold mb-10 text-center">Visit Our Showrooms</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Branch Photos */}
            <div className="rounded-2xl overflow-hidden shadow-lg group relative">
              <div className="aspect-video bg-muted flex items-center justify-center">
                <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800" alt="Nairobi Main Branch" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">Nairobi Main Branch</h3>
                <p className="flex items-center text-white/80"><MapPin className="w-4 h-4 mr-2" /> Nairobi</p>
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

            {/* Google Maps Embeds */}
            <div className="rounded-2xl overflow-hidden shadow-lg border">
              <iframe
                title="Main Branch Map"
                className="w-full h-64"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://maps.google.com/maps?q=PV6W%2B4Q,Nairobi&t=&z=15&ie=UTF8&iwloc=&output=embed"
              />
              <div className="p-4 bg-secondary/50">
                <p className="font-semibold text-sm">Nairobi Main Branch</p>
                <p className="text-xs text-muted-foreground">Nairobi, Kenya</p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg border">
              <iframe
                title="Tena Branch Map"
                className="w-full h-64"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/embed/v1/place?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY&q=Tena+Estate,Nairobi,Kenya"
              />
              <div className="p-4 bg-secondary/50">
                <p className="font-semibold text-sm">Tena Branch</p>
                <p className="text-xs text-muted-foreground">Manyanja Road, Whitehouse Footbridge</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── TikTok Feed ── */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold mb-4 text-center">Follow Our Work on TikTok</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            We share builds, transformations, and behind-the-scenes clips from our workshop.
          </p>
          <div className="flex justify-center">
            <TikTokEmbed />
          </div>
        </div>

        {/* ── FAQ ── */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold mb-4 text-center">Frequently Asked Questions</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Everything you need to know before placing an order.
          </p>
          <div className="max-w-3xl mx-auto bg-secondary/30 rounded-2xl border p-6 md:p-10">
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="text-center bg-primary text-primary-foreground rounded-3xl p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Looking for furniture that fits your style?</h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto relative z-10">
            Explore our collection or let us create something uniquely yours.
          </p>
          <div className="flex justify-center gap-4 flex-wrap relative z-10">
            <Link to="/products" className="inline-flex items-center justify-center h-11 px-8 rounded-md text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
              Browse Collection
            </Link>
            <Link to="/custom-orders" className="inline-flex items-center justify-center h-11 px-8 rounded-md text-sm font-medium border border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-colors">
              Request a Custom Design
            </Link>
          </div>
        </div>

      </div>
    </PageLayout>
  );
}
