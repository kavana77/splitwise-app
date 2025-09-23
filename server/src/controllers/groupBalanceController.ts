import { RequestHandler } from "express";
import db from "../config/firebaseConfig";

export const getGroupBalance:RequestHandler=async(req , res)=>{
    const {groupName}=req.params
    try {
        const groupSnap = await db.ref(`group/${groupName}/groupMembers`).once("value")
        if(!groupSnap.exists()){
            return res.status(400).json({message:"Group not found"})
        }
        const members = groupSnap.val()
        const memberIds = Object.keys(members)
        const balances: Record<string, number> = {};
        memberIds.forEach(uid => balances[uid] = 0);
        const expenseSnap = await db.ref(`group/${groupName}/expense`).once("value")
        if(!expenseSnap.exists()){
            return res.status(400).json({message:"expense from group not found"})
        }
        const expenses = expenseSnap.val()
        const expenseIds = Object.keys(expenses)
        for(let i=0; i<expenseIds.length; i++){
            const expenseId = expenseIds[i]
            const expenseSnap= await db.ref(`expense/${expenseId}`).once("value")
            const expense = expenseSnap.val()
            if(!expense) continue
            const paidUserId = expense.paidUserId
            const splits = expense.splits
            const amount = expense.amount

            const splitUids = Object.keys(splits)
            for(let j=0; j< splitUids.length; j++){
                const uid = splitUids[j]
                balances[uid]-= splits[uid]
            }
            balances[paidUserId]+= amount
        }

        const settlementSnap = await db.ref(`group/${groupName}/settlement`).once("value")
        if(!settlementSnap.exists()){
            return res.status(400).json({message:"Settlement not found"})
        }
        const settlements = settlementSnap.val()
        const settlementIds = Object.keys(settlements)
        for(let i=0; i<settlementIds.length; i++){
            const settleId = settlementIds[i]
            const settleSnap = await db.ref(`settlements/${settleId}`).once("value")
            const settle = settleSnap.val()
            const paidByUser = settle.paidByUser
            const receivedByUser = settle.receivedByUser
            const amount = settle.amount

            balances[paidByUser] += amount
            balances[receivedByUser] -= amount
        }
        res.status(200).json({groupName,balances})
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Internal server error",error})
    }
}