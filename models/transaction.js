import mongoose from "mongoose";
const { Schema } = mongoose;
const { ObjectId } = Schema;

const txnSchema = new Schema(
    {
        doneBy: { type: ObjectId, ref: "User" },
        fromUser: { type: ObjectId, ref: "User" },
        toUser: { type: ObjectId, ref: "User" },
        amount: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ['Credit', 'Debit'],
        }
    },
    { timestamps: true }
);

export default mongoose.model("Transaction", txnSchema);