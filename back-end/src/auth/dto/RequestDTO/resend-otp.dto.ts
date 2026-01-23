import { IsEmail, IsNotEmpty } from "class-validator";

export class Resendotp{
    @IsEmail()
    @IsNotEmpty()
    email:string
}