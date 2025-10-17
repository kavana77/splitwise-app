// AddExpenseForm
export type ItemRow = {
  id: string;
  description: string;
  amount: number;
  included: Record<string, boolean>; 
};

export interface Member {
  uid: string;
  name: string | null;
}


export interface ExpenseLists {
  expenseId: string;
  description: string;
  paidAmount: number;
  shouldGetBack: number;
  paidUserName: string;
}

export interface GroupMember {
  uid: string;
  name: string | null;
  email?: string | null;
}
export interface AddGroupBody {
  groupName: string;
  groupMembers: GroupMember[];
  groupType: string;
  createdBy: string
}
export interface Group {
    groupId: string
    groupName: string;
  groupMembers?: Record<string, { name: string; email?: string }>;
  groupType?: string;
  createdBy: string,
}
interface SplitInput {
  [uid: string]: number;
}

interface PaidInput {
  [uid: string]: number;
}

interface Items {
  description: string;
  amount: number;
}

export interface AddExpenseBody {
  description: string;
  amount: number;
  paidUsersId: PaidInput;
  splitType:
    | "equally"
    | "exact"
    | "adjustment"
    | "shares"
    | "reimbursement"
    | "percentage"
    | "itemized";
  date: string;
  groupId: string;
  items?: Items[]; 
  gst?: number; 
  tip?: number; 
  splitDetails?: SplitInput; 
}

 export interface AddSettlementBody {
  groupId: string
  amount: number
  date: string
  paidByUserId: string
  receivedByUserId: string
 }
export interface GroupBalanceResponse {
  [groupId: string]: Record<string, Record<string, number>>;
}