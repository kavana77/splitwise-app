import { addExpenses } from "../../../utils/http";
import type { AddExpenseBody } from "@/types/type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeftRight, Equal, Notebook, Percent, Users } from "lucide-react";
import { useForm } from "react-hook-form";
import SelectDialog from "../../SelectDialog";
import { Calendar } from "../../ui/calendar";
import { useState, type ReactNode, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useGroupData } from "@/hooks/useGroupData";
import PaidDialog from "./PaidDialog";
import CurrencyDialog from "./CurrencyDialog";
import { toast } from "sonner";
import ItemizedSection from "./ItemizedSection";
import type { ItemRow } from "@/types/type";

interface AddExpenseFormProps {
  onClose: () => void;
}

const operators: {
  value: AddExpenseBody["splitType"];
  icon: ReactNode;
  hover: string;
}[] = [
  { value: "equally", icon: <Equal />, hover: "Split equally" },
  { value: "exact", icon: <span>1.23</span>, hover: "Split by exact amount" },
  { value: "percentage", icon: <Percent />, hover: "Split by percentages" },
  { value: "shares", icon: <Users />, hover: "Split by shares" },
  { value: "adjustment", icon: <span>+/-</span>, hover: "Split by adjustment" },
  { value: "reimbursement", icon: <ArrowLeftRight />, hover: "Reimbursement" },
  { value: "itemized", icon: <Notebook />, hover: "Itemized expense" },
];

const AddExpenseForm = ({ onClose }: AddExpenseFormProps) => {
  const queryClient = useQueryClient();
  const { groupId } = useParams();
  const { members } = useGroupData();

  // UI state
  const [currencyDialog, setCurrencyDialog] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState({
    code: "INR",
    label: "₹",
  });
  const [isMultiple, setIsMultiple] = useState(false);
  const [payersData, setPayersData] = useState<Record<string, number>>({});
  const [paidUserId, setPaidUserId] = useState<string>("");
  const [paidByName, setPaidByName] = useState<string>("Select payer");

  const [selectGroup, setSelectGroup] = useState(false);
  const [selectType, setSelectType] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Itemized rows
  const makeEmptyIncluded = () =>
    (members || []).reduce(
      (acc, m) => ({ ...acc, [m.uid]: true }),
      {} as Record<string, boolean>
    );
  const [itemsState, setItemsState] = useState<ItemRow[]>(() => [
    {
      id: cryptoRandomId(),
      description: "",
      amount: 0,
      included: makeEmptyIncluded(),
    },
  ]);

  // gst & tip percents (applied to subtotal)
  const [gst, setGst] = useState<number>(0);
  const [tip, setTip] = useState<number>(0);

  // split details general state (used for other split types)
  const [splitDetailsState, setSplitDetailsState] = useState<
    Record<string, number>
  >(() => (members || []).reduce((acc, m) => ({ ...acc, [m.uid]: 0 }), {}));
  const [reimbursementChecked, setReimbursementChecked] = useState<
    Record<string, boolean>
  >(() => (members || []).reduce((acc, m) => ({ ...acc, [m.uid]: false }), {}));

  const { register, handleSubmit, watch, setValue } = useForm<AddExpenseBody>({
    defaultValues: {
      description: "",
      splitType: "equally",
      paidUsersId: {},
      date: new Date().toISOString().split("T")[0],
      groupId: groupId!,
    },
  });
  const mutation = useMutation({
    mutationFn: addExpenses,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expense", groupId] });
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
      queryClient.invalidateQueries({ queryKey: ["groupBalance", groupId] });
      onClose();
    },
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : "Error adding expense";
      toast.error(message);
    },
  });
  const enteredAmount = Number(watch("amount")) || 0;
  const splitType = watch("splitType");
  const amountValue = Number(watch("amount")) || 0;
  const dateValue = watch("date");

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    });

  // Derived  itemized

  const subtotal = useMemo(() => {
    return itemsState.reduce((s, it) => s + (Number(it.amount) || 0), 0);
  }, [itemsState]);

  const gstAmount = useMemo(
    () => (subtotal * (Number(gst) || 0)) / 100,
    [subtotal, gst]
  );
  const tipAmount = useMemo(
    () => (subtotal * (Number(tip) || 0)) / 100,
    [subtotal, tip]
  );
  const grandTotalItemized = useMemo(
    () => subtotal + gstAmount + tipAmount,
    [subtotal, gstAmount, tipAmount]
  );

  // ---------- Handlers ----------
  function cryptoRandomId() {
    // small uid fallback
    return Math.random().toString(36).slice(2, 9);
  }

  const handleMultiplePayerSave = () => {
    const totalAmount = Object.values(payersData).reduce(
      (sum, amount) => sum + (Number(amount) || 0),
      0
    );

    if (totalAmount !== enteredAmount) {
      toast.warning(
        `The total of all payers (${totalAmount}) must equal the entered amount (${enteredAmount}).`
      );
      return;
    }
    const validPayers: Record<string, number> = {};
    for (const userId in payersData) {
      const amt = Number(payersData[userId]) || 0;
      if (amt > 0) validPayers[userId] = amt;
    }
    if (Object.keys(validPayers).length === 0) {
      alert("Please enter at least one payer amount!");
      return;
    }
    setPaidByName("Multiple payer");
    setPayersData(validPayers);
    setSelectGroup(false);
  };

  const handleSplitChange = (uid: string, value: number) => {
    setSplitDetailsState((prev) => {
      const updated = { ...prev, [uid]: value };
      if (splitType === "adjustment") {
        const lastUid = members[members.length - 1].uid;
        const totalEntered = Object.values(updated).reduce((a, b) => a + b, 0);
        const leftOver = Number(
          (amountValue - totalEntered + updated[lastUid]).toFixed(2)
        );
        updated[lastUid] = leftOver;
      }

      setValue("splitDetails", updated);
      return updated;
    });
  };

  const onSubmit = (data: AddExpenseBody) => {
    if (data.splitType === "itemized") {
      if (!itemsState.length) {
        alert("Please add at least one item for itemized split.");
        return;
      }
      const itemsPayload = itemsState.map((it) => ({
        description: it.description || "Item",
        amount: Number(it.amount) || 0,
        users: Object.keys(it.included).filter((uid) => it.included[uid]),
      }));
      data.amount = subtotal;

      data.gst = Number(gst) || 0;

      data.tip = Number(tip) || 0;

      data.items = itemsPayload.map(({ description, amount }) => ({
        description,
        amount,
      }));
    } else {
      data.amount = Number(data.amount) || 0;
    }

    // Paid by handling
    if (!paidUserId && !isMultiple) {
      toast.message("Please select who paid the expense");
      return;
    }
    data.paidUsersId = isMultiple
      ? payersData
      : { [paidUserId]: Number(data.amount) || amountValue };

    // split details for other split types
    if (splitType !== "itemized") {
      data.splitDetails = splitDetailsState;
    } else {
      data.splitDetails = undefined;
    }

    // attach groupId & date already set via defaultValues
    data.groupId = groupId!;
    data.date = data.date || new Date().toISOString().split("T")[0];
    console.log("Submitting expense data:", data);
    mutation.mutate(data);
  };

  useMemo(() => {
    setSplitDetailsState((prev) =>
      (members || []).reduce<Record<string, number>>(
        (acc, m) => ({ ...acc, [m.uid]: prev[m.uid] ?? 0 }),
        {}
      )
    );

    setReimbursementChecked((prev) =>
      (members || []).reduce<Record<string, boolean>>(
        (acc, m) => ({ ...acc, [m.uid]: prev[m.uid] ?? false }),
        {}
      )
    );

    setItemsState((prev) =>
      prev.map((row) => ({
        ...row,
        included: (members || []).reduce<Record<string, boolean>>(
          (acc, m) => ({ ...acc, [m.uid]: row.included?.[m.uid] ?? true }),
          {}
        ),
      }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members?.length]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      {/* Description */}
      <input
        {...register("description", { required: true })}
        placeholder="Enter a description"
        className="w-full border-b-2 border-gray-200 text-2xl focus:outline-none "
      />

      {/* Amount field */}
      <div className="relative">
        <button
          type="button"
          className="absolute bottom-1 text-xl hover:bg-gray-200 rounded-full px-2"
          onClick={() => setCurrencyDialog(true)}
        >
          {selectedCurrency.label}  
        </button>
        <input
          {...register("amount", {
            required: splitType !== "itemized",
            min: 1,
            valueAsNumber: true,
          })}
          value={
            splitType === "itemized"
              ? grandTotalItemized.toFixed(2)
              : watch("amount") || ""
          }
          placeholder="0.00"
          onChange={(e) => setValue("amount", Number(e.target.value))}
          className="ml-16  w-50 border-b-2 border-gray-200 text-2xl focus:outline-none"
          disabled={splitType === "itemized"}
        />
      </div>

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
          </button>
        </p>
      </div>

      {/* Currency dialog */}
      <CurrencyDialog
        onOpenChange={setCurrencyDialog}
        isOpen={currencyDialog}
        onSelect={(currency)=>{
          setSelectedCurrency(currency)
          setValue("currencySymbol", currency.label)
          setValue("currencyCode", currency.code)
        }}
      />

      {/* Paid by Dialog */}
      <PaidDialog
        isOpen={selectGroup}
        onOpenChange={setSelectGroup}
        members={members || []}
        isMultiple={isMultiple}
        setIsMultiple={setIsMultiple}
        handleMultiplePayerSave={handleMultiplePayerSave}
        paidUserId={paidUserId}
        setPaidUserId={setPaidUserId}
        payersData={payersData}
        setPayersData={setPayersData}
        setPaidByName={setPaidByName}
      />

      {/* Split Type Dialog */}
      <SelectDialog
        isOpen={selectType}
        onOpenChange={setSelectType}
        title="Choose split options"
      >
        <div className="flex bg-gray-300 justify-between mb-2 ">
          {operators.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`cursor-pointer w-full p-2 border-2 border-gray-400 hover:bg-gray-200 flex flex-col items-center gap-1 ${
                splitType === opt.value ? "bg-white" : ""
              } `}
              onClick={() => {
                setValue("splitType", opt.value);
                if (opt.value === "equally") {
                  const resetSplits = (members || []).reduce(
                    (acc, m) => ({ ...acc, [m.uid]: 0 }),
                    {}
                  );
                  setSplitDetailsState(resetSplits);
                  setValue("splitDetails", resetSplits);
                  setSelectType(false);
                }
              }}
            >
              {opt.icon}
            </button>
          ))}
        </div>

        {splitType !== "equally" && (
          <div className="space-y-2">
            <p className="font-semibold mb-2">
              {splitType === "exact" && "Split by exact amount"}
              {splitType === "percentage" && "Split by percentage"}
              {splitType === "shares" && "Split by shares"}
              {splitType === "adjustment" && "Split by adjustment"}
              {splitType === "reimbursement" && "Reimbursement"}
              {splitType === "itemized" &&
                "Itemized expense (configure items below)"}
            </p>

            {splitType !== "itemized" ? (
              <>
                {(members || []).map((member) => (
                  <div
                    key={member.uid}
                    className="flex justify-between items-center"
                  >
                    <span>{member.name}</span>
                    {splitType === "reimbursement" ? (
                      <input
                        type="checkbox"
                        checked={reimbursementChecked[member.uid]}
                        onChange={() => {
                          const updated: Record<string, boolean> = {
                            ...reimbursementChecked,
                            [member.uid]: !reimbursementChecked[member.uid],
                          };
                          setReimbursementChecked(updated);
                          const checkedMembers = (members || []).filter(
                            (m) => updated[m.uid]
                          );
                          const perMember =
                            checkedMembers.length > 0
                              ? amountValue / checkedMembers.length
                              : 0;
                          const newSplitDetails = (members || []).reduce(
                            (acc, m) => {
                              acc[m.uid] = updated[m.uid] ? perMember : 0;
                              return acc;
                            },
                            {} as Record<string, number>
                          );
                          setSplitDetailsState(newSplitDetails);
                          setValue("splitDetails", newSplitDetails);
                        }}
                      />
                    ) : (
                      <input
                        className="w-24 border px-2 py-1 rounded"
                        value={splitDetailsState[member.uid] ?? 0}
                        onChange={(e) =>
                          handleSplitChange(member.uid, Number(e.target.value))
                        }
                      />
                    )}
                  </div>
                ))}
                <div className="flex justify-between items-center mt-2">
                  <span className="font-semibold">
                    Total:{" "}
                    {splitType === "percentage"
                      ? `${Object.values(splitDetailsState)
                          .reduce((a, b) => a + b, 0)
                          .toFixed(2)}%`
                      : Object.values(splitDetailsState)
                          .reduce((a, b) => a + b, 0)
                          .toFixed(2)}
                  </span>
                  <button
                    type="button"
                    className="px-4 py-1 bg-emerald-500 text-white rounded-lg"
                    onClick={() => {
                      setValue("splitDetails", splitDetailsState);
                      setSelectType(false);
                    }}
                  >
                    Save
                  </button>
                </div>
              </>
            ) : (
              <ItemizedSection
                members={members}
                itemsState={itemsState}
                setItemsState={setItemsState}
                gst={gst}
                setGst={setGst}
                tip={tip}
                setTip={setTip}
                setValue={setValue}
                setSelectType={setSelectType}
              />
            )}
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

      <SelectDialog
        isOpen={showDatePicker}
        onOpenChange={setShowDatePicker}
        title="Choose date"
      >
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
