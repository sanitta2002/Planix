export interface IS3Service {
  uploadFile(
    file: Express.Multer.File,
    userId: string,
    folder?: string,
  ): Promise<{ key: string }>;
  deleteFile(key: string): Promise<void>;
  createSignedUrl(key: string, expiresIn?: number): Promise<string>;
}
