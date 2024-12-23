import React, { ReactNode } from "react";
import { Card } from "../atoms/Card";

interface MenuLayoutProps {
  header: ReactNode;
  sidebar: ReactNode;
  children: ReactNode;
  currentSection: {
    language: string;
    section: string;
    view?: string;
    itemCount?: number;
  };
}

export const MenuLayout = ({
  header,
  sidebar,
  children,
  currentSection,
}: MenuLayoutProps) => (
  <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <div className="fixed top-0 left-0 right-0 z-50">{header}</div>

    <div className="pt-[73px] flex">
      <div className="fixed left-0 top-[93px] bottom-0 w-64 bg-white border-r border-gray-200">
        <div className="h-full overflow-y-auto">
          <div className="p-4">{sidebar}</div>
        </div>
      </div>

      <div className="flex-1 ml-64">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <Card className="mb-8">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-medium text-gray-700">
                    {currentSection.language} / {currentSection.section}
                    {currentSection.view && ` / ${currentSection.view}`}
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    {currentSection.itemCount} items in total
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
                    {currentSection.language}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                    {currentSection.section}
                  </span>
                </div>
              </div>
            </div>
          </Card>
          {children}
        </div>
      </div>
    </div>
  </div>
);
