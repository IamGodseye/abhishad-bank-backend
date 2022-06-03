import express from "express";
import { isAdmin, requireSignin } from "../middlewares/index";
import { totalUser, totalData, debit, credit } from "../controllers/admin";
const router = express.Router();

router.get('/admin/total-users', requireSignin, isAdmin, totalUser)
router.get('/admin/total-data', requireSignin, isAdmin, totalData)
router.post('/admin/credit', requireSignin, isAdmin, credit)
router.post('/admin/debit', requireSignin, isAdmin, debit)

module.exports = router;