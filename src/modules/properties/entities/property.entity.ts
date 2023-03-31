import { AdType, Status } from "src/enums/property.enum";
import { Address } from "src/modules/address/entities/address.entity";
import { Detail } from "src/modules/details/entities/detail.entity";
import { PropertyType } from "src/modules/property-types/entities/property-type.entity";
import { RentalContract } from "src/modules/rental-contracts/entities/rental-contract.entity";
import { SalesContract } from "src/modules/sales-contracts/entities/sales-contract.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export interface IDetail {
    id: number;
    name: string;
    slug: string;
}

@Entity()
export class Property {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'simple-enum', enum: AdType, default: AdType.aluguel})
    adType: AdType;
    
    @Column({type: 'simple-enum', enum: Status, default: Status.disponivel})
    status: Status;

    @Column({default: false})
    emphasis: boolean

    @Column({default: 0})
    numberRooms: number;

    @Column({default: 0})
    numberBathroom: number;
    
    @Column({default: 0})
    numberSuite: number;

    @Column({default: 0})
    numberGarage: number;
    
    @Column()
    code: string;

    @Column({type: 'text'})
    description: string;

    @Column({type: 'decimal'})
    price: string;
    
    @Column({type: 'decimal'})
    condominium: string;

    @Column({type: 'decimal', nullable: true})
    iptu: string;

    @Column({default: false})
    exemptIptu: boolean;

    @Column()
    usefulArea: number;
    
    @Column()
    totalArea: number;

    @Column({type: "simple-array"})
    images: Array<string>

    @ManyToOne(() => PropertyType, propertyType => propertyType.properties, {eager: true, nullable: false})
    type: PropertyType;

    @OneToOne(() => Address, address => address.property, {eager: true})
    @JoinColumn()
    address: Address;

    @ManyToOne(() => User, user => user.capturedProperties)
    pickup: User;

    @ManyToOne(() => User, user => user.ownerProperties)
    owner: User;
    
    @ManyToOne(() => User, user => user.favoriteProperties)
    favorites: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToMany(() => Detail, detail => detail.properties, {cascade: true})
    @JoinTable()
    details: Detail[];

    @OneToOne(() => RentalContract, rentalContract => rentalContract.property)
    rentalContract: RentalContract;
    
    @OneToOne(() => SalesContract, salesContract => salesContract.property)
    salesContract: SalesContract;
}
