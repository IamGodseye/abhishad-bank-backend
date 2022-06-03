import User from "../models/user";
import Transaction from "../models/transaction";
import { transactionHelper } from "../utils";

export const totalUser = async (req, res) => {
    try {
        const users = await User.find({})
        console.log(users)
        return res.json({ ok: true, users })
    }
    catch (error) {
        console.log(error);
        return res.json({ ok: false, message: error.message || 'Error...Try again....' })
    }
}

export const totalData = async (req, res) => {
    try {
        const totalUsers = await User.count({})
        const totalTransactions = await Transaction.count({})
        const txns = await Transaction.find({})

        let totalTransactionAmount = 0n;
        txns.map((t) => {
            const currAmnt = BigInt(t.amount)
            totalTransactionAmount += currAmnt
        })

        // console.log(totalUsers.toString(), totalTransactions.toString(), totalTransactionAmount.toString())

        return res.json({ ok: true, totalUsers: totalUsers.toString(), totalTransaction: totalTransactions.toString(), totalTransactionAmount: totalTransactionAmount.toString() })
    }
    catch (error) {
        console.log(error);
        return res.json({ ok: false, message: error.message || 'Error...Try again....' })
    }
}

export const credit = async (req, res) => {
    try {
        const userId = req.user._id
        const { send, receive, amount } = req.body
        const txn = await transactionHelper(send, receive, amount, userId)
        return res.json({ ok: true, transaction: txn, message: `Successfully Transfered ${amount} from ${send} to ${receive}` })
    }
    catch (error) {
        console.log(error);
        return res.json({ ok: false, message: error.message || 'Error...Try again....' })
    }
}

export const debit = async (req, res) => {
    try {
        const userId = req.user._id
        const { send, receive, amount } = req.body
        const txn = await transactionHelper(receive, send, amount, userId)
        return res.json({
            ok: true, transaction: txn, message: `Successfully Transfered ${amount} from ${receive} to ${send}`
        })
    }
    catch (error) {
        console.log(error);
        return res.json({ ok: false, message: error.message || 'Error...Try again....' })
    }
}