import { Form, Formik } from "formik";
import { t } from "i18next";
import { useContext, useEffect, useState } from "react";
import { Button, Spinner } from "../../../components/atoms";
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
import { Group_TP } from "./CreatingInventoryBond";
import { Loading } from "../../../components/organisms/Loading";

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

type ResponseData = {
  id: string;
  group_name?: string;
};

type SuccessParams = {
  data?: ResponseData;
  dataNode?: ResponseData;
};

interface InventoryNewGoldDiamondsMiscellaneousProps {
  currenGroup: Group_TP | null;
  setCurrenGroup: (value: Group_TP) => void;
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
  isGetTenantFromUrl?: string;
  SOCKET_SERVER_URL?: string;
  socket?: any;
}

const InventoryNewGoldDiamondsMiscellaneous: React.FC<
  InventoryNewGoldDiamondsMiscellaneousProps
> = ({
  setSteps,
  currenGroup,
  setCurrenGroup,
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
  isGetTenantFromUrl,
  SOCKET_SERVER_URL,
  socket,
}) => {
  console.log("🚀 ~ InventoryNewGoldDiamondsMiscellaneous ~ socket:", socket);
  console.log(
    "🚀 ~ InventoryNewGoldDiamondsMiscellaneous ~ identitiesCheckedItems:",
    identitiesCheckedItems
  );
  const { id } = useParams<{ id: string }>();
  const { userData } = useContext(authCtx);
  const { formatReyal } = numberContext();
  const [isInputBusy, setIsInputBusy] = useState(false);

  const navigate = useNavigate();
  const [search, setSearch] = useState<string>("");
  const [openDetailsItem, setOpenDetailsItem] = useState(false);
  const [unknownItemDetails, setUnknownItemDetails] = useState<any>({});
  const [openWeightItem, setOpenWeightItem] = useState(false);
  const [openKitItems, setOpenKitItems] = useState(false);
  const [kitItemsData, setKitItemsData] = useState([]);
  const [editWeight, setEditWeight] = useState({});
  const [activeTableId, setActiveTableId] = useState<string | null>(null);
  const [nextGroup, setNextGroup] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  // const [responsesReceived, setResponsesReceived] = useState({
  //   bondItems: false,
  //   roomData: false,
  //   missingPieces: false,
  // });

  const numbers = ConvertNumberToWordGroup();

  const BasicCompanyData = {
    branchId: userData?.branch_id,
    inventoryId: id,
    companyKey: isGetTenantFromUrl,
  };
  console.log("🚀 ~ BasicCompanyData:", BasicCompanyData);

  const totalidentitiesCheckedItems = identitiesCheckedItems?.reduce(
    (sum, group) => sum + (group.items?.length || 0),
    0
  );

  const totals: Totals[] = [
    {
      name: t("Number of items in the branch"),
      key: crypto.randomUUID(),
      unit: "item",
      value: availableItems?.length,
    },
    {
      name: t("Number of items inspected"),
      key: crypto.randomUUID(),
      unit: "item",
      value: totalidentitiesCheckedItems,
    },
    {
      name: t("Uninspected items"),
      key: crypto.randomUUID(),
      unit: "item",
      value: availableItems?.length - totalidentitiesCheckedItems,
    },
    {
      name: t("Unidentified items"),
      key: crypto.randomUUID(),
      unit: "item",
      value: unknownIdentities?.length,
    },
  ];

  useEffect(() => {
    setNextGroup(identitiesCheckedItems?.length);
  }, [identitiesCheckedItems?.length]);

  // useEffect(() => {
  //   const allReceived = Object.values(responsesReceived).every(Boolean);
  //   if (allReceived) setLoading(false);
  // }, [responsesReceived]);

  const handleBondItemsResponse = (data: any) => {
    setAvailableItems(data.success ? data?.data?.items : []);
    setLoading(false);
  };

  const handleRoomData = (data: any) => {
    setIdentitiesCheckedItems(data.success ? data?.data : []);
    setIsInputBusy(false);
  };

  const handleUnknownIdentitiesData = (data: any) => {
    setUnknownIdentities(data.success ? data?.data : []);
    setIsInputBusy(false);
  };

  useEffect(() => {
    const setupListeners = () => {
      socket
        .off("getBondItemsResponse")
        .on("getBondItemsResponse", handleBondItemsResponse);
      socket.off("roomData").on("roomData", handleRoomData);
      socket
        .off("getmissingPieceResponse")
        .on("getmissingPieceResponse", handleUnknownIdentitiesData);
    };

    const emitRequests = () => {
      socket.emit("joinBranch", BasicCompanyData);
      socket.emit("getBondItems", BasicCompanyData);
      socket.emit("getRooms", BasicCompanyData);
      socket.emit("getmissingPieces", BasicCompanyData);
    };

    if (socket.connected) {
      setupListeners();
      emitRequests();
    } else {
      socket.once("connect", () => {
        setupListeners();
        emitRequests();
      });

      socket.connect();
    }

    return () => {
      socket.off("getBondItemsResponse", handleBondItemsResponse);
      socket.off("roomData", handleRoomData);
      socket.off("getmissingPieceResponse", handleUnknownIdentitiesData);
      socket.off("connect");
      socket.disconnect();
    };
  }, []);

  // useEffect(() => {
  //   socket.on("connect");

  //   socket.emit("joinBranch", BasicCompanyData);

  //   socket.emit("getBondItems", BasicCompanyData);
  //   socket.on("getBondItemsResponse", handleBondItemsResponse);

  //   socket.emit("getRooms", BasicCompanyData);
  //   socket.on("roomData", handleRoomData);

  //   socket.emit("getmissingPieces", BasicCompanyData);
  //   // socket.on("getmissingPieceResponse", handleUnknownIdentitiesData);
  //   socket.on("getmissingPieceResponse", handleUnknownIdentitiesData);

  //   return () => {
  //     socket.off("getBondItemsResponse", handleBondItemsResponse);
  //     socket.off("roomData", handleRoomData);
  //     // socket.off("getmissingPieces", handleUnknownIdentitiesData);
  //     socket.off("getmissingPieceResponse", handleUnknownIdentitiesData);
  //     socket.disconnect();
  //   };
  // }, []);

  const addItemToIdentity = (id: string, newItem: Item, isChecked: boolean) => {
    const isGroupExists = identitiesCheckedItems.some(
      (identity) => identity?._id === id
    );

    if (!isGroupExists) {
      notify("info", `${t("A group must be created first.")}`);
      return;
    }

    if (newItem?.is_exist && isChecked) {
      handleCheckedItem(id, newItem);
    } else {
      handleUnknownItem(newItem);
    }
  };

  const handleAddPieceToRoom = (item: any) => {
    if (!currenGroup?.id) {
      notify("info", `${t("Missing room ID")}`);
      setIsInputBusy(false);
      return;
    }

    const payload = {
      roomId: currenGroup?.id,
      isWeight: item.category_selling_type === "all" ? 1 : 0,
      karat_name:
        item.classification_id === 1 ? item.karat_name : item.karatmineral_name,
      classification_name: item.classification_name,
      category_id: item.category_id,
      category_name: item.category_name,
      weight: item.weight,
      hwya: item.hwya,
      itemId: item.id,
      diamond_value: item.diamond_value,
    };

    socket.emit("addPieceToRoom", payload);

    socket.on("addPieceToRoomResponse", () => {
      socket.emit("getBondItems", BasicCompanyData);
      socket.on("getBondItemsResponse", handleBondItemsResponse);

      socket.emit("getRooms", BasicCompanyData);
      socket.on("roomData", handleRoomData);

      setIsInputBusy(false);
    });

    return () => {
      socket.off("getBondItemsResponse", handleBondItemsResponse);
      socket.off("roomData", handleRoomData);
      socket.disconnect();
    };
  };

  const handleAddMissingPieces = (item: any) => {
    const payload = {
      ...BasicCompanyData,
      karat_id: item.karat_id,
      mineral_id: item.mineral_id,
      karat_name:
        item.classification_id === 1 ? item.karat_name : item.karatmineral_name,
      classification_id: item.classification_id,
      classification_name: item.classification_name,
      category_id: item.category_id,
      category_name: item.category_name,
      weight: item.weight,
      hwya: item.hwya,
      itemId: item.id,
      Iban: item.Iban,
      wage: item.wage,
      diamond_value: item.diamond_value,
    };

    socket.emit("missingPieces", payload);

    socket.on("missingPieceResponse", () => {
      socket.emit("getBondItems", BasicCompanyData);
      socket.on("getBondItemsResponse", handleBondItemsResponse);

      socket.emit("getRooms", BasicCompanyData);
      socket.on("roomData", handleRoomData);

      socket.emit("getmissingPieces", BasicCompanyData);
      socket.on("getmissingPieceResponse", handleUnknownIdentitiesData);
      setIsInputBusy(false);
    });

    return () => {
      socket.off("getBondItemsResponse", handleBondItemsResponse);
      socket.off("roomData", handleRoomData);
      socket.off("getmissingPieces", handleUnknownIdentitiesData);
      socket.disconnect();
    };
  };

  const handleDeleteRoom = (roomId: string) => {
    if (!roomId) return;

    setIsInputBusy(true);

    const payload = {
      branchId: BasicCompanyData.branchId,
      inventoryId: BasicCompanyData.inventoryId,
      companyKey: BasicCompanyData.companyKey,
      roomId,
    };
    console.log("🚀 ~ handleDeleteRoom ~ payload:", payload);

    socket.emit("deleteRoomData", payload);
    socket.on("deleteRoom", handleRoomData);

    socket.emit("getBondItems", BasicCompanyData);
    socket.on("getBondItemsResponse", handleBondItemsResponse);

    socket.emit("getRooms", BasicCompanyData);
    socket.on("roomData", handleRoomData);

    setIsInputBusy(false);

    return () => {
      socket.off("deleteRoom", handleRoomData);
      socket.off("getBondItemsResponse", handleBondItemsResponse);
      socket.off("roomData", handleRoomData);
      socket.disconnect();
    };
  };

  const handleDeleteItemFromRoom = (pieceId: string, roomId: string) => {
    if (!roomId) return;

    setIsInputBusy(true);

    const payload = {
      branchId: BasicCompanyData.branchId,
      inventoryId: BasicCompanyData.inventoryId,
      companyKey: BasicCompanyData.companyKey,
      roomId,
      pieceId,
    };

    socket.emit("deletePieceResponse", payload);
    socket.on("deletePieceFromRoom", handleRoomData);

    socket.emit("getBondItems", BasicCompanyData);
    socket.on("getBondItemsResponse", handleBondItemsResponse);

    socket.emit("getRooms", BasicCompanyData);
    socket.on("roomData", handleRoomData);

    setIsInputBusy(false);

    return () => {
      socket.off("deletePieceFromRoom", handleRoomData);
      socket.off("getBondItemsResponse", handleBondItemsResponse);
      socket.off("roomData", handleRoomData);
      socket.disconnect();
    };
  };

  const handleCheckedItem = async (newItemId: string, newItem: Item) => {
    const group = identitiesCheckedItems.find(
      (identity) => identity?._id === newItemId
    );

    const isItemAlreadyInGroup = group.items.some(
      (item: any) => item.hwya === newItem.hwya
    );

    if (isItemAlreadyInGroup && newItem?.category_selling_type === "part") {
      notify("info", `${t("This item is already added")}`);
      return;
    }

    handleItemIdentity(newItem);

    handleAddPieceToRoom(newItem);
  };

  const handleUnknownItem = (newItem: Item) => {
    const isItemAlreadyInunknown = unknownIdentities.some(
      (item: any) => item.hwya === newItem.hwya
    );
    if (isItemAlreadyInunknown) {
      notify("info", `${t("This item is already added to unknown items.")}`);
      return;
    }

    handleAddMissingPieces(newItem);

    playBeep(1000);
  };

  const { data } = useFetch({
    queryKey: ["branch-all-accepted-items", search],
    pagination: true,
    endpoint: `/inventory/api/v1/getItembyhwya/${userData?.branch_id}?hwya[lk]=${search}`,
    enabled: Boolean(search),
    onSuccess: (data) => {
      if (!data?.data) return;

      const { weightitems, category_selling_type } = data?.data;
      const isKit = Boolean(
        weightitems?.length && weightitems.some((item) => item.status === 1)
      );

      setSelectedItem(data?.data);

      if (category_selling_type === "all") {
        setEditWeight(data.data);
        setOpenWeightItem(true);
      } else if (isKit) {
        setOpenKitItems(true);
      } else {
        addItemToIdentity(currenGroup?.id, data.data, true);
      }

      setSearch("");
    },
    onError: () => {
      setIsInputBusy(false); // allow retry on failure
    },
  });

  const { mutateAsync, isLoading: isLoadingMutate } = useMutate({
    mutationFn: mutateData,
    onSuccess: () => {
      socket.emit("getRooms", BasicCompanyData);
      socket.on("roomData", handleRoomData);

      notify("success", `${t("The group has been created successfully.")}`);
    },
  });

  const { mutateAsync: mutateGroupToNodeAsync } = useMutate({
    mutationFn: mutateData,
  });

  const handleSuccess = ({ data, dataNode }: SuccessParams): void => {
    const currentGroup = {
      number: data?.id,
      id: dataNode?.["_id"],
      groupName: dataNode?.groupName,
    };
    localStorage.setItem("currentGroup", JSON.stringify(currentGroup));

    const storedValue = localStorage.getItem("currentGroup");
    if (storedValue) {
      setCurrenGroup(JSON.parse(storedValue));
    }

    setIdentitiesCheckedItems((prev) => {
      const updatedItems = [
        ...prev,
        {
          id: currentGroup?.id,
          _id: currentGroup?.id,
          groupName: data?.group_name || "",
          totalItems: 0,
          totalWeight: 0,
          items: [],
        },
      ];

      return updatedItems;
    });

    // refetchNextGroup();
  };

  const { mutate: mutateItemIdentity } = useMutate({
    mutationFn: mutateData,
    onSuccess: () => {
      playBeep(200);
    },
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
        group_id: currenGroup?.number,
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

    const [response1, response2] = await Promise.all([
      mutateAsync({
        endpointName: `/inventory/api/v1/inventorygroups`,
        values: {
          inventory_id: id,
          group_name: numbers?.[Number(nextGroup)],
          employee_id: userData?.id,
          branch_id: userData?.branch_id,
        },
      }),
      mutateGroupToNodeAsync({
        endpointName: `${SOCKET_SERVER_URL}/api/room`,
        values: {
          branchId: String(userData?.branch_id),
          companyKey: isGetTenantFromUrl,
          employeeId: String(userData?.id),
          groupId: "0",
          groupName: numbers?.[Number(nextGroup)],
          inventoryId: String(id),
        },
      }),
    ]);

    handleSuccess({ data: response1, dataNode: response2 });
  };

  // Start Of The Inventory Process For Employees
  const handleSuccessInventoryData = () => {
    ["currenGroup", "weightItems"].forEach((key) =>
      localStorage.removeItem(key)
    );
    notify("success", `${t("The inventory process has been completed.")}`);
    navigate("/selling/inventory/view");
  };

  const { mutate: mutateInventoryData, isLoading: isLoadingInventoryData } =
    useMutate({
      mutationFn: mutateData,
      onSuccess: handleSuccessInventoryData,
    });

  const handlePostInventoryData = () => {
    mutateInventoryData({
      endpointName: `/inventory/api/v1/finishedInventories`,
      values: {
        branch_id: userData?.branch_id,
        employee_id: userData?.id,
        type_employe: true,
        inventory_id: id,
      },
    });
  };
  // End Of The Inventory Process For Employees

  // if (loading) return <Loading mainTitle="Inventory" />;

  return (
    <div className="px-10 py-8">
      <div className="flex items-center justify-between text-mainGreen border-b-2 pb-3">
        <h2 className="text-xl font-semibold ">{t("Inventory")}</h2>
        <p className="font-semibold">
          {t("Inventory of new gold, diamonds and miscellaneous")}
        </p>
      </div>
      <Formik initialValues={{ search: "" }} onSubmit={(values) => {}}>
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

            {/* <div className="flex gap-2 items-center justify-center rounded-md  p-1">
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
            </div> */}

            <div className="relative flex gap-2 items-center justify-center rounded-md p-1">
              <BaseInputField
                id="search"
                name="search"
                autoFocus
                label={`${t("id code")}`}
                type="text"
                value={search}
                onChange={(e) => {
                  const v = e.target.value;
                  setSearch(v);
                  setIsInputBusy(Boolean(v.trim()));
                }}
                placeholder={
                  isInputBusy ? `${t("loading")} ...` : `${t("id code")}`
                }
                disabled={
                  isInputBusy || isLoadingMutate || isLoadingInventoryData
                }
                className={`py-1.5
                  ${
                    (isInputBusy ||
                      isLoadingMutate ||
                      isLoadingInventoryData) &&
                    "bg-mainDisabled ps-12"
                  }
                  `}
              />
              {isInputBusy && (
                <div className="absolute right-3.5 top-[3.2rem] -translate-y-1/2">
                  <Spinner size="medium" className="" />
                </div>
              )}
            </div>

            {!!currenGroup?.groupName && (
              <div className="bg-mainGreen rounded-full py-1.5 px-8 text-white">
                <h2>
                  {t("group")} {currenGroup?.groupName}
                </h2>
              </div>
            )}
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
                isGetTenantFromUrl={isGetTenantFromUrl}
                SOCKET_SERVER_URL={SOCKET_SERVER_URL}
              />
            </div>
            <div className="w-[35%]">
              <IdentitiesCheckedByBranch
                identitiesCheckedItems={identitiesCheckedItems}
                setIdentitiesCheckedItems={setIdentitiesCheckedItems}
                currenGroup={currenGroup}
                setOpenWeightItem={setOpenWeightItem}
                setEditWeight={setEditWeight}
                setSelectedItem={setSelectedItem}
                activeTableId={activeTableId}
                setActiveTableId={setActiveTableId}
                handleDeleteRoom={handleDeleteRoom}
                handleDeleteItemFromRoom={handleDeleteItemFromRoom}
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
                setOpenDetailsItem={setOpenDetailsItem}
              />
            </div>
          </div>
        </Form>
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
          currenGroup={currenGroup}
          addItemToIdentity={addItemToIdentity}
          BasicCompanyData={BasicCompanyData}
          socket={socket}
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
          currenGroup={currenGroup}
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
        <ShowDetailsItemOfInventory
          itemDetails={!!selectedItem ? [selectedItem] : []}
        />
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
              {t("Finished")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryNewGoldDiamondsMiscellaneous;

// const { data: nextGroups, refetch: refetchNextGroup } = useFetch({
//   endpoint: `/inventory/api/v1/next-group/${userData?.branch_id}/${id}`,
//   queryKey: ["next-group"],
// });

// ---------------------------------------------------------------------------------
// NEW

// import { Form, Formik } from "formik";
// import { t } from "i18next";
// import { useCallback, useContext, useEffect, useState } from "react";
// import { Button } from "../../../components/atoms";
// import { AddIcon } from "../../../components/atoms/icons";
// import { BaseInputField, Modal } from "../../../components/molecules";
// import { BoxesDataBase } from "../../../components/atoms/card/BoxesDataBase";
// import AvailableItemsInBranch from "../../../components/selling/Inventory/AvailableItemsInBranch";
// import IdentitiesCheckedByBranch from "../../../components/selling/Inventory/IdentitiesCheckedByBranch";
// import UnknownIdentitiesInBranch from "../../../components/selling/Inventory/UnknownIdentitiesInBranch";
// import IdentityInformationInBranch from "../../../components/selling/Inventory/IdentityInformationInBranch";
// import ConvertNumberToWordGroup from "../../../utils/number to arabic words/convertNumToArWordGroup";
// import { numberContext } from "../../../context/settings/number-formatter";
// import { useFetch, useMutate } from "../../../hooks";
// import { notify } from "../../../utils/toast";
// import { authCtx } from "../../../context/auth-and-perm/auth";
// import { json, useNavigate, useParams } from "react-router-dom";
// import { mutateData } from "../../../utils/mutateData";
// import ShowDetailsItemOfInventory from "./ShowDetailsItemOfInventory";
// import WeightAdjustmentInBranch from "../../../components/selling/Inventory/WeightAdjustmentInBranch";
// import InventoryKitInBranch from "../../../components/selling/Inventory/InventoryKitInBranch";
// import { io } from "socket.io-client";
// import { Group_TP } from "./CreatingInventoryBond";

// const playBeep = (frequency: number) => {
//   const context = new (window.AudioContext || window.webkitAudioContext)();
//   const oscillator = context.createOscillator();
//   oscillator.type = "sine";
//   oscillator.frequency.setValueAtTime(frequency, context.currentTime);
//   oscillator.connect(context.destination);
//   oscillator.start();
//   oscillator.stop(context.currentTime + 0.2);
// };

// interface Totals {
//   name: string;
//   key: string;
//   unit: string;
//   value: number;
// }

// interface Item {
//   id: string;
//   weight?: number;
//   is_exist?: number;
//   [key: string]: any;
// }

// interface InventoryNewGoldDiamondsMiscellaneousProps {
//   currenGroup: Group_TP | null;
//   setCurrenGroup: (value: Group_TP) => void;
//   setSteps: (value: number) => void;
//   selectedItem: Item | null;
//   setSelectedItem: (item: any | null) => void;
//   availableItems: Item[];
//   setAvailableItems: (items: any[]) => void;
//   identitiesCheckedItems: any[];
//   setIdentitiesCheckedItems: (items: any[]) => void;
//   unknownIdentities: Item[];
//   setUnknownIdentities: (items: any[]) => void;
//   numberItemsInBranch: number;
//   setNumberItemsInBranch: (value: number) => void;

//   isGetTenantFromUrl?: string;
//   SOCKET_SERVER_URL?: string;
//   socket?: any;
// }

// type ResponseData = {
//   id: string;
//   group_name?: string;
// };

// type SuccessParams = {
//   data?: ResponseData;
//   dataNode?: ResponseData;
// };

// const InventoryNewGoldDiamondsMiscellaneous: React.FC<
//   InventoryNewGoldDiamondsMiscellaneousProps
// > = ({
//   setSteps,
//   currenGroup,
//   setCurrenGroup,
//   selectedItem,
//   setSelectedItem,
//   availableItems,
//   setAvailableItems,
//   identitiesCheckedItems,
//   setIdentitiesCheckedItems,
//   unknownIdentities,
//   setUnknownIdentities,
//   numberItemsInBranch,
//   setNumberItemsInBranch,
//   isGetTenantFromUrl,
//   SOCKET_SERVER_URL,
//   socket,
// }) => {
//   const [search, setSearch] = useState<string>("");
//   const numbers = ConvertNumberToWordGroup();
//   const { formatReyal } = numberContext();
//   const { userData } = useContext(authCtx);
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [openDetailsItem, setOpenDetailsItem] = useState(false);
//   const [unknownItemDetails, setUnknownItemDetails] = useState<any>({});
//   const [openWeightItem, setOpenWeightItem] = useState(false);
//   const [openKitItems, setOpenKitItems] = useState(false);
//   const [kitItemsData, setKitItemsData] = useState([]);
//   const [editWeight, setEditWeight] = useState({});
//   const [activeTableId, setActiveTableId] = useState<string | null>(null);

//   const BasicCompanyData = {
//     branchId: userData?.branch_id,
//     inventoryId: id,
//     companyKey: isGetTenantFromUrl,
//   };

//   const totalidentitiesCheckedItems = identitiesCheckedItems?.reduce(
//     (sum, group) => sum + (group.items?.length || 0),
//     0
//   );

//   const totals: Totals[] = [
//     {
//       name: t("Number of items in the branch"),
//       key: crypto.randomUUID(),
//       unit: "item",
//       value: availableItems?.length,
//     },
//     {
//       name: t("Number of items inspected"),
//       key: crypto.randomUUID(),
//       unit: "item",
//       value: totalidentitiesCheckedItems,
//     },
//     {
//       name: t("Uninspected items"),
//       key: crypto.randomUUID(),
//       unit: "item",
//       value: availableItems?.length - totalidentitiesCheckedItems,
//     },
//     {
//       name: t("Unidentified items"),
//       key: crypto.randomUUID(),
//       unit: "item",
//       value: unknownIdentities?.length,
//     },
//   ];

//   const addItemToIdentity = (id: number, newItem: Item, isChecked: boolean) => {
//     const isGroupExists = identitiesCheckedItems.some(
//       (identity) => identity?._id === id
//     );
//     if (!isGroupExists) {
//       notify("info", `${t("A group must be created first.")}`);
//       return;
//     }

//     if (newItem?.is_exist && isChecked) {
//       handleCheckedItem(id, newItem);
//     } else {
//       handleUnknownItem(newItem);
//     }
//   };

//   const handleBondItemsResponse = (data: any) => {
//     setAvailableItems(data.success ? data?.data?.items : []);
//   };

//   const handleRoomData = (data: any) => {
//     setIdentitiesCheckedItems(data.success ? data?.data : []);
//   };

//   const handleUnknownIdentitiesData = (data: any) => {
//     setUnknownIdentities(data.success ? data?.data : []);
//   };

//   const handleAddPieceToRoom = (item: any) => {
//     if (!currenGroup?.id) {
//       notify("info", `${t("Missing room ID")}`);
//       return;
//     }

//     const payload = {
//       roomId: currenGroup?.id,
//       isWeight: item.category_selling_type === "all" ? 1 : 0,
//       karat_name:
//         item.classification_id === 1 ? item.karat_name : item.karatmineral_name,
//       diamond_value: item.diamond_value,
//       classification_name: item.classification_name,
//       category_name: item.category_name,
//       weight: item.weight,
//       hwya: item.hwya,
//       itemId: item.id,
//     };

//     socket.emit("addPieceToRoom", payload);

//     socket.on("addPieceToRoomResponse", () => {
//       socket.emit("getBondItems", BasicCompanyData);

//       socket.on("getBondItemsResponse", handleBondItemsResponse);

//       socket.emit("getRooms", BasicCompanyData);

//       socket.on("roomData", handleRoomData);
//     });
//   };

//   const handleAddMissingPieces = (item: any) => {
//     const payload = {
//       ...BasicCompanyData,
//       karat_name:
//         item.classification_id === 1 ? item.karat_name : item.karatmineral_name,
//       diamond_value: item.diamond_value,
//       classification_name: item.classification_name,
//       category_name: item.category_name,
//       weight: item.weight,
//       hwya: item.hwya,
//       itemId: item.id,
//     };

//     socket.emit("missingPieces", payload);

//     socket.on("missingPieceResponse", () => {
//       socket.emit("getBondItems", BasicCompanyData);

//       socket.on("getBondItemsResponse", handleBondItemsResponse);

//       socket.emit("getRooms", BasicCompanyData);

//       socket.on("roomData", handleRoomData);

//       socket.emit("getmissingPieces", BasicCompanyData);

//       socket.on("getmissingPieceResponse", handleUnknownIdentitiesData);
//     });
//   };

//   // Handle checked items
//   const handleCheckedItem = async (newItemId: number, newItem: Item) => {
//     const group = identitiesCheckedItems.find(
//       (identity) => identity?._id === newItemId
//     );
//     const isItemAlreadyInGroup = group.items.some(
//       (item: any) => item.itemId === newItem.item_id
//     );

//     if (!group) return;

//     if (isItemAlreadyInGroup) {
//       notify("info", `${t("This item is already added")}`);
//       return;
//     }

//     // const updatedIdentities = identitiesCheckedItems.map((identity) =>
//     //   identity._id === newItemId
//     //     ? {
//     //         ...identity,
//     //         items: getUpdatedItems(identity.items, newItem),
//     //         totalItems: identity.items.length + 1,
//     //         totalWeight: identity.items.reduce(
//     //           (sum: number, item: Item) => sum + Number(item.weight),
//     //           Number(newItem.weight)
//     //         ),
//     //       }
//     //     : identity
//     // );

//     handleItemIdentity(newItem);

//     handleAddPieceToRoom(newItem);
//   };

//   // Get updated items list
//   // const getUpdatedItems = (items: Item[], newItem: Item) => {
//   //   return items.some((item) => item.id === newItem.id)
//   //     ? items.map((item) =>
//   //         item.id === newItem.id
//   //           ? { ...item, weight: Number(newItem.weight), kitItems: newItem }
//   //           : item
//   //       )
//   //     : [...items, { ...newItem, status: "Checked" }];
//   // };

//   // Handle unknown items
//   const handleUnknownItem = (newItem: Item) => {
//     if (unknownIdentities.some((item) => item.id === newItem.id)) {
//       notify("info", `${t("This item is already added to unknown items.")}`);
//       return;
//     }

//     // const updatedUnknowns = [
//     //   { ...newItem, status: "Unknown" },
//     //   ...unknownIdentities,
//     // ];
//     // setUnknownIdentities(updatedUnknowns);
//     // localStorage.setItem("unknownIdentities", JSON.stringify(updatedUnknowns));

//     handleAddMissingPieces(newItem);

//     playBeep(1000);
//   };

//   useEffect(() => {
//     socket.on("connect");

//     socket.emit("getBondItems", BasicCompanyData);

//     socket.on("getBondItemsResponse", handleBondItemsResponse);

//     socket.emit("getRooms", BasicCompanyData);

//     socket.on("roomData", handleRoomData);

//     socket.emit("getmissingPieces", BasicCompanyData);

//     socket.on("getmissingPieceResponse", handleUnknownIdentitiesData);

//     return () => {
//       socket.off("getBondItemsResponse", handleBondItemsResponse);
//       socket.off("roomData", handleRoomData);
//       socket.off("getmissingPieces", handleUnknownIdentitiesData);
//     };
//   }, []);

//   const { data } = useFetch({
//     queryKey: ["branch-all-accepted-items", search],
//     pagination: true,
//     endpoint: `/inventory/api/v1/getItembyhwya/${userData?.branch_id}?hwya[lk]=${search}`,
//     onSuccess: (data) => {
//       setSelectedItem(data?.data);
//       const isKit =
//         data?.data?.weightitems?.length &&
//         data?.data?.weightitems?.some((item) => item.status === 1);

//       if (data?.data?.category_selling_type === "all") {
//         setEditWeight(data?.data);
//         setOpenWeightItem(true);
//       } else if (isKit) {
//         setOpenKitItems(true);
//       } else {
//         addItemToIdentity(currenGroup?.id, data?.data, true);
//       }
//       setSearch("");
//     },
//     enabled: !!search,
//   });

//   const {
//     data: nextGroup,
//     isLoading: isNextGroupLoading,
//     refetch: refetchNextGroup,
//   } = useFetch({
//     endpoint: `/inventory/api/v1/next-group/${userData?.branch_id}/${id}`,
//     queryKey: ["next-group"],
//   });

//   const { mutateAsync, isLoading: isLoadingMutate } = useMutate({
//     mutationFn: mutateData,
//   });

//   const { mutateAsync: mutateGroupToNodeAsync } = useMutate({
//     mutationFn: mutateData,
//   });

//   const handleSuccess = ({ data, dataNode }: SuccessParams): void => {
//     const currentGroup = { number: data?.id, id: dataNode?.["_id"] };
//     localStorage.setItem("currentGroup", JSON.stringify(currentGroup));

//     const storedValue = localStorage.getItem("currentGroup");
//     if (storedValue) {
//       setCurrenGroup(JSON.parse(storedValue));
//     }

//     notify("success");

//     setIdentitiesCheckedItems((prev) => {
//       const updatedItems = [
//         ...prev,
//         {
//           id: currentGroup?.id,
//           _id: currentGroup?.id,
//           groupName: data?.group_name || "",
//           totalItems: 0,
//           totalWeight: 0,
//           items: [],
//         },
//       ];

//       return updatedItems;
//     });

//     refetchNextGroup();
//   };

//   const { mutate: mutateItemIdentity } = useMutate({
//     mutationFn: mutateData,
//     onSuccess: () => {
//       playBeep(200);
//     },
//   });

//   const { mutate: mutateItemIdentityNode } = useMutate({
//     mutationFn: mutateData,
//   });

//   const handleItemIdentity = async (data) => {
//     const kitItems = data?.weightitems?.map((item) => ({
//       category_id: item.category_id,
//       weight: item.weight,
//     }));

//     mutateItemIdentity({
//       endpointName: `/inventory/api/v1/group-item`,
//       values: {
//         item_id: data?.item_id,
//         group_id: currenGroup?.number,
//         weight: Number(data?.weight),
//         kitItems: data?.weightitems?.length ? kitItems : null,
//       },
//     });

//     // mutateItemIdentityNode({
//     //   endpointName: `${SOCKET_SERVER_URL}/api/room/${currenGroup?.id}/piece`,
//     //   values: {
//     //     karat_name:
//     //       data.classification_id === 1
//     //         ? data.karat_name
//     //         : data.karatmineral_name,
//     //     diamond_value: data.diamond_value,
//     //     classification_name: data.classification_name,
//     //     category_name: data.category_name,
//     //     weight: data.weight,
//     //     hwya: data.hwya,
//     //     itemId: data.id,
//     //   },
//     // });
//   };

//   const handleCreateGroups = async () => {
//     const groupHasEmptyItems = identitiesCheckedItems.some(
//       (identity) => identity.items?.length === 0
//     );

//     if (groupHasEmptyItems) {
//       notify("info", `${t("Group already created")}`);
//       return;
//     }

//     const [response1, response2] = await Promise.all([
//       mutateAsync({
//         endpointName: `/inventory/api/v1/inventorygroups`,
//         values: {
//           inventory_id: id,
//           group_name: numbers?.[Number(nextGroup?.group_num - 1)],
//           employee_id: userData?.id,
//           branch_id: userData?.branch_id,
//         },
//       }),
//       mutateGroupToNodeAsync({
//         endpointName: `${SOCKET_SERVER_URL}/api/room`,
//         values: {
//           branchId: String(userData?.branch_id),
//           companyKey: isGetTenantFromUrl,
//           employeeId: String(userData?.id),
//           groupId: "0",
//           groupName: numbers?.[Number(nextGroup?.group_num - 1)],
//           inventoryId: String(id),
//         },
//       }),
//     ]);

//     handleSuccess({ data: response1, dataNode: response2 });
//   };

//   // End Of The Inventory Process For Employees
//   const handleSuccessInventoryData = () => {
//     notify("success");
//     ["currenGroup", "unknownIdentities", "identitiesCheckedItems"].forEach(
//       (key) => localStorage.removeItem(key)
//     );
//     navigate("/selling/inventory/view");
//   };

//   const { mutate: mutateInventoryData, isLoading: isLoadingInventoryData } =
//     useMutate({
//       mutationFn: mutateData,
//       onSuccess: handleSuccessInventoryData,
//     });

//   const handlePostInventoryData = () => {
//     const lostItems = unknownIdentities.map((item) => ({
//       inventory_id: id,
//       branch_id: userData?.branch_id,
//       ...item,
//     }));

//     mutateInventoryData({
//       endpointName: `/inventory/api/v1/missinginventories`,
//       values: {
//         branch_id: userData?.branch_id,
//         employee_id: userData?.id,
//         type_employe: true,
//         inventory_id: id,
//         lostItems,
//       },
//     });
//   };
//   // End Of The Inventory Process For Employees

//   return (
//     <div className="px-10 py-8">
//       <div className="flex items-center justify-between text-mainGreen border-b-2 pb-3">
//         <h2 className="text-xl font-semibold ">{t("Inventory")}</h2>
//         <p className="font-semibold">
//           {t("Inventory of new gold, diamonds and miscellaneous")}
//         </p>
//       </div>
//       <Formik initialValues={{ search: "" }} onSubmit={(values) => {}}>
//         {({ values }) => {
//           return (
//             <Form>
//               <div className="flex items-end gap-x-8">
//                 <Button
//                   bordered
//                   className="flex items-center gap-x-2"
//                   loading={isLoadingMutate}
//                   action={() => {
//                     handleCreateGroups();
//                   }}
//                 >
//                   <AddIcon size={22} />
//                   <span>{t("Create a group")}</span>
//                 </Button>

//                 <div className="flex gap-2 items-center justify-center rounded-md  p-1">
//                   <BaseInputField
//                     id="search"
//                     name="search"
//                     autoFocus
//                     label={`${t("id code")}`}
//                     type="text"
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     placeholder={`${t("id code")}`}
//                     className="placeholder-slate-400  w-80 !shadow-transparent focus:border-transparent"
//                   />
//                 </div>

//                 <div className="bg-mainGreen rounded-full py-1.5 px-8 text-white">
//                   <h2>{t("first group")}</h2>
//                 </div>
//               </div>

//               <ul className="grid grid-cols-4 gap-6 mb-5 my-5">
//                 {totals.map(({ name, key, unit, value }) => (
//                   <BoxesDataBase variant="secondary" key={key}>
//                     <p className="bg-mainOrange px-2 py-4 flex items-center justify-center rounded-t-xl">
//                       {name}
//                     </p>
//                     <p className="bg-white px-2 py-[7px] text-black rounded-b-xl">
//                       {formatReyal(Number(value))} {t(unit)}
//                     </p>
//                   </BoxesDataBase>
//                 ))}
//               </ul>

//               <div className="flex items-center gap-x-4 w-full bg-[#295E5608] py-8 rounded-2xl">
//                 <div className="w-[30%]">
//                   <AvailableItemsInBranch
//                     selectedItem={selectedItem}
//                     setSelectedItem={setSelectedItem}
//                     availableItems={availableItems}
//                     setAvailableItems={setAvailableItems}
//                     setNumberItemsInBranch={setNumberItemsInBranch}
//                     activeTableId={activeTableId}
//                     setActiveTableId={setActiveTableId}
//                     isGetTenantFromUrl={isGetTenantFromUrl}
//                     SOCKET_SERVER_URL={SOCKET_SERVER_URL}
//                   />
//                 </div>
//                 <div className="w-[30%]">
//                   <IdentitiesCheckedByBranch
//                     identitiesCheckedItems={identitiesCheckedItems}
//                     setIdentitiesCheckedItems={setIdentitiesCheckedItems}
//                     currenGroup={currenGroup}
//                     setOpenWeightItem={setOpenWeightItem}
//                     setEditWeight={setEditWeight}
//                     setSelectedItem={setSelectedItem}
//                     activeTableId={activeTableId}
//                     setActiveTableId={setActiveTableId}
//                   />
//                 </div>
//                 <div className="w-[30%]">
//                   <UnknownIdentitiesInBranch
//                     unknownIdentities={unknownIdentities}
//                     setUnknownIdentities={setUnknownIdentities}
//                     setOpenDetailsItem={setOpenDetailsItem}
//                     setUnknownItemDetails={setUnknownItemDetails}
//                     setSelectedItem={setSelectedItem}
//                     activeTableId={activeTableId}
//                     setActiveTableId={setActiveTableId}
//                   />
//                 </div>
//                 <div className="w-[25%]">
//                   <IdentityInformationInBranch
//                     selectedItem={selectedItem}
//                     setSelectedItem={setSelectedItem}
//                     setOpenDetailsItem={setOpenDetailsItem}
//                   />
//                 </div>
//               </div>
//             </Form>
//           );
//         }}
//       </Formik>

//       {/* Edit Weight Item */}
//       <Modal
//         onClose={() => setOpenWeightItem(false)}
//         isOpen={openWeightItem}
//         title={`${t("Enter weight for a piece")}`}
//       >
//         <WeightAdjustmentInBranch
//           editWeight={editWeight}
//           setIdentitiesCheckedItems={setIdentitiesCheckedItems}
//           setOpenWeightItem={setOpenWeightItem}
//           currenGroup={currenGroup}
//           addItemToIdentity={addItemToIdentity}
//         />
//       </Modal>

//       {/* kit Items */}
//       <Modal
//         onClose={() => setOpenKitItems(false)}
//         isOpen={openKitItems}
//         title={`${t("Enter weight for a piece")}`}
//       >
//         <InventoryKitInBranch
//           selectedItem={selectedItem}
//           setIdentitiesCheckedItems={setIdentitiesCheckedItems}
//           kitItemsData={kitItemsData}
//           setKitItemsData={setKitItemsData}
//           addItemToIdentity={addItemToIdentity}
//           currenGroup={currenGroup}
//           setOpenKitItems={setOpenKitItems}
//         />
//       </Modal>

//       {/* Show Details Item */}
//       <Modal
//         isOpen={openDetailsItem}
//         onClose={() => {
//           setOpenDetailsItem(false);
//         }}
//       >
//         <ShowDetailsItemOfInventory
//           itemDetails={!!selectedItem ? [selectedItem] : []}
//         />
//       </Modal>

//       <div>
//         {userData?.role_id === 3 ? (
//           <div className="flex justify-end mt-5">
//             <Button
//               action={() => {
//                 setSteps(2);
//               }}
//             >
//               {t("next")}
//             </Button>
//           </div>
//         ) : (
//           <div className="flex justify-end mt-5">
//             <Button
//               loading={isLoadingInventoryData}
//               action={handlePostInventoryData}
//             >
//               {t("save")}
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default InventoryNewGoldDiamondsMiscellaneous;

// ---------------------------------------------------------------------------------
// OLD

// import { Form, Formik } from "formik";
// import { t } from "i18next";
// import { useContext, useEffect, useState } from "react";
// import { Button } from "../../../components/atoms";
// import { AddIcon } from "../../../components/atoms/icons";
// import { BaseInputField, Modal } from "../../../components/molecules";
// import { BoxesDataBase } from "../../../components/atoms/card/BoxesDataBase";
// import AvailableItemsInBranch from "../../../components/selling/Inventory/AvailableItemsInBranch";
// import IdentitiesCheckedByBranch from "../../../components/selling/Inventory/IdentitiesCheckedByBranch";
// import UnknownIdentitiesInBranch from "../../../components/selling/Inventory/UnknownIdentitiesInBranch";
// import IdentityInformationInBranch from "../../../components/selling/Inventory/IdentityInformationInBranch";
// import ConvertNumberToWordGroup from "../../../utils/number to arabic words/convertNumToArWordGroup";
// import { numberContext } from "../../../context/settings/number-formatter";
// import { useFetch, useMutate } from "../../../hooks";
// import { notify } from "../../../utils/toast";
// import { authCtx } from "../../../context/auth-and-perm/auth";
// import { json, useNavigate, useParams } from "react-router-dom";
// import { mutateData } from "../../../utils/mutateData";
// import ShowDetailsItemOfInventory from "./ShowDetailsItemOfInventory";
// import WeightAdjustmentInBranch from "../../../components/selling/Inventory/WeightAdjustmentInBranch";
// import InventoryKitInBranch from "../../../components/selling/Inventory/InventoryKitInBranch";
// import axios from "axios";
// import { io } from "socket.io-client";

// const playBeep = (frequency: number) => {
//   const context = new (window.AudioContext || window.webkitAudioContext)();
//   const oscillator = context.createOscillator();
//   oscillator.type = "sine";
//   oscillator.frequency.setValueAtTime(frequency, context.currentTime);
//   oscillator.connect(context.destination);
//   oscillator.start();
//   oscillator.stop(context.currentTime + 0.2);
// };

// interface Totals {
//   name: string;
//   key: string;
//   unit: string;
//   value: number;
// }

// interface Item {
//   id: string;
//   weight?: number;
//   is_exist?: number;
//   [key: string]: any;
// }

// interface InventoryNewGoldDiamondsMiscellaneousProps {
//   currenGroup: number | null;
//   setCurrenGroup: (value: any) => void;
//   setSteps: (value: number) => void;
//   selectedItem: Item | null;
//   setSelectedItem: (item: any | null) => void;
//   availableItems: Item[];
//   setAvailableItems: (items: any[]) => void;
//   identitiesCheckedItems: any[];
//   setIdentitiesCheckedItems: (items: any[]) => void;
//   unknownIdentities: Item[];
//   setUnknownIdentities: (items: any[]) => void;
//   numberItemsInBranch: number;
//   setNumberItemsInBranch: (value: number) => void;
//   isGetTenantFromUrl?: string;
//   SOCKET_SERVER_URL?: string;
// }

// type ResponseData = {
//   id: string;
//   group_name?: string;
// };

// type SuccessParams = {
//   data?: ResponseData;
//   dataNode?: ResponseData;
// };

// const InventoryNewGoldDiamondsMiscellaneous: React.FC<
//   InventoryNewGoldDiamondsMiscellaneousProps
// > = ({
//   setSteps,
//   currenGroup,
//   setCurrenGroup,
//   selectedItem,
//   setSelectedItem,
//   availableItems,
//   setAvailableItems,
//   identitiesCheckedItems,
//   setIdentitiesCheckedItems,
//   unknownIdentities,
//   setUnknownIdentities,
//   numberItemsInBranch,
//   setNumberItemsInBranch,
//   isGetTenantFromUrl,
//   SOCKET_SERVER_URL,
// }) => {
//   const [search, setSearch] = useState<string>("");
//   const numbers = ConvertNumberToWordGroup();
//   const { formatReyal } = numberContext();
//   const { userData } = useContext(authCtx);
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [openDetailsItem, setOpenDetailsItem] = useState(false);
//   const [unknownItemDetails, setUnknownItemDetails] = useState<any>({});
//   const [openWeightItem, setOpenWeightItem] = useState(false);
//   const [openKitItems, setOpenKitItems] = useState(false);
//   const [kitItemsData, setKitItemsData] = useState([]);
//   const [editWeight, setEditWeight] = useState({});
//   const [activeTableId, setActiveTableId] = useState<string | null>(null);

//   const totalNumberItemsInspected = identitiesCheckedItems?.reduce(
//     (count, group) => count + group.items.length,
//     0
//   );

//   const totals: Totals[] = [
//     {
//       name: t("Number of items in the branch"),
//       key: "1",
//       unit: "item",
//       value: numberItemsInBranch,
//     },
//     {
//       name: t("Number of items inspected"),
//       key: "2",
//       unit: "item",
//       value: totalNumberItemsInspected,
//     },
//     {
//       name: t("Uninspected items"),
//       key: "3",
//       unit: "item",
//       value: numberItemsInBranch - totalNumberItemsInspected,
//     },
//     {
//       name: t("Unidentified items"),
//       key: "4",
//       unit: "item",
//       value: unknownIdentities?.length,
//     },
//   ];

//   // useEffect(() => {
//   //   const socket = io(SOCKET_SERVER_URL);

//   //   socket.emit("getRooms", {
//   //     branchId: userData?.branch_id,
//   //     inventoryId: id,
//   //     companyKey: isGetTenantFromUrl,
//   //   });

//   //   socket.on("roomData", (data) => {
//   //     setIdentitiesCheckedItems(data.data);
//   //   });

//   //   socket.on("roomError", (error) => {
//   //     setIdentitiesCheckedItems(null);
//   //   });
//   // }, []);

//   const addItemToIdentity = (id: number, newItem: Item, isChecked: boolean) => {
//     const groupExists = identitiesCheckedItems.some(
//       (identity) => identity?.["_id"] == id
//     );
//     if (!groupExists) {
//       notify("info", `${t("A group must be created first.")}`);
//       return;
//     }

//     if (newItem?.is_exist && isChecked) {
//       const group = identitiesCheckedItems.find(
//         (identity) => identity?.["_id"] == id
//       );

//       const itemAlreadyExists = group?.items.some(
//         (item) => item.itemId == newItem.item_id
//       );

//       if (itemAlreadyExists && newItem?.category_selling_type !== "all") {
//         notify("info", `${t("This item is already added")}`);
//         return;
//       }

//       const updatedIdentities = identitiesCheckedItems.map((identity) => {
//         if (identity.id !== id) return identity;

//         const updatedItems = [
//           // Add the new item if it doesn't already exist
//           ...(!identity.items.some((item) => item.id === newItem.id)
//             ? [{ ...newItem, status: "Checked" }]
//             : []),
//           // Update weight if the item already exists
//           ...identity.items.map((item) =>
//             item.id === newItem.id
//               ? { ...item, weight: Number(newItem.weight), kitItems: newItem }
//               : item
//           ),
//         ];

//         return {
//           ...identity,
//           items: updatedItems,
//           totalItems: updatedItems.length,
//           totalWeight: updatedItems.reduce(
//             (sum: number, item: Item) => sum + Number(item.weight),
//             0
//           ),
//         };
//       });
//       handleItemIdentity(newItem);
//       // setIdentitiesCheckedItems(updatedIdentities);
//       // localStorage.setItem(
//       //   "identitiesCheckedItems",
//       //   JSON.stringify(updatedIdentities)
//       // );

//       const socket = io(SOCKET_SERVER_URL);

//       socket.emit("getRooms", {
//         branchId: userData?.branch_id,
//         inventoryId: id,
//         companyKey: isGetTenantFromUrl,
//       });

//       socket.on("roomData", (data) => {
//         setIdentitiesCheckedItems(data.data);
//       });

//       // socket.on("roomError", (error) => {
//       //   setIdentitiesCheckedItems(null);
//       // });

//       playBeep(200);
//     } else {
//       // Check if the item is already in unknown items
//       const itemAlreadyExistsInUnknowns = unknownIdentities.some(
//         (item) => item.id === newItem.id
//       );

//       if (itemAlreadyExistsInUnknowns) {
//         notify("info", `${t("This item is already added to unknown items.")}`);
//         return;
//       }

//       // Add item to unknown identities
//       const updatedUnknowns = [
//         { ...newItem, status: "Unknown" },
//         ...unknownIdentities,
//       ];

//       setUnknownIdentities(updatedUnknowns);
//       localStorage.setItem(
//         "unknownIdentities",
//         JSON.stringify(updatedUnknowns)
//       );
//       playBeep(1000);
//     }
//   };

//   const { data } = useFetch({
//     queryKey: ["branch-all-accepted-items", search],
//     pagination: true,
//     endpoint: `/inventory/api/v1/getItembyhwya/${userData?.branch_id}?hwya[lk]=${search}`,
//     onSuccess: (data) => {
//       setSelectedItem(data?.data);
//       const isKit =
//         data?.data?.weightitems?.length &&
//         data?.data?.weightitems?.some((item) => item.status === 1);

//       if (data?.data?.category_selling_type === "all") {
//         setEditWeight(data?.data);
//         setOpenWeightItem(true);
//       } else if (isKit) {
//         setOpenKitItems(true);
//       } else {
//         addItemToIdentity(currenGroup?.id, data?.data, true);
//       }
//       setSearch("");
//     },
//     enabled: !!search,
//   });

//   const {
//     data: nextGroup,
//     isLoading: isNextGroupLoading,
//     refetch: refetchNextGroup,
//   } = useFetch({
//     endpoint: `/inventory/api/v1/next-group/${userData?.branch_id}/${id}`,
//     queryKey: ["next-group"],
//   });

//   const { mutateAsync, isLoading: isLoadingMutate } = useMutate({
//     mutationFn: mutateData,
//     // onSuccess: (response?: ResponseData) => {
//     //   handleSuccess({ data: response });
//     // },
//   });

//   const { mutateAsync: mutateGroupToNodeAsync } = useMutate({
//     mutationFn: mutateData,
//     // onSuccess: (response?: ResponseData) => {
//     //   handleSuccess({ dataNode: response });
//     // },
//   });

//   const handleSuccess = ({ data, dataNode }: SuccessParams): void => {
//     // localStorage.removeItem("currentGroup")
//     const currentGroup = { number: data?.id, id: dataNode?.["_id"] };
//     localStorage.setItem("currentGroup", JSON.stringify(currentGroup));

//     const storedValue = localStorage.getItem("currentGroup");
//     if (storedValue) {
//       setCurrenGroup(JSON.parse(storedValue));
//     }

//     notify("success");

//     setIdentitiesCheckedItems((prev) => {
//       const updatedItems = [
//         ...prev,
//         {
//           id: currentGroup?.id,
//           _id: currentGroup?.id,
//           groupName: data?.group_name || "",
//           totalItems: 0,
//           totalWeight: 0,
//           items: [],
//         },
//       ];

//       // localStorage.setItem(
//       //   "identitiesCheckedItems",
//       //   JSON.stringify(updatedItems)
//       // );

//       return updatedItems;
//     });

//     refetchNextGroup();
//   };

//   const { mutate: mutateItemIdentity } = useMutate({
//     mutationFn: mutateData,
//   });

//   const { mutate: mutateItemIdentityNode } = useMutate({
//     mutationFn: mutateData,
//   });

//   const handleItemIdentity = async (data) => {
//     const kitItems = data?.weightitems?.map((item) => ({
//       category_id: item.category_id,
//       weight: item.weight,
//     }));

//     mutateItemIdentity({
//       endpointName: `/inventory/api/v1/group-item`,
//       values: {
//         item_id: data?.item_id,
//         group_id: currenGroup?.number,
//         weight: Number(data?.weight),
//         kitItems: data?.weightitems?.length ? kitItems : null,
//       },
//     });

//     mutateItemIdentityNode({
//       endpointName: `${SOCKET_SERVER_URL}/api/room/${currenGroup?.id}/piece`,
//       values: {
//         karat_name:
//           data.classification_id === 1
//             ? data.karat_name
//             : data.karatmineral_name,
//         diamond_value: data.diamond_value,
//         classification_name: data.classification_name,
//         category_name: data.category_name,
//         weight: data.weight,
//         hwya: data.hwya,
//         itemId: data.id,
//       },
//     });
//   };

//   const handleCreateGroups = async () => {
//     const groupHasEmptyItems = identitiesCheckedItems.some(
//       (identity) => identity.items?.length === 0
//     );

//     if (groupHasEmptyItems) {
//       notify("info", `${t("Group already created")}`);
//       return;
//     }

//     const [response1, response2] = await Promise.all([
//       mutateAsync({
//         endpointName: `/inventory/api/v1/inventorygroups`,
//         values: {
//           inventory_id: id,
//           group_name: numbers?.[Number(nextGroup?.group_num - 1)],
//           employee_id: userData?.id,
//           branch_id: userData?.branch_id,
//         },
//       }),
//       mutateGroupToNodeAsync({
//         endpointName: `${SOCKET_SERVER_URL}/api/room`,
//         values: {
//           branchId: String(userData?.branch_id),
//           companyKey: isGetTenantFromUrl,
//           employeeId: String(userData?.id),
//           groupId: "0",
//           groupName: numbers?.[Number(nextGroup?.group_num - 1)],
//           inventoryId: String(id),
//         },
//       }),
//     ]);

//     handleSuccess({ data: response1, dataNode: response2 });

//     // mutate({
//     //   endpointName: `/inventory/api/v1/inventorygroups`,
//     //   values: {
//     //     inventory_id: id,
//     //     group_name: numbers?.[Number(nextGroup?.group_num - 1)],
//     //     employee_id: userData?.id,
//     //     branch_id: userData?.branch_id,
//     //   },
//     // });

//     // mutateGroupToNode({
//     //   endpointName: `${SOCKET_SERVER_URL}/api/room`,
//     //   values: {
//     //     branchId: String(userData?.branch_id),
//     //     companyKey: isGetTenantFromUrl,
//     //     employeeId: String(userData?.id),
//     //     groupId: "0",
//     //     groupName: numbers?.[Number(nextGroup?.group_num - 1)],
//     //     inventoryId: String(id),
//     //   },
//     // });
//   };

//   // End Of The Inventory Process For Employees
//   const handleSuccessInventoryData = () => {
//     notify("success");
//     ["currenGroup", "unknownIdentities", "identitiesCheckedItems"].forEach(
//       (key) => localStorage.removeItem(key)
//     );
//     navigate("/selling/inventory/view");
//   };

//   const { mutate: mutateInventoryData, isLoading: isLoadingInventoryData } =
//     useMutate({
//       mutationFn: mutateData,
//       onSuccess: handleSuccessInventoryData,
//     });

//   const handlePostInventoryData = () => {
//     const lostItems = unknownIdentities.map((item) => ({
//       inventory_id: id,
//       branch_id: userData?.branch_id,
//       ...item,
//     }));

//     mutateInventoryData({
//       endpointName: `/inventory/api/v1/missinginventories`,
//       values: {
//         branch_id: userData?.branch_id,
//         employee_id: userData?.id,
//         type_employe: true,
//         inventory_id: id,
//         lostItems,
//       },
//     });
//   };
//   // End Of The Inventory Process For Employees

//   return (
//     <div className="px-10 py-8">
//       <div className="flex items-center justify-between text-mainGreen border-b-2 pb-3">
//         <h2 className="text-xl font-semibold ">{t("Inventory")}</h2>
//         <p className="font-semibold">
//           {t("Inventory of new gold, diamonds and miscellaneous")}
//         </p>
//       </div>
//       <Formik initialValues={{ search: "" }} onSubmit={(values) => {}}>
//         {({ values }) => {
//           return (
//             <Form>
//               <div className="flex items-end gap-x-8">
//                 <Button
//                   bordered
//                   className="flex items-center gap-x-2"
//                   loading={isLoadingMutate}
//                   action={() => {
//                     handleCreateGroups();
//                   }}
//                 >
//                   <AddIcon size={22} />
//                   <span>{t("Create a group")}</span>
//                 </Button>

//                 <div className="flex gap-2 items-center justify-center rounded-md  p-1">
//                   <BaseInputField
//                     id="search"
//                     name="search"
//                     autoFocus
//                     label={`${t("id code")}`}
//                     type="text"
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     placeholder={`${t("id code")}`}
//                     className="placeholder-slate-400  w-80 !shadow-transparent focus:border-transparent"
//                   />
//                 </div>

//                 <div className="bg-mainGreen rounded-full py-1.5 px-8 text-white">
//                   <h2>{t("first group")}</h2>
//                 </div>
//               </div>

//               <ul className="grid grid-cols-4 gap-6 mb-5 my-5">
//                 {totals.map(({ name, key, unit, value }) => (
//                   <BoxesDataBase variant="secondary" key={key}>
//                     <p className="bg-mainOrange px-2 py-4 flex items-center justify-center rounded-t-xl">
//                       {name}
//                     </p>
//                     <p className="bg-white px-2 py-[7px] text-black rounded-b-xl">
//                       {formatReyal(Number(value))} {t(unit)}
//                     </p>
//                   </BoxesDataBase>
//                 ))}
//               </ul>

//               <div className="flex items-center gap-x-4 w-full bg-[#295E5608] py-8 rounded-2xl">
//                 <div className="w-[30%]">
//                   <AvailableItemsInBranch
//                     selectedItem={selectedItem}
//                     setSelectedItem={setSelectedItem}
//                     availableItems={availableItems}
//                     setAvailableItems={setAvailableItems}
//                     setNumberItemsInBranch={setNumberItemsInBranch}
//                     activeTableId={activeTableId}
//                     setActiveTableId={setActiveTableId}
//                     isGetTenantFromUrl={isGetTenantFromUrl}
//                     SOCKET_SERVER_URL={SOCKET_SERVER_URL}
//                   />
//                 </div>
//                 <div className="w-[30%]">
//                   <IdentitiesCheckedByBranch
//                     identitiesCheckedItems={identitiesCheckedItems}
//                     setIdentitiesCheckedItems={setIdentitiesCheckedItems}
//                     currenGroup={currenGroup}
//                     setOpenWeightItem={setOpenWeightItem}
//                     setEditWeight={setEditWeight}
//                     setSelectedItem={setSelectedItem}
//                     activeTableId={activeTableId}
//                     setActiveTableId={setActiveTableId}
//                   />
//                 </div>
//                 <div className="w-[30%]">
//                   <UnknownIdentitiesInBranch
//                     unknownIdentities={unknownIdentities}
//                     setUnknownIdentities={setUnknownIdentities}
//                     setOpenDetailsItem={setOpenDetailsItem}
//                     setUnknownItemDetails={setUnknownItemDetails}
//                     setSelectedItem={setSelectedItem}
//                     activeTableId={activeTableId}
//                     setActiveTableId={setActiveTableId}
//                   />
//                 </div>
//                 <div className="w-[25%]">
//                   <IdentityInformationInBranch
//                     selectedItem={selectedItem}
//                     setSelectedItem={setSelectedItem}
//                     setOpenDetailsItem={setOpenDetailsItem}
//                   />
//                 </div>
//               </div>
//             </Form>
//           );
//         }}
//       </Formik>

//       {/* Edit Weight Item */}
//       <Modal
//         onClose={() => setOpenWeightItem(false)}
//         isOpen={openWeightItem}
//         title={`${t("Enter weight for a piece")}`}
//       >
//         <WeightAdjustmentInBranch
//           editWeight={editWeight}
//           setIdentitiesCheckedItems={setIdentitiesCheckedItems}
//           setOpenWeightItem={setOpenWeightItem}
//           currenGroup={currenGroup}
//           addItemToIdentity={addItemToIdentity}
//         />
//       </Modal>

//       {/* kit Items */}
//       <Modal
//         onClose={() => setOpenKitItems(false)}
//         isOpen={openKitItems}
//         title={`${t("Enter weight for a piece")}`}
//       >
//         <InventoryKitInBranch
//           selectedItem={selectedItem}
//           setIdentitiesCheckedItems={setIdentitiesCheckedItems}
//           kitItemsData={kitItemsData}
//           setKitItemsData={setKitItemsData}
//           addItemToIdentity={addItemToIdentity}
//           currenGroup={currenGroup}
//           setOpenKitItems={setOpenKitItems}
//         />
//       </Modal>

//       {/* Show Details Item */}
//       <Modal
//         isOpen={openDetailsItem}
//         onClose={() => {
//           setOpenDetailsItem(false);
//         }}
//       >
//         <ShowDetailsItemOfInventory
//           itemDetails={!!selectedItem ? [selectedItem] : []}
//         />
//       </Modal>

//       <div>
//         {userData?.role_id === 3 ? (
//           <div className="flex justify-end mt-5">
//             <Button
//               action={() => {
//                 setSteps(2);
//               }}
//             >
//               {t("next")}
//             </Button>
//           </div>
//         ) : (
//           <div className="flex justify-end mt-5">
//             <Button
//               loading={isLoadingInventoryData}
//               action={handlePostInventoryData}
//             >
//               {t("save")}
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default InventoryNewGoldDiamondsMiscellaneous;

// // const response = await axios.get(
// //   `${SOCKET_SERVER_URL}/api/room/${
// //     userData?.branch_id
// //   }/${isGetTenantFromUrl}/${userData?.id}/${0}/${encodeURIComponent(
// //     numbers?.[Number(nextGroup?.group_num - 1)]
// //   )}/${id}`
// // );

// // if (response.status === 200) {
// //   console.log("API Response:", response.data);
// // }
