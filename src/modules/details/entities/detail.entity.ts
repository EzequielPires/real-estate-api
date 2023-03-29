import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { DetailType } from "src/enums/property.enum";
import { Property } from "src/modules/properties/entities/property.entity";

@Entity()
export class Detail {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    slug: string;

    @Column({type: 'simple-enum', enum: DetailType})
    type: DetailType;

    @ManyToMany(() => Property, property => property.details)
    properties: Property[];
}
