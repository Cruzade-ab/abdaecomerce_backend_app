import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import stream from 'stream';

@Injectable()
export class CloudinaryService {
    async uploadProductImage(imageFile: Buffer | NodeJS.ReadableStream): Promise<string> {
        try {
            // Upload the image file to Cloudinary
            const cloudinaryResponse = await this.uploadFile(imageFile);

            // Check if the response is an UploadApiResponse or an UploadApiErrorResponse
            if ('secure_url' in cloudinaryResponse) {
                // If it's an UploadApiResponse, return the secure URL of the uploaded image
                return cloudinaryResponse.secure_url;
            } else {
                // If it's an UploadApiErrorResponse, throw an error with the error message
                throw new Error(`Error uploading image: ${cloudinaryResponse.message}`);
            }
        } catch (error) {
            // Handle errors appropriately
            throw new Error(`Error uploading image: ${error.message}`);
        }
    }

    private uploadFile(imageFile: Buffer | NodeJS.ReadableStream): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise<UploadApiResponse | UploadApiErrorResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                },
            );
            if (imageFile instanceof Buffer) {
                uploadStream.write(imageFile);
                uploadStream.end();
            } else if (imageFile instanceof stream.Readable) {
                imageFile.pipe(uploadStream);
            } else {
                reject(new Error('Invalid image file format'));
            }
        });
    }
}
