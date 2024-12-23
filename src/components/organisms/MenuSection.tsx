import { Card } from "../atoms/Card";
import { SortableList } from "./SortableList";
import { Badge } from "../atoms/Badge";

interface MenuSectionProps {
  title: string;
  items: string[];
  hideList: string[];
  onDragEnd: (oldIndex: number, newIndex: number) => void;
  onToggleHide: (item: string) => void;
}

export const MenuSection = ({
  title,
  items,
  hideList,
  onDragEnd,
  onToggleHide,
}: MenuSectionProps) => (
  <div className="p-4">
    <SortableList
      items={items}
      hideList={hideList}
      onDragEnd={onDragEnd}
      onToggleHide={onToggleHide}
    />
  </div>
);
