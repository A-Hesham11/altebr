import { Form, Formik } from "formik";
import { t } from "i18next";
import { useContext, useEffect, useState } from "react";
import { Button } from "../../../components/atoms";
import { AddIcon } from "../../../components/atoms/icons";
import { BaseInputField, Modal } from "../../../components/molecules";
import { BoxesDataBase } from "../../../components/atoms/card/BoxesDataBase";
import AvailableItemsInBranch from "../../../components/selling/Inventory/AvailableItemsInBranch";
import IdentitiesCheckedByBranch from "../../../components/selling/Inventory/IdentitiesCheckedByBranch";
import UnknownIdentitiesInBranch from "../../../components/selling/Inventory/UnknownIdentitiesInBranch";
import IdentityInformationInBranch from "../../../components/selling/Inventory/IdentityInformationInBranch";
import ConvertNumberToWordGroup from "../../../utils/number to arabic words/convertNumToArWordGroup";
import { numberContext } from "../../../context/settings/number-formatter";
import { useFetch, useMutate } from "../../../hooks";
import { notify } from "../../../utils/toast";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { useNavigate, useParams } from "react-router-dom";
import { mutateData } from "../../../utils/mutateData";
import ShowDetailsItemOfInventory from "./ShowDetailsItemOfInventory";
import WeightAdjustmentInBranch from "../../../components/selling/Inventory/WeightAdjustmentInBranch";
import InventoryKitInBranch from "../../../components/selling/Inventory/InventoryKitInBranch";

const playBeep = (frequency: number) => {
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = context.createOscillator();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, context.currentTime);
  oscillator.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.2);
};

interface Totals {
  name: string;
  key: string;
  unit: string;
  value: number;
}

interface Item {
  id: string;
  weight?: number;
  is_exist?: number;
  [key: string]: any;
}

interface InventoryNewGoldDiamondsMiscellaneousProps {
  currenGroupNumber: number;
  setCurrenGroupNumber: (value: number) => void;
  setSteps: (value: number) => void;
  selectedItem: Item | null;
  setSelectedItem: (item: any | null) => void;
  availableItems: Item[];
  setAvailableItems: (items: any[]) => void;
  identitiesCheckedItems: any[];
  setIdentitiesCheckedItems: (items: any[]) => void;
  unknownIdentities: Item[];
  setUnknownIdentities: (items: any[]) => void;
  numberItemsInBranch: number;
  setNumberItemsInBranch: (value: number) => void;
}

const InventoryNewGoldDiamondsMiscellaneous: React.FC<
  InventoryNewGoldDiamondsMiscellaneousProps
> = ({
  setSteps,
  currenGroupNumber,
  setCurrenGroupNumber,
  selectedItem,
  setSelectedItem,
  availableItems,
  setAvailableItems,
  identitiesCheckedItems,
  setIdentitiesCheckedItems,
  unknownIdentities,
  setUnknownIdentities,
  numberItemsInBranch,
  setNumberItemsInBranch,
}) => {
  const [search, setSearch] = useState<string>("");
  const numbers = ConvertNumberToWordGroup();
  const { formatReyal } = numberContext();
  const { userData } = useContext(authCtx);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [openDetailsItem, setOpenDetailsItem] = useState(false);
  const [unknownItemDetails, setUnknownItemDetails] = useState<any>({});
  const [openWeightItem, setOpenWeightItem] = useState(false);
  const [openKitItems, setOpenKitItems] = useState(false);
  const [kitItemsData, setKitItemsData] = useState([]);
  const [editWeight, setEditWeight] = useState({});
  const [activeTableId, setActiveTableId] = useState<string | null>(null);

  const totalNumberItemsInspected = identitiesCheckedItems?.reduce(
    (count, group) => count + group.items.length,
    0
  );

  const totals: Totals[] = [
    {
      name: t("Number of items in the branch"),
      key: "1",
      unit: "item",
      value: numberItemsInBranch,
    },
    {
      name: t("Number of items inspected"),
      key: "2",
      unit: "item",
      value: totalNumberItemsInspected,
    },
    {
      name: t("Uninspected items"),
      key: "3",
      unit: "item",
      value: numberItemsInBranch - totalNumberItemsInspected,
    },
    {
      name: t("Unidentified items"),
      key: "4",
      unit: "item",
      value: unknownIdentities?.length,
    },
  ];

  const addItemToIdentity = (id: number, newItem: Item, isChecked: boolean) => {
    const groupExists = identitiesCheckedItems.some(
      (identity) => identity.id === id
    );
    if (!groupExists) {
      notify("info", `${t("A group must be created first.")}`);
      return;
    }

    if (newItem?.is_exist && isChecked) {
      const group = identitiesCheckedItems.find(
        (identity) => identity.id === id
      );

      const itemAlreadyExists = group?.items.some(
        (item) => item.id === newItem.id
      );

      if (itemAlreadyExists && newItem?.category_selling_type !== "all") {
        notify("info", `${t("This item is already added")}`);
        return;
      }

      const updatedIdentities = identitiesCheckedItems.map((identity) => {
        if (identity.id !== id) return identity;

        const updatedItems = [
          // Add the new item if it doesn't already exist
          ...(!identity.items.some((item) => item.id === newItem.id)
            ? [{ ...newItem, status: "Checked" }]
            : []),
          // Update weight if the item already exists
          ...identity.items.map((item) =>
            item.id === newItem.id
              ? { ...item, weight: Number(newItem.weight), kitItems: newItem }
              : item
          ),
        ];

        return {
          ...identity,
          items: updatedItems,
          totalItems: updatedItems.length,
          totalWeight: updatedItems.reduce(
            (sum: number, item: Item) => sum + Number(item.weight),
            0
          ),
        };
      });
      handleItemIdentity(newItem);
      setIdentitiesCheckedItems(updatedIdentities);
      localStorage.setItem(
        "identitiesCheckedItems",
        JSON.stringify(updatedIdentities)
      );
      playBeep(200);
    } else {
      // Check if the item is already in unknown items
      const itemAlreadyExistsInUnknowns = unknownIdentities.some(
        (item) => item.id === newItem.id
      );

      if (itemAlreadyExistsInUnknowns) {
        notify("info", `${t("This item is already added to unknown items.")}`);
        return;
      }

      // Add item to unknown identities
      const updatedUnknowns = [
        { ...newItem, status: "Unknown" },
        ...unknownIdentities,
      ];

      setUnknownIdentities(updatedUnknowns);
      localStorage.setItem(
        "unknownIdentities",
        JSON.stringify(updatedUnknowns)
      );
      playBeep(1000);
    }
  };

  const { data } = useFetch({
    queryKey: ["branch-all-accepted-items", search],
    pagination: true,
    endpoint: `/inventory/api/v1/getItembyhwya/${userData?.branch_id}?hwya[lk]=${search}`,
    onSuccess: (data) => {
      setSelectedItem(data?.data);
      const isKit =
        data?.data?.weightitems?.length &&
        data?.data?.weightitems?.some((item) => item.status === 1);

      if (data?.data?.category_selling_type === "all") {
        setEditWeight(data?.data);
        setOpenWeightItem(true);
      } else if (isKit) {
        setOpenKitItems(true);
      } else {
        addItemToIdentity(currenGroupNumber, data?.data, true);
      }
      setSearch("");
    },
    enabled: !!search,
  });

  const {
    data: nextGroup,
    isLoading: isNextGroupLoading,
    refetch: refetchNextGroup,
  } = useFetch({
    endpoint: `/inventory/api/v1/next-group/${userData?.branch_id}/${id}`,
    queryKey: ["next-group"],
  });

  const handleSuccess = (data) => {
    notify("success");
    localStorage.setItem("currenGroupNumber", JSON.stringify(data?.id));
    setCurrenGroupNumber(JSON.parse(localStorage.getItem("currenGroupNumber")));

    setIdentitiesCheckedItems((prev) => {
      const updatedItems = [
        ...prev,
        {
          id: data?.id,
          groupName: data?.group_name,
          totalItems: 0,
          totalWeight: 0,
          items: [],
        },
      ];

      localStorage.setItem(
        "identitiesCheckedItems",
        JSON.stringify(updatedItems)
      );

      return updatedItems;
    });

    refetchNextGroup();
  };

  const { mutate, isLoading: isLoadingMutate } = useMutate({
    mutationFn: mutateData,
    onSuccess: (data) => handleSuccess(data),
  });

  const { mutate: mutateItemIdentity, isLoading: isLoadingItemIdentity } =
    useMutate({
      mutationFn: mutateData,
    });

  const handleItemIdentity = async (data) => {
    const kitItems = data?.weightitems?.map((item) => ({
      category_id: item.category_id,
      weight: item.weight,
    }));

    mutateItemIdentity({
      endpointName: `/inventory/api/v1/group-item`,
      values: {
        item_id: data?.item_id,
        group_id: currenGroupNumber,
        weight: Number(data?.weight),
        kitItems: data?.weightitems?.length ? kitItems : null,
      },
    });
  };

  const handleCreateGroups = async () => {
    const groupHasEmptyItems = identitiesCheckedItems.some(
      (identity) => identity.items?.length === 0
    );

    if (groupHasEmptyItems) {
      notify("info", `${t("Group already created")}`);
      return;
    }

    mutate({
      endpointName: `/inventory/api/v1/inventorygroups`,
      values: {
        inventory_id: id,
        group_name: numbers?.[Number(nextGroup?.group_num - 1)],
        employee_id: userData?.id,
        branch_id: userData?.branch_id,
      },
    });
  };

  // End Of The Inventory Process For Employees
  const handleSuccessInventoryData = () => {
    notify("success");
    [
      "currenGroupNumber",
      "unknownIdentities",
      "identitiesCheckedItems",
    ].forEach((key) => localStorage.removeItem(key));
    navigate("/selling/inventory/view");
  };

  const { mutate: mutateInventoryData, isLoading: isLoadingInventoryData } =
    useMutate({
      mutationFn: mutateData,
      onSuccess: handleSuccessInventoryData,
    });

  const handlePostInventoryData = () => {
    const lostItems = unknownIdentities.map((item) => ({
      inventory_id: id,
      branch_id: userData?.branch_id,
      ...item,
    }));

    mutateInventoryData({
      endpointName: `/inventory/api/v1/missinginventories`,
      values: {
        branch_id: userData?.branch_id,
        employee_id: userData?.id,
        type_employe: true,
        inventory_id: id,
        lostItems,
      },
    });
  };
  // End Of The Inventory Process For Employees

  return (
    <div className="px-10 py-8">
      <div className="flex items-center justify-between text-mainGreen border-b-2 pb-3">
        <h2 className="text-xl font-semibold ">{t("Inventory")}</h2>
        <p className="font-semibold">
          {t("Inventory of new gold, diamonds and miscellaneous")}
        </p>
      </div>
      <Formik initialValues={{ search: "" }} onSubmit={(values) => {}}>
        {({ values }) => {
          console.log("🚀 ~ values:", values);
          return (
            <Form>
              <div className="flex items-end gap-x-8">
                <Button
                  bordered
                  className="flex items-center gap-x-2"
                  loading={isLoadingMutate}
                  action={() => {
                    handleCreateGroups();
                  }}
                >
                  <AddIcon size={22} />
                  <span>{t("Create a group")}</span>
                </Button>

                <div className="flex gap-2 items-center justify-center rounded-md  p-1">
                  <BaseInputField
                    id="search"
                    name="search"
                    autoFocus
                    label={`${t("id code")}`}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={`${t("id code")}`}
                    className="placeholder-slate-400  w-80 !shadow-transparent focus:border-transparent"
                  />
                </div>

                <div className="bg-mainGreen rounded-full py-1.5 px-8 text-white">
                  <h2>{t("first group")}</h2>
                </div>
              </div>

              <ul className="grid grid-cols-4 gap-6 mb-5 my-5">
                {totals.map(({ name, key, unit, value }) => (
                  <BoxesDataBase variant="secondary" key={key}>
                    <p className="bg-mainOrange px-2 py-4 flex items-center justify-center rounded-t-xl">
                      {name}
                    </p>
                    <p className="bg-white px-2 py-[7px] text-black rounded-b-xl">
                      {formatReyal(Number(value))} {t(unit)}
                    </p>
                  </BoxesDataBase>
                ))}
              </ul>

              <div className="flex items-center gap-x-4 w-full bg-[#295E5608] py-8 rounded-2xl">
                <div className="w-[30%]">
                  <AvailableItemsInBranch
                    selectedItem={selectedItem}
                    setSelectedItem={setSelectedItem}
                    availableItems={availableItems}
                    setAvailableItems={setAvailableItems}
                    setNumberItemsInBranch={setNumberItemsInBranch}
                    activeTableId={activeTableId}
                    setActiveTableId={setActiveTableId}
                  />
                </div>
                <div className="w-[30%]">
                  <IdentitiesCheckedByBranch
                    identitiesCheckedItems={identitiesCheckedItems}
                    setIdentitiesCheckedItems={setIdentitiesCheckedItems}
                    currenGroupNumber={currenGroupNumber}
                    setOpenWeightItem={setOpenWeightItem}
                    setEditWeight={setEditWeight}
                    setSelectedItem={setSelectedItem}
                    activeTableId={activeTableId}
                    setActiveTableId={setActiveTableId}
                  />
                </div>
                <div className="w-[30%]">
                  <UnknownIdentitiesInBranch
                    unknownIdentities={unknownIdentities}
                    setUnknownIdentities={setUnknownIdentities}
                    setOpenDetailsItem={setOpenDetailsItem}
                    setUnknownItemDetails={setUnknownItemDetails}
                    setSelectedItem={setSelectedItem}
                    activeTableId={activeTableId}
                    setActiveTableId={setActiveTableId}
                  />
                </div>
                <div className="w-[25%]">
                  <IdentityInformationInBranch
                    selectedItem={selectedItem}
                    setSelectedItem={setSelectedItem}
                    setOpenDetailsItem={setOpenDetailsItem}
                  />
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>

      {/* Edit Weight Item */}
      <Modal
        onClose={() => setOpenWeightItem(false)}
        isOpen={openWeightItem}
        title={`${t("Enter weight for a piece")}`}
      >
        <WeightAdjustmentInBranch
          editWeight={editWeight}
          setIdentitiesCheckedItems={setIdentitiesCheckedItems}
          setOpenWeightItem={setOpenWeightItem}
          currenGroupNumber={currenGroupNumber}
          addItemToIdentity={addItemToIdentity}
        />
      </Modal>

      {/* kit Items */}
      <Modal
        onClose={() => setOpenKitItems(false)}
        isOpen={openKitItems}
        title={`${t("Enter weight for a piece")}`}
      >
        <InventoryKitInBranch
          selectedItem={selectedItem}
          setIdentitiesCheckedItems={setIdentitiesCheckedItems}
          kitItemsData={kitItemsData}
          setKitItemsData={setKitItemsData}
          addItemToIdentity={addItemToIdentity}
          currenGroupNumber={currenGroupNumber}
          setOpenKitItems={setOpenKitItems}
        />
      </Modal>

      {/* Show Details Item */}
      <Modal
        isOpen={openDetailsItem}
        onClose={() => {
          setOpenDetailsItem(false);
        }}
      >
        <ShowDetailsItemOfInventory itemDetails={!!selectedItem ? [selectedItem] : []} />
      </Modal>

      <div>
        {userData?.role_id === 3 ? (
          <div className="flex justify-end mt-5">
            <Button
              action={() => {
                setSteps(2);
              }}
            >
              {t("next")}
            </Button>
          </div>
        ) : (
          <div className="flex justify-end mt-5">
            <Button
              loading={isLoadingInventoryData}
              action={handlePostInventoryData}
            >
              {t("save")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryNewGoldDiamondsMiscellaneous;
