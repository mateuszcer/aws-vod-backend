export interface UploadRequest {
  fileName: string;
  title: string;
  description: string;
  categories: string[];
  length: number;
  productionYear: number;
  thumbnailFilename: string;
}
