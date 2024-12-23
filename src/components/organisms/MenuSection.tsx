import { SortableList } from "./SortableList";
import { DraggableItem } from "../molecules/DraggableItem";

interface MenuSectionProps {
  title: string;
  items: string[];
  hasHotNewProvider: boolean;
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
  hasHotNewProvider,
  newProvider,
  onDragEnd,
  onToggleHide,
  onToggleProvider,
}: MenuSectionProps) => {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">{title}</h2>

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
              hasHotNewProvider={hasHotNewProvider}
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
    </div>
  );
};
