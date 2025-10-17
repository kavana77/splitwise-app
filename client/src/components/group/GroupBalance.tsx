import { useQuery } from "@tanstack/react-query";
import Text from "../ui/text";
import { useParams } from "react-router-dom";
import { getGroupBalance } from "../../utils/http";
import type { GroupBalanceResponse } from "@/types/type";
import { useGroupData } from "../../hooks/useGroupData";
import { FaBalanceScale } from "react-icons/fa";

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

  const { data: balanceData, isError } = useQuery<GroupBalanceResponse>({
    queryKey: ["groupBalance", groupId],
    queryFn: () => getGroupBalance(groupId!),
    enabled: !!groupId,
  });
      const getInitials = (name: string | null)=>{
        if(!name) return ""
        const parts = name.trim().split(" ")
        const initials = parts.map(part => part.charAt(0).toUpperCase()).join("")
        return initials
    }

  if (isError) return <p>Failed to load group balance</p>;
  if (!balanceData || !group) return null;

  const balances = balanceData[groupId!];

  return (
    <div className="bg-background text-foreground">
      <Text className="text-xl font-bold mb-6 flex items-center gap-2 ">
        GROUP BALANCE  <FaBalanceScale className="text-emerald-600"/> 
      </Text>
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
                <span className="text-green-600"> Gets back {amount}</span>
              ) : amount < 0 ? (
                <span className="text-red-600"> Owes {Math.abs(amount)}</span>
              ) : (
                <span className="text-gray-500"> Settled up</span>
              )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default GroupBalance;
