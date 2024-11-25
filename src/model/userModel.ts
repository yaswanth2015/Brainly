import {model, Schema, Document} from "mongoose";
import { z } from "zod";

export const zodUserSchema = z.object({
    emailId: z.string().email({ message: "Invalid Email ID" }),
    password: z.string()
})

export interface UserInterface extends Document {
    emailId: string,
    password: string
}
const userSchema = new Schema<UserInterface>({
    emailId: {type: String, required: true, unique: true},
    password: {type: String, required: true}
})


export const UserModel = model<UserInterface>('User', userSchema)

