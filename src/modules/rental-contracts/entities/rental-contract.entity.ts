import { Property } from "src/modules/properties/entities/property.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
