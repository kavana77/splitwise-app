"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.settlePayment = void 0;
const firebaseConfig_1 = __importDefault(require("../config/firebaseConfig"));
const settlePayment = async (req, res) => {
    const { groupId, amount, date, paidByUserId, receivedByUserId } = req.body;
    try {
        if (!amount || !date || !paidByUserId || !receivedByUserId) {
            return res.status(400).json({ message: "Invalid settlement Inputs" });
        }
        const groupSnap = await firebaseConfig_1.default
            .ref(`group/${groupId}/groupMembers`)
            .once("value");
        if (!groupSnap.exists()) {
            return res.status(404).json({ message: "Group not found" });
        }
        if (paidByUserId === receivedByUserId) {
            return res
                .status(400)
                .json({ message: "Cannot settle a payment with same member" });
        }
        const newSettleRef = await firebaseConfig_1.default.ref("settlements").push();
        const settleId = newSettleRef.key;
        const settlePaymentData = {
            settleId,
            groupId,
            amount,
            date,
            paidByUserId,
            receivedByUserId,
            createdAt: Date.now(),
        };
        await newSettleRef.set(settlePaymentData);
        await firebaseConfig_1.default.ref(`group/${groupId}/settlement/${settleId}`).set(true);
        res.status(200).json({
            message: "Settle Payment created successfully",
            settlement: settlePaymentData,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.settlePayment = settlePayment;
