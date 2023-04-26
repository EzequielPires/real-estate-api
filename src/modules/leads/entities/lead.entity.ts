import { LeadType } from "src/enums/property.enum";
import { Property } from "src/modules/properties/entities/property.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Lead {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'simple-enum', enum: LeadType, default: LeadType.interesse})
    type: LeadType;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    email: string;

    @Column({ nullable: false })
    phone: string;

    @Column({ type: "text", nullable: true })
    message: string;

    @ManyToOne(() => User, user => user.leads, { eager: true, onDelete: 'SET NULL'})
    realtor: User;

    @ManyToOne(() => Property, property => property.leads, { eager: true, onDelete: 'CASCADE' })
    property: Property;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updateAt: Date;

    //financing
    @Column({nullable: true})
    nance: Date;

    @Column({nullable: true})
    document: string;

    @Column({ type: 'decimal', nullable: true })
    monthlyIncome: string;

    @Column({ default: false, nullable: true })
    married: boolean;

    @Column({ type: 'decimal', nullable: true })
    propertyPrice: string;
    
    @Column({ type: 'decimal', nullable: true })
    prohibited: string;

    @Column({nullable: true})
    financingTime: string;

    //visit
    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true})
    time: Date;
    
    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true})
    date: Date;
}
