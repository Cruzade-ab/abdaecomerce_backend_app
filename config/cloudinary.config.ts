import { ConfigService } from '@nestjs/config';
import  CloudinaryOptions  from '../src/cloudinary/interfaces/cloudinary-options.interface'

export const cloudinaryConfig = (configService: ConfigService): CloudinaryOptions => {
  return {
    cloudName: configService.get('cloudinary_service'),
    apiKey: configService.get('666286384159972'),
    apiSecret: configService.get('OnWUYfiE19ftq9_GNCFn_tM5gmU')
  };
};
