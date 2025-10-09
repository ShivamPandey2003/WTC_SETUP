"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (val: string) => void;
  className?: string;
  children: React.ReactNode;
}

interface TabsChildProps {
  activeTab?: string;
  onTabChange?: (val: string) => void;
}

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (val: string) => void;
}

interface TabsTriggerProps {
  value: string;
  className?: string;
  activeTab?: string;
  onTabChange?: (val: string) => void;
  children: React.ReactNode;
}

interface TabsContentProps {
  value: string;
  className?: string;
  activeTab?: string;
  children: React.ReactNode;
}

const Tabs = ({
  value,
  defaultValue,
  onValueChange,
  className,
  children,
}: TabsProps) => {
  const [activeTab, setActiveTab] = React.useState(value ?? defaultValue ?? "");

  React.useEffect(() => {
    if (value !== undefined) setActiveTab(value);
  }, [value]);

  const handleChange = (val: string) => {
    if (value === undefined) setActiveTab(val);
    onValueChange?.(val);
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<TabsChildProps>,
              { activeTab, onTabChange: handleChange }
            )
          : child
      )}
    </div>
  );
};

const TabsList = ({
  className,
  children,
  activeTab,
  onTabChange,
}: TabsListProps) => {
  return (
    <div
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-full sm:w-fit items-center justify-center rounded-lg p-[3px] overflow-x-auto pl-[200px] xxs:pl-[140px] xs:pl-[0]",
        className
      )}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<TabsChildProps>,
              { activeTab, onTabChange }
            )
          : child
      )}
    </div>
  );
};

const TabsTrigger = ({
  value,
  className,
  activeTab,
  onTabChange,
  children,
}: TabsTriggerProps) => {
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => onTabChange?.(value)}
      className={cn(
        "inline-flex h-[calc(100%-1px)] items-center justify-center rounded-md border border-transparent px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none",
        isActive
          ? "bg-primary text-white shadow-sm"
          : "text-text hover:bg-muted/50",
        className
      )}
    >
      {children}
    </button>
  );
};

const TabsContent = ({
  value,
  activeTab,
  className,
  children,
}: TabsContentProps) => {
  if (activeTab !== value) return null;

  return (
    <div className={cn("flex-1 outline-none", className)}>{children}</div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
