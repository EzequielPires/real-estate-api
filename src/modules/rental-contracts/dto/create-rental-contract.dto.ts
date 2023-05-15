import { MaritalStatus } from "src/enums/rental.enum";
import { Address } from "src/modules/address/entities/address.entity";
import { Property } from "src/modules/properties/entities/property.entity";
import { User } from "src/modules/users/entities/user.entity";

export class CreateRentalContractDto {
    id: number;
    price: string;
    start: Date;
    shorts: string;
    signatureDate?: Date;
    end: Date;
    fineDelay: number;
    earlyTerminationFine: number;
    property: Property;
    owner: User;
    locator: User;
    tenant: User;

    cpf: string;
    rg: string;
    profession: string;
    nationality: string;
    duration: number;
    paymentLimit: number;
    maritalStatus: MaritalStatus;
    address: Address;

    guarantorName: string;
    guarantorEmail: string;
    guarantorCpf: string;
    guarantorRg: string;
    guarantorProfession: string;
    guarantorNationality: string;
    guarantorPhone: string;
    guarantorMaritalStatus: MaritalStatus;
}
