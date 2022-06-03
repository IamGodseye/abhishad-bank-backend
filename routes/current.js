import express from "express";
import { currentTransactions, transfer, currentUser } from "../controllers/current";
import { requireSignin } from "../middlewares/index";
const router = express.Router();

router.post('/transfer', requireSignin, transfer)
router.get('/current-transactions', requireSignin, currentTransactions)
router.get('/current-user', requireSignin, currentUser);
module.exports = router;