import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { X, Plus } from "lucide-react";
import { Label } from "../ui/label";
import React from "react";

interface ArrayFieldInputProps {
  label: string;
  values: string[];
  onAdd: () => void;
  onUpdate: (oldValue: string, newValue: string) => void;
  onRemove: (value: string) => void;
  placeholder?: string;
  itemLabelPrefix?: string;
}

export const ArrayFieldInput: React.FC<ArrayFieldInputProps> = ({
  label,
  values,
  onAdd,
  onUpdate,
  onRemove,
  placeholder,
  itemLabelPrefix,
}) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <Label>{label}</Label>
      <Button type="button" variant="ghost" size="sm" onClick={onAdd} className="h-6 w-6 p-0">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
    {values.map((value, index) => (
      <div className="flex items-center" key={index}>
        {itemLabelPrefix && (
          <span className="text-sm font-medium">{itemLabelPrefix}{index + 1}</span>
        )}
        <Input
          value={value}
          onChange={e => onUpdate(value, e.target.value)}
          placeholder={placeholder}
        />
        <Button type="button" variant="ghost" size="sm" onClick={() => onRemove(value)} className="h-6 w-6 p-0 mt-1">
          <X className="h-4 w-4" />
        </Button>
      </div>
    ))}
  </div>
);
