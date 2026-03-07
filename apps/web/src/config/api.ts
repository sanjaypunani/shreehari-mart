const DEFAULT_API_BASE_URL = 'http://localhost:3000/api';
const DEFAULT_IMAGE_FALLBACK = 'https://via.placeholder.com/252x272?text=No+Image';

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const configuredApiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

export const API_BASE_URL = trimTrailingSlash(
  configuredApiBaseUrl || DEFAULT_API_BASE_URL
);

export const API_ORIGIN = API_BASE_URL.replace(/\/api$/, '');

export const toApiAssetUrl = (
  assetPath?: string | null,
  fallbackUrl = DEFAULT_IMAGE_FALLBACK
) => {
  if (!assetPath) {
    return fallbackUrl;
  }

  if (assetPath.startsWith('http://') || assetPath.startsWith('https://')) {
    return assetPath;
  }

  const normalizedAssetPath = assetPath.startsWith('/')
    ? assetPath
    : `/${assetPath}`;

  return `${API_ORIGIN}${normalizedAssetPath}`;
};
