import * as Dialog from "@radix-ui/react-dialog";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { useState } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { getCategoryLabel } from "../../constants/categoryMappings";

interface AddProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: {
    providerName: string;
    categories: string[];
    languages: string[];
    targetType: "menu" | "submenu";
  }) => void;
  availableCategories: string[];
  availableLanguages: string[];
}

export const AddProviderModal = ({
  isOpen,
  onClose,
  onAdd,
  availableCategories,
  availableLanguages,
}: AddProviderModalProps) => {
  const [providerName, setProviderName] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [targetType, setTargetType] = useState<"menu" | "submenu">("menu");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      providerName,
      categories: targetType === "menu" ? [] : selectedCategories,
      languages: selectedLanguages,
      targetType,
    });
    onClose();
  };

  const isValid =
    providerName &&
    selectedLanguages.length > 0 &&
    (targetType === "menu" || selectedCategories.length > 0);
  console.log("selectedCategories", selectedCategories);
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-xl shadow-xl p-6 z-[61]">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              Add New Menu
            </Dialog.Title>
            <Dialog.Close className="text-gray-400 hover:text-gray-500">
              <Cross2Icon />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Target Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add to
              </label>
              <RadioGroup.Root
                value={targetType}
                onValueChange={(value) =>
                  setTargetType(value as "menu" | "submenu")
                }
                className="flex gap-4"
              >
                <div className="flex items-center">
                  <RadioGroup.Item
                    value="menu"
                    id="menu"
                    className="w-4 h-4 rounded-full border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2 after:h-2 after:rounded-full after:bg-blue-600" />
                  </RadioGroup.Item>
                  <label htmlFor="menu" className="ml-2 text-sm text-gray-700">
                    Main Menu
                  </label>
                </div>
                <div className="flex items-center">
                  <RadioGroup.Item
                    value="submenu"
                    id="submenu"
                    className="w-4 h-4 rounded-full border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2 after:h-2 after:rounded-full after:bg-blue-600" />
                  </RadioGroup.Item>
                  <label
                    htmlFor="submenu"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Sub Menu
                  </label>
                </div>
              </RadioGroup.Root>
            </div>

            {/* Provider Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={providerName}
                onChange={(e) => setProviderName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter name"
                required
              />
            </div>

            {/* Categories Multi-select (only show for submenu) */}
            {targetType === "submenu" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categories
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableCategories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => {
                        setSelectedCategories((prev) =>
                          prev.includes(category)
                            ? prev.filter((c) => c !== category)
                            : [...prev, category]
                        );
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                        ${
                          selectedCategories.includes(category)
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                      {getCategoryLabel(category)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Languages Multi-select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Languages & Region
              </label>
              <div className="flex flex-wrap gap-2">
                {availableLanguages.map((language) => (
                  <button
                    key={language}
                    type="button"
                    onClick={() => {
                      setSelectedLanguages((prev) =>
                        prev.includes(language)
                          ? prev.filter((l) => l !== language)
                          : [...prev, language]
                      );
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                      ${
                        selectedLanguages.includes(language)
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                  >
                    {language}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isValid}
              >
                Add Provider
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
