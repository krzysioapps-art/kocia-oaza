export async function uploadToCloudinary(file: File, catId: string) {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", "kocia_oaza_unsigned");
  formData.append("folder", `cats/${catId}`);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/dskmhj26c/auto/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || "Upload failed");
  }

  return data;
}

/**
 * Optimizes Cloudinary URL with automatic format, quality, and size transformations
 * @param url - Original Cloudinary URL
 * @param options - Transformation options
 */
export function optimizeCloudinaryUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
    format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
    crop?: 'fill' | 'fit' | 'limit' | 'scale';
  } = {}
): string {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'limit'
  } = options;

  const transformations = [
    format && `f_${format}`,
    quality && `q_${quality}`,
    width && `w_${width}`,
    height && `h_${height}`,
    crop && `c_${crop}`,
  ].filter(Boolean).join(',');

  return url.replace('/upload/', `/upload/${transformations}/`);
}

/**
 * Generates responsive image URLs for different screen sizes
 */
export function getResponsiveCloudinaryUrls(url: string) {
  return {
    mobile: optimizeCloudinaryUrl(url, { width: 640, quality: 'auto', format: 'auto' }),
    tablet: optimizeCloudinaryUrl(url, { width: 1024, quality: 'auto', format: 'auto' }),
    desktop: optimizeCloudinaryUrl(url, { width: 1920, quality: 'auto', format: 'auto' }),
  };
}

/**
 * Generates blur placeholder from Cloudinary URL
 */
export function getBlurDataURL(url: string): string {
  return optimizeCloudinaryUrl(url, {
    width: 10,
    quality: 10,
    format: 'auto',
    crop: 'fill'
  });
}