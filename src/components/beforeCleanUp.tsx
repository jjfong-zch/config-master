import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon, DragHandleDots2Icon } from "@radix-ui/react-icons";

// Add interfaces
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

// Add Card component
const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}
  >
    {children}
  </div>
);

const SortableItem = ({ id, isHidden }: { id: string; isHidden: boolean }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : isHidden ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 rounded-lg bg-white
        ${
          isDragging
            ? "shadow-lg ring-1 ring-blue-500/10"
            : "shadow-sm hover:shadow-md"
        }
        ${isHidden ? "opacity-40 cursor-not-allowed" : ""}
        transition-all duration-200`}
    >
      <div
        {...attributes}
        {...listeners}
        className={`p-1 rounded hover:bg-gray-50 ${
          isHidden ? "cursor-not-allowed" : "cursor-grab"
        }`}
      >
        <DragHandleDots2Icon className="w-4 h-4 text-gray-400" />
      </div>
      <div className="flex items-center justify-between flex-1">
        <span className="font-medium text-sm text-gray-700">{id}</span>
        {isHidden && (
          <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
            Hidden
          </span>
        )}
      </div>
    </div>
  );
};

const SortableList = ({
  items,
  hideList = [],
  onDragEnd,
}: {
  items: string[];
  hideList?: string[];
  onDragEnd: (oldIndex: number, newIndex: number) => void;
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    // Prevent dragging if item is hidden
    if (hideList.includes(active.id)) return;

    if (active.id !== over?.id) {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      onDragEnd(oldIndex, newIndex);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className="space-y-2 min-h-[50px] rounded-lg p-4 overflow-y-auto bg-gray-50/50">
          {items.map((id) => (
            <SortableItem key={id} id={id} isHidden={hideList.includes(id)} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

const MenuOrderingSystemDndKit = ({ data }: { data: MenuSection }) => {
  const [menuData, setMenuData] = useState<MenuSection>(data);
  const [virtualMenuData, setVirtualMenuData] = useState<MenuSection>(data);
  const [activeLanguage, setActiveLanguage] = useState<string>(
    Object.keys(data)[0]
  );
  const [activeSection, setActiveSection] = useState<string>("web");
  const [hasChanges, setHasChanges] = useState(false);

  const handleListReorder = (
    listKey: string,
    category: string | null,
    oldIndex: number,
    newIndex: number
  ) => {
    setVirtualMenuData((prev) => {
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
    setHasChanges(true);
  };

  const handleSave = () => {
    setMenuData(virtualMenuData);
    setHasChanges(false);
    const jsonString = JSON.stringify(virtualMenuData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "updated-menu-config.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDiscard = () => {
    setVirtualMenuData(menuData);
    setHasChanges(false);
  };

  // Add header render function
  const renderHeader = () => (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Menu Configuration
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {hasChanges ? "You have unsaved changes" : "All changes saved"}
            </p>
          </div>
          <div className="flex gap-3">
            {hasChanges && (
              <button
                onClick={handleDiscard}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Discard Changes
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                ${
                  hasChanges
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Add side navigation item component
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
          isActive
            ? "bg-blue-50 text-blue-700"
            : "text-gray-600 hover:bg-gray-50"
        }
        transition-all duration-200`}
    >
      {label}
    </button>
  );

  const renderContent = () => {
    if (activeSection === "mobile-sidemenu") {
      return (
        <div className="grid grid-cols-2 gap-8">
          {/* Before Login Menu */}
          <Card>
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-sm font-medium text-gray-700">
                Before Login Menu
              </h2>
              <span className="text-xs text-gray-500">
                {
                  virtualMenuData[activeLanguage][activeSection].beforeLogin
                    .ordering.length
                }{" "}
                items
              </span>
            </div>
            <div className="p-4">
              <SortableList
                items={
                  virtualMenuData[activeLanguage][activeSection].beforeLogin
                    .ordering
                }
                hideList={
                  virtualMenuData[activeLanguage][activeSection].beforeLogin
                    .hideList
                }
                onDragEnd={(oldIndex, newIndex) =>
                  handleListReorder("beforeLogin", null, oldIndex, newIndex)
                }
              />
            </div>
          </Card>

          {/* After Login Menu */}
          <Card>
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-sm font-medium text-gray-700">
                After Login Menu
              </h2>
              <span className="text-xs text-gray-500">
                {
                  virtualMenuData[activeLanguage][activeSection].afterLogin
                    .ordering.length
                }{" "}
                items
              </span>
            </div>
            <div className="p-4">
              <SortableList
                items={
                  virtualMenuData[activeLanguage][activeSection].afterLogin
                    .ordering
                }
                hideList={
                  virtualMenuData[activeLanguage][activeSection].afterLogin
                    .hideList
                }
                onDragEnd={(oldIndex, newIndex) =>
                  handleListReorder("afterLogin", null, oldIndex, newIndex)
                }
              />
            </div>
          </Card>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-8">
        {/* Main Menu */}
        <Card>
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-sm font-medium text-gray-700">Main Menu</h2>
            <span className="text-xs text-gray-500">
              {
                virtualMenuData[activeLanguage][activeSection].menu.ordering
                  .length
              }{" "}
              items
            </span>
          </div>
          <div className="p-4">
            <SortableList
              items={
                virtualMenuData[activeLanguage][activeSection].menu.ordering
              }
              hideList={
                virtualMenuData[activeLanguage][activeSection].menu.hideList
              }
              onDragEnd={(oldIndex, newIndex) =>
                handleListReorder("main-menu", null, oldIndex, newIndex)
              }
            />
          </div>
        </Card>

        {/* Submenus */}
        {virtualMenuData[activeLanguage][activeSection].submenu && (
          <div className="space-y-4">
            {Object.entries(
              virtualMenuData[activeLanguage][activeSection].submenu
            ).map(([category, submenu]) => (
              <Card key={category}>
                <Accordion.Root type="single" collapsible>
                  <Accordion.Item value={category}>
                    <Accordion.Header>
                      <Accordion.Trigger className="flex w-full items-center justify-between p-4 text-left">
                        <span className="text-sm font-medium text-gray-700">
                          {category}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {(submenu as SubMenuConfig).ordering.length} items
                          </span>
                          <ChevronDownIcon className="w-5 h-5 text-gray-400 transition-transform duration-200" />
                        </div>
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content>
                      <div className="p-4 pt-0">
                        <SortableList
                          items={(submenu as SubMenuConfig).ordering}
                          hideList={(submenu as SubMenuConfig).hideList}
                          onDragEnd={(oldIndex, newIndex) =>
                            handleListReorder(
                              "submenu",
                              category,
                              oldIndex,
                              newIndex
                            )
                          }
                        />
                      </div>
                    </Accordion.Content>
                  </Accordion.Item>
                </Accordion.Root>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {renderHeader()}

      <div className="flex">
        {/* Side Navigation */}
        <div className="w-64 fixed left-0 top-[73px] bottom-0 bg-white border-r border-gray-200 p-4">
          {/* Language Selection */}
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Languages
            </h3>
            <div className="space-y-1">
              {Object.keys(virtualMenuData).map((lang) => (
                <SideNavItem
                  key={lang}
                  label={lang}
                  isActive={activeLanguage === lang}
                  onClick={() => setActiveLanguage(lang)}
                />
              ))}
            </div>
          </div>

          {/* Section Selection */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Sections
            </h3>
            <div className="space-y-1">
              {["web", "mobile", "mobile-sidemenu", "affiliate"].map(
                (section) => (
                  <SideNavItem
                    key={section}
                    label={section}
                    isActive={activeSection === section}
                    onClick={() => setActiveSection(section)}
                  />
                )
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64">
          <div className="max-w-5xl mx-auto px-6 py-8">
            <Card className="mb-8">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-sm font-medium text-gray-700">
                  {activeLanguage} / {activeSection}
                </h2>
              </div>
            </Card>

            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuOrderingSystemDndKit;
