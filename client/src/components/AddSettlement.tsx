import { ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import DefaultProfile from "../assets/deffault-profile.jpg";
import SelectDialog from "./SelectDialog";
import { useState } from "react";
import { Calendar } from "./ui/calendar";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addSettlement } from "../utils/http";
import type { AddSettlementBody } from "@/types/type";
import { useGroupData } from "../hooks/useGroupData";

const currencyList = [
  { code: "USD", label: "$" },
  { code: "INR", label: "₹" },
  { code: "EUR", label: "€" },
  { code: "GBP", label: "£" },
];

interface AddSettlementProps {
  id?: string;
  onClose: () => void;
}

const AddSettlement = ({ id, onClose }: AddSettlementProps) => {
  const queryClient = useQueryClient();
  const { groupId } = useParams();
  const { members } = useGroupData();

  const [paidByUserId, setPaidByUserId] = useState<string>("");
  const [paidByUserName, setPaidByUserName] = useState<string>("select payer");
  const [receivedByUserId, setReceivedByUserId] = useState<string>("");
  const [receivedByUserName, setReceivedByUserName] =
    useState<string>("select receiver");
  const [payerDialogOpen, setPayerDialogOpen] = useState(false);
  const [receiverDialogOpen, setReceiverDialogOpen] = useState(false);
  const [currencyDialog, setCurrencyDialog] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState({
    code: "USD",
    label: "$",
  });
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const mutation = useMutation({
    mutationFn: addSettlement,
    onSuccess: () => {
      console.log("settlement added successfully");
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
      queryClient.invalidateQueries({ queryKey: ["groupBalance", groupId] });
      onClose();
    },
  });

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    });

  const { register, handleSubmit } = useForm<AddSettlementBody>({
    defaultValues: {
      groupId: groupId!,
      date: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = (data: AddSettlementBody) => {
    data.paidByUserId = paidByUserId;
    data.receivedByUserId = receivedByUserId;
    if (paidByUserId === receivedByUserId) {
      alert("Cannot settle the payment with same member");
    }
    mutation.mutate(data);
  };

  return (
    <form id={id} onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      <div className="flex items-center justify-center mb-4">
        <img src={DefaultProfile} className="w-25 h-25 rounded-full" />
        <ArrowRight className="text-gray-500 mx-2" />
        <img
          src={DefaultProfile}
          className="w-25 h-25 rounded-full opacity-40 bg-gray-300"
        />
      </div>

      <p className="text-center mb-4">
        <button
          type="button"
          className="text-emerald-500 bg-gray-100 border-2 border-gray-300 px-2 rounded-full"
          onClick={() => setPayerDialogOpen(true)}
        >
          {paidByUserName}
        </button>{" "}
        paid{" "}
        <button
          type="button"
          className="text-emerald-500 bg-gray-100 border-2 border-gray-300 px-2 rounded-full"
          onClick={() => setReceiverDialogOpen(true)}
        >
          {receivedByUserName}
        </button>
      </p>

      {/* Amount Input */}
      <div className="relative text-center mb-4">
        <button
          type="button"
          className="absolute bottom-1 text-gray-400 text-xl hover:bg-gray-200 rounded-full px-2"
          onClick={() => setCurrencyDialog(true)}
        >
          {selectedCurrency.label}
        </button>
        <input
          {...register("amount", { required: true, valueAsNumber: true })}
          className="w-25 border-b-2 border-gray-200 pl-8 text-3xl focus:outline-none"
          placeholder="0.00"
        />
      </div>

      {/* Date Picker Button */}
      <div className="flex justify-center mb-4">
        <button
          type="button"
          className="px-4 py-2 bg-gray-200 rounded-full border-2 border-gray-400 cursor-pointer"
          onClick={() => setShowDatePicker(true)}
        >
          {date ? formatDate(date) : formatDate(new Date())}
        </button>
      </div>

      {/* Payer Dialog */}
      <SelectDialog
        isOpen={payerDialogOpen}
        onOpenChange={setPayerDialogOpen}
        title="Select payer"
      >
        {members.map((member) => (
          <button
            key={member.uid}
            type="button"
            onClick={() => {
              console.log("member id", member.uid);
              setPaidByUserId(member.uid);
              setPaidByUserName(member.name ?? "unknown");
              setPayerDialogOpen(false);
            }}
          >
            {member.name}
          </button>
        ))}
      </SelectDialog>

      {/* Receiver Dialog */}
      <SelectDialog
        isOpen={receiverDialogOpen}
        onOpenChange={setReceiverDialogOpen}
        title="Select receiver"
      >
        {members.map((member) => (
          <button
            key={member.uid}
            type="button"
            onClick={() => {
              setReceivedByUserId(member.uid);
              setReceivedByUserName(member.name ?? "unknown");
              setReceiverDialogOpen(false);
            }}
          >
            {member.name}
          </button>
        ))}
      </SelectDialog>

      {/* Currency Dialog */}
      <SelectDialog
        isOpen={currencyDialog}
        onOpenChange={setCurrencyDialog}
        title="Choose a currency"
      >
        {currencyList.map((currency, idx) => (
          <div
            key={idx}
            className="border-b-2 mx-[-25px] text-center cursor-pointer hover:bg-gray-200"
            onClick={() => {
              setSelectedCurrency(currency);
              setCurrencyDialog(false);
            }}
          >
            {currency.code}
          </div>
        ))}
      </SelectDialog>

      {/* Date Picker Dialog */}
      <SelectDialog
        isOpen={showDatePicker}
        onOpenChange={setShowDatePicker}
        title="Choose date"
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            if (selectedDate) {
              setDate(selectedDate);
              setShowDatePicker(false);
            }
          }}
          className="w-full"
        />
      </SelectDialog>

      {/* Save Button */}
      <button
        type="submit"
        className="px-4 py-2 bg-emerald-500 text-white rounded-lg"
      >
        Save
      </button>
    </form>
  );
};

export default AddSettlement;
