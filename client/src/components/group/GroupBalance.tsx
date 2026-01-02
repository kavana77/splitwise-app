import {  useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Text from "../ui/text";
import { useParams } from "react-router-dom";
import { convertGroupExpenses,getExpenseList,getGroupBalance } from "../../utils/http";
import type { GroupBalanceResponse } from "@/types/type";
import { useGroupData } from "../../hooks/useGroupData";
import { FaBalanceScale } from "react-icons/fa";
import { toast } from "sonner";
import { useEffect, useState } from "react";
export interface ConvertedExpense {
  id: string;
  oldCurrency: string;
  oldAmount: number;
  newCurrency: string;
  newAmount: number;
}

const colors = [
  "bg-emerald-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-orange-500",
  "bg-teal-500",
  "bg-red-500",
  "bg-yellow-500",
]

const GroupBalance = () => {
  const { groupId } = useParams();
  const { group } = useGroupData();
  const queryClient = useQueryClient()
const [convertedExpenses, setConvertedExpenses] = useState<ConvertedExpense[]>([]);

  const { data: balanceData, isError } = useQuery<GroupBalanceResponse>({
    queryKey: ["groupBalance", groupId],
    queryFn: () => getGroupBalance(groupId!),
    enabled: !!groupId,
  });
    const { data: expenseData } = useQuery({
      queryKey: ["expense", groupId],
      queryFn: () => getExpenseList(groupId!),
      enabled: !!groupId,
    });
  const convertMutation = useMutation({
    mutationFn: ()=> convertGroupExpenses(groupId!),
    onSuccess: (data)=>{
       setConvertedExpenses(data.convertedExpenses || []);
      toast.success("All expenses converted to USD!")
      queryClient.invalidateQueries({queryKey: ["groupBalance", groupId]})
      queryClient.invalidateQueries({queryKey: ["expense", groupId]})
      queryClient.invalidateQueries({queryKey: ["group", groupId]})
    }
  })
useEffect(() => {
  setConvertedExpenses([]);
}, [groupId]);

      const getInitials = (name: string | null)=>{
        if(!name) return ""
        const parts = name.trim().split(" ")
        const initials = parts.map(part => part.charAt(0).toUpperCase()).join("")
        return initials
    }

  if (isError) return <p>Failed to load group balance</p>;
  if (!balanceData || !group) return null;

const multipleCurrencies = group?.hasMultipleCurrencies;
const currencies = group?.currencies || [];

  const balances = balanceData.balances;
  const currencySymbol = expenseData?.expenseList?.[0]?.currencySymbol || "";

  return (
    <div className="bg-background text-foreground">
      <Text className="text-xl font-bold mb-6 flex items-center gap-2 ">
        GROUP BALANCE  <FaBalanceScale className="text-emerald-600"/> 
      </Text>
            {convertedExpenses.length > 0 && (
        <div className="mb-4 border p-3 rounded-md bg-green-50 text-sm">
          <h3 className="font-semibold mb-2 text-green-700">Converted Expenses:</h3>
          <ul className="space-y-1">
            {convertedExpenses.map((item) => (
              <li key={item.id}>
                {item.oldCurrency} {item.oldAmount} → {item.newCurrency}{" "}
                {item.newAmount}
              </li>
            ))}
          </ul>
        </div>
      )}
      <ul className="space-y-2 ">
        {Object.entries(balances).map(([uid, memberBalance], index) => {
          const memberName = Object.keys(memberBalance)[0];
          const amount = memberBalance[memberName];
          const initials = getInitials(memberName)
          const colorClass = colors[index % colors.length]
          return (
            <li
              key={uid}
              className="flex justify-between items-center p-2  rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 "
            >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-semibold ${colorClass}`}>{initials}</div>
              <span className="font-medium ">{memberName}</span>
            </div>
            <div className="text-sm font-semibold ">
              {amount > 0 ? (
                <span className="text-green-600"> Gets back {currencySymbol}{amount}</span>
              ) : amount < 0 ? (
                <span className="text-red-600"> Owes  {currencySymbol}{Math.abs(amount)}</span>
              ) : (
                <span className="text-gray-500"> Settled up</span>
              )}
              </div>
            </li>
          );
        })}
      </ul>
      {multipleCurrencies && (
        <div className="mt-6 p-4 w-52 border border-yellow-400 bg-yellow-50 rounded-lg">
           <p>This group has balances in multiple currencies {currencies.join(" + ")}</p>
           <button 
           onClick={()=> convertMutation.mutate()}
           disabled={convertMutation.isPending}
           className="bg-yellow-700 px-2 py-2 w-35 text-md text-center font-bold text-white border border-yellow-950 rounded-lg"> 
           {convertMutation.isPending ? "Converting..." : "Convert all expenses to USD"}</button>
        <p></p>
    
        </div>
      )}
    </div>
  );
};

export default GroupBalance;
