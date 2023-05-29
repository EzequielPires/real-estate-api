import * as fs from 'fs';
import * as path from 'path';
import slugify from 'slugify';
import { formatDate } from 'src/helpers/date';
import { maskPhone, maskPrice } from 'src/helpers/mask';
import { RentalContract } from 'src/modules/rental-contracts/entities/rental-contract.entity';
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
    signatureDate: string;
    guarantor?: string;
    shorts?: string;
}

export class Doc {
    async generateContract(rentalContract: RentalContract) {
        try {
            const template = fs.readFileSync(path.resolve(__dirname, '../../../modelo_contrato.docx'), 'binary');
            const { property, signatureDate, guarantorCpf, guarantorEmail, guarantorMaritalStatus, guarantorName, guarantorNationality, guarantorPhone, guarantorProfession, guarantorRg } = rentalContract;
            const date = new Date(signatureDate);
            date.setHours(date.getHours() + 4);
            const contract: ContractData = {
                name: rentalContract.tenant.name,
                nationality: rentalContract.nationality,
                maritalStatus: rentalContract.maritalStatus,
                address: rentalContract?.address?.city ? `${rentalContract.address.city.name} - ${rentalContract.address.state.shortName}` : 'Catalão - GO',
                cpf: rentalContract.cpf,
                duration: `${rentalContract.duration} meses`,
                endContract: formatDate(new Date(rentalContract.end)),
                paymentLimit: rentalContract.paymentLimit.toString(),
                phone: maskPhone(rentalContract.tenant.phone),
                price: maskPrice(rentalContract.price),
                shorts: maskPrice(rentalContract.shorts),
                profession: rentalContract.profession,
                propertyAddress: `${property.address.route}, ${property.address.number} - ${property.address.district.name}, ${property.address.city.name} - ${property.address.state.shortName}`,
                rg: rentalContract.rg,
                startContract: formatDate(new Date(rentalContract.end)),
                type: property.type.name,
                signatureDate: date.toLocaleDateString(),
                guarantor: `${guarantorName ?? 'XXXXXX'}, ${guarantorNationality ?? 'XXXXXX'}, ${guarantorMaritalStatus ?? 'XXXXXX'}, ${guarantorProfession ?? 'XXXXXX'}, RG nº ${guarantorCpf ?? 'XXXXXX'}, CPF ${guarantorRg ?? 'XXXXXX'}, Tel: ${guarantorPhone ?? 'XXXXXX'}`
            };


            const zip = new PizZip(template);
            const doc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
            });
            doc.render(contract);
            const buf = doc.getZip().generate({
                type: "nodebuffer",
                compression: "DEFLATE",
            });

            fs.writeFileSync(path.resolve(__dirname, `../../../storage/contracts/${slugify(rentalContract.id + '-' + contract.name + '-' + contract.startContract, { lower: true })}.docx`), buf);

            return `storage/contracts/${slugify(rentalContract.id + '-' + contract.name + '-' + contract.startContract, { lower: true })}.docx`;
        } catch (error) {
            console.log(error.message);
            return null
        }
    }
}