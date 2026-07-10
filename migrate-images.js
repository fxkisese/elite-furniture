import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xjrbztxuteqhctsvlvhf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqcmJ6dHh1dGVxaGN0c3ZsdmhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExOTM4MzAsImV4cCI6MjA5Njc2OTgzMH0._r4Ust0cOJV1TBJ_PwT_QJ7BkNrz1OTqiQf4jEk_SLQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function dataURLtoBuffer(dataurl) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = Buffer.from(arr[1], 'base64');
  return { buffer: bstr, mime };
}

async function main() {
  console.log('Starting migration to Google Ads approved URLs...\n');

  console.log('Fetching products...');
  const { data: products, error: pErr } = await supabase.from('products').select('*');
  if (pErr) throw pErr;

  let migrated = 0;

  for (const p of products) {
    let needsUpdate = false;
    let newImage = p.image;
    let newDeliveryOutside = p.delivery_outside;

    // Check if the main image is base64
    if (newImage && newImage.startsWith('data:')) {
      needsUpdate = true;
      console.log(`Migrating main image for product: ${p.name || p.id}...`);
      try {
        const { buffer, mime } = dataURLtoBuffer(newImage);
        const fileName = `migrated-${p.id}-${Date.now()}.jpg`;
        
        const { error: uploadError } = await supabase.storage.from('images').upload(fileName, buffer, {
          contentType: mime || 'image/jpeg'
        });

        if (uploadError) {
          console.error(`  Upload failed:`, uploadError.message);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
        newImage = publicUrl;
      } catch (e) {
        console.error(`  Error processing product ${p.id}:`, e.message);
        continue;
      }
    }

    // Check if delivery_outside has base64 images
    if (newDeliveryOutside && newDeliveryOutside.includes('data:')) {
      needsUpdate = true;
      console.log(`Migrating delivery_outside images for product: ${p.name || p.id}...`);
      try {
        const parsed = JSON.parse(newDeliveryOutside);
        if (parsed.metadata && Array.isArray(parsed.metadata.images)) {
          const newImagesArray = [];
          for (let i = 0; i < parsed.metadata.images.length; i++) {
            let img = parsed.metadata.images[i];
            if (img.startsWith('data:')) {
              const { buffer, mime } = dataURLtoBuffer(img);
              const fileName = `migrated-meta-${p.id}-${i}-${Date.now()}.jpg`;
              
              const { error: uploadError } = await supabase.storage.from('images').upload(fileName, buffer, {
                contentType: mime || 'image/jpeg'
              });

              if (!uploadError) {
                const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
                img = publicUrl;
              }
            }
            newImagesArray.push(img);
          }
          parsed.metadata.images = newImagesArray;
          newDeliveryOutside = JSON.stringify(parsed);
        }
      } catch(e) {
        console.error(`  Error parsing delivery_outside for product ${p.id}:`, e.message);
      }
    }

    // Update the product if any base64 string was replaced
    if (needsUpdate) {
      const { error: updateError } = await supabase.from('products').update({ 
        image: newImage,
        delivery_outside: newDeliveryOutside
      }).eq('id', p.id);

      if (updateError) {
        console.error(`  Database update failed:`, updateError.message);
      } else {
        console.log(`  Successfully migrated product: ${p.name}`);
        migrated++;
      }
    }
  }

  console.log('\nFetching hero slides...');
  const { data: slides, error: sErr } = await supabase.from('hero_slides').select('*');
  if (sErr) throw sErr;

  for (const h of slides) {
    if (h.image && h.image.startsWith('data:')) {
      console.log(`Migrating hero slide: ${h.id}...`);
      try {
        const { buffer, mime } = dataURLtoBuffer(h.image);
        const fileName = `migrated-hero-${h.id}-${Date.now()}.jpg`;
        
        const { error: uploadError } = await supabase.storage.from('images').upload(fileName, buffer, {
          contentType: mime || 'image/jpeg'
        });

        if (uploadError) {
          console.error(`  Upload failed:`, uploadError.message);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
        
        const { error: updateError } = await supabase.from('hero_slides').update({ 
          image: publicUrl
        }).eq('id', h.id);

        if (updateError) {
          console.error(`  Database update failed:`, updateError.message);
        } else {
          console.log(`  Successfully migrated hero slide! -> ${publicUrl}`);
          migrated++;
        }
      } catch (e) {
        console.error(`  Error processing slide ${h.id}:`, e.message);
      }
    }
  }

  console.log(`\nMigration complete. Total records migrated: ${migrated}`);
  console.log('You can now run `node generate-ads-gallery.js` to verify all images are included!');
}

main().catch(console.error);
