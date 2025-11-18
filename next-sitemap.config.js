/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://faircoin.bixio.xyz',
  generateRobotsTxt: false, // We already have a custom robots.txt
  generateIndexSitemap: false,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: [
    '/api/*',
    '/admin/*',
    '/_next/*',
  ],
  transform: async (config, path) => {
    // Custom priority for important pages
    let priority = config.priority
    let changefreq = config.changefreq

    if (path === '/') {
      priority = 1.0
      changefreq = 'daily'
    } else if (path.startsWith('/community') || path.startsWith('/exchange')) {
      priority = 0.8
      changefreq = 'daily'
    } else if (path.startsWith('/about')) {
      priority = 0.8
      changefreq = 'weekly'
    } else if (path.startsWith('/docs')) {
      priority = 0.6
      changefreq = 'weekly'
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    }
  },
}
