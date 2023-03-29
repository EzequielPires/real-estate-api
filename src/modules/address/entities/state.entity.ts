import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Address } from "./address.entity";
import { City } from "./city.entity";

@Entity()
@Unique(['shortName'])
export class State {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    shortName: string;

    @Column({ nullable: true })
    region: string;

    @OneToMany(() => City, city => city.state)
    cities: City[];

    @OneToMany(() => Address, address => address.state)
    addresses: Address[];
}