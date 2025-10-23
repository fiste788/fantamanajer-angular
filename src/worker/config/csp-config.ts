export const cspConfig: Record<string, Array<string>> = {
  'default-src': ["'self'", '*.fantamanajer.it'],
  'script-src': ["'self'", "'unsafe-inline static.cloudflareinsights.com'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", '*.fantamanajer.it', 'data:'],
};
