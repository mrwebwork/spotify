import { Price } from '@/types';
import DOMPurify from 'dompurify';

export const validateUuid = (
  id: string | undefined | null,
  errorMessage = 'Invalid UUID'
): string => {
  if (!id || id === 'undefined') {
    throw new Error(errorMessage);
  }
  return id;
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

/**
 * Sanitizes text input to prevent XSS attacks
 * @param input - The input string to sanitize
 * @param allowHtml - Whether to allow safe HTML tags (default: false)
 * @returns Sanitized string safe for rendering
 */
export const sanitizeInput = (input: string | null | undefined, allowHtml: boolean = false): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // First, handle basic HTML entity encoding for non-HTML contexts
  if (!allowHtml) {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  // For HTML contexts, use DOMPurify with strict configuration
  // Note: DOMPurify requires a DOM environment, so we check if it's available
  if (typeof window !== 'undefined' && DOMPurify) {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [], // Allow no HTML tags for maximum security
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true, // Keep the text content but strip tags
    });
  }

  // Fallback for server-side rendering - basic encoding
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Sanitizes error messages that might contain user input
 * @param message - The error message to sanitize
 * @returns Sanitized error message safe for display
 */
export const sanitizeErrorMessage = (message: string | null | undefined): string => {
  if (!message || typeof message !== 'string') {
    return 'An error occurred';
  }

  // Remove any potential HTML/script content and encode special characters
  return sanitizeInput(message, false);
};
