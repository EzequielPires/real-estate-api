import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";


@Entity()
export class Token {
    @PrimaryColumn('uuid')
    refresh_token: string;

    @ManyToOne(() => User, user => user.tokens, {onDelete: 'CASCADE'})
    user: User;

    @Column()
    expires_date: Date;
}
