import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface SelectDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onSave?: () => void;
  children: React.ReactNode;
  saveLabel?: string;
  showFooter?: boolean;
}

const SelectDialog = ({
  isOpen,
  onOpenChange,
  title,
  children,
}: SelectDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="bg-emerald-400 mt-[-25px] mx-[-25px] py-3 px-2 text-white">
            {title}
          </DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default SelectDialog;
