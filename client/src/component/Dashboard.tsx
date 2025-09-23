import { Link } from "react-router-dom";
import DefaultProfile from "../assets/deffault-profile.jpg";
import { Card, CardContent, CardTitle } from "./ui/card";
import Text from "./ui/text";
import { useState } from "react";
import { Calendar } from "./ui/calendar";
import {
  ArrowLeftRight,
  ArrowRight,
  Equal,
  Percent,
  Users,
} from "lucide-react";
import SelectDialog from "./SelectDialog";
import { useQuery } from "@tanstack/react-query";
import { fetchGroups, type Group } from "@/utils/http";

const operators = [
  { icon: <Equal />, hover: "Split equally" },
  { icon: <span>1.23</span>, hover: "Split by exact amount" },
  { icon: <Percent />, hover: "Split by percentages" },
  { icon: <Users />, hover: "Split by shares" },
  { icon: <span>+/-</span>, hover: "Split by adjustment" },
  { icon: <ArrowLeftRight />, hover: "Reimbursement" },
];
const currencyList = [
  { code: "USD", label: "$" },
  { code: "INR", label: "₹" },
  { code: "EUR", label: "€" },
  { code: "GBP", label: "£" },
];
const Dashboard = () => {
  const [settleBox, setSettleBox] = useState(false);
  const [currencyDialog, setCurrencyDialog] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState({
    code: "USD",
    label: "$",
  });
  const [selectGroup, setSelectGroup] = useState(false);
  const [selectType, setSelectType] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    });
    const {data: groups, isLoading, isError}= useQuery<Group[]>({
      queryKey:["groups"],
      queryFn: fetchGroups
    })
if(isLoading) return <p>Loading groups...</p>
if(isError)return <p>Failed to load groups</p>
  return (
    <div className="flex justify-center">
      {/* Group title */}
      <aside className="w-50 mr-4">
        <div className="flex flex-col items-start pl-4">
          <button className="hover:bg-gray-100">Dashboard</button>
        </div>
        <div className="bg-gray-200 flex justify-between text-gray-400 text-md px-1">
          <p>GROUP</p>
          <Link to="/groups/new">+add</Link>
        </div>
        <div className="flex flex-col pl-4">
          {groups?.map((group)=>(
            <Link key={group.groupId} to={`/group/${group.groupId}`}
            className="hover:bg-emerald-500 py-2 block text-left">{group.groupName}</Link>
          ))}
        </div>
      </aside>
      {/* card */}
      <Card className="w-150 h-150 shadow-2xl shadow-black/10">
        <div className="bg-gray-400 h-10 mt-[-24px] flex justify-between items-center px-10">
          <Text>Dashboard</Text>
          <div className="flex gap-4">
            <button
              className="bg-orange-500 px-3 py-1 border-none rounded-md"
              onClick={() => setAddExpenseOpen(true)}
            >
              {" "}
              Add an expense{" "}
            </button>
            <button
              className="bg-emerald-500 px-3 py-1 border-none rounded-md"
              onClick={() => setSettleBox(true)}
            >
              {" "}
              Settle up{" "}
            </button>
          </div>
        </div>
        <CardTitle className="text-center text-3xl mt-4">
          {" "}
          Welcome to Splitwise{" "}
        </CardTitle>
        <CardContent className="px-12 text-center">
          <Text variant="muted" className="text-xl">
            {" "}
            Splitwise helps you split bills with friends{" "}
          </Text>
          <Text variant="muted" className="text-xl mt-4">
            {" "}
            Click "Add an expense" above to get started, or invite some friends
            first!{" "}
          </Text>
          <button className="bg-orange-500 px-3 py-1 border-none rounded-md mt-12">
            {" "}
            Add friends on Splitwise{" "}
          </button>
        </CardContent>
      </Card>

    {/* Add expense*/}
      <SelectDialog
        isOpen={addExpenseOpen}
        onOpenChange={setAddExpenseOpen}
        title="Add an expense"
        showFooter
        saveLabel="Save"
      >
        
        <input
          className="w-full border-b-2 border-gray-200 text-2xl focus:outline-none"
          placeholder="Enter a description"
        />
        <div className="relative">
          {" "}
          <button
            className="absolute bottom-1 text-gray-400 text-xl hover:bg-gray-200 rounded-full px-2"
            onClick={() => setCurrencyDialog(true)}
          >
            {" "}
            {selectedCurrency.label}{" "}
          </button>
          <input
            className="w-full border-b-2 border-gray-200 pl-8 text-2xl focus:outline-none"
            placeholder="0.00"
          />
        </div>{" "}
        <div className="text-center">
          <p>
            {" "}
            Paid by{" "}
            <button className="bg-gray-200 rounded-full px-2 text-emerald-400">
              {" "}
              you{" "}
            </button>{" "}
            and split{" "}
            <button
              className="bg-gray-200 rounded-full px-2 text-emerald-400"
              onClick={() => setSelectType(true)}
            >
              {" "}
              equally
            </button>{" "}
            (/person){" "}
          </p>
        </div>
        <div className="flex justify-center">
          {" "}
          <button
            className="px-4 py-2 bg-gray-200 rounded-full border-2 border-gray-400 mr-6 cursor-pointer"
            onClick={() => setShowDatePicker(true)}
          >
            {" "}
            {date ? formatDate(date) : formatDate(new Date())}{" "}
          </button>
          <button
            className="px-4 py-2 bg-gray-200 rounded-full border-2 border-gray-400 cursor-pointer"
            onClick={() => setSelectGroup(true)}
          >
            {" "}
            No group{" "}
          </button>{" "}
          <SelectDialog
            isOpen={showDatePicker}
            onOpenChange={setShowDatePicker}
            title="Choose date"
          >
            <Calendar
              mode="single"
              selected={date}
              onSelect={(selectedDate) => {
                setDate(selectedDate);
                setShowDatePicker(false);
              }}
              className="w-full"
            />
          </SelectDialog>
        </div>
      </SelectDialog>
      {/* splitType */}
      <SelectDialog
        isOpen={selectType}
        onOpenChange={setSelectType}
        title="Choose split options"
      >
        <div className="flex bg-gray-300 text-center justify-between">
          {" "}
          {operators.map((opt, index) => (
            <div
              key={index}
              className="flex items-center justify-center w-full border-2 border-gray-400"
            >
              <button title={opt.hover} className="cursor-pointer">
                {" "}
                {opt.icon}{" "}
              </button>
            </div>
          ))}{" "}
        </div>
      </SelectDialog>
      {/* select groupmember who paid */}
      <SelectDialog
        isOpen={selectGroup}
        onOpenChange={setSelectGroup}
        title="Choose group"
      >
        <p className="font-bold bg-gray-400 mt-">Non-group expenses</p>
      </SelectDialog>
      {/* list of currency */}
      <SelectDialog
        isOpen={currencyDialog}
        onOpenChange={setCurrencyDialog}
        title="Choose a currency"
      >
        {currencyList.map((currency, index) => (
          <div
            key={index}
            className="border-b-2 mx-[-25px] text-center cursor-pointer hover:bg-gray-200"
            onClick={() => {
              setSelectedCurrency(currency);
              setCurrencyDialog(false);
            }}
          >
            {" "}
            {currency.code}{" "}
          </div>
        ))}
      </SelectDialog>
      {/* settle */}
      <SelectDialog
        isOpen={settleBox}
        onOpenChange={setSettleBox}
        title="Settle up"
        showFooter
        saveLabel="Save"
      >
        {" "}
        <div className="flex items-center justify-center">
          {" "}
          <img src={DefaultProfile} className="w-25 h-25" />{" "}
          <ArrowRight className="text-gray-500" />{" "}
          <img
            src={DefaultProfile}
            className="w-25 h-25 opacity-40 bg-gray-300"
          />{" "}
        </div>{" "}
        <p className="text-center">
          {" "}
          <button className="text-emerald-500 bg-gray-100 border-2 border-gray-300 px-2 rounded-full">
            {" "}
            you{" "}
          </button>{" "}
          paid{" "}
          <button className="text-emerald-500 bg-gray-100 border-2 border-gray-300 px-2 rounded-full">
            {" "}
            me{" "}
          </button>{" "}
        </p>{" "}
        <div className="relative text-center">
          {" "}
          <button
            className="absolute bottom-1 text-gray-400 text-xl hover:bg-gray-200 rounded-full px-2"
            onClick={() => setCurrencyDialog(true)}
          >
            {" "}
            {selectedCurrency.label}{" "}
          </button>{" "}
          <input
            className="w-25 border-b-2 border-gray-200 pl-8 text-3xl focus:outline-none"
            placeholder="0.00"
          />{" "}
        </div>{" "}
        <div className="flex justify-center">
          {" "}
          <button
            className="px-4 py-2 bg-gray-200 rounded-full border-2 border-gray-400 mr-6 cursor-pointer"
            onClick={() => setShowDatePicker(true)}
          >
            {" "}
            {date ? formatDate(date) : formatDate(new Date())}{" "}
          </button>{" "}
          <button
            className="px-4 py-2 bg-gray-200 rounded-full border-2 border-gray-400 cursor-pointer"
            onClick={() => setSelectGroup(true)}
          >
            {" "}
            No group{" "}
          </button>{" "}
        </div>{" "}
      </SelectDialog>{" "}
      {/* group balance */}
      <aside>
        {" "}
        <Text className="text-gray-500">GROUP BALANCE</Text>{" "}
        <div>
          {" "}
          <p>username</p> <p>get back $2468</p>{" "}
        </div>{" "}
      </aside>{" "}
    </div>
  );
};
export default Dashboard;
