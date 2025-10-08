import { Button } from "./button";
import { Input } from "./input";
import { X, Plus } from "lucide-react";
import { Label } from "./label";
import React from "react";
import { Person } from "@/types/models";

interface ArrayFieldsInputProps {
  label: string;
  values: Person[];
  onAdd: () => void;
  onUpdate: (oldValue: Person, newValue: Person) => void;
  onRemove: (value: Person) => void;
  placeholder?: string[];
  itemLabelPrefix?: string;
}

export const ArrayFieldsInput: React.FC<ArrayFieldsInputProps> = ({
  label,
  values,
  onAdd,
  onUpdate,
  onRemove,
  placeholder,
  itemLabelPrefix,
}) => (
  <div className="space-y-2">
    <div className="flex items-center">
      <Label>{label}</Label>
      <Button type="button" variant="ghost" size="sm" onClick={onAdd} className="h-6 w-6 p-0">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
    {values.map((value, index) => (
      <div className="flex items-center gap-2" key={index}>
        {itemLabelPrefix && (
          <span className="text-sm font-medium">{itemLabelPrefix} {index + 1}</span>
        )}
        {value.Director !== undefined && (
          <Input
            value={value.Director}
            onChange={e => onUpdate(value, { ...value, Director: e.target.value })}
            placeholder={placeholder?.[0]}
          />)}
        {value.Partner !== undefined && (
          <Input
            value={value.Partner}
            onChange={e => onUpdate(value, { ...value, Partner: e.target.value })}
            placeholder={placeholder?.[0]}
          />)}
        {value.Shareholder !== undefined && (
          <Input
            value={value.Shareholder}
            onChange={e => onUpdate(value, { ...value, Shareholder: e.target.value })}
            placeholder={placeholder?.[0]}
          />)}
        {value.DIN !== undefined && (
          <Input
            value={value.DIN}
            onChange={e => onUpdate(value, { ...value, DIN: e.target.value })}
            placeholder={placeholder?.[1]}
          />)}
        {value.ShareNumber !== undefined && (
          <Input
            value={value.ShareNumber}
            onChange={e => onUpdate(value, { ...value, ShareNumber: e.target.value })}
            placeholder={placeholder?.[1]}
          />)}
        {value.Percentage !== undefined && (
          <Input
            value={value.Percentage}
            onChange={e => onUpdate(value, { ...value, Percentage: e.target.value })}
            placeholder={placeholder?.[1]}
          />)}
        {value.email !== undefined && (
          <Input
            value={value.email}
            onChange={e => onUpdate(value, { ...value, email: e.target.value })}
            placeholder={placeholder?.[2]}
          />)}
        {value.phone !== undefined && (
          <Input
            value={value.phone}
            onChange={e => onUpdate(value, { ...value, phone: e.target.value })}
            placeholder={placeholder?.[3]}
          />)}
        {value.address !== undefined && (
          <Input
            value={value.address}
            onChange={e => onUpdate(value, { ...value, address: e.target.value })}
            placeholder={placeholder?.[4]}
          />)}
        {value.PAN !== undefined && (
          <Input
            value={value.PAN}
            onChange={e => onUpdate(value, { ...value, PAN: e.target.value })}
            placeholder={placeholder?.[5]}
          />)}
        <Button type="button" variant="ghost" size="sm" onClick={() => onRemove(value)} className="h-6 w-6 p-0 mt-1">
          <X className="h-4 w-4" />
        </Button>
      </div>
    ))}
  </div>
);
