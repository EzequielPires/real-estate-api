import * as fs from 'fs';
import * as path from 'path';
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");

export interface ContractData {
    name: string;
    nationality: string;
    maritalStatus: string;
    profession: string;
    rg: string;
    cpf: string;
    address: string;
    phone: string;
    type: string;
    propertyAddress: string;
    duration: string;
    startContract: string;
    endContract: string;
    price: string;
    paymentLimit: string;
}

export class Doc {
    async generateContract() {
        const template = fs.readFileSync(path.resolve(__dirname, '../../../modelo_contrato.docx'), 'binary');

        const contrato: ContractData = {
            name: 'João da Silva',
            nationality: 'Brasileiro',
            maritalStatus: 'Casado',
            address: 'Catalão - GO',
            cpf: '069.017.831-08',
            duration: '12 meses',
            endContract: '17/04/2024',
            paymentLimit: '20',
            phone: '(64) 99626-8117',
            price: '700,00',
            profession: 'Administração',
            propertyAddress: 'Rua José da Rosa Pena, 99 - Ipanema, Catalão - GO',
            rg: '6888806',
            startContract: '17/04/2023',
            type: 'Casa'
        };

        const zip = new PizZip(template);
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });
        doc.render(contrato);
        const buf = doc.getZip().generate({
            type: "nodebuffer",
            compression: "DEFLATE",
        });
        
        fs.writeFileSync(path.resolve(__dirname, "../../../output.docx"), buf);

        return true
    }
}