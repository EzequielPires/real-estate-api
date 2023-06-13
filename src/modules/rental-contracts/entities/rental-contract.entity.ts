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

    @Column({nullable: true})
    pix: string;
    
    @Column({type: 'decimal', nullable: true})
    shorts: string;

    @Column({type: 'datetime'})
    signatureDate: Date;
    
    @Column({type: 'datetime'})
    start: Date;

    @Column({type: 'datetime'})
    end: Date;

    @Column({type: 'decimal', nullable: true})
    fineDelay: number;
    
    @Column({type: 'decimal', nullable: true})
    earlyTerminationFine: number;

    @OneToOne(() => Property, property => property.rentalContract, {eager: true, nullable: false, onDelete: 'CASCADE'})
    @JoinColumn()
    property: Property;

    @ManyToOne(() => User, user => user.rentalContracts, {eager: true, nullable: true, onDelete: 'SET NULL'})
    owner: User;
    
    @ManyToOne(() => User, user => user.rentalContractsLocator, {eager: true, nullable: true, onDelete: 'SET NULL'})
    locator: User;

    @ManyToOne(() => User, user => user.rentalContractsTenant, {eager: true, nullable: false, onDelete: 'CASCADE'})
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
    

    //tenant additional data
    @Column({nullable: true})
    guarantorName: string;

    @Column({nullable: true})
    guarantorEmail: string;

    @Column({nullable: true})
    guarantorCpf: string;

    @Column({nullable: true})
    guarantorRg: string;

    @Column({nullable: true})
    guarantorProfession: string;
    
    @Column({nullable: true})
    guarantorNationality: string;

    @Column({nullable: true})
    guarantorPhone: string;

    @Column({type: 'simple-enum', enum: MaritalStatus, nullable: true})
    guarantorMaritalStatus: MaritalStatus;
}
