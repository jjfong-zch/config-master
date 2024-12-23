import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DragHandleDots2Icon,
  EyeOpenIcon,
  EyeNoneIcon,
} from "@radix-ui/react-icons";
import { Badge } from "../atoms/Badge";

interface DraggableItemProps {
  id: string;
  isHidden: boolean;
  onToggleHide: () => void;
}

export const DraggableItem = React.memo(
  ({ id, isHidden, onToggleHide }: DraggableItemProps) => {
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
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleHide();
              }}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              {isHidden ? (
                <EyeOpenIcon className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              ) : (
                <EyeNoneIcon className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

DraggableItem.displayName = "DraggableItem";
