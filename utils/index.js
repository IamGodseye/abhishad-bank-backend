import bcrypt from "bcryptjs";
import User from "../models/user";
import Transaction from "../models/transaction";

export const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(12, (err, salt) => {
            if (err) {
                reject(err);
            }
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    reject(err);
                }
                resolve(hash);
            });
        });
    });
};

export const comparePassword = (password, hashedpassword) => {
    return bcrypt.compare(password, hashedpassword);
};

export const getRandomNumber = (digit) => {
    return Math.random().toFixed(digit).split('.')[1];
}

export const transactionHelper = async (send, receive, amount, done) => {

    const receiver = await User.findOne({ accountNumber: receive })
    const sender = await User.findOne({ accountNumber: send })
    const doneBy = await User.findById(done)

    console.log(receiver, sender, doneBy)
    if (sender._id === receiver._id) throw Error("You can not transfer money to yourself")

    // processing transaction
    const amountBal = BigInt(amount)
    if (amountBal <= 0n) throw Error('Amount is negative or Zero')
    let senderBal = BigInt(sender.balance)
    let receiverBal = BigInt(receiver.balance)

    // if balance is zero or not enough
    if (senderBal < amountBal) throw Error('Not enough balance')
    if (senderBal === 0n) {
        throw Error('Balance is zero')
    }

    const txn = new Transaction({ doneBy: doneBy._id, fromUser: sender._id, toUser: receiver._id, amount })
    await txn.save()
    console.log(txn)

    senderBal -= amountBal;
    receiverBal += amountBal;

    if (sender._id != doneBy._id) {
        await User.findByIdAndUpdate(doneBy._id, {
            $addToSet: { transaction: txn._id }
        })
    }
    await User.findByIdAndUpdate(sender._id, {
        balance: senderBal.toString(),
        $addToSet: { transaction: txn._id }
    })

    await User.findByIdAndUpdate(receiver._id, {
        balance: receiverBal.toString(),
        $addToSet: { transaction: txn._id }
    })

    return txn;
}