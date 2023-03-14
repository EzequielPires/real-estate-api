import { Property } from "src/modules/properties/entities/property.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['name'])
export class PropertyType {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;

    @Column()
    slug: string;

    @OneToMany(() => Property, property => property.type)
    properties: Property[];
}
