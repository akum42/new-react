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
        {(value.director !== undefined && value.director !== null) && (
          <Input
            value={value.director}
            onChange={e => onUpdate(value, { ...value, director: e.target.value })}
            placeholder={'Director'}
          />)}
        {(value.partner !== undefined && value.partner !== null) && (
          <Input
            value={value.partner}
            onChange={e => onUpdate(value, { ...value, partner: e.target.value })}
            placeholder={'Partner'}
          />)}
        {(value.shareholder !== undefined && value.shareholder !== null) && (
          <Input
            value={value.shareholder}
            onChange={e => onUpdate(value, { ...value, shareholder: e.target.value })}
            placeholder={'Shareholder'}
          />)}
        {(value.propreitor !== undefined && value.propreitor !== null) && (
          <Input
            value={value.propreitor}
            onChange={e => onUpdate(value, { ...value, propreitor: e.target.value })}
            placeholder={'Propreitor'}
          />)}
        {(value.member !== undefined && value.member !== null) && (
          <Input
            value={value.member}
            onChange={e => onUpdate(value, { ...value, member: e.target.value })}
            placeholder={'member'}
          />)}
        {(value.din !== undefined && value.din !== null) && (
          <Input
            value={value.din}
            onChange={e => onUpdate(value, { ...value, din: e.target.value })}
            placeholder={'DIN'}
          />)}
        {(value.shareNumber !== undefined && value.shareNumber !== null) && (
          <Input
            type="number"
            value={value.shareNumber}
            onChange={e => onUpdate(value, { ...value, shareNumber: e.target.value })}
            placeholder={'Num of Shares'}
          />)}
        {(value.percentage !== undefined && value.percentage !== null) && (
          <Input
            value={value.percentage}
            onChange={e => onUpdate(value, { ...value, percentage: e.target.value })}
            placeholder={"%"}
          />)}
        {(value.email !== undefined && value.email !== null) && (
          <Input
            type="email"
            value={value.email}
            onChange={e => onUpdate(value, { ...value, email: e.target.value })}
            placeholder={'Email'}
          />)}
        {(value.phone !== undefined && value.phone !== null) && (
          <Input
            type="tel"
            value={value.phone}
            onChange={e => onUpdate(value, { ...value, phone: e.target.value })}
            placeholder={'Phone'}
          />)}
        {(value.address !== undefined && value.address !== null) && (
          <Input
            value={value.address}
            onChange={e => onUpdate(value, { ...value, address: e.target.value })}
            placeholder={'Address'}
          />)}
        {(value.pan !== undefined && value.pan !== null) && (
          <Input
            value={value.pan}
            onChange={e => onUpdate(value, { ...value, pan: e.target.value })}
            placeholder={'PAN'}
          />)}
        <Button type="button" variant="ghost" size="sm" onClick={() => onRemove(value)} className="h-6 w-6 p-0 mt-1">
          <X className="h-4 w-4" />
        </Button>
      </div>
    ))}
  </div>
);
