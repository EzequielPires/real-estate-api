import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Address } from "./address.entity";
import { City } from "./city.entity";

@Entity()
export class District {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    apiId: number;

    @Column()
    name: string;

    @ManyToOne(() => City, city => city.districts, {nullable: false, onDelete: 'CASCADE'})
    city: City;

    @OneToMany(() => Address, address => address.district)
    addresses: Address[];
}