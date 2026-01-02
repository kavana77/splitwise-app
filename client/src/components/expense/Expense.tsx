import Text from "@/components/ui/text";
import ExpenseList from "@/components/expense/ExpenseList";
import { Skeleton } from "@/components/ui/skeleton";
import BlueRabbit from "@/assets/blue-rabbit.png";
import BlueBlackRabbit from "@/assets/BlueBlag-bg-rabbit.png";
import Money from "@/assets/magic.png";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getExpenseList, deleteExpense } from "@/utils/http";
import type { Group } from "@/types/type";
import type { ExpenseLists } from "@/types/type";
import { useDarkMode } from "@/hooks/useDarkMode";
import { ScrollArea } from "../ui/scroll-area";

interface Props {
  groupId?: string;
  groups: Group[];
  setUserBox: (open: boolean) => void;
}

const ExpenseSection = ({ groupId, groups, setUserBox }: Props) => {
  const isDark = useDarkMode();
  const queryClient = useQueryClient();

  const { data: expenseData, isFetching } = useQuery({
    queryKey: ["expense", groupId],
    queryFn: () => getExpenseList(groupId!),
    enabled: !!groupId,
  });

  const expense = expenseData?.expenseList ?? [];

  const deleteExpenseMutation = useMutation({
    mutationFn: ({
      groupId,
      expenseId,
    }: {
      groupId: string;
      expenseId: string;
    }) => deleteExpense(groupId, expenseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expense", groupId] });
    },
  });

  return (
    <div>
      {groups.length === 0 ? (
        <div className="p-8 text-center">
          <Text className="text-2xl">Welcome to Splitwise</Text>
          <div className="mt-4">
            <Text variant="muted">
              Splitwise helps you split bills with friends.
            </Text>
            <Text variant="muted" className="mt-2">
              Click "Add an expense" above to get started, or invite some
              friends.
            </Text>
            <button
              className="bg-orange-500 text-white px-4 py-2 rounded-md mt-6 hover:bg-orange-600"
              onClick={() => setUserBox(true)}
            >
              Add friends
            </button>
          </div>
        </div>
      ) : expense.length === 0 ? (
        <div className="flex p-6 items-center gap-6">
          <img src={isDark ? BlueBlackRabbit : BlueRabbit} className="w-28" />
          <div>
            <Text className="text-xl font-semibold">No expenses yet</Text>
            <div className="mt-2">
              <Text variant="muted">
                To add a new expense, click the orange “Add expense” button.
              </Text>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2 md:p-4">
          <Text variant="heading" className="text-gray-400 flex gap-2">
            Expense History <img src={Money} className="w-10 h-10" />
          </Text>
          <ScrollArea className="h-120">
            {isFetching ? (
              <Skeleton className=" h-20 rounded-xl mb-2" />
            ) : (
              expense.map((exp: ExpenseLists) => (
                <ExpenseList
                  key={exp.expenseId}
                  expenseId={exp.expenseId}
                  description={exp.description}
                  amountPaid={exp.paidAmount}
                  lentAmount={exp.shouldGetBack}
                  paidUserName={exp.paidUserName}
                  currencySymbol={exp.currencySymbol}
                  onDelete={(id) =>
                    deleteExpenseMutation.mutate({
                      groupId: groupId!,
                      expenseId: id,
                    })
                  }
                />
              ))
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default ExpenseSection;
