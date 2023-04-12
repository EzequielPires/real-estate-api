import { BannerType } from "src/modules/banner-types/entities/banner-type.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Banner {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;

    @Column({nullable: true})
    path: string; 
    
    @Column({nullable: true})
    link: string; 

    @Column({default: true})
    active: boolean;

    @ManyToOne(() => BannerType, bannerType => bannerType.banners, {eager: true, nullable: false})
    bannerType: Banner;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updateAt: Date;
}
