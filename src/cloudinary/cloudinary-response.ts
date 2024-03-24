import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";

export type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;

// aquí cloudinary devuelve una promesa, upload ok o upload error.