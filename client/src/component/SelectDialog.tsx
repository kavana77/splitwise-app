import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";

interface SelectDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onSave?: () => void;
  children: React.ReactNode;
  saveLabel?: string; 
  showFooter?: boolean; // Optionally hide footer
}

const SelectDialog = ({
  isOpen,
  onOpenChange,
  title,
  onSave,
  children,
  saveLabel ,
  showFooter,
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

        {showFooter && (
          <DialogFooter>
            <button
              className="bg-emerald-500 text-white py-2 px-3 rounded-sm"
              onClick={onSave}
            >
              {saveLabel}
            </button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SelectDialog;
