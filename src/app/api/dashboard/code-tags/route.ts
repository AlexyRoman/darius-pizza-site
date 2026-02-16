import { NextResponse } from 'next/server';

import { isAuthenticated } from '@/lib/auth';
import { getQrCounts } from '@/lib/qr-analytics';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const codes = await getQrCounts();
    return NextResponse.json({ codes });
  } catch (err) {
    console.error('GET /api/dashboard/code-tags:', err);
    return NextResponse.json(
      { error: 'Failed to load code tags' },
      { status: 500 }
    );
  }
}
