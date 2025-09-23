import { RequestHandler } from "express";
import db from "../config/firebaseConfig";
interface SplitInput {
  [uid: string]: number;
}
interface AddExpenseBody {
  description: string;
  amount: number;
  paidUserId: string;
  splitType: "equally" | "exact" | "adjustment" | "shares" | "reimbursement" | 'percentage';
  date: string;
  groupId: string;
  splitDetails?: SplitInput;
}
export const addExpenses: RequestHandler<AddExpenseBody> = async (req, res) => {
  const {
    description,
    amount,
    paidUserId,
    splitType,
    date,
    groupId,
    splitDetails,
  } = req.body;
  try {
    if (
      !description ||
      !amount ||
      !paidUserId ||
      !splitType ||
      !date ||
      !groupId
    ) {
      return res.status(400).json({ message: "Invalid Inputs" });
    }
    if(amount <=0){
        return res.status(400).json({message:"Amount must be positive number"})
    }
    const groupSnap = await db
      .ref(`group/${groupId}/groupMembers`)
      .once("value");
    if (!groupSnap.exists()) {
      return res.status(404).json({ message: "Group not found" });
    }
    const members: Record<string, any> = groupSnap.val();
    const memberIds = Object.keys(members);
    if(!memberIds.includes(paidUserId)){
        return res.status(400).json({message:"Paid user is not a member of this group"})
    }
    if(splitDetails){
        const invalidSplitUsers = Object.keys(splitDetails).filter(uid =>!memberIds.includes(uid))
        if (invalidSplitUsers.length > 0) {
            return res.status(400).json({ message: `Split details contain users not in the group: ${invalidSplitUsers.join(', ')}` });
        }
    }
    let splits: Record<string, number> = {};

    if (splitType === "equally") {
      const perHead = amount / memberIds.length;
      memberIds.forEach((uid) => {
        splits[uid] = Number(perHead.toFixed(2));
      });
    } else if (splitType === "exact") {
      if (!splitDetails) {
        return res
          .status(400)
          .json({ message: "Exact split requires splitDetails" });
      }
      const total = (Object.values(splitDetails) as number[]).reduce((a, b) => a + b, 0);
      if (Math.abs(total - amount) > 0.01) {
        return res
          .status(400)
          .json({ message: "Exact split must add up to total amount" });
      }
      splits = splitDetails;
    }else if(splitType === 'percentage'){
        if (!splitDetails) {
        return res
          .status(400)
          .json({ message: "Percentage split requires splitDetails" });
      } 
      const totalPercentage =(Object.values(splitDetails) as number[]).reduce((a,b)=> a + b ,0)
      if(Math.abs(totalPercentage - 100) > 0.001){
        return res.status(400).json({message:"Percentage must add up to 100"})
      }
      memberIds.forEach((uid)=>{
        const userPercentage = splitDetails[uid] 
        splits[uid] = Number(((amount* userPercentage)/100).toFixed(2))
      })
    } else if (splitType === "shares") {
      if (!splitDetails) {
        return res
          .status(400)
          .json({ message: "Shares split requires splitDetails" });
      }
      const totalShares = (Object.values(splitDetails) as number[]).reduce(
        (a, b: any) => a + b,
        0
      );
      memberIds.forEach((uid) => {
        const userShares = splitDetails[uid] || 0;
        splits[uid] = Number(((amount * userShares) / totalShares).toFixed(2));
      });
    } else if (splitType === "adjustment") {
      if (!splitDetails) {
        return res
          .status(400)
          .json({ message: "Adjustment split requires splitDetails" });
      }
      const total = (Object.values(splitDetails) as number[]).reduce((a:number, b:number) => a + b, 0);
      if (Math.abs(total - amount) > 0.01) {
        return res
          .status(400)
          .json({ message: "Adjustment must add up to total amount" });
      }
      splits = splitDetails;
    } else if (splitType === "reimbursement") {
      if (!splitDetails) {
        return res
          .status(400)
          .json({ message: "Reimbursement requires splitDetails" });
      }
      const total = (Object.values(splitDetails) as number[]).reduce((a, b) => a + b, 0);
      if (Math.abs(total - amount) > 0.01) {
        return res
          .status(400)
          .json({ message: "Reimbursement must balance out to 0" });
      }
      splits = splitDetails;
    }else {
        return res.status(400).json({message: "Invalid split type"})
    }
    const newExpenseRef = await db.ref("expense").push();
    const expenseId = newExpenseRef.key;

    const expenseData = {
      expenseId,
      description,
      amount,
      paidUserId,
      splitType,
      date,
      groupId,
      splits,
      createdAt: Date.now(),
    };
    await newExpenseRef.set(expenseData);
    await db.ref(`group/${groupId}/expense/${expenseId}`).set(true);

    res
      .status(201)
      .json({
        message: "Expense created successfully",
        expense: expenseData,

      });
  } catch (error) {
    res.status(500).json({ message: "Internal Server error", error });
  }
};
