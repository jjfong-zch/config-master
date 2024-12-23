import { SortableList } from "./SortableList";
import { DraggableItem } from "../molecules/DraggableItem";

interface MenuSectionProps {
  title: string;
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
}

export const MenuSection = ({
  title,
  items,
  hideList,
  hotProvider,
  newProvider,
  onDragEnd,
  onToggleHide,
  onToggleProvider,
}: MenuSectionProps) => {
  console.log(items);

  return (
    <div className="p-4">
      <SortableList
        items={items}
        hideList={hideList}
        hotProvider={hotProvider}
        newProvider={newProvider}
        onDragEnd={onDragEnd}
        onToggleHide={onToggleHide}
        onToggleProvider={onToggleProvider}
      >
        {items.map((item) => (
          <DraggableItem
            key={item}
            id={item}
            isHidden={hideList.includes(item)}
            isHot={hotProvider?.includes(item)}
            isNew={newProvider?.includes(item)}
            onToggleHide={() => onToggleHide(item)}
            onToggleHot={() => onToggleProvider(item, "hotProvider")}
            onToggleNew={() => onToggleProvider(item, "newProvider")}
          />
        ))}
      </SortableList>
    </div>
  );
};
