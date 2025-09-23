import { getDatabase, ref, get, child } from "firebase/database";
const url = "http://localhost:4000/api"

export interface GroupMember {
  uid: string;
  name: string | null;
  email?: string | null;
}

export interface AddGroupBody {
  groupName: string;
  groupMembers: GroupMember[];
  groupType: string;
}
export interface Group {
    groupId: string
    groupName: string;
  groupMembers?: Record<string, { name: string; email?: string }>;
  groupType?: string;
}
export interface SplitInput {
  [uid: string]: number;
}


export interface AddExpenseBody {
  description: string;
  amount: number;
  paidUserId: string;
  splitType: "equally" | "exact" | "adjustment" | "shares" | "reimbursement" | "percentage";
  date: string;
  groupId: string;
  splitDetails?: SplitInput;
}

export const createGroup = async(groupData: AddGroupBody)=>{
    const response = await fetch(`${url}/add/newGroup`,{
        method: "POST",
        headers:{
            "Content-Type": "application/json"
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
    const response = await fetch(`${url}/add/groups/${groupId}`,{
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
  const res = await fetch(`${url}/add/groups`, { method: "GET", headers: { "Content-Type": "application/json" } });
  if (!res.ok) throw new Error("Failed to fetch groups");
  const data = await res.json();
  return data.groups ;
};