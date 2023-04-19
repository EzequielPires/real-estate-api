import { MaritalStatus } from "src/enums/rental.enum";
import { Address } from "src/modules/address/entities/address.entity";
import { Invoice } from "src/modules/invoices/entities/invoice.entity";
import { Property } from "src/modules/properties/entities/property.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class RentalContract {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'decimal'})
    price: string;

    @Column({type: 'datetime'})
    start: Date;

    @Column({type: 'datetime'})
    end: Date;

    @Column({type: 'decimal', nullable: true})
    fineDelay: number;
    
    @Column({type: 'decimal', nullable: true})
    earlyTerminationFine: number;

    @OneToOne(() => Property, property => property.rentalContract, {eager: true, nullable: false})
    @JoinColumn()
    property: Property;

    @ManyToOne(() => User, user => user.rentalContracts, {eager: true, nullable: false})
    owner: User;
    
    @ManyToOne(() => User, user => user.rentalContractsLocator, {eager: true, nullable: false})
    locator: User;

    @ManyToOne(() => User, user => user.rentalContractsTenant, {eager: true, nullable: false})
    tenant: User;

    @OneToMany(() => Invoice, invoice => invoice.rentalContract)
    invoices: Invoice[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    //tenant additional data
    @Column()
    cpf: string;

    @Column()
    rg: string;
    
    @Column()
    profession: string;
    
    @Column()
    nationality: string;
    
    @Column()
    duration: number;
    
    @Column()
    paymentLimit: number;
    
    @Column({nullable: true})
    document: string;
    
    @Column({type: "simple-array", nullable: true})
    images: Array<string>;
    
    @Column({type: 'simple-enum', enum: MaritalStatus, default: MaritalStatus.solteiro})
    maritalStatus: MaritalStatus;

    @OneToOne(() => Address, address => address.rentalContract, {eager: true})
    @JoinColumn()
    address: Address;
}
