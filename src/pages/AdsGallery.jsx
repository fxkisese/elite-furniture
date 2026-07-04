import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdsGallery() {
  const [products, setProducts] = useState([]);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          { data: pData },
          { data: sData }
        ] = await Promise.all([
          supabase.from('products').select('*').order('created_at', { ascending: false }),
          supabase.from('hero_slides').select('*').order('created_at', { ascending: false })
        ]);
        setProducts(pData || []);
        setSlides(sData || []);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Elite Furniture Product Gallery</h1>
      <p>This page is automatically generated for easy ads selection.</p>
      
      <h2>Hero Slides</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '40px' }}>
        {slides.map(slide => (
          slide.image && (
            <div key={slide.id} style={{ border: '1px solid #ddd', padding: '10px' }}>
              <img src={slide.image} alt="Hero Slide" style={{ width: '300px', height: 'auto', display: 'block' }} />
              <div style={{ fontSize: '12px', marginTop: '5px', wordBreak: 'break-all' }}>{slide.image}</div>
            </div>
          )
        ))}
      </div>

      <h2>Products</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {products.map(p => (
          p.image && (
            <div key={p.id} style={{ border: '1px solid #ddd', padding: '10px' }}>
              <img src={p.image} alt={p.name || 'Product'} style={{ width: '100%', height: 'auto', display: 'block' }} />
              <div style={{ fontWeight: 'bold', marginTop: '8px' }}>{p.name}</div>
              <div style={{ color: '#666' }}>{p.category}</div>
              <div style={{ fontSize: '12px', marginTop: '5px', wordBreak: 'break-all', color: '#0066cc' }}>
                <a href={p.image} target="_blank" rel="noreferrer">View Full Image</a>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}
