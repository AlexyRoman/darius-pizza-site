'use client';

import React, { useState, useEffect } from 'react';
import { Instagram, ExternalLink } from 'lucide-react';

interface InstagramPost {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

interface InstagramFeedProps {
  className?: string;
}

export default function InstagramFeed({ className = '' }: InstagramFeedProps) {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstagramPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/instagram');

        if (!response.ok) {
          throw new Error('Failed to fetch Instagram posts');
        }

        const data = await response.json();
        setPosts(data.posts || []);
      } catch (err) {
        console.error('Instagram API Error:', err);
        setError('Unable to load Instagram posts');
      } finally {
        setLoading(false);
      }
    };

    fetchInstagramPosts();
  }, []);

  if (loading) {
    return (
      <div className={`grid grid-cols-3 gap-2 ${className}`}>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div
            key={i}
            className='aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center animate-pulse'
          >
            <Instagram className='h-8 w-8 text-primary/60' />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <Instagram className='h-12 w-12 text-primary/60 mx-auto mb-4' />
        <p className='text-foreground-secondary mb-4'>{error}</p>
        <a
          href='https://instagram.com/dariuspizza'
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all'
        >
          <Instagram className='h-4 w-4' />
          Voir sur Instagram
        </a>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <Instagram className='h-12 w-12 text-primary/60 mx-auto mb-4' />
        <p className='text-foreground-secondary mb-4'>
          Aucun post Instagram disponible
        </p>
        <a
          href='https://instagram.com/dariuspizza'
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all'
        >
          <Instagram className='h-4 w-4' />
          Suivre sur Instagram
        </a>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-3 gap-2 ${className}`}>
      {posts.slice(0, 6).map(post => (
        <a
          key={post.id}
          href={post.permalink}
          target='_blank'
          rel='noopener noreferrer'
          className='aspect-square rounded-lg overflow-hidden group relative'
        >
          <img
            src={
              post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url
            }
            alt={post.caption || 'Post Instagram'}
            className='w-full h-full object-cover transition-transform group-hover:scale-105'
          />
          <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center'>
            <ExternalLink className='h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity' />
          </div>
        </a>
      ))}
    </div>
  );
}
