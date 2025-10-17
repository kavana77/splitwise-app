import SelectDialog from "@/components/SelectDialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const currencyList = [
  { code: "USD", label: "$" },
  { code: "INR", label: "₹" },
  { code: "EUR", label: "€" },
  { code: "GBP", label: "£" },
  { code: "JPY", label: "¥" },
  { code: "AUD", label: "A$" },
  { code: "CAD", label: "C$" },
  { code: "CHF", label: "Fr" },
  { code: "CNY", label: "¥" },
  { code: "SEK", label: "kr" },
  { code: "NZD", label: "NZ$" },
  { code: "MXN", label: "$" },
  { code: "SGD", label: "S$" },
  { code: "HKD", label: "HK$" },
  { code: "NOK", label: "kr" },
  { code: "KRW", label: "₩" },
  { code: "TRY", label: "₺" },
  { code: "RUB", label: "₽" },
  { code: "BRL", label: "R$" },
  { code: "ZAR", label: "R" },
  { code: "DKK", label: "kr" },
  { code: "PLN", label: "zł" },
  { code: "TWD", label: "NT$" },
  { code: "THB", label: "฿" },
  { code: "MYR", label: "RM" },
  { code: "IDR", label: "Rp" },
  { code: "CZK", label: "Kč" },
  { code: "HUF", label: "Ft" },
  { code: "ILS", label: "₪" },
  { code: "PHP", label: "₱" },
];
interface CurrencyDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (currency: { code: string; label: string }) => void;
}
const CurrencyDialog = ({
  isOpen,
  onSelect,
  onOpenChange,
}: CurrencyDialogProps) => {
  return (
    <SelectDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Choose a currency"
    >
      <ScrollArea className="h-40">
        {currencyList.map((currency, idx) => (
          <div
            key={idx}
            className="border-b-2 mx-[-25px] text-center cursor-pointer hover:bg-gray-200"
            onClick={() => {
              onSelect(currency);
              onOpenChange(false);
            }}
          >
            {currency.code}
          </div>
        ))}
      </ScrollArea>
    </SelectDialog>
  );
};

export default CurrencyDialog;
