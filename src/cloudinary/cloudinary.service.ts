import { Injectable, UploadedFile } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {

  async uploadImage(fileName: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      v2.config({
        cloud_name: 'df9cpjyaf',
        api_key: '538446387268838',
        api_secret: 'UCrCYPHjldGwQkVIUM7UJ0gxew0',
      });
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
      toStream(fileName.buffer).pipe(upload);
    });
  }

  async uploadAndGetUrl(fileName: Express.Multer.File): Promise<string> {
    try {
      const result = await this.uploadImage(fileName);
      if (result && 'secure_url' in result) {
        return result.secure_url;
      } else {
        throw new Error('Failed to get the URL from the upload result');
      }
    } catch (error) {
      // Handle the error appropriately, maybe logging it or throwing a custom error
      throw new Error(`Upload failed: ${error.message}`);
    }
  }
}
