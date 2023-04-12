import { Module } from "@nestjs/common";
import { FirebaseService } from "./firebase.service";
import * as admin from 'firebase-admin';
import { firebaeKey } from "src/config/firebase.config";
import { FirebaseController } from "./firebase.controller";

@Module({
    imports: [],
    controllers: [FirebaseController],
    providers: [FirebaseService],
    exports: [FirebaseService]
})
export class FirebaseModule {
    constructor() {
        admin.initializeApp({
            credential: admin.credential.cert({
                clientEmail: firebaeKey.client_email,
                privateKey: firebaeKey.private_key,
                projectId: firebaeKey.project_id,
            }),
            storageBucket: 'gs://rotina-imoveis.appspot.com'
        });
    }
}