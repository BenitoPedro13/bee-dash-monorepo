import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useDataStore, { DashbordDateRange } from "@/store";
import { CalendarDays } from "lucide-react";

export function SelectComponent() {
  const setDateRange = useDataStore((store) => store.setDateRange);

  return (
    <Select onValueChange={(value: DashbordDateRange) => setDateRange(value)}>
      <SelectTrigger
        className="w-[140px] text-black"
        defaultValue={DashbordDateRange.ZERO}
        defaultChecked
        // disabled
      >
        <SelectValue
          className="text-black"
          defaultValue={DashbordDateRange.ZERO}
          defaultChecked
          placeholder={
            <div className="flex items-center gap-2">
              <CalendarDays width={16} />
              Total
            </div>
          }
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Período</SelectLabel>
          <SelectItem value={DashbordDateRange.ZERO}>
            <div className="flex items-center gap-2">
              <CalendarDays width={16} />
              Total
            </div>
          </SelectItem>
          <SelectItem value={DashbordDateRange.SEVEN}>
            <div className="flex items-center gap-2">
              <CalendarDays width={16} />7 Dias
            </div>
          </SelectItem>
          <SelectItem value={DashbordDateRange.FOURTEEN}>
            <div className="flex items-center gap-2">
              <CalendarDays width={16} />2 Semanas
            </div>
          </SelectItem>
          <SelectItem value={DashbordDateRange.THIRTY}>
            <div className="flex items-center gap-2">
              <CalendarDays width={16} />1 Mes
            </div>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
