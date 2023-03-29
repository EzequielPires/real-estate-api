import { Property } from "src/modules/properties/entities/property.entity";
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { City } from "./city.entity";
import { District } from "./district.entity";
import { State } from "./state.entity";

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

    @ManyToOne(() => State, state => state.addresses, {eager: true, nullable: false})
    state: State;

    @ManyToOne(() => City, city => city.addresses, {eager: true, nullable: false})
    city: City;

    @ManyToOne(() => District, district => district.addresses, {eager: true})
    district: District;

    @Column({ nullable: true })
    route: string;

    @Column({ nullable: true })
    complement: string;

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
