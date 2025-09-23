import { RequestHandler } from "express";
import db from "../config/firebaseConfig";

interface SettlePaymentBody{
    groupId: string
    amount: number
    date: string
    paidByUser: string
    receivedByUser: string
}
export const settlePayment: RequestHandler <SettlePaymentBody>= async (req, res) => {
  const {groupId,amount, date, paidByUser, receivedByUser } =
    req.body;
  try {
    if (!amount || !date || !paidByUser || !receivedByUser) {
      return res.status(400).json({ message: "Invalid Inputs" });
    }
    const groupSnap = await db.ref(`group/${groupId}/groupMembers`).once("value");
    if (!groupSnap.exists()) {
      return res.status(404).json({ message: "Group not found" });
    }
    if(paidByUser === receivedByUser){
        return res.status(400).json({message:"Cannot settle a payment with yourself"})
    }

    const newSettleRef = await db.ref("settlements").push();
    const settleId = newSettleRef.key;

    const settlePaymentData = {
      settleId,
      groupId,
      amount,
      date,
      paidByUser,
      receivedByUser,
      createdAt: Date.now(),
    };
    await newSettleRef.set(settlePaymentData);
    await db.ref(`group/${groupId}/settlement/${settleId}`).set(true)

    
    res
      .status(200)
      .json({
        message: "Settle Payment created successfully",
        settlement: settlePaymentData,
        
      });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
