import { Status } from "src/enums/invoice.enum";
import { Property } from "src/modules/properties/entities/property.entity";
import { RentalContract } from "src/modules/rental-contracts/entities/rental-contract.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Invoice {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'simple-enum', enum: Status, default: Status.pendente })
    status: Status;

    @Column({ type: 'date', nullable: true })
    expiration: Date;
   
    @Column({ type: 'date', nullable: true })
    payment: Date;
    
    @Column({ type: 'date', nullable: true })
    reference: Date;

    @Column({type: 'decimal'})
    price: string;

    @Column({nullable: true})
    path: string;
    
    @Column({nullable: true})
    voucher: string;

    @ManyToOne(() => RentalContract, rentalContract => rentalContract.invoices, {onDelete: 'CASCADE'})
    rentalContract: RentalContract;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}