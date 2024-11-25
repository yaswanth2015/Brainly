import mongoose, { Types, Schema, Document, model } from "mongoose";
import { z } from "zod";
enum SupportedTypes {
    document = "document",
    tweet = "tweet",
    youtube = "youtube",
    link = "link"
}

export const zodContentSchema = z.object({
    type: z.enum([
        SupportedTypes.document,
        SupportedTypes.tweet,
        SupportedTypes.youtube,
        SupportedTypes.link
    ]),
    link: z.string().url({message: "invalid URL"}).optional(),
    title: z.string().optional(),
    tags: z.array(z.string())
})

export const zodDeleteContentSchema = z.object({
    contentId: z.string({ message: "Please send ContentID to delte" })
})

export interface ContentInterface extends Document {
    contentType: string
    link: string,
    title: string,
    userIdRef: Schema.Types.ObjectId,
    tags: Schema.Types.ObjectId[],
}

const contentSchema = new Schema<ContentInterface>({
    contentType: { type: String, required: true },
    link: { type: String, required: true },
    title: { type: String },
    tags: [{type: Schema.Types.ObjectId, ref: 'Tag'}],
    userIdRef: { type: Schema.Types.ObjectId, ref: 'User', required: true}
})

export const ContentModel = model<ContentInterface>('content', contentSchema)

