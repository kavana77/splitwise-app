import Text from "../ui/text";
import { motion } from "framer-motion";
import { MdDeleteOutline } from "react-icons/md";

type ExpenseListProp = {
  expenseId: string;
  description: string;
  amountPaid: number;
  lentAmount: number;
  paidUserName: string;
  onDelete: (expenseId: string) => void;
};

const ExpenseList = ({
  description,
  amountPaid,
  lentAmount,
  paidUserName,
  expenseId,
  onDelete,
}: ExpenseListProp) => {
  const roundTwo = (num: number) => Math.round(num * 100) / 100;

  return (
    <motion.div className="w-auto lg:gap-2 flex xl:gap-6 items-center justify-between px-1 lg:px-3 xl:px-8 py-4 rounded-xl shadow-sm border-b border-gray-200 hover:shadow-md transition duration-300 bg-background text-foreground">
      {/* Expense description */}
      <div className="flex-1 xl:pr-16 text-foreground">
        <Text className="text-lg font-semibold ">{description}</Text>
        <Text variant="muted" className="text-sm text-gray-500">
          {paidUserName} paid
        </Text>
      </div>

      {/* Paid + Lent */}
      <div className="flex gap-2 xl:gap-8 items-center">
        <div className="text-center">
          <Text className="text-xs text-gray-500 uppercase tracking-wide">
            Paid
          </Text>
          <Text className="text-emerald-600 font-bold text-lg">
            ₹{roundTwo(amountPaid).toFixed(2)}
          </Text>
        </div>
        <div className="text-center">
          <Text className="text-xs text-gray-500 uppercase tracking-wide">
            Lent
          </Text>
          <Text className="text-red-500 font-bold text-lg">
            ₹{roundTwo(lentAmount).toFixed(2)}
          </Text>
        </div>
      </div>

      {/*Delete button */}
      <button
        onClick={() => onDelete(expenseId)}
        className="ml-4 p-2 rounded-full hover:bg-red-100 transition duration-300"
      >
        <MdDeleteOutline className="text-gray-500 hover:text-red-600 text-2xl" />
      </button>
    </motion.div>
  );
};

export default ExpenseList;
