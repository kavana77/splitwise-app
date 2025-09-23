import { type AddExpenseBody, addExpenses, type Group, type GroupMember } from "@/utils/http";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeftRight, Equal, Percent, Users, CircleUserRound } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import SelectDialog from "./SelectDialog";
import { Calendar } from "./ui/calendar";
import { useState, type ReactNode } from "react";

interface AddExpenseFormProps {
  group: Group;
  onClose: () => void;
}

const operators: { value: AddExpenseBody["splitType"]; icon: ReactNode; hover: string }[] = [
  { value: "equally", icon: <Equal />, hover: "Split equally" },
  { value: "exact", icon: <span>1.23</span>, hover: "Split by exact amount" },
  { value: "percentage", icon: <Percent />, hover: "Split by percentages" },
  { value: "shares", icon: <Users />, hover: "Split by shares" },
  { value: "adjustment", icon: <span>+/-</span>, hover: "Split by adjustment" },
  { value: "reimbursement", icon: <ArrowLeftRight />, hover: "Reimbursement" },
];

const AddExpenseForm = ({ group, onClose }: AddExpenseFormProps) => {
  // Paid by state
  const [paidUserId, setPaidUserId] = useState<string>("");
  const [paidByName, setPaidByName] = useState<string>("you");

  // Dialog states
  const [selectGroup, setSelectGroup] = useState(false);
  const [selectType, setSelectType] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { register, handleSubmit, watch, control, setValue } = useForm<AddExpenseBody>({
    defaultValues: {
      description: "",
      amount: 0,
      paidUserId: "",
      splitType: "equally",
      date: new Date().toISOString().split("T")[0],
      groupId: group.groupId,
      splitDetails: {},
    },
  });

  const mutation = useMutation({ mutationFn: addExpenses });
  const splitType = watch("splitType");
  const dateValue = watch("date");

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" });

  const onSubmit = (data: AddExpenseBody) => {
    data.paidUserId = paidUserId; // update with chosen member
    mutation.mutate(data, {
      onSuccess: () => {
        console.log("Expense added successfully!");
        onClose();
      },
      onError: (err) => console.error("Error adding expense:", err),
    });
  };

  const members = Object.values(group.groupMembers || {}) as GroupMember[];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      {/* Description */}
      <input
        {...register("description", { required: true })}
        placeholder="Enter a description"
        className="w-full border-b-2 border-gray-200 text-2xl focus:outline-none"
      />

      {/* Amount */}
      <input
        type="number"
        {...register("amount", { required: true, min: 1, valueAsNumber: true })}
        placeholder="0.00"
        className="w-full border-b-2 border-gray-200 text-2xl focus:outline-none"
      />

      {/* Paid by and split */}
      <div className="text-center">
        <p>
          Paid by{" "}
          <button
            type="button"
            className="bg-gray-200 rounded-full px-2 text-emerald-400"
            onClick={() => setSelectGroup(true)}
          >
            {paidByName}
          </button>{" "}
          and split{" "}
          <button
            type="button"
            className="bg-gray-200 rounded-full px-2 text-emerald-400"
            onClick={() => setSelectType(true)}
          >
            {splitType}
          </button>{" "}
          (/person)
        </p>
      </div>

      {/* Paid by Dialog */}
      <SelectDialog isOpen={selectGroup} onOpenChange={setSelectGroup} title="Choose group member">
        {members.map((member) => (
          <button
            key={member.uid}
            type="button"
            className={`flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-200 ${
              paidUserId === member.uid ? "bg-gray-300" : ""
            }`}
            onClick={() => {
              setPaidUserId(member.uid);
              setPaidByName(member.name ?? "unknown");
              setSelectGroup(false);
            }}
          >
            <CircleUserRound size={20} />
            {member.name}
          </button>
        ))}
      </SelectDialog>

      {/* Split Type Dialog */}
      <SelectDialog isOpen={selectType} onOpenChange={setSelectType} title="Choose split options">
        {splitType === "equally" ? (
          <div className="flex bg-gray-300 text-center justify-between">
            {operators.map((opt) => (
              <div
                key={opt.value}
                className="flex items-center justify-center w-full border-2 border-gray-400"
              >
                <button
                  type="button"
                  className="cursor-pointer w-full p-2"
                  onClick={() => {
                    setValue("splitType", opt.value);
                    if (opt.value === "equally") {
                      setSelectType(false); // close only if equally
                    }
                  }}
                >
                  {opt.icon}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            <p className="font-semibold">Enter split details</p>
            {members.map((member) => (
              <div key={member.uid} className="flex justify-between items-center">
                <span>{member.name}</span>
                <Controller
                  control={control}
                  name={`splitDetails.${member.uid}`}
                  render={({ field }) => (
                    <input
                      type="number"
                      {...field}
                      placeholder="Enter value"
                      className="border p-1 w-24 rounded"
                    />
                  )}
                />
              </div>
            ))}
            <button
              type="button"
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg w-full"
              onClick={() => setSelectType(false)}
            >
              Done
            </button>
          </div>
        )}
      </SelectDialog>

      {/* Date Picker */}
      <div className="flex justify-center">
        <button
          className="px-4 py-2 bg-gray-200 rounded-full border-2 border-gray-400 mr-6 cursor-pointer"
          type="button"
          onClick={() => setShowDatePicker(true)}
        >
          {dateValue ? formatDate(new Date(dateValue)) : formatDate(new Date())}
        </button>
      </div>

      <SelectDialog isOpen={showDatePicker} onOpenChange={setShowDatePicker} title="Choose date">
        <Calendar
          mode="single"
          selected={dateValue ? new Date(dateValue) : undefined}
          onSelect={(selectedDate) => {
            if (selectedDate) {
              setValue("date", selectedDate.toISOString().split("T")[0]);
              setShowDatePicker(false);
            }
          }}
          className="w-full"
        />
      </SelectDialog>

      {/* Submit */}
      <button
        type="submit"
        className="px-4 py-2 bg-emerald-500 text-white rounded-lg"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Saving..." : "Save"}
      </button>
    </form>
  );
};

export default AddExpenseForm;
