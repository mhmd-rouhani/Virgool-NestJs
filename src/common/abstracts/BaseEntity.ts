import { PrimaryGeneratedColumn } from "typeorm";

export class BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number

    // @CreateDateColumn()
    // createdAt: Date
}