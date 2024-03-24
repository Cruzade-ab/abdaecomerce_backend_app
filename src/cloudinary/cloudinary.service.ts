import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
import { streamifier } from 'streamifier'; // Import streamifier to create a readable stream from buffer

@Injectable()
export class CloudinaryService {
    // method to upload a single file
    async uploadFile(file: Express.Multer.File): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result.secure_url);
                },
            );
            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }
}
