/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Artwork is hot-linked from the API's CDNs. Serving it directly avoids
    // burning the host's image-optimization quota on thousands of posters.
    unoptimized: true,
  },
};

module.exports = nextConfig;
