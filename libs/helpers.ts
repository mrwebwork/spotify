import { Price } from '@/types';

export const validateUuid = (
  id: string | undefined | null,
  errorMessage = 'Invalid UUID'
): string => {
  if (!id || id === 'undefined') {
    throw new Error(errorMessage);
  }
  return id;
};

// Sanitize user input to prevent XSS and injection attacks
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  // Remove HTML tags and trim whitespace
  return input.replace(/<[^>]*>/g, '').trim().slice(0, 255); // Limit length to 255 chars
};

// Validate file type and size for security
export const validateFileUpload = (file: File, allowedTypes: string[], maxSizeBytes: number): void => {
  if (!file) {
    throw new Error('No file provided');
  }
  
  // Check file size to prevent DoS attacks
  if (file.size > maxSizeBytes) {
    throw new Error(`File size exceeds ${Math.round(maxSizeBytes / 1024 / 1024)}MB limit`);
  }
  
  // Validate MIME type against allowed types for security
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File type ${file.type} not allowed. Allowed types: ${allowedTypes.join(', ')}`);
  }
};

// Secure environment variable validation
export const validateEnvVar = (varName: string, defaultValue?: string): string => {
  const value = process.env[varName];
  if (!value) {
    if (defaultValue !== undefined) return defaultValue;
    throw new Error(`Required environment variable ${varName} is missing`);
  }
  return value;
};

export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? //* Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? //* Automatically set by Vercel.
    'http://localhost:3000/';
  //* Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`;
  //* Make sure to including trailing `/`.
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
  return url;
};

export const postData = async ({ url, data }: { url: string; data?: { price: Price } }) => {
  // console.log('posting,', url, data);

  const res: Response = await fetch(url, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    credentials: 'same-origin',
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    // console.log('Error in postData', { url, data, res });

    throw Error(res.statusText);
  }

  return res.json();
};

export const toDateTime = (secs: number) => {
  var t = new Date('1970-01-01T00:30:00Z');
  t.setSeconds(secs);
  return t;
};
