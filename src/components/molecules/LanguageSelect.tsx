import React from "react";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";

interface LanguageSelectProps {
  languages: string[];
  value: string;
  onChange: (value: string) => void;
}

export const LanguageSelect = React.memo(
  ({ languages, value, onChange }: LanguageSelectProps) => {
    const allLanguages = ["ALL", ...languages];
    const referenceLanguage = languages[0];

    return (
      <Select.Root value={value} onValueChange={onChange}>
        <Select.Trigger
          className="flex items-center justify-between w-full px-3 py-2 text-sm bg-white 
          border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 
          focus:ring-blue-500 focus:ring-offset-2"
        >
          <Select.Value>
            {value === "ALL" ? (
              <span className="flex flex-col">
                <span className="font-medium">ALL Languages</span>
                <span className="text-xs text-gray-500">
                  Reference: {referenceLanguage}
                </span>
              </span>
            ) : (
              <span className="flex flex-col">
                <span className="font-medium">{value.split("_")[0]}</span>
                <span className="text-xs text-gray-500">
                  {value.split("_")[1]}
                </span>
              </span>
            )}
          </Select.Value>
          <Select.Icon>
            <ChevronDownIcon className="w-4 h-4 text-gray-500" />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
            position="popper"
            sideOffset={4}
          >
            <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white text-gray-500">
              <ChevronUpIcon />
            </Select.ScrollUpButton>

            <Select.Viewport className="p-1">
              {allLanguages.map((lang) => (
                <Select.Item
                  key={lang}
                  value={lang}
                  className="flex items-center px-3 py-2 text-sm rounded-md outline-none
                  select-none cursor-default data-[highlighted]:bg-gray-100 
                  data-[state=checked]:bg-blue-50"
                >
                  <Select.ItemText>
                    <div className="flex flex-col">
                      {lang === "ALL" ? (
                        <span className="font-medium">ALL Languages</span>
                      ) : (
                        <>
                          <span className="font-medium">
                            {lang.split("_")[0]}
                          </span>
                          <span className="text-xs text-gray-500">
                            {lang.split("_")[1]}
                          </span>
                        </>
                      )}
                    </div>
                  </Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>

            <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white text-gray-500">
              <ChevronDownIcon />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    );
  }
);

LanguageSelect.displayName = "LanguageSelect";
