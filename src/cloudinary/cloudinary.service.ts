import { Injectable } from '@nestjs/common';
import { v2 as cloudinary} from 'cloudinary';


@Injectable()
export class CloudinaryService {
    async uploadProductImage(filePath: string, brand: string, productName: string): Promise<string> {
        const targetPath = `brandNames/${brand}/${productName}`;
        const fullPath = `${targetPath}/${filePath}`;

        try {
            const result = await cloudinary.uploader.upload(filePath, {
                folder: targetPath
            });
            return result.url; // Retorna la URL de la imagen subida
        } catch (error) {
            throw new Error('Error al subir la imagen: ' + error.message);
        }
    }
}
