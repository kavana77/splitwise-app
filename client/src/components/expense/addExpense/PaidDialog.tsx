import SelectDialog from "@/components/SelectDialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Users } from "lucide-react";
import type { Member } from "@/types/type";

interface PaidDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  members: Member[];
  isMultiple: boolean;
  setIsMultiple: (val: boolean) => void;
  handleMultiplePayerSave: () => void;
  paidUserId: string;
  setPaidUserId: (uid: string) => void;
  payersData: Record<string, number>;
  setPayersData: (data: Record<string, number>) => void;
  setPaidByName: (name: string) => void;
}
const PaidDialog = ({
  isOpen,
  onOpenChange,
  members,
  isMultiple,
  setIsMultiple,
  handleMultiplePayerSave,
  paidUserId,
  setPaidUserId,
  payersData,
  setPayersData,
  setPaidByName,
}: PaidDialogProps) => {
  return (
    <SelectDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Choose payer"
    >
      <div className="relative h-48 w-full mt-6 ">
        <ScrollArea className="h-48 ">
          {!isMultiple ? (
            <>
              {members.map((member) => (
                <button
                  key={member.uid}
                  type="button"
                  className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-400"
                  onClick={() => {
                    setPaidUserId(member.uid);
                    setPaidByName(member.name ?? "unknown");
                    onOpenChange(false);
                  }}
                >
                  {member.name}
                </button>
              ))}
            </>
          ) : (
            <>
              {members.map((member) => (
                <div key={member.uid} className="flex px-4 items-center gap-2">
                  <p className="w-70 text-start">{member.name}</p>
                  <Input
                    placeholder="0.00"
                    className="w-28"
                    onChange={(e) => {
                      const value = Number(e.target.value) || 0;
                      setPayersData({
                        ...payersData,
                        [member.uid]: value,
                      });
                      if (value > 0) setPaidUserId(member.uid);
                      else {
                        // if currently selected payer becomes zero, clear it
                        if (paidUserId === member.uid) setPaidUserId("");
                      }
                    }}
                  />
                </div>
              ))}
              <div className="flex justify-end px-4 py-2">
                <button
                  type="button"
                  className="bg-emerald-600 rounded-md px-2 py-1 text-white"
                  onClick={() => handleMultiplePayerSave()}
                >
                  Save
                </button>
              </div>
            </>
          )}

          <button
            onClick={() => setIsMultiple(!isMultiple)}
            className="cursor-pointer flex items-center gap-2 absolute px-2 py-1 top-[-37px] right-0 border-2 rounded-md"
            type="button"
          >
            {!isMultiple ? (
              <>
                <span>Multiple payer</span>
                <Users />
              </>
            ) : (
              <>
                <span>Single payer</span>
                <User />
              </>
            )}
          </button>
        </ScrollArea>
      </div>
    </SelectDialog>
  );
};

export default PaidDialog;
