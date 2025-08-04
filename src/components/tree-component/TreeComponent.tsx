import {
  createOnDropHandler,
  dragAndDropFeature,
  keyboardDragAndDropFeature,
  expandAllFeature,
  hotkeysCoreFeature,
  selectionFeature,
  renamingFeature,
  searchFeature,
  TreeState,
  syncDataLoaderFeature,
} from "@headless-tree/core";
import { AssistiveTreeDescription, useTree } from "@headless-tree/react";
import {
  CircleXIcon,
  FileIcon,
  FilterIcon,
  FolderIcon,
  FolderOpenIcon,
  ListCollapseIcon,
  ListTreeIcon,
} from "lucide-react";

import { Tree, TreeDragLine, TreeItem, TreeItemLabel } from "./tree";
import { useEffect, useRef, useState } from "react";
import { BaseInput, Button, Spinner } from "../atoms";
import { t } from "i18next";
import { Back } from "@/utils/utils-components/Back";
import { numberContext } from "@/context/settings/number-formatter";
import { transformBackendToTreeState } from "./TransformBackendToTree";
import { LoadingIndicator } from "react-select/dist/declarations/src/components/indicators";

interface Item {
  name: string;
  children?: string[];
}

export type TreeItem = {
  name: string;
  code: string;
  children?: string[];
};

const indent = 40;

export default function TreeComponent({ data }: any) {
  const transformed = transformBackendToTreeState(data);
  const [items, setItems] = useState(transformed);
  const [isLoading, setIsLoading] = useState(false);
  const initialExpandedItems = ["node-1"];
  const [state, setState] = useState<Partial<TreeState<Item>>>({});
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { formatReyal } = numberContext();

  const tree = useTree<Item>({
    state,
    setState,
    initialState: {
      expandedItems: [],
    },
    indent,
    rootItemId: "root",
    getItemName: (item: any) => {
      // <p className="flex items-center justify-between gap-2 w-full">
      //   <span>
      //     {item.getItemData().code} - {item.getItemData().name}{" "}
      //   </span>
      //   <span className="font-bold text-mainGreen flex items-center gap-3">
      //     {item.getItemData().children?.length > 0 && (
      //       <>
      //         <span>{t("accounts count")}</span>
      //         <span>{item.getItemData().children?.length}</span>
      //       </>
      //     )}
      //     <Button className="!p-1 text-xs !px-4">{t("Credit")}</Button>
      //     <Button className="!p-1 text-xs !px-4 flex items-center gap-1">
      //       <span>{formatReyal(49434)}</span>
      //       <span>{t("reyal")}</span>
      //     </Button>
      //   </span>
      // </p>;
      // return {
      //   code: item.getItemData().code,
      //   name: item.getItemData().name,
      //   childrenCount: item.getItemData().children?.length,
      // };

      // item?.isRenaming()
      //   ? item.getItemData().name.trim()
      //   : `${item.getItemData().code} - ${item.getItemData().name}`,

      return `${item.getItemData().name} (${item.getItemData().code})`;
    },
    isItemFolder: (item) => (item.getItemData()?.children?.length ?? 0) > 0,
    // canReorder: true,
    // onDrop: createOnDropHandler((parentItem, newChildrenIds) => {
    //   setItems((prevItems) => ({
    //     ...prevItems,
    //     [parentItem.getId()]: {
    //       ...prevItems[parentItem.getId()],
    //       children: newChildrenIds,
    //     },
    //   }));
    // }),
    // onRename: (item, newName) => {
    //   // Update the item name in our state
    //   const itemId = item.getId();
    //   setItems((prevItems) => ({
    //     ...prevItems,
    //     [itemId]: {
    //       ...prevItems[itemId],
    //       name: newName,
    //     },
    //   }));
    // },
    dataLoader: {
      getItem: (itemId) => {
        return items[itemId];
      },
      getChildren: (itemId) => items[itemId].children ?? [],
    },
    features: [
      syncDataLoaderFeature,
      selectionFeature,
      hotkeysCoreFeature,
      expandAllFeature,
      // dragAndDropFeature,
      // renamingFeature,
      searchFeature,
      // keyboardDragAndDropFeature,
    ],
  });

  // Handle clearing the search
  const handleClearSearch = () => {
    setSearchValue("");

    // Manually trigger the tree's search onChange with an empty value
    // to ensure item.isMatchingSearch() is correctly updated.
    const searchProps = tree.getSearchInputElementProps();
    if (searchProps.onChange) {
      const syntheticEvent = {
        target: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>; // Cast to the expected event type
      searchProps.onChange(syntheticEvent);
    }

    // Reset tree state to initial expanded items
    setState((prevState) => ({
      ...prevState,
      expandedItems: initialExpandedItems,
    }));

    // Clear custom filtered items
    setFilteredItems([]);

    if (inputRef.current) {
      inputRef.current.focus();
      // Also clear the internal search input
      inputRef.current.value = "";
    }
  };

  // Keep track of filtered items separately from the tree's internal search state
  const [filteredItems, setFilteredItems] = useState<string[]>([]);

  // This function determines if an item should be visible based on our custom filtering
  const shouldShowItem = (itemId: string) => {
    if (!searchValue || searchValue.length === 0) return true;
    return filteredItems.includes(itemId);
  };

  // Update filtered items when search value changes
  useEffect(() => {
    setIsLoading(true);

    const handler = setTimeout(() => {
      if (!searchValue || searchValue.length === 0) {
        setFilteredItems([]);
        setState((prevState) => ({
          ...prevState,
          expandedItems: initialExpandedItems,
        }));
        setIsLoading(false);
        return;
      }

      const allItems = tree.getItems();

      const directMatches = allItems
        .filter((item) =>
          item.getItemName().toLowerCase().includes(searchValue.toLowerCase())
        )
        .map((item) => item.getId());

      const parentIds = new Set<string>();
      directMatches.forEach((matchId) => {
        let item = allItems.find((i) => i.getId() === matchId);
        while (item?.getParent && item.getParent()) {
          const parent = item.getParent();
          if (parent) {
            parentIds.add(parent.getId());
            item = parent;
          } else {
            break;
          }
        }
      });

      const childrenIds = new Set<string>();
      directMatches.forEach((matchId) => {
        const item = allItems.find((i) => i.getId() === matchId);
        if (item && item.isFolder()) {
          const getDescendants = (itemId: string) => {
            const children = items[itemId]?.children || [];
            children.forEach((childId) => {
              childrenIds.add(childId);
              if (items[childId]?.children?.length) {
                getDescendants(childId);
              }
            });
          };
          getDescendants(item.getId());
        }
      });

      setFilteredItems([
        ...directMatches,
        ...Array.from(parentIds),
        ...Array.from(childrenIds),
      ]);

      const currentExpandedItems = tree.getState().expandedItems || [];
      const folderIdsToExpand = allItems
        .filter((item) => item.isFolder())
        .map((item) => item.getId());

      setState((prevState) => ({
        ...prevState,
        expandedItems: [
          ...new Set([...currentExpandedItems, ...folderIdsToExpand]),
        ],
      }));

      setIsLoading(false);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchValue, tree, items]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BaseInput
            ref={inputRef}
            className="w-[300px] h-10"
            value={searchValue}
            onChange={(e) => {
              const value = e.target.value;
              setSearchValue(value);

              const searchProps = tree.getSearchInputElementProps();
              if (searchProps.onChange) {
                searchProps.onChange(e);
              }

              // No need to handle expandAll/reset here anymore.
            }}
            // Prevent the internal search from being cleared on blur
            onBlur={(e) => {
              // Prevent default blur behavior
              e.preventDefault();

              // Re-apply the search to ensure it stays active
              if (searchValue && searchValue.length > 0) {
                const searchProps = tree.getSearchInputElementProps();
                if (searchProps.onChange) {
                  const syntheticEvent = {
                    target: { value: searchValue },
                  } as React.ChangeEvent<HTMLInputElement>;
                  searchProps.onChange(syntheticEvent);
                }
              }
            }}
            type="search"
            placeholder={`${t("search")}`}
          />
          <Button action={tree.expandAll}>{t("expand all")}</Button>
          <Button
            className="bg-transparent text-mainGreen border border-mainGreen"
            action={tree.collapseAll}
          >
            {t("collapse all")}
          </Button>
        </div>

        <Back />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <Tree
          className="relative before:absolute before:inset-0 before:-ms-1 before:bg-[repeating-linear-gradient(to_right,transparent_0,transparent_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)))]"
          indent={indent}
          tree={tree}
        >
          <AssistiveTreeDescription tree={tree} />
          {searchValue && filteredItems.length === 0 ? (
            <p className="px-3 py-4 text-center text-sm">
              {t("no results for")} "{searchValue}"
            </p>
          ) : (
            tree.getItems().map((item: any) => {
              const isVisible = shouldShowItem(item.getId());

              return (
                <TreeItem
                  key={item.getId()}
                  item={item}
                  data-visible={isVisible || !searchValue}
                  className="data-[visible=false]:hidden  "
                >
                  <TreeItemLabel className=" bg-flatWhite text-base relative before:absolute before:inset-x-0 before:-inset-y-0.5 before:-z-10">
                    <p className="flex items-center gap-2 w-full">
                      {item.isFolder() ? (
                        item.isExpanded() ? (
                          <FolderOpenIcon className="text-muted-foreground pointer-events-none size-4" />
                        ) : (
                          <FolderIcon className="text-muted-foreground pointer-events-none size-4" />
                        )
                      ) : (
                        <FileIcon className="text-muted-foreground pointer-events-none size-4" />
                      )}
                      {/* {item.isRenaming() ? (
                      <input
                        {...item.getRenameInputProps()}
                        autoFocus
                        className="-my-0.5 h-6 px-1"
                      />
                    ) : ( */}
                      {/* <p className="flex items-center justify-between gap-2 w-full">
                      <span>
                        {item.getItemName().code} - {item.getItemName().name}{" "}
                      </span>
                      <span className="font-bold text-mainGreen flex items-center gap-3">
                        <Button className="!p-1 text-xs !px-4">
                          {t("Credit")}
                        </Button>
                        <Button className="!p-1 text-xs !px-4 flex items-center gap-1">
                          <span>{formatReyal(49434)}</span>
                          <span>{t("reyal")}</span>
                        </Button>
                      </span>
                    </p> */}
                      {item.getItemName()}
                      {/* )} */}
                    </p>
                  </TreeItemLabel>
                </TreeItem>
              );
            })
          )}

          <TreeDragLine />
        </Tree>
      )}
    </div>
  );
}
