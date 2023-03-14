import { Property } from "src/modules/properties/entities/property.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

type Location = {
    lat: number;
    lng: number;
}

@Entity()
export class Address {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    nation: string;

    @Column({ nullable: true })
    state: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    district: string;

    @Column({ nullable: true })
    route: string;

    @Column({ nullable: true })
    number: number;

    @Column({ nullable: true })
    zipcode: string;

    @Column({ nullable: true })
    place_id: string;

    @Column({ nullable: true })
    formatted_address: string;

    @Column({ type: 'simple-json', nullable: true })
    location: Location;

    @OneToOne(() => Property, property => property.address, {onDelete: 'CASCADE'})
    property: Property;
}
