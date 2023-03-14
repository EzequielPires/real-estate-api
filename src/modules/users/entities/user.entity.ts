import { hashSync } from "bcrypt";
import { Role } from "src/enums/role.enum";
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['email'])
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    phone: string;

    @Column({nullable: true})
    avatar: string;

    @Column({type: "simple-enum", enum: Role, default: Role.customer})
    role: Role;

    @BeforeInsert()
    hasPassword() {
        this.password = hashSync(this.password, 10);
    }
}
