import NavbarUser from "../components/navbar/NavbarUser";
import Text from "../components/ui/text";
import { useState } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import AddSettlement from "../components/AddSettlement";
import AddExpenseForm from "../components/expense/addExpense/AddExpenseForm";
import SelectDialog from "../components/SelectDialog";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { auth } from "@/firebaseConfig";
import { useGroupData } from "../hooks/useGroupData";
import { fetchGroups } from "../utils/http";
import type { Group } from "@/types/type";
import GroupBalance from "../components/group/GroupBalance";
import WelcomeState from "@/components/WelcomeState";
import ExpenseSection from "@/components/expense/Expense";
import GroupSection from "@/components/group/Group";
import MemberSection from "@/components/group/AddMember";

const Dashboard = () => {
  const { groupId } = useParams();
  const [userBox, setUserBox] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const [settleBox, setSettleBox] = useState(false);
  const [selected, setSelected] = useState("");

  const { members } = useGroupData();

  const { data: groupData, isLoading } = useQuery<Group[]>({
    queryKey: ["groups", auth.currentUser?.uid],
    queryFn: fetchGroups,
  });
  const groups = groupData ?? [];

  if (isLoading) {
    return (
      <div className="px-4 py-6 md:flex flex-col gap-6">
        <Skeleton className="h-10 w-1/3 rounded-md mb-6" />
        <div className="flex flex-col md:flex-row gap-6">
          <Skeleton className="flex-1 h-48 rounded-lg" />
          <Skeleton className="flex-1 h-48 rounded-lg" />
          <Skeleton className="flex-1 h-48 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="h-[88%] relative bg-background text-foreground min-h-screen"
    >
      <NavbarUser />

      {groups?.length > 0 || skipped ? (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.8 }}
          className="absolute  w-full md:flex flex-col justify-between space-x-6 px-4 xl:px-18 py-6 rounded-t-3xl mt-[-18px]"
        >
          <div className="w-full flex justify-between flex-col md:flex-row gap-6 ">
            <Text
              variant="heading"
              className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-400 via-emerald-500 to-black/5 bg-clip-text text-transparent"
            >
              Dashboard
            </Text>
            <div className="flex max-sm:justify-end">
              <button
                className="bg-orange-500 text-white px-3 py-1 lg:px-5 lg:py-2.5 rounded-l-md hover:bg-orange-600 text-sm hover:scale-105 transition-all duration-300"
                onClick={() => setAddExpenseOpen(true)}
              >
                Add Expense
              </button>
              <button
                className="bg-emerald-500 text-white px-3 py-1 lg:px-5 lg:py-2.5 rounded-r-md hover:bg-emerald-600 text-sm hover:scale-105 transition-all duration-300"
                onClick={() => setSettleBox(true)}
              >
                Settle Up
              </button>
            </div>
          </div>
          <div className="lg:flex justify-between">
            {/* group card */}
            <GroupSection
              groups={groups}
              members={members}
              selected={selected}
              setSelected={setSelected}
              setUserBox={setUserBox}
            />
            {/* expenselist */}
            <ExpenseSection
              groupId={groupId}
              groups={groups}
              setUserBox={setUserBox}
            />
            {/* Group balance */}
            <div className="px-8 py-12">
              <GroupBalance />
            </div>
          </div>
          {/* Add Expense Dialog */}
          <SelectDialog
            isOpen={addExpenseOpen}
            onOpenChange={setAddExpenseOpen}
            title="Add an expense"
          >
            <AddExpenseForm onClose={() => setAddExpenseOpen(false)} />
          </SelectDialog>

          {/* Settle Up Dialog */}
          <SelectDialog
            isOpen={settleBox}
            onOpenChange={setSettleBox}
            title="Settle up"
          >
            <AddSettlement
              onClose={() => setSettleBox(false)}
              id="settleForm"
            />
          </SelectDialog>
          {/* Add User Dialog */}
          <MemberSection
            userBox={userBox}
            setUserBox={setUserBox}
            groupId={groupId}
          />
        </motion.div>
      ) : (
        <WelcomeState setSkipped={setSkipped} />
      )}
    </motion.div>
  );
};

export default Dashboard;
