import React, { useEffect } from "react";
import { MenuLayout } from "../templates/MenuLayout";
import { MenuSection } from "../organisms/MenuSection";
import { Button } from "../atoms/Button";
import { SideNavItem } from "../molecules/SideNavItem";
import { MenuCategories } from "../organisms/MenuCategories";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  initializeMenu,
  setActiveLanguage,
  setActiveSection,
  setActiveView,
  reorderItems,
  toggleHideItem,
} from "../../store/menuSlice";
import { MenuSection as MenuSectionType } from "../../types/menu";
import { LanguageSelect } from "../molecules/LanguageSelect";

export const MenuConfigurationPage = ({ data }: { data: MenuSectionType }) => {
  const dispatch = useAppDispatch();
  const {
    data: menuData,
    activeLanguage,
    activeSection,
    activeView,
  } = useAppSelector((state) => state.menu);

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

  const handleLanguageChange = (newLanguage: string) => {
    dispatch(setActiveLanguage(newLanguage));
  };

  const renderHeader = () => (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Menu Setting Configuration
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              <div className="inline-block bg-blue-50 text-blue-700 rounded-full px-2 py-1 text-xs font-medium">
                Reorder
              </div>
              <div className="inline-block bg-blue-50 text-blue-700 rounded-full px-2 py-1 text-xs font-medium">
                Hide
              </div>
              <div className="inline-block bg-blue-50 text-blue-700 rounded-full px-2 py-1 text-xs font-medium">
                Show
              </div>
              Menu Items at your fingertips
            </p>
          </div>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );

  const SECTION_GROUPS = {
    web: {
      label: "Web",
      types: {
        main: "Main Menu",
        submenu: "Sub Menus",
      },
    },
    mobile: {
      label: "Mobile",
      types: {
        main: "Main Menu",
        submenu: "Sub Menus",
      },
    },
    "mobile-sidemenu": {
      label: "Mobile Sidemenu",
      types: null, // No menu types for mobile-sidemenu
    },
    affiliate: {
      label: "Affiliate",
      types: {
        main: "Main Menu",
        submenu: "Sub Menus",
      },
    },
  } as const;

  const renderSidebar = () => (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Region & Language
        </h3>
        <LanguageSelect
          languages={Object.keys(menuData)}
          value={activeLanguage}
          onChange={handleLanguageChange}
        />
      </div>

      {/* Menu Sections */}
      <div className="flex-1 overflow-hidden">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Menu Sections
        </h3>
        <div className="space-y-4 overflow-y-auto pr-2 scrollbar-hide">
          {Object.entries(SECTION_GROUPS).map(
            ([sectionKey, { label, types }]) => (
              <div key={sectionKey} className="space-y-1">
                {/* Section Header */}
                <div className="px-2 py-1">
                  <span className="text-sm font-medium text-gray-900">
                    {label}
                  </span>
                </div>

                {/* Menu Types or Single Section */}
                {types ? (
                  // For sections with menu types
                  Object.entries(types).map(([typeKey, typeLabel]) => (
                    <SideNavItem
                      key={`${sectionKey}-${typeKey}`}
                      label={typeLabel}
                      isActive={
                        activeSection === sectionKey && activeView === typeKey
                      }
                      onClick={() => {
                        dispatch(setActiveSection(sectionKey));
                        dispatch(setActiveView(typeKey as "main" | "submenu"));
                      }}
                    />
                  ))
                ) : (
                  // For sections without menu types (like mobile-sidemenu)
                  <SideNavItem
                    label="Menu Items"
                    isActive={activeSection === sectionKey}
                    onClick={() => dispatch(setActiveSection(sectionKey))}
                  />
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (activeSection === "mobile-sidemenu") {
      return (
        <div className="space-y-8">
          <MenuSection
            title="Before Login Menu"
            items={menuData[activeLanguage][activeSection].beforeLogin.ordering}
            hideList={
              menuData[activeLanguage][activeSection].beforeLogin.hideList
            }
            onDragEnd={(oldIndex, newIndex) =>
              handleListReorder("beforeLogin", null, oldIndex, newIndex)
            }
            onToggleHide={(item) => handleToggleHide("beforeLogin", item)}
          />
          <MenuSection
            title="After Login Menu"
            items={menuData[activeLanguage][activeSection].afterLogin.ordering}
            hideList={
              menuData[activeLanguage][activeSection].afterLogin.hideList
            }
            onDragEnd={(oldIndex, newIndex) =>
              handleListReorder("afterLogin", null, oldIndex, newIndex)
            }
            onToggleHide={(item) => handleToggleHide("afterLogin", item)}
          />
        </div>
      );
    }

    if (activeView === "main") {
      return (
        <div className="space-y-8">
          <MenuSection
            title="Main Menu"
            items={menuData[activeLanguage][activeSection].menu.ordering}
            hideList={menuData[activeLanguage][activeSection].menu.hideList}
            onDragEnd={(oldIndex, newIndex) =>
              handleListReorder("main-menu", null, oldIndex, newIndex)
            }
            onToggleHide={(item) => handleToggleHide(null, item)}
          />
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Sub Menus</h2>
          <MenuCategories
            categories={menuData[activeLanguage][activeSection].submenu}
            onDragEnd={(category, oldIndex, newIndex) =>
              handleListReorder("submenu", category, oldIndex, newIndex)
            }
            onToggleHide={(category, item) => handleToggleHide(category, item)}
          />
        </div>
      </div>
    );
  };

  const getCurrentSectionItemCount = () => {
    if (
      !menuData ||
      !menuData[activeLanguage] ||
      !menuData[activeLanguage][activeSection]
    ) {
      return 0;
    }

    const currentSection = menuData[activeLanguage][activeSection];

    if (activeSection === "mobile-sidemenu") {
      return (
        currentSection.beforeLogin.ordering.length +
        currentSection.afterLogin.ordering.length
      );
    }

    if (activeView === "main") {
      return currentSection.menu.ordering.length;
    }

    // For submenu view, sum up all submenu items
    return Object.values(currentSection.submenu).reduce(
      (total, submenu) => total + (submenu as SubMenuConfig).ordering.length,
      0
    );
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
      header={renderHeader()}
      sidebar={renderSidebar()}
      currentSection={{
        language: activeLanguage,
        section: activeSection,
        view: activeSection !== "mobile-sidemenu" ? activeView : undefined,
        itemCount: getCurrentSectionItemCount(),
      }}
    >
      {renderContent()}
    </MenuLayout>
  );
};
