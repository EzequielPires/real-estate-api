import * as fs from 'fs';
import * as path from 'path';
import slugify from 'slugify';
import { formatDate } from 'src/helpers/date';
import { maskPhone, maskPrice } from 'src/helpers/mask';
import { fullNumber } from 'src/helpers/numeroExtenso';
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
    pix: string;
    paymentLimit: string;
    signatureDate: string;
    guarantor?: string;
    shorts?: string;
}

const getValue = (value: string) => value && value != '' ? value : 'XXXXXX';

export class Doc {
    async generateContract(rentalContract: RentalContract) {
        try {
            const template = fs.readFileSync(path.resolve(__dirname, '../../../modelo_contrato.docx'), 'binary');
            const { property, signatureDate, guarantorCpf, guarantorEmail, guarantorMaritalStatus, guarantorName, guarantorNationality, guarantorPhone, guarantorProfession, guarantorRg } = rentalContract;
            const date = new Date(signatureDate);
            date.setHours(date.getHours() + 4);
            const contract: ContractData = {
                name: rentalContract.tenant.name,
                nationality: getValue(rentalContract.nationality),
                maritalStatus: getValue(rentalContract.maritalStatus),
                address: rentalContract?.address?.city ? `${rentalContract.address.city.name} - ${rentalContract.address.state.shortName}` : 'Catalão - GO',
                cpf: getValue(rentalContract.cpf),
                duration: `${fullNumber(rentalContract.duration)} meses`,
                endContract: formatDate(new Date(rentalContract.end)),
                paymentLimit: rentalContract.paymentLimit.toString(),
                phone: maskPhone(rentalContract.tenant.phone),
                price: `${maskPrice(rentalContract.price)} (${fullNumber(Number(rentalContract.price.substring(0, rentalContract.price.length - 2)))} reais)`,
                pix: rentalContract.pix ?? 'Celular: (64) 98168-0018',
                shorts: maskPrice(rentalContract.shorts),
                profession: getValue(rentalContract.profession),
                propertyAddress: `${property.address.route}, ${property.address.number} - ${property.address.district.name}, ${property.address.city.name} - ${property.address.state.shortName}`,
                rg: getValue(rentalContract.rg),
                startContract: formatDate(new Date(rentalContract.start)),
                type: property.type.name,
                signatureDate: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
                guarantor: `${getValue(guarantorName)}, ${getValue(guarantorNationality)}, ${getValue(guarantorMaritalStatus)}, ${getValue(guarantorProfession)}, RG nº ${getValue(guarantorCpf)}, CPF ${getValue(guarantorRg)}, Tel: ${getValue(guarantorPhone)}`
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