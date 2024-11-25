import { Document, model, Schema } from "mongoose"


export interface TagInterface extends Document {
    title: string,
}

const tagSchema = new Schema<TagInterface>({
    title: {type: String, required: true, unique: true}
})

export const TagModel = model<TagInterface>('Tag', tagSchema)


