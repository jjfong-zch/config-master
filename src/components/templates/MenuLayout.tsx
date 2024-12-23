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
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1.5 text-sm font-medium bg-blue-50 text-blue-700 rounded-md">
                    {currentSection.language}
                  </span>
                  <span className="text-gray-400">/</span>
                  <span className="text-sm font-medium text-gray-700">
                    {currentSection.section}
                    {currentSection.view && ` / ${currentSection.view}`}
                  </span>
                </div>
                {currentSection.itemCount !== undefined && (
                  <span className="text-sm text-gray-500">
                    {currentSection.itemCount} items
                  </span>
                )}
              </div>
            </div>
          </Card>
          {children}
        </div>
      </div>
    </div>
  </div>
);
