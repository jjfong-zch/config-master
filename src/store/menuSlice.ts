import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Draft } from "@reduxjs/toolkit";
import {
  MenuSection,
  SectionType,
  WebMobileSection,
  MobileSideMenu,
  SubMenuConfig,
  BaseMenuConfig,
} from "../types/menu";

type WritableSection = Draft<WebMobileSection | MobileSideMenu>;
type WritableSubMenu = Draft<SubMenuConfig>;
type WritableBaseMenu = Draft<BaseMenuConfig>;

export type LanguageOption = "en" | "zh" | "ALL";

interface MenuItem {
  id: number;
  [key: string]: any;
}

interface MenuState {
  data: MenuSection;
  activeLanguage: string;
  referenceLanguage: string;
  activeSection: string;
  activeView: "main" | "submenu";
  selectedLanguage: LanguageOption;
  menuItems: {
    en: MenuItem[];
    zh: MenuItem[];
  };
}

const isMobileSideMenu = (
  section: WritableSection
): section is Draft<MobileSideMenu> => {
  return "beforeLogin" in section && "afterLogin" in section;
};

const isWebMobileSection = (
  section: WritableSection
): section is Draft<WebMobileSection> => {
  return "menu" in section && "submenu" in section;
};

const initialState: MenuState = {
  data: {} as MenuSection,
  activeLanguage: "",
  referenceLanguage: "",
  activeSection: "web",
  activeView: "main",
  selectedLanguage: "en" as LanguageOption,
  menuItems: {
    en: [],
    zh: [],
  },
};

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    initializeMenu: (state, action: PayloadAction<MenuSection>) => {
      state.data = action.payload;
      state.activeLanguage = Object.keys(action.payload)[0];
    },
    setActiveLanguage: (state, action: PayloadAction<string>) => {
      console.log(action.payload);
      state.activeLanguage = action.payload;
    },
    setReferenceLanguage: (state, action: PayloadAction<string>) => {
      state.referenceLanguage = action.payload;
    },
    setActiveSection: (state, action: PayloadAction<string>) => {
      state.activeSection = action.payload;
    },
    setActiveView: (state, action: PayloadAction<"main" | "submenu">) => {
      state.activeView = action.payload;
    },
    reorderItems: (
      state,
      action: PayloadAction<{
        listKey: string;
        category: string | null;
        oldIndex: number;
        newIndex: number;
      }>
    ) => {
      const { listKey, category, oldIndex, newIndex } = action.payload;
      const languages =
        state.activeLanguage === "ALL"
          ? Object.keys(state.data)
          : [state.activeLanguage];

      // Get reference data from EN
      const enData = state.data["EN"];
      const referenceData =
        state.activeLanguage === "ALL"
          ? enData
          : state.data[state.activeLanguage];

      // Helper function to reorder array
      const reorder = (list: string[]) => {
        const result = [...list];
        const [removed] = result.splice(oldIndex, 1);
        result.splice(newIndex, 0, removed);
        return result;
      };

      // Get the reordered list from EN first
      let reorderedList: string[] = [];
      const refSection = referenceData[
        state.activeSection as SectionType
      ] as WritableSection;

      if (
        state.activeSection === "mobile-sidemenu" &&
        isMobileSideMenu(refSection)
      ) {
        const section = listKey as "beforeLogin" | "afterLogin";
        reorderedList = reorder(refSection[section].ordering);
      } else if (isWebMobileSection(refSection)) {
        if (listKey === "main-menu") {
          reorderedList = reorder(refSection.menu.ordering);
        } else if (category) {
          const submenu = refSection.submenu[category] as WritableSubMenu;
          if (submenu) {
            reorderedList = reorder(submenu.ordering);
          }
        }
      }

      // Apply the same ordering to all selected languages
      languages.forEach((lang) => {
        const currentSection = state.data[lang][
          state.activeSection as SectionType
        ] as WritableSection;

        if (
          state.activeSection === "mobile-sidemenu" &&
          isMobileSideMenu(currentSection)
        ) {
          const section = listKey as "beforeLogin" | "afterLogin";
          currentSection[section].ordering = [...reorderedList];
        } else if (isWebMobileSection(currentSection)) {
          if (listKey === "main-menu") {
            currentSection.menu.ordering = [...reorderedList];
          } else if (category) {
            const submenu = currentSection.submenu[category] as WritableSubMenu;
            if (submenu) {
              submenu.ordering = [...reorderedList];
            }
          }
        }
      });
    },
    toggleHideItem: (
      state,
      action: PayloadAction<{
        category: string | null;
        item: string;
      }>
    ) => {
      const { category, item } = action.payload;
      const languages =
        state.activeLanguage === "ALL"
          ? Object.keys(state.data)
          : [state.activeLanguage];

      // Get reference data from EN
      const enData = state.data["EN"];
      const referenceData =
        state.activeLanguage === "ALL"
          ? enData
          : state.data[state.activeLanguage];

      // Get the target section from EN first
      let referenceSection: WritableBaseMenu | undefined;
      const section = referenceData[
        state.activeSection as SectionType
      ] as WritableSection;

      if (
        state.activeSection === "mobile-sidemenu" &&
        isMobileSideMenu(section)
      ) {
        referenceSection = section[category as "beforeLogin" | "afterLogin"];
      } else if (isWebMobileSection(section)) {
        if (!category) {
          referenceSection = section.menu;
        } else {
          const submenu = section.submenu[category] as WritableSubMenu;
          referenceSection = submenu;
        }
      }

      if (!referenceSection) {
        return;
      }

      // Initialize hideList if it doesn't exist
      if (!Array.isArray(referenceSection.hideList)) {
        referenceSection.hideList = [];
      }

      // Update the hideList based on EN data
      const hideIndex = referenceSection.hideList.indexOf(item);
      const updatedHideList = [...referenceSection.hideList];
      if (hideIndex > -1) {
        updatedHideList.splice(hideIndex, 1);
      } else {
        updatedHideList.push(item);
      }

      // Apply the same hideList to all selected languages
      languages.forEach((lang) => {
        const section = state.data[lang][
          state.activeSection as SectionType
        ] as WritableSection;
        let targetSection: WritableBaseMenu | undefined;

        if (
          state.activeSection === "mobile-sidemenu" &&
          isMobileSideMenu(section)
        ) {
          targetSection = section[category as "beforeLogin" | "afterLogin"];
        } else if (isWebMobileSection(section)) {
          if (!category) {
            targetSection = section.menu;
          } else {
            const submenu = section.submenu[category] as WritableSubMenu;
            targetSection = submenu;
          }
        }

        if (targetSection) {
          targetSection.hideList = [...updatedHideList];
        }
      });
    },
    toggleFlag: (
      state,
      action: PayloadAction<{
        category: string;
        flagName:
          | "disableOverrideFromBaseMenu"
          | "disableBaseMenuHotNewProvider";
      }>
    ) => {
      const { category, flagName } = action.payload;
      const languages =
        state.activeLanguage === "ALL"
          ? Object.keys(state.data)
          : [state.activeLanguage];

      languages.forEach((lang) => {
        const section = state.data[lang][
          state.activeSection as SectionType
        ] as WritableSection;
        if (isWebMobileSection(section)) {
          const submenu = section.submenu[category] as WritableSubMenu;
          if (submenu) {
            submenu[flagName] = !submenu[flagName];
          }
        }
      });
    },
    toggleProvider: (
      state,
      action: PayloadAction<{
        category: string;
        item: string;
        providerType: "newProvider" | "hotProvider";
      }>
    ) => {
      const { category, item, providerType } = action.payload;
      const languages =
        state.activeLanguage === "ALL"
          ? Object.keys(state.data)
          : [state.activeLanguage];

      languages.forEach((lang) => {
        const section = state.data[lang][
          state.activeSection as SectionType
        ] as WritableSection;
        if (isWebMobileSection(section)) {
          const submenu = section.submenu[category] as WritableSubMenu;
          if (submenu) {
            if (providerType === "newProvider") {
              if (!submenu.newProvider) {
                submenu.newProvider = [];
              }
              const index = submenu.newProvider.indexOf(item);
              if (index > -1) {
                submenu.newProvider.splice(index, 1);
              } else {
                submenu.newProvider.push(item);
              }
            } else if (providerType === "hotProvider") {
              if (!submenu.hotProvider) {
                submenu.hotProvider = [];
              }
              const index = submenu.hotProvider.indexOf(item);
              if (index > -1) {
                submenu.hotProvider.splice(index, 1);
              } else {
                submenu.hotProvider.push(item);
              }
            }
          }
        }
      });
    },
  },
});

export const {
  initializeMenu,
  setActiveLanguage,
  setReferenceLanguage,
  setActiveSection,
  setActiveView,
  reorderItems,
  toggleHideItem,
  toggleFlag,
  toggleProvider,
} = menuSlice.actions;

export default menuSlice.reducer;
