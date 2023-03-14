import { Address } from "src/modules/address/entities/address.entity";
import { PropertyType } from "src/modules/property-types/entities/property-type.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Property {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    adType: string;

    @Column({default: 0})
    numberRooms: number;

    @Column({default: 0})
    numberBathroom: number;
    
    @Column({default: 0})
    numberSuite: number;

    @Column({default: 0})
    numberGarage: number;

    @Column({type: 'text'})
    description: string;

    @Column()
    price: number;

    @Column()
    iptu: number;

    @Column()
    exemptIptu: boolean;

    @Column()
    usefulArea: number;
    
    @Column()
    totalArea: number;

    @Column({type: "simple-array"})
    images: Array<string>

    @ManyToOne(() => PropertyType, propertyType => propertyType.properties)
    type: PropertyType;

    @OneToOne(() => Address, address => address.property, {eager: true})
    @JoinColumn()
    address: Address;
}
