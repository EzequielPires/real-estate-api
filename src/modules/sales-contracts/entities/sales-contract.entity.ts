import { Property } from "src/modules/properties/entities/property.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class SalesContract {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'decimal'})
    price: string;

    @Column({nullable: true})
    paymentForm: string;

    @OneToOne(() => Property, property => property.salesContract, {eager: true, nullable: false})
    @JoinColumn()
    property: Property;

    @ManyToOne(() => User, user => user.salesContracts, {eager: true, nullable: false})
    owner: User;

    @ManyToOne(() => User, user => user.salesContractsBuyer, {eager: true, nullable: false})
    buyer: User;
    
    @ManyToOne(() => User, user => user.salesContractsSeller, {eager: true, nullable: false})
    seller: User;

    @Column({type: 'datetime'})
    date: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
