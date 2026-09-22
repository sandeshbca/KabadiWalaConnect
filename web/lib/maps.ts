export function googleMapsUrl(
  address: string,
  lat?: number,
  lng?: number,
): string {
  if (lat != null && lng != null && !Number.isNaN(lat) && !Number.isNaN(lng)) {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}

export function googleMapsEmbedUrl(
  address: string,
  lat?: number,
  lng?: number,
): string {
  const q =
    lat != null && lng != null
      ? `${lat},${lng}`
      : encodeURIComponent(address);
  return `https://maps.google.com/maps?q=${q}&z=15&output=embed`;
}
