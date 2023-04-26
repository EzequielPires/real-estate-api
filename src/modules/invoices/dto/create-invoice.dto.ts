import { Status } from "src/enums/invoice.enum";
import { Property } from "src/modules/properties/entities/property.entity";
import { RentalContract } from "src/modules/rental-contracts/entities/rental-contract.entity";

export class CreateInvoiceDto {
    id?: string;
    status?: Status;
    expiration?: Date;
    payment?: Date;
    reference?: Date;
    price?: string;
    path?: string;
    voucher?: string;
    rentalContract?: RentalContract;
    property?: Property;
}
