import { readFile, unlink } from 'fs';
import { promisify } from 'util';
import * as sharp from 'sharp';
import { FirebaseService } from 'src/services/firebase/firebase.service';
//import { FirebaseService } from 'src/services/firebase/firebase.service';
//import { S3Service } from 'src/services/s3.service';

const readFileAsyc = promisify(readFile);

export async function compressImage(file: Express.Multer.File) {
    const [name,] = file.filename.split('.');
    const imageFile = await readFileAsyc(file.path);
    const imageSharpe = sharp(imageFile);

    await imageSharpe
        .metadata()
        .then(function (metadata) {
            return imageSharpe
                .composite([{
                    input: './logo.png',
                    blend: 'soft-light',
                    gravity: sharp.gravity.center,
                }])
                .resize(metadata.width > 1920 ? 1920 : 1920)
                .webp({ quality: 80 })
                .toFile(__dirname + `/../../storage/${name}.webp`);
        })
        .then(() => {
            file.path != `storage/${name}.webp` ? unlink(file.path, (err) => { }) : null
        })
        .catch();
    const firebase = new FirebaseService();
    const path = __dirname + `/../../storage/${name}.webp`;
    const fileByFirebase = await firebase.upload(path);
    { fileByFirebase?.file?.path && unlink(`storage/${name}.webp`, (err) => { }) }

    return fileByFirebase?.file?.path ? fileByFirebase.file.path : `storage/${name}.webp`;
}