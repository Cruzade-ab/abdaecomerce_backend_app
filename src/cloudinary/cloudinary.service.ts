import { Injectable } from '@nestjs/common';
import * as streamifier from 'streamifier';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';

@Injectable()
export class CloudinaryService {
    async uploadProductImage(filePath: string, brand: string, productName: string): Promise<string> {
        const targetPath = `brandNames/${brand}/${productName}/${filePath}`;

        try {
            // Subir el archivo a Cloudinary
            const cloudinaryResponse = await this.uploadFile(filePath);

            // Comprueba si la respuesta es un UploadApiResponse o un UploadApiErrorResponse
            if ('secure_url' in cloudinaryResponse) {
                // Si es un UploadApiResponse, devuelve la URL segura de la imagen subida
                return cloudinaryResponse.secure_url;
            } else {
                // Si es un UploadApiErrorResponse, lanza un error con el mensaje de error
                throw new Error(`Error al subir la imagen: ${cloudinaryResponse.message}`);
            }
        } catch (error) {
            // Manejar errores de manera adecuada
            throw new Error(`Error al subir la imagen: ${error.message}`);
        }
    }

    private uploadFile(filePath: string): Promise<CloudinaryResponse> {
        return new Promise<CloudinaryResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                },
            );
            streamifier.createReadStream(filePath).pipe(uploadStream);
        });
    }
}
