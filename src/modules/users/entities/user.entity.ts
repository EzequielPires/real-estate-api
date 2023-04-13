import { hashSync } from "bcrypt";
import { Role } from "src/enums/role.enum";
import { Lead } from "src/modules/leads/entities/lead.entity";
import { Property } from "src/modules/properties/entities/property.entity";
import { RentalContract } from "src/modules/rental-contracts/entities/rental-contract.entity";
import { SalesContract } from "src/modules/sales-contracts/entities/sales-contract.entity";
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['email'])
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    phone: string;
    
    @Column({nullable: true})
    document: string;

    @Column({nullable: true})
    avatar: string;

    @Column({type: "simple-enum", enum: Role, default: Role.customer})
    role: Role;

    @OneToMany(() => Property, property => property.pickup)
    capturedProperties: Property[];

    @OneToMany(() => Property, property => property.owner)
    ownerProperties: Property[];
   
    @OneToMany(() => Property, property => property.favorites)
    favoriteProperties: Property[];

    //Start Contracts

    @OneToMany(() => RentalContract, rentalContract => rentalContract.owner)
    rentalContracts: RentalContract[]; 
    
    @OneToMany(() => RentalContract, rentalContract => rentalContract.locator)
    rentalContractsLocator: RentalContract[]; 
    
    @OneToMany(() => RentalContract, rentalContract => rentalContract.tenant)
    rentalContractsTenant: RentalContract[]; 
    
    @OneToMany(() => SalesContract, salesContract => salesContract.owner)
    salesContracts: SalesContract[]; 
    
    @OneToMany(() => SalesContract, salesContract => salesContract.buyer)
    salesContractsBuyer: SalesContract[]; 
    
    @OneToMany(() => SalesContract, salesContract => salesContract.seller)
    salesContractsSeller: SalesContract[]; 

    @OneToMany(() => Lead, lead => lead.realtor)
    leads: Lead[];

    //End Contracts

    @BeforeInsert()
    hasPassword() {
        this.password = hashSync(this.password, 10);
    }
}
