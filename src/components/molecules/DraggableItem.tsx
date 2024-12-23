import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DragHandleDots2Icon,
  EyeOpenIcon,
  EyeNoneIcon,
} from "@radix-ui/react-icons";
import { HiSparkles, HiFire } from "react-icons/hi";

import { Badge } from "../atoms/Badge";

interface DraggableItemProps {
  id: string;
  isHidden: boolean;
  hasHotNewProvider?: boolean;
  isHot?: boolean;
  isNew?: boolean;
  onToggleHide: () => void;
  onToggleHot?: () => void;
  onToggleNew?: () => void;
}

export const DraggableItem = React.memo(
  ({
    id,
    isHidden,
    isHot,
    isNew,
    hasHotNewProvider,
    onToggleHide,
    onToggleHot,
    onToggleNew,
  }: DraggableItemProps) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id,
      disabled: isHidden,
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
    const hasHot = hasHotNewProvider && onToggleHot;
    const hasNew = hasHotNewProvider && onToggleNew;
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
        ${isHidden ? "opacity-40" : ""}
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
          <div className="flex items-center gap-2">
            {isHidden && <Badge variant="hidden">Hidden</Badge>}
            {/* {isHot && <Badge>Hot</Badge>}
            {isNew && <Badge>New</Badge>} */}

            <div className="flex gap-1">
              {hasNew && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleNew();
                  }}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  title="Toggle New"
                >
                  <HiSparkles
                    className={`text-base ${
                      isNew ? "text-green-600" : "text-gray-400"
                    }`}
                  />
                  {/* <span
                    className={`text-xs font-medium px-1 ${
                      isNew ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    N
                  </span> */}
                </button>
              )}

              {hasHot && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleHot();
                  }}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  title="Toggle Hot"
                >
                  <HiFire
                    className={`text-base ${
                      isHot ? "text-orange-600" : "text-gray-400"
                    }`}
                  />
                </button>
              )}

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleHide();
                }}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                {isHidden ? (
                  <EyeOpenIcon className="w-4 h-4" />
                ) : (
                  <EyeNoneIcon className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

DraggableItem.displayName = "DraggableItem";
