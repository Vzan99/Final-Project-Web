export const cloudinaryBaseUrl =
  "https://res.cloudinary.com/ddunl3ta7/image/upload/";

export function getCloudinaryImageUrl(
  publicIdWithExt: string | null | undefined,
  options: { width?: number; height?: number; crop?: string } = {}
): string | null {
  if (!publicIdWithExt) return null;

  const transforms = [];
  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);
  if (options.crop) transforms.push(`c_${options.crop}`);

  const transformStr = transforms.length ? transforms.join(",") + "/" : "";

  return `${cloudinaryBaseUrl}${transformStr}${publicIdWithExt}`;
}
