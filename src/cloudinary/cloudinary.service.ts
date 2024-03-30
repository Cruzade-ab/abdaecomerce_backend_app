import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {

  constructor() {
    cloudinary.config({
      cloud_name: 'df9cpjyaf',
      api_key: '538446387268838',
      api_secret: 'UCrCYPHjldGwQkVIUM7UJ0gxew0',
    });
  }

  async uploadAndGetUrl(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        }
      );

      toStream(file.buffer).pipe(uploadStream);
    });
  }
}
