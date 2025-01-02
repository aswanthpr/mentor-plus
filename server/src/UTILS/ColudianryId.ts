export function extractPublicIdFromCloudinaryUrl(url: string): string | null {
    const regex = /https:\/\/res.cloudinary.com\/[a-zA-Z0-9_-]+\/image\/upload\/v[0-9]+\/(.*?)(?=\.\w+$)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }