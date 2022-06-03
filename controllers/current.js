import User from "../models/user";
import Transaction from "../models/transaction";
import { transactionHelper } from "../utils";


export const transfer = async (req, res) => {
    try {
        const userId = req.user._id

        const { receive, amount } = req.body
        const send = await User.findById(userId)
        const txn = await transactionHelper(send.accountNumber, receive, amount, userId)
        console.log(txn)
        return res.json({ ok: true, transaction: txn, message: `Successfully Transfered ${amount} from ${send.accountNumber} to ${receive}` })
    }
    catch (error) {
        console.log(error);
        return res.json({ ok: false, message: error.message || 'Error...Try again....' })
    }
}

export const currentTransactions = async (req, res) => {
    try {
        const userId = req.user._id
        const Transaction = await User.findById(userId).populate({
            path: 'transaction',
            populate: {
                path: 'fromUser',

            }
        })
            .populate({
                path: 'transaction',
                populate: {
                    path: 'toUser',
                }
            })
            .populate({
                path: 'transaction',
                populate: {
                    path: 'doneBy',
                }
            })

            .select('transaction')

        console.log(Transaction)
        return res.json({ ok: true, transactions: Transaction.transaction })

    }
    catch (error) {
        console.log(error);
        return res.json({ ok: false, message: error.message || 'Error...Try again....' })
    }
}

export const currentUser = async (req, res) => {
    try {
        const userId = req.user._id
        const user = await User.findById(userId)

        return res.json({ ok: true, user })
    }
    catch (error) {
        console.log(error);
        return res.json({ ok: false, message: error.message || 'Error...Try again....' })
    }
}