import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DndContextProps,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DraggableItem } from "../molecules/DraggableItem";

interface SortableListProps {
  items: string[];
  hideList: string[];
  hotProvider?: string[];
  newProvider?: string[];
  onDragEnd: (oldIndex: number, newIndex: number) => void;
  onToggleHide: (item: string) => void;
  onToggleProvider: (
    item: string,
    providerType: "newProvider" | "hotProvider"
  ) => void;
  children: React.ReactNode;
}

export const SortableList = ({
  items,
  onDragEnd,
  children,
}: SortableListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd: DndContextProps["onDragEnd"] = (event) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = items.indexOf(active.id.toString());
      const newIndex = items.indexOf(over.id.toString());
      onDragEnd(oldIndex, newIndex);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className="space-y-2 min-h-[50px] max-h-[400px] rounded-lg p-4 overflow-y-auto bg-gray-50/50">
          {children}
        </div>
      </SortableContext>
    </DndContext>
  );
};
