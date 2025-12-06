export type Tab = 'host' | 'generator';

export interface UploadedImage {
  id: string;
  name: string;
  url: string; // The local preview URL or hosted URL
  hostedUrl?: string; // The final ImgBB URL
  deleteUrl?: string;
  shortUrl?: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
}

export enum ImageSourceMode {
  MANUAL = 'MANUAL',
  AI_AUTO = 'AI_AUTO'
}

export interface GeneratorState {
  topic: string;
  affiliateLink: string;
  imageSourceMode: ImageSourceMode;
  aiImageCount: number;
  manualImages: UploadedImage[];
  manualImageUrls: string[];
}

export interface PromptResult {
  prompt: string;
  review: string;
}
