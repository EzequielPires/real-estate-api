import { Banner } from "src/modules/banners/entities/banner.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class BannerType {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;

    @Column({default: 300})
    width: number;

    @Column({default: 300})
    height: number;

    @OneToMany(() => Banner, banner => banner.bannerType)
    banners: Banner[];
}
