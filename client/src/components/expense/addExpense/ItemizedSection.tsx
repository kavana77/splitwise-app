import { useMemo } from "react";
import Text from "@/components/ui/text";
import type { ItemRow } from "@/types/type";
import type { UseFormSetValue } from "react-hook-form";
import type { AddExpenseBody } from "@/types/type";
import type { Member } from "@/types/type";

interface ItemizedSectionProps {
  members: Member[];
  itemsState: ItemRow[];
  setItemsState: React.Dispatch<React.SetStateAction<ItemRow[]>>;
  gst: number;
  setGst: (v: number) => void;
  tip: number;
  setTip: (v: number) => void;
  setValue: UseFormSetValue<AddExpenseBody>;
  setSelectType: (v: boolean) => void;
}

const ItemizedSection = ({
  members,
  itemsState,
  setItemsState,
  gst,
  setGst,
  tip,
  setTip,
  setValue,
  setSelectType,
}: ItemizedSectionProps) => {
  function cryptoRandomId() {
    return Math.random().toString(36).slice(2, 9);
  }

  const updateItem = (id: string, changes: Partial<ItemRow>) => {
    setItemsState((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...changes } : r))
    );
  };

  const removeItemRow = (id: string) => {
    setItemsState((prev) => prev.filter((r) => r.id !== id));
  };

  const addItemRow = () => {
    setItemsState((prev) => [
      ...prev,
      {
        id: cryptoRandomId(),
        description: "",
        amount: 0,
        included: members.reduce((acc, m) => ({ ...acc, [m.uid]: true }), {}),
      },
    ]);
  };
  const subtotal = useMemo(
    () => itemsState.reduce((sum, it) => sum + (Number(it.amount) || 0), 0),
    [itemsState]
  );

  const gstAmount = useMemo(
    () => (subtotal * (Number(gst) || 0)) / 100,
    [subtotal, gst]
  );
  const tipAmount = useMemo(
    () => (subtotal * (Number(tip) || 0)) / 100,
    [subtotal, tip]
  );
  const grandTotal = useMemo(
    () => subtotal + gstAmount + tipAmount,
    [subtotal, gstAmount, tipAmount]
  );

  const perUserSplit = useMemo(() => {
    const totals: Record<string, number> = members.reduce(
      (a, m) => ({ ...a, [m.uid]: 0 }),
      {}
    );
    itemsState.forEach((item) => {
      const included = Object.keys(item.included).filter(
        (uid) => item.included[uid]
      );
      if (!included.length) return;
      const per = (Number(item.amount) || 0) / included.length;
      included.forEach((uid) => (totals[uid] += per));
    });
    const gstShare = gstAmount / members.length;
    const tipShare = tipAmount / members.length;
    members.forEach(
      (m) =>
        (totals[m.uid] = Number(
          (totals[m.uid] + gstShare + tipShare).toFixed(2)
        ))
    );
    return totals;
  }, [itemsState, gstAmount, tipAmount, members]);

  return (
    <div className="space-y-2">
      <Text variant="muted">
        Itemized split: configure each item and who shares it
      </Text>

      {/* Items List */}
      <div className="max-h-64 overflow-auto border border-gray-300 rounded-md p-4 mt-2">
        {itemsState.map((it) => (
          <div key={it.id} className="p-2 border rounded mb-2">
            <div className="flex gap-2 items-center">
              <input
                placeholder="Item description"
                value={it.description}
                onChange={(e) =>
                  updateItem(it.id, { description: e.target.value })
                }
                className="flex-1 border px-2 py-1 rounded"
              />
              <input
                placeholder="0.00"
                type="number"
                value={it.amount}
                onChange={(e) =>
                  updateItem(it.id, { amount: Number(e.target.value) || 0 })
                }
                className="w-28 border px-2 py-1 rounded"
              />
              <button
                type="button"
                className="px-2 py-1 bg-red-500 text-white rounded"
                onClick={() => removeItemRow(it.id)}
              >
                Remove
              </button>
            </div>

            <div className="mt-2 grid grid-cols-3 gap-2">
              {members.map((m) => (
                <label key={m.uid} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={it.included[m.uid]}
                    onChange={(e) =>
                      updateItem(it.id, {
                        included: { ...it.included, [m.uid]: e.target.checked },
                      })
                    }
                  />
                  <span>{m.name}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add item and GST/Tip */}
      <div className="flex gap-2 mt-2">
        <button
          type="button"
          className="px-3 py-1 border rounded"
          onClick={addItemRow}
        >
          + Add Item
        </button>

        <div className="flex items-center gap-2 ml-auto">
          <label className="text-sm">GST %</label>
          <input
            value={gst}
            onChange={(e) => setGst(Number(e.target.value) || 0)}
            className="w-20 border px-2 py-1 rounded"
          />
          <label className="text-sm">Tip %</label>
          <input
            value={tip}
            onChange={(e) => setTip(Number(e.target.value) || 0)}
            className="w-20 border px-2 py-1 rounded"
          />
        </div>
      </div>

      {/* Totals */}
      <div className="mt-2 space-y-1">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal:</span> {subtotal.toFixed(2)}
        </div>
        <div className="flex justify-between">
          <span>GST ({gst}%): </span>
          {gstAmount.toFixed(2)}
        </div>
        <div className="flex justify-between">
          <span>Tip ({tip}%): </span>
          {tipAmount.toFixed(2)}
        </div>
        <div className="flex justify-between font-semibold text-green-600 text-lg">
          <span>Grand Total: </span>
          {grandTotal.toFixed(2)}
        </div>
      </div>

      {/* Per-Person Preview */}
      <div className="mt-3">
        <p className="font-semibold text-sm">Per person (preview):</p>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {members.map((m) => (
            <div key={m.uid} className="flex justify-between text-sm">
              <span>{m.name}</span>
              <span>{(perUserSplit[m.uid] || 0).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end mt-3">
        <button
          type="button"
          className="px-4 py-1 bg-emerald-500 text-white rounded-lg"
          onClick={() => {
            setValue("splitDetails", {});
            setSelectType(false);
          }}
        >
          Save itemized
        </button>
      </div>
    </div>
  );
};

export default ItemizedSection;
