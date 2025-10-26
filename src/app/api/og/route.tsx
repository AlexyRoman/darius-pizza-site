import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getLocaleMetadata } from '@/lib/og-metadata';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'Darius Pizza';
    const locale = searchParams.get('locale') || 'en';
    const type = searchParams.get('type') || 'default';

    const localeInfo = getLocaleMetadata(locale);

    const colors = {
      default: {
        primary: '#8B4513',
        secondary: '#FFD700',
        background: '#FFF8DC',
        text: '#2F1B14',
      },
      menu: {
        primary: '#DC143C',
        secondary: '#32CD32',
        background: '#F0FFF0',
        text: '#2F1B14',
      },
      info: {
        primary: '#4169E1',
        secondary: '#FF6347',
        background: '#F0F8FF',
        text: '#2F1B14',
      },
    };

    const currentColors = colors[type as keyof typeof colors] || colors.default;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: currentColors.background,
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <div style={{ fontSize: 120, marginBottom: 20 }}>🍕</div>
          <div
            style={{
              fontSize: 48,
              fontWeight: 'bold',
              color: currentColors.text,
              textAlign: 'center',
              marginBottom: 20,
              maxWidth: '800px',
              lineHeight: 1.2,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 24,
              color: currentColors.primary,
              textAlign: 'center',
              marginBottom: 30,
              fontWeight: 500,
            }}
          >
            {localeInfo.flag} {localeInfo.nativeName}
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 'bold',
              color: currentColors.secondary,
              textAlign: 'center',
              marginTop: 20,
            }}
          >
            Darius Pizza
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    console.log(errorMessage);
    return new Response(`Failed to generate the image`, { status: 500 });
  }
}
