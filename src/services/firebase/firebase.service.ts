import { Injectable } from "@nestjs/common";
import { storage } from "firebase-admin";
import * as admin from 'firebase-admin';
import { firebaeKey } from "src/config/firebase.config";

@Injectable()
export class FirebaseService {
    bucketUrl: string;
    constructor() {
        this.bucketUrl = 'gs://rotina-imoveis.appspot.com'
    }

    async upload(path?: string) {
        try {
            const bucket = storage().bucket();

            const file = await bucket.upload(path, {
                public: true
            }).then(res => res[0]);

            return {
                success: true,
                message: 'Upload realizado com sucesso.',
                file: {
                    id: file.metadata.id,
                    generation: file.metadata.generation,
                    name: file.metadata.name,
                    bucket: file.metadata.bucket,
                    path: `https://storage.googleapis.com/storage/v1/b/${file.metadata.bucket}/o/${file.metadata.name}?generation=${file.metadata.generation}&alt=media`
                },
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }
}