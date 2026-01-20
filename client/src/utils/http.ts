import { auth } from "@/firebaseConfig";
import { getDatabase, ref, get, child } from "firebase/database";
const url = "https://splitwise-app-1.onrender.com/api"
import type {GroupMember, AddGroupBody, Group, AddSettlementBody,AddExpenseBody , GroupBalanceResponse } from "@/types/type";

export const createGroup = async(groupData: AddGroupBody)=>{
  const token = await auth.currentUser?.getIdToken();
    const response = await fetch(`${url}/add/newGroup`,{
        method: "POST",
        headers:{
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(groupData)
    })
    if(!response.ok){
        throw new Error("Failed to save group data")
    }
    return response.json()

}

export const fetchUsers = async (): Promise<GroupMember[]> => {
  const db = getDatabase();
  const response = await get(child(ref(db), "users"));

  if (!response.exists()) {
    return [];
  }
  const data = response.val() as Record<string, { name: string | null; email?: string | null }>;

  return Object.entries(data).map(([uid, userObject]) => ({
    uid,
    name: userObject.name,
    email: userObject.email,
  }));
};



export const addExpenses = async (expenseData: AddExpenseBody)=>{
    const response = await fetch(`${url}/add/expenses`,{
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(expenseData)
    })
    if(!response.ok){
        throw new Error("Failed to add expense")
    }
    return response.json()
}

export const fetchGroupById = async(groupId: string)=>{
    const response = await fetch(`${url}/add/group/${groupId}`,{
        method: "GET",
        headers:{
            "Content-Type": "application/json"
        }
        
    })
    if(!response.ok){
        throw new Error("Failed to get the group data by id")
    }
    return response.json()
}
export const fetchGroups = async (): Promise<Group[]> => {
    const user = auth.currentUser
  if (!user) throw new Error("Not logged in");
  const res = await fetch(`${url}/add/groups?uid=${user.uid}`, { method: "GET", headers: { "Content-Type": "application/json" } });
  if (!res.ok) throw new Error("Failed to fetch groups");
  const data = await res.json();
  return data.groups ;
};
export const addSettlement = async(settlementData: AddSettlementBody)=>{
  const response = await fetch(`${url}/add/settlement`,{
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(settlementData)
  })
  if(!response.ok){
    throw new Error("Failed to add the settlement")
  }
  return response.json()
}

export const getGroupBalance = async(groupId: string): Promise<GroupBalanceResponse>=>{
  const response = await fetch(`${url}/check/group/balance/${groupId}`,{
    method: "GET",
     headers:{
            "Content-Type": "application/json"
        }
  })
  if(!response.ok){
    throw new Error("Failed to get the Group Balance")
  }
  return response.json() as Promise<GroupBalanceResponse>
}

export const addGroupMember = async(groupId:string, groupMembers: GroupMember[])=>{
  const response = await fetch(`${url}/add/groups/${groupId}/members`,{
    method:"POST",
    headers:{
        "Content-Type": "application/json"
    },
        body: JSON.stringify({ groupMembers: groupMembers }),

  })
    if(!response.ok){
    throw new Error("Failed to get the Group Balance")
  }
  return response.json()
}

export const getExpenseList = async(groupId: string)=>{
  const response = await fetch(`${url}/add/getExpense/${groupId}`,{
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
    if(!response.ok){
    throw new Error("Failed to get the Group Balance")
  }
  return response.json()
}

export const deleteExpense = async(groupId: string, expenseId: string)=>{
  const response = await fetch(`${url}/add/expense/${groupId}/${expenseId}`,{
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json"
    }
  })
      if(!response.ok){
    throw new Error("Failed to get the Group Balance")
  }
  return response.json()
}

export const checkMultipleCurrencies = async(groupId: string)=>{
  const response = await fetch(`${url}/add/check-currency/${groupId}`,{
    method: 'GET',
    headers:{
      "Content-Type": "application/json"
    }
  })
      if(!response.ok){
    throw new Error("Failed to get the Group Balance")
  }
  return response.json()
}

export const convertGroupExpenses = async(groupId: string)=>{
  const response = await fetch(`${url}/check/group/${groupId}/convert`,{
    method: 'POST',
    headers:{
      "Content-Type": "application/json"
    }
  })
  if(!response.ok){
    throw new Error("Failed pass the expense")
  }
  return response.json()
}