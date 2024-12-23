import { LanguageSelect } from "../molecules/LanguageSelect";
import { SideNavItem } from "../molecules/SideNavItem";
// import { Dispatch } from "@reduxjs/toolkit";
import { setActiveSection, setActiveView } from "../../store/menuSlice";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { RootState } from "../../store/store";
interface SideProps {
  languages: string[];
  onLanguageChange: (newLanguage: string) => void;
}

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
    types: null,
  },
  affiliate: {
    label: "Affiliate",
    types: {
      main: "Main Menu",
      submenu: "Sub Menus",
    },
  },
} as const;

export const Sidebar = ({ languages, onLanguageChange }: SideProps) => {
  const dispatch = useAppDispatch();
  const { activeLanguage, activeSection, activeView } = useAppSelector(
    (state: RootState) => state.menu
  );

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Region & Language
        </h3>
        <LanguageSelect
          languages={languages}
          value={activeLanguage}
          onChange={onLanguageChange}
        />
      </div>

      <div className="flex-1 overflow-hidden">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Menu Sections
        </h3>
        <div className="space-y-4 overflow-y-auto pr-2 scrollbar-hide">
          {Object.entries(SECTION_GROUPS).map(
            ([sectionKey, { label, types }]) => (
              <div key={sectionKey} className="space-y-1">
                <div className="px-2 py-1">
                  <span className="text-sm font-medium text-gray-900">
                    {label}
                  </span>
                </div>

                {types ? (
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
};
