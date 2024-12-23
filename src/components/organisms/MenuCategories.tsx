import React, { useRef, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { MenuSection } from "./MenuSection";
import { SubMenuConfig } from "../../types/menu";
import { getCategoryLabel } from "../../constants/categoryMappings";

interface MenuCategoriesProps {
  categories: {
    [key: string]: SubMenuConfig | { ordering: string[] };
  };
  onDragEnd: (category: string, oldIndex: number, newIndex: number) => void;
  onToggleHide: (category: string, item: string) => void;
  onToggleFlag: (
    category: string,
    flagName: "disableOverrideFromBaseMenu" | "disableBaseMenuHotNewProvider"
  ) => void;
  onToggleProvider: (
    category: string,
    item: string,
    providerType: "newProvider" | "hotProvider"
  ) => void;
}

export const MenuCategories = ({
  categories,
  onDragEnd,
  onToggleHide,
  onToggleFlag,
  onToggleProvider,
}: MenuCategoriesProps) => {
  const allCategories = Object.keys(categories);
  const defaultCategory = allCategories[0];
  const tabsRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const dragStartPos = useRef<{ x: number; y: number; time: number } | null>(
    null
  );
  const clickPrevented = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!tabsRef.current) return;
    dragStartPos.current = {
      x: e.pageX,
      y: e.pageY,
      time: Date.now(),
    };
    setStartX(e.pageX - tabsRef.current.offsetLeft);
    setScrollLeft(tabsRef.current.scrollLeft);
    clickPrevented.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!tabsRef.current || !dragStartPos.current) return;

    const deltaX = Math.abs(e.pageX - dragStartPos.current.x);
    const deltaY = Math.abs(e.pageY - dragStartPos.current.y);
    const dragThreshold = 5; // pixels to move before considering it a drag

    if (deltaX > dragThreshold || deltaY > dragThreshold) {
      setIsDragging(true);
      clickPrevented.current = true;
      const x = e.pageX - tabsRef.current.offsetLeft;
      const walk = (x - startX) * 2;
      tabsRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!dragStartPos.current) return;

    const dragTime = Date.now() - dragStartPos.current.time;
    const deltaX = Math.abs(e.pageX - dragStartPos.current.x);
    const deltaY = Math.abs(e.pageY - dragStartPos.current.y);

    // Only trigger click if:
    // 1. Movement was minimal (less than 5px)
    // 2. Duration was short (less than 200ms)
    // 3. Click wasn't prevented by drag
    if (deltaX < 5 && deltaY < 5 && dragTime < 200 && !clickPrevented.current) {
      const tabTrigger = e.target as HTMLElement;
      if (tabTrigger.getAttribute("role") === "tab") {
        tabTrigger.click();
      }
    }

    setIsDragging(false);
    dragStartPos.current = null;
    // Reset click prevention after a short delay
    setTimeout(() => {
      clickPrevented.current = false;
    }, 50);
  };

  const handleTabClick = (e: React.MouseEvent) => {
    // Prevent click if we were dragging
    if (clickPrevented.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <Tabs.Root defaultValue={defaultCategory} className="flex flex-col">
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div
          ref={tabsRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            setIsDragging(false);
            dragStartPos.current = null;
          }}
          className="overflow-x-auto scrollbar-hide relative"
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
          <Tabs.List className="flex gap-2 mb-6 border-b border-gray-200 min-w-max px-4">
            {allCategories.map((category) => (
              <Tabs.Trigger
                key={category}
                value={category}
                onClick={handleTabClick}
                className={`px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900
                  data-[state=active]:text-blue-600 data-[state=active]:border-b-2 
                  data-[state=active]:border-blue-600 flex items-center gap-2
                  whitespace-nowrap select-none transition-all duration-200
                  ${isDragging ? "pointer-events-none" : ""}`}
              >
                {getCategoryLabel(category)}
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  {(categories[category] as SubMenuConfig).ordering.length}
                </span>
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </div>
      </div>
      {allCategories.map((category) => (
        <Tabs.Content key={category} value={category} className="space-y-4">
          <div className="mb-4 flex flex-col gap-2 p-4 rounded-lg bg-blue-50 text-blue-700">
            <p>Force follow settings here:</p>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={
                  (categories[category] as SubMenuConfig)
                    .disableOverrideFromBaseMenu || false
                }
                onChange={() =>
                  onToggleFlag(category, "disableOverrideFromBaseMenu")
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Menu sequence
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={
                  (categories[category] as SubMenuConfig)
                    .disableBaseMenuHotNewProvider || false
                }
                onChange={() =>
                  onToggleFlag(category, "disableBaseMenuHotNewProvider")
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Hot New Provider
            </label>
          </div>
          <MenuSection
            title={getCategoryLabel(category)}
            items={(categories[category] as SubMenuConfig).ordering}
            hideList={(categories[category] as SubMenuConfig).hideList || []}
            hotProvider={(categories[category] as SubMenuConfig).hotProvider}
            newProvider={(categories[category] as SubMenuConfig).newProvider}
            onDragEnd={(oldIndex, newIndex) =>
              onDragEnd(category, oldIndex, newIndex)
            }
            onToggleHide={(item) => onToggleHide(category, item)}
            onToggleProvider={(item, providerType) =>
              onToggleProvider(category, item, providerType)
            }
          />
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
};
