import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MenuSection } from "../types/menu";

export type LanguageOption = "en" | "zh" | "ALL";

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
    // ... other languages ...
  };
}

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
    // ... other languages ...
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
      const refSection = referenceData[state.activeSection];

      if (state.activeSection === "mobile-sidemenu") {
        const section = listKey as "beforeLogin" | "afterLogin";
        reorderedList = reorder(refSection[section].ordering);
      } else if (listKey === "main-menu") {
        reorderedList = reorder(refSection.menu.ordering);
      } else if (category) {
        // Handle submenu reordering with ID updates
        const submenu = refSection.submenu[category];
        if (submenu) {
          reorderedList = reorder(submenu.ordering);

          // Update IDs based on new positions
          languages.forEach((lang) => {
            const currentSection = state.data[lang][state.activeSection];
            const submenuItems = currentSection.submenu[category];

            reorderedList.forEach((itemKey, index) => {
              if (submenuItems[itemKey]) {
                submenuItems[itemKey].id = index + 1;
              }
            });
          });
        }
      }

      // Apply the same ordering to all selected languages
      languages.forEach((lang) => {
        const currentSection = state.data[lang][state.activeSection];

        if (state.activeSection === "mobile-sidemenu") {
          const section = listKey as "beforeLogin" | "afterLogin";
          currentSection[section].ordering = [...reorderedList];
        } else if (listKey === "main-menu") {
          currentSection.menu.ordering = [...reorderedList];
        } else if (category) {
          const submenu = currentSection.submenu[category];
          if (submenu) {
            submenu.ordering = [...reorderedList];
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
      let referenceSection;
      if (state.activeSection === "mobile-sidemenu") {
        referenceSection =
          referenceData[state.activeSection][
            category as "beforeLogin" | "afterLogin"
          ];
      } else if (!category) {
        referenceSection = referenceData[state.activeSection].menu;
      } else {
        referenceSection = referenceData[state.activeSection].submenu[category];
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
        let targetSection;

        if (state.activeSection === "mobile-sidemenu") {
          targetSection =
            state.data[lang][state.activeSection][
              category as "beforeLogin" | "afterLogin"
            ];
        } else if (!category) {
          targetSection = state.data[lang][state.activeSection].menu;
        } else {
          targetSection =
            state.data[lang][state.activeSection].submenu[category];
        }

        targetSection.hideList = [...updatedHideList];
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
        const targetSection =
          state.data[lang][state.activeSection].submenu[category];
        targetSection[flagName] = !targetSection[flagName];
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
        const targetSection =
          state.data[lang][state.activeSection].submenu[category];
        if (!targetSection[providerType]) {
          targetSection[providerType] = [];
        }

        const index = targetSection[providerType]!.indexOf(item);
        if (index > -1) {
          targetSection[providerType]!.splice(index, 1);
        } else {
          targetSection[providerType]!.push(item);
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
