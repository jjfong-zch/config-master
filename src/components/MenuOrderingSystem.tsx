import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import * as Accordion from "@radix-ui/react-accordion";
import * as Collapsible from "@radix-ui/react-collapsible";
import * as Tabs from "@radix-ui/react-tabs";
import { ChevronDownIcon, DragHandleDots2Icon } from "@radix-ui/react-icons";
import { useMenuConfiguration } from "../hooks/useMenuConfiguration";

interface BaseMenuConfig {
  hideList: string[];
  ordering: string[];
}

interface SubMenuConfig extends BaseMenuConfig {
  newProvider?: string[];
  hotProvider?: string[];
}

interface WebMobileSection {
  menu: BaseMenuConfig;
  submenu: {
    [key: string]: SubMenuConfig | { ordering: string[] };
  };
}

interface MobileSideMenu {
  beforeLogin: BaseMenuConfig;
  afterLogin: BaseMenuConfig;
}

interface AffiliateSection {
  menu: BaseMenuConfig;
}

interface LanguageSection {
  web: WebMobileSection;
  mobile: WebMobileSection;
  "mobile-sidemenu": MobileSideMenu;
  affiliate: AffiliateSection;
}

interface MenuSection {
  [key: string]: LanguageSection;
}

interface TabButtonProps extends React.ComponentProps<typeof Tabs.Trigger> {
  children: React.ReactNode;
  isActive?: boolean;
}

const TabButton = ({ children, isActive, ...props }: TabButtonProps) => (
  <Tabs.Trigger
    className={`px-4 py-2 rounded-full text-sm font-medium 
      ${
        isActive
          ? "bg-blue-500 text-white shadow-sm"
          : "text-gray-600 hover:bg-gray-100"
      } 
      transition-all duration-200`}
    {...props}
  >
    {children}
  </Tabs.Trigger>
);

// Update the Card component to accept maxHeight prop
const Card = ({
  children,
  className = "",
  maxHeight,
}: {
  children: React.ReactNode;
  className?: string;
  maxHeight?: string;
}) => (
  <div
    className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}
    style={maxHeight ? { maxHeight } : undefined}
  >
    {children}
  </div>
);

const SideNavItem = ({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium
      ${
        isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
      } transition-all duration-200`}
  >
    {label}
  </button>
);

const MenuOrderingSystem = () => {
  const { handleSave } = useMenuConfiguration();

  return (
    <div>
      {/* ... existing menu ordering UI ... */}
      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Save Configuration
      </button>
    </div>
  );
};

export default MenuOrderingSystem;
