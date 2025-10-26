#!/usr/bin/env node

const https = require('https');
const http = require('http');

function extractOGMeta(html) {
  const ogTags = {};
  const twitterTags = {};
  
  // Extract Open Graph tags
  const ogRegex = /<meta\s+property="og:([^"]+)"\s+content="([^"]+)"/g;
  let match;
  while ((match = ogRegex.exec(html)) !== null) {
    ogTags[match[1]] = match[2];
  }
  
  // Extract Twitter tags
  const twitterRegex = /<meta\s+name="twitter:([^"]+)"\s+content="([^"]+)"/g;
  while ((match = twitterRegex.exec(html)) !== null) {
    twitterTags[match[1]] = match[2];
  }
  
  return { ogTags, twitterTags };
}

function testOGMeta(url) {
  const protocol = url.startsWith('https') ? https : http;
  
  protocol.get(url, (res) => {
    let html = '';
    
    res.on('data', (chunk) => {
      html += chunk;
    });
    
    res.on('end', () => {
      const { ogTags, twitterTags } = extractOGMeta(html);
      
      console.log('\n🍕 OG Metadata Test Results');
      console.log('='.repeat(50));
      console.log(`URL: ${url}`);
      console.log('\n📱 Open Graph Tags:');
      Object.entries(ogTags).forEach(([key, value]) => {
        console.log(`  og:${key}: ${value}`);
      });
      
      console.log('\n🐦 Twitter Tags:');
      Object.entries(twitterTags).forEach(([key, value]) => {
        console.log(`  twitter:${key}: ${value}`);
      });
      
      // Validation
      console.log('\n✅ Validation:');
      const requiredOG = ['title', 'description', 'image', 'url', 'type'];
      const requiredTwitter = ['card', 'title', 'description', 'image'];
      
      requiredOG.forEach(tag => {
        const status = ogTags[tag] ? '✅' : '❌';
        console.log(`  ${status} og:${tag}`);
      });
      
      requiredTwitter.forEach(tag => {
        const status = twitterTags[tag] ? '✅' : '❌';
        console.log(`  ${status} twitter:${tag}`);
      });
      
      console.log('\n🎯 OG Image URLs:');
      if (ogTags.image) {
        console.log(`  Static: ${ogTags.image}`);
      }
      if (ogTags.image && ogTags.image.includes('/api/og')) {
        console.log(`  Dynamic: ${ogTags.image}`);
      }
    });
  }).on('error', (err) => {
    console.error('Error:', err.message);
  });
}

// Get URL from command line argument
const url = process.argv[2] || 'http://localhost:3000/en';

console.log('🔍 Testing OG Metadata...');
testOGMeta(url);




