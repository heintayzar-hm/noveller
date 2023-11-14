import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
import { IsEmail } from "class-validator"; // Import the class-validator library
import { Exclude } from "class-transformer";


// username
// email
// password


@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    username: string;

    @Column()

    @IsEmail() // Use the @IsEmail() decorator to ensure the email is valid
    email: string;

    @Column({ nullable: true })
    @Exclude() // Use the @Exclude() decorator to exclude the password from responses
    password: string;

    @Column({ nullable: true })
    photo: string;

    @Column({ nullable: true })
    isVerified: boolean;

  @Column({ nullable: true })
  code: number;

    constructor(partial: Partial<User>) {
        Object.assign(this, partial);
      }

}


