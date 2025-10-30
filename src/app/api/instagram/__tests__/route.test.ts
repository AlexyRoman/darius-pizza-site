/** @jest-environment node */
import { GET } from '@/app/api/instagram/route';

describe('GET /api/instagram', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    delete process.env.INSTAGRAM_ACCESS_TOKEN;
  });

  it('returns 500 if access token missing', async () => {
    const response = await GET();
    expect(response.status).toBe(500);
  });

  it('returns posts on success', async () => {
    process.env.INSTAGRAM_ACCESS_TOKEN = 'token';
    const fakePosts = [
      {
        id: '1',
        caption: 'Hello',
        media_type: 'IMAGE',
        media_url: 'http://img',
        permalink: 'http://insta/1',
        timestamp: '2020-01-01T00:00:00Z',
      },
    ];

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: fakePosts }),
    } as unknown as Response);

    const response = await GET();
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(Array.isArray(json.posts)).toBe(true);
    expect(json.posts).toHaveLength(1);
  });

  it('handles non-ok response from Instagram', async () => {
    process.env.INSTAGRAM_ACCESS_TOKEN = 'token';
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: false, status: 500 } as Response);

    const response = await GET();
    expect(response.status).toBe(500);
  });
});
