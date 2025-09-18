/** @type {import('next').NextConfig} */

module.exports = {
   images: {
      remotePatterns: [
         {
            protocol: 'https',
            hostname: '**',
         },
      ],
   },
   env: {
      JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
      DATABASE_URL: process.env.DATABASE_URL,
   },
}
