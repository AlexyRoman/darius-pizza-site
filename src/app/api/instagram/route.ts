import { NextResponse } from 'next/server';

interface InstagramPost {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

export async function GET() {
  try {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Instagram access token not configured' },
        { status: 500 }
      );
    }

    // Fetch posts from Instagram Basic Display API
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${accessToken}&limit=12`
    );

    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform the data to match our interface
    const posts: InstagramPost[] = data.data.map(
      (post: Record<string, unknown>) => ({
        id: post.id as string,
        caption: post.caption as string | undefined,
        media_type: post.media_type as 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM',
        media_url: post.media_url as string,
        thumbnail_url: post.thumbnail_url as string | undefined,
        permalink: post.permalink as string,
        timestamp: post.timestamp as string,
      })
    );

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Instagram API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Instagram posts' },
      { status: 500 }
    );
  }
}
