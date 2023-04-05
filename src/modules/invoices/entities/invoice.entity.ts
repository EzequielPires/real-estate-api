import { Property } from "src/modules/properties/entities/property.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Invoice {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Property, property => property.invoices, {eager: true, nullable: false})
    property: Property;
}