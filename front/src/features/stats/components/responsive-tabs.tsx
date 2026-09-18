"use client";

import { ReactNode, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ResponsiveTabItem {
  value: string;
  trigger: ReactNode;
  label: string;
  content: ReactNode;
}

interface ResponsiveTabsProps {
  items: ResponsiveTabItem[];
  defaultValue: string;
  className?: string;
}

export function ResponsiveTabs({
  items,
  defaultValue,
  className,
}: ResponsiveTabsProps) {
  const [value, setValue] = useState(defaultValue);

  return (
    <Tabs
      value={value}
      onValueChange={setValue}
      className={className ?? "w-full border rounded-lg gap-0"}
    >
      <div className="mx-2 my-4 sm:hidden">
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <TabsList className="w-fit mx-2 my-4 p-2 hidden sm:inline-flex">
        {items.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            className="flex items-center gap-2 cursor-pointer w-fit"
          >
            {item.trigger}
          </TabsTrigger>
        ))}
      </TabsList>

      {items.map((item) => (
        <TabsContent
          key={item.value}
          value={item.value}
          forceMount
          className="data-[state=inactive]:hidden p-2"
        >
          {item.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
