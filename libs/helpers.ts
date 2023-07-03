import { Price } from '@/types';

//* Function to retrieve and format the URL for the application
export const getURL = () => {
  let url =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL ??
    'https://localhost:3000';

  //* If the URL does not include 'http' prepend 'https://' to it
  url = url.includes('http') ? url : `https://${url}`;

  //* If the URL does not end with a '/', append one to it
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;

  return url;
};

//* Function to post data to a specific URL
export const postData = async ({ url, data }: { url: string; data?: { price: Price } }) => {
  console.log('POST REQUEST:', url, data);

  const res: Response = await fetch(url, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    credentials: 'same-origin',
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    console.log('Error in the Post', { url, data, res });
    throw new Error(res.statusText);
  }
  return res.json();
};

//* Function to convert seconds into a Date object
export const toDateTime = (secs: number) => {
  let t = new Date('1970, 0, 1T00:30:00Z'); //* Epoch
  t.setSeconds(secs);
  return t;
};
