// Using the API key provided in the legacy code
const IMGBB_API_KEY = 'c3ae30847449f071df97b0097ef05348';

interface ImgBBResponse {
  success: boolean;
  data: {
    url: string;
    delete_url: string;
    display_url: string;
  };
  error?: {
    message: string;
  };
}

export const uploadToImgBB = async (file: File): Promise<ImgBBResponse> => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('ImgBB Upload Error:', error);
    throw new Error('Failed to upload image to host.');
  }
};

export const shortenUrl = async (url: string): Promise<string> => {
  try {
    const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
    if (!response.ok) throw new Error('Shortener failed');
    return await response.text();
  } catch (error) {
    console.error('TinyURL Error:', error);
    return url; // Fallback to original URL if shortener fails
  }
};