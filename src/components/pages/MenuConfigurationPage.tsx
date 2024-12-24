import { useEffect, useCallback, useMemo, useState } from "react";
import { MenuLayout } from "../templates/MenuLayout";
import { MenuSection } from "../organisms/MenuSection";
import { Button } from "../atoms/Button";
import { Navbar } from "../organisms/Navbar";
import { Sidebar } from "../organisms/Sidebar";
import { MenuCategories } from "../organisms/MenuCategories";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  initializeMenu,
  setActiveLanguage,
  reorderItems,
  toggleHideItem,
  setReferenceLanguage,
  toggleFlag,
  toggleProvider,
  addProvider,
} from "../../store/menuSlice";
import {
  MenuSection as MenuSectionType,
  WebMobileSection,
  MobileSideMenu,
  SectionType,
} from "../../types/menu";
import { RootState } from "../../store/store";
import { PlusIcon } from "@radix-ui/react-icons";
import { AddProviderModal } from "../molecules/AddProviderModal";

type MenuData = {
  [key: string]: {
    [K in SectionType]: K extends "mobile-sidemenu"
      ? MobileSideMenu
      : WebMobileSection;
  };
};

const isMobileSideMenu = (section: any): section is MobileSideMenu => {
  return (
    section &&
    typeof section === "object" &&
    "beforeLogin" in section &&
    "afterLogin" in section
  );
};

const isWebMobileSection = (section: any): section is WebMobileSection => {
  return (
    section &&
    typeof section === "object" &&
    "menu" in section &&
    "submenu" in section
  );
};

export const MenuConfigurationPage = ({ data }: { data: MenuSectionType }) => {
  const dispatch = useAppDispatch();
  const {
    data: menuData,
    activeLanguage,
    activeSection,
    activeView,
  } = useAppSelector((state: RootState) => state.menu);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    dispatch(initializeMenu(data));
  }, [dispatch, data]);

  const handleListReorder = (
    listKey: string,
    category: string | null,
    oldIndex: number,
    newIndex: number
  ) => {
    dispatch(reorderItems({ listKey, category, oldIndex, newIndex }));
  };

  const handleSave = () => {
    const jsonString = JSON.stringify(menuData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "menu-config.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleToggleHide = (category: string | null, item: string) => {
    dispatch(toggleHideItem({ category, item }));
  };

  const handleLanguageChange = useCallback(
    (newLanguage: string) => {
      if (newLanguage === activeLanguage) return;

      if (newLanguage === "ALL") {
        const firstLanguage = Object.keys(menuData)[0];
        dispatch(setActiveLanguage(firstLanguage));
        dispatch(setReferenceLanguage(firstLanguage));
      } else {
        dispatch(setActiveLanguage(newLanguage));
        dispatch(setReferenceLanguage(newLanguage));
      }
    },
    [activeLanguage, dispatch, menuData]
  );

  const languages = useMemo(() => Object.keys(menuData || {}), [menuData]);

  const handleToggleFlag = (
    category: string,
    flagName: "disableOverrideFromBaseMenu" | "disableBaseMenuHotNewProvider"
  ) => {
    dispatch(toggleFlag({ category, flagName }));
  };

  const handleToggleProvider = (
    category: string,
    item: string,
    providerType: "newProvider" | "hotProvider"
  ) => {
    dispatch(
      toggleProvider({
        category,
        item,
        providerType,
      })
    );
  };

  const handleAddProvider = (data: {
    providerName: string;
    categories: string[];
    languages: string[];
    targetType: "menu" | "submenu";
  }) => {
    dispatch(addProvider(data));
  };

  const renderContent = () => {
    const typedMenuData = menuData as MenuData;
    if (!typedMenuData?.[activeLanguage]) {
      return null;
    }

    const section = typedMenuData[activeLanguage][activeSection as SectionType];
    if (!section) {
      return null;
    }

    if (activeSection === "mobile-sidemenu" && isMobileSideMenu(section)) {
      return (
        <div className="space-y-8">
          <MenuSection
            title="Before Login"
            items={section.beforeLogin.ordering}
            hideList={section.beforeLogin.hideList}
            hasHotNewProvider={false}
            onDragEnd={(oldIndex, newIndex) =>
              handleListReorder("beforeLogin", null, oldIndex, newIndex)
            }
            onToggleHide={(item) => handleToggleHide("beforeLogin", item)}
            onToggleProvider={() => {}}
          />
          <MenuSection
            title="After Login"
            hasHotNewProvider={false}
            items={section.afterLogin.ordering}
            hideList={section.afterLogin.hideList}
            onDragEnd={(oldIndex, newIndex) =>
              handleListReorder("afterLogin", null, oldIndex, newIndex)
            }
            onToggleHide={(item) => handleToggleHide("afterLogin", item)}
            onToggleProvider={() => {}}
          />
        </div>
      );
    }

    if (!isWebMobileSection(section)) {
      return null;
    }

    if (activeView === "main") {
      return (
        <div className="space-y-8 main">
          <MenuSection
            title="Main Menu"
            items={section.menu.ordering}
            hideList={section.menu.hideList}
            hasHotNewProvider={false}
            onDragEnd={(oldIndex, newIndex) =>
              handleListReorder("main-menu", null, oldIndex, newIndex)
            }
            onToggleHide={(item) => handleToggleHide(null, item)}
            onToggleProvider={() => {}}
          />
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Sub Menus</h2>
          <MenuCategories
            categories={section.submenu}
            onDragEnd={(category, oldIndex, newIndex) =>
              handleListReorder("submenu", category, oldIndex, newIndex)
            }
            hasHotNewProvider={true}
            onToggleHide={(category, item) => handleToggleHide(category, item)}
            onToggleFlag={handleToggleFlag}
            onToggleProvider={(category, item, providerType) =>
              handleToggleProvider(category, item, providerType)
            }
          />
        </div>
      </div>
    );
  };

  const getCurrentSectionItemCount = () => {
    const typedMenuData = menuData as MenuData;
    if (!typedMenuData?.[activeLanguage]) {
      return 0;
    }

    const section = typedMenuData[activeLanguage][activeSection as SectionType];
    if (!section) {
      return 0;
    }

    if (activeSection === "mobile-sidemenu" && isMobileSideMenu(section)) {
      return (
        section.beforeLogin.ordering.length + section.afterLogin.ordering.length
      );
    }

    if (!isWebMobileSection(section)) {
      return 0;
    }

    if (activeView === "main") {
      return section.menu.ordering.length;
    }

    return Object.values(section.submenu).reduce(
      (total: number, submenu) => total + submenu.ordering.length,
      0
    );
  };

  const getCurrentSection = () => {
    const typedMenuData = menuData as MenuData;
    if (!typedMenuData?.[activeLanguage]) {
      return null;
    }

    const section = typedMenuData[activeLanguage][activeSection as SectionType];
    if (!section || !isWebMobileSection(section)) {
      return null;
    }

    return section;
  };

  if (!menuData || !menuData[activeLanguage]) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <MenuLayout
      header={<Navbar btnFn={handleSave} />}
      sidebar={
        <Sidebar
          languages={languages}
          onLanguageChange={handleLanguageChange}
        />
      }
      currentSection={{
        language: activeLanguage,
        section: activeSection,
        view: activeSection !== "mobile-sidemenu" ? activeView : undefined,
        itemCount: getCurrentSectionItemCount(),
      }}
    >
      {renderContent()}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed right-8 bottom-8 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <PlusIcon className="w-6 h-6" />
      </button>

      <AddProviderModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddProvider}
        availableCategories={
          getCurrentSection()?.submenu
            ? Object.keys(getCurrentSection()!.submenu)
            : []
        }
        availableLanguages={languages}
      />
    </MenuLayout>
  );
};
