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
  hideList?: string[];
  onDragEnd: (oldIndex: number, newIndex: number) => void;
  onToggleHide: (item: string) => void;
}

export const SortableList = ({
  items,
  hideList = [],
  onDragEnd,
  onToggleHide,
}: SortableListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd: DndContextProps["onDragEnd"] = (event) => {
    const { active, over } = event;
    if (!over || hideList.includes(active.id.toString())) return;

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
          {items.map((id) => (
            <DraggableItem
              key={id}
              id={id}
              isHidden={hideList.includes(id)}
              onToggleHide={() => onToggleHide(id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
