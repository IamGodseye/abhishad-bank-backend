import mongoose from "mongoose";
const { Schema } = mongoose;
const { ObjectId } = Schema;

const userSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            min: 6,
            max: 64,
        },
        role: {
            type: [String],
            default: ["User"],
            enum: ["User", "Admin"],
        },
        accountNumber: {
            type: String,
            required: true,
            unique: true
        },
        balance: {
            type: String,
            default: '0'
        },
        transaction: [{
            type: ObjectId, ref: "Transaction"
        }]
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);