export interface BaseMenuConfig {
  hideList: string[];
  ordering: string[];
}

export interface SubMenuConfig extends BaseMenuConfig {
  newProvider?: string[];
  hotProvider?: string[];
  disableOverrideFromBaseMenu?: boolean;
  disableBaseMenuHotNewProvider?: boolean;
}

export type SectionType = "web" | "mobile" | "mobile-sidemenu" | "affiliate";
export type ViewType = "main" | "submenu";

export interface WebMobileSection {
  menu: BaseMenuConfig;
  submenu: {
    [key: string]: SubMenuConfig;
  };
}

export interface MobileSideMenu {
  beforeLogin: BaseMenuConfig;
  afterLogin: BaseMenuConfig;
}

export interface AffiliateSection {
  menu: BaseMenuConfig;
}

export type LanguageSection = {
  [K in SectionType]: K extends "mobile-sidemenu"
    ? MobileSideMenu
    : WebMobileSection;
};

export interface MenuSection {
  [key: string]: LanguageSection;
}
