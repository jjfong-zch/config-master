import { useState, useCallback } from "react";
import { MenuSection } from "../types/menu";
import { arrayMove } from "@dnd-kit/sortable";

export function useMenuConfiguration(initialData: MenuSection) {
  const [menuData, setMenuData] = useState<MenuSection>(initialData);
  const [activeLanguage, setActiveLanguage] = useState<string>(
    Object.keys(initialData)[0]
  );
  const [activeSection, setActiveSection] = useState<string>("web");

  const handleListReorder = (
    listKey: string,
    category: string | null,
    oldIndex: number,
    newIndex: number
  ) => {
    setMenuData((prev) => {
      const newData = { ...prev };
      const currentSection = newData[activeLanguage][activeSection];

      if (activeSection === "mobile-sidemenu") {
        const section = listKey as "beforeLogin" | "afterLogin";
        currentSection[section].ordering = arrayMove(
          currentSection[section].ordering,
          oldIndex,
          newIndex
        );
      } else if (listKey === "main-menu") {
        currentSection.menu.ordering = arrayMove(
          currentSection.menu.ordering,
          oldIndex,
          newIndex
        );
      } else if (category) {
        const submenu = currentSection.submenu[category] as SubMenuConfig;
        submenu.ordering = arrayMove(submenu.ordering, oldIndex, newIndex);
      }

      return newData;
    });
  };

  const saveMenuConfiguration = (menuData: any) => {
    const menuToSave = JSON.parse(JSON.stringify(menuData));

    if (menuToSave.web?.subCategory) {
      Object.keys(menuToSave.web.subCategory).forEach((category) => {
        const items = menuToSave.web.subCategory[category];

        const itemsArray = Object.entries(items).map(([key, value]) => ({
          key,
          ...value,
        }));

        itemsArray.sort((a, b) => (a.id || 0) - (b.id || 0));

        itemsArray.forEach((item, index) => {
          item.id = index + 1;
        });

        menuToSave.web.subCategory[category] = itemsArray.reduce(
          (acc, item) => {
            const { key, ...value } = item;
            acc[key] = value;
            return acc;
          },
          {}
        );
      });
    }

    if (menuToSave.mobile?.subCategory) {
      Object.keys(menuToSave.mobile.subCategory).forEach((category) => {
        const items = menuToSave.mobile.subCategory[category];

        const itemsArray = Object.entries(items).map(([key, value]) => ({
          key,
          ...value,
        }));

        itemsArray.sort((a, b) => (a.id || 0) - (b.id || 0));

        itemsArray.forEach((item, index) => {
          item.id = index + 1;
        });

        menuToSave.mobile.subCategory[category] = itemsArray.reduce(
          (acc, item) => {
            const { key, ...value } = item;
            acc[key] = value;
            return acc;
          },
          {}
        );
      });
    }

    try {
      const fs = require("fs");
      fs.writeFileSync("menu2.json", JSON.stringify(menuToSave, null, 2));
      console.log("Menu configuration saved successfully");
    } catch (error) {
      console.error("Error saving menu configuration:", error);
    }
  };

  const handleSave = useCallback(() => {
    const currentMenu = store.getState().menu.data;
    saveMenuConfiguration(currentMenu);
  }, []);

  return {
    menuData,
    activeLanguage,
    activeSection,
    setActiveLanguage,
    setActiveSection,
    handleListReorder,
    handleSave,
  };
}
