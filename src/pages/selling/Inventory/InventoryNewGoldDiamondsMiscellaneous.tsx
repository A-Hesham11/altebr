import { Form, Formik } from "formik";
import { t } from "i18next";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

type SocketLike = {
  connected: boolean;
  connect: () => void;
  disconnect: () => void;
  emit: (event: string, payload?: any) => void;
  on: (event: string, cb: (...args: any[]) => void) => SocketLike;
  off: (event: string, cb?: (...args: any[]) => void) => SocketLike;
  once?: (event: string, cb: (...args: any[]) => void) => SocketLike;
};

interface Totals {
  name: string;
  unit: string;
  value: number;
  id: string;
}

interface Item {
  id: string;
  weight?: number;
  is_exist?: number;
  hwya?: string;
  category_selling_type?: "all" | "part";
  classification_id?: number;
  karat_name?: string;
  karatmineral_name?: string;
  classification_name?: string;
  category_id?: number;
  category_name?: string;
  diamond_value?: number;
  karat_id?: number;
  mineral_id?: number;
  Iban?: string;
  wage?: number;
  item_id?: string;
  weightitems?: { status: number; category_id: number; weight: number }[];
  [key: string]: any;
}

type ResponseData = {
  id: string;
  group_name?: string;
};

type SuccessParams = {
  data?: ResponseData;
  dataNode?: { _id?: string; groupName?: string };
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
  socket?: SocketLike;
}

type PendingKind = "known" | "missing";

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
  const { id } = useParams<{ id: string }>();
  const { userData } = useContext(authCtx);
  const { formatReyal } = numberContext();
  const navigate = useNavigate();

  // ui state
  const [isInputBusy, setIsInputBusy] = useState(false);

  const [search, setSearch] = useState<string>("");
  const [openDetailsItem, setOpenDetailsItem] = useState(false);
  const [openWeightItem, setOpenWeightItem] = useState(false);
  const [openKitItems, setOpenKitItems] = useState(false);
  const [kitItemsData, setKitItemsData] = useState<any[]>([]);
  const [editWeight, setEditWeight] = useState<any>({});
  const [activeTableId, setActiveTableId] = useState<string | null>(null);
  const [nextGroup, setNextGroup] = useState<number>(0);
  const [deletingPieceIds, setDeletingPieceIds] = useState<Set<string>>(
    new Set()
  );
  const [deletingRoomIds, setDeletingRoomIds] = useState<Set<string>>(
    new Set()
  );

  // pending add guard
  const [pendingAdd, setPendingAdd] = useState<{
    hwya: string;
    opsLeft: number;
    kind: PendingKind;
  } | null>(null);

  const numbers = ConvertNumberToWordGroup();

  // audio
  const audioCtxRef = useRef<AudioContext | null>(null);
  const playBeep = useCallback((frequency: number) => {
    try {
      if (!audioCtxRef.current) {
        const Ctx =
          (window as any).AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new Ctx();
      }
      const ctx = audioCtxRef.current!;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      osc.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {
      // ignore
    }
  }, []);

  // company data
  const BasicCompanyData = useMemo(
    () => ({
      branchId: userData?.branch_id,
      inventoryId: id,
      companyKey: isGetTenantFromUrl,
    }),
    [userData?.branch_id, id, isGetTenantFromUrl]
  );

  // derived counts
  const totalIdentitiesChecked = useMemo(
    () =>
      identitiesCheckedItems?.reduce(
        (sum: number, group: any) => sum + (group.items?.length || 0),
        0
      ),
    [identitiesCheckedItems]
  );

  const totals: Totals[] = useMemo(
    () => [
      {
        id: "branch-items",
        name: t("Number of items in the branch"),
        unit: "item",
        value: availableItems?.length || 0,
      },
      {
        id: "inspected-items",
        name: t("Number of items inspected"),
        unit: "item",
        value: totalIdentitiesChecked || 0,
      },
      {
        id: "uninspected-items",
        name: t("Uninspected items"),
        unit: "item",
        value: Math.max(
          (availableItems?.length || 0) - (totalIdentitiesChecked || 0),
          0
        ),
      },
      {
        id: "unidentified-items",
        name: t("Unidentified items"),
        unit: "item",
        value: unknownIdentities?.length || 0,
      },
    ],
    [availableItems?.length, totalIdentitiesChecked, unknownIdentities?.length]
  );

  useEffect(() => {
    setNextGroup(identitiesCheckedItems?.length || 0);
  }, [identitiesCheckedItems?.length]);

  // socket handlers
  const handleBondItemsResponse = useCallback(
    (data: any) => {
      const items = data?.success ? data?.data?.items || [] : [];
      setAvailableItems(items);

      if (pendingAdd?.hwya) {
        const stillAvailable = items.some(
          (it: any) => it.hwya === pendingAdd.hwya
        );
        if (!stillAvailable) {
          setPendingAdd((prev) =>
            prev ? { ...prev, opsLeft: prev.opsLeft - 1 } : prev
          );
        }
      }
    },
    [setAvailableItems, pendingAdd]
  );

  const handleRoomData = useCallback(
    (data: any) => {
      const rooms = data?.success ? data?.data || [] : data;
      setIdentitiesCheckedItems(rooms);

      if (pendingAdd?.hwya) {
        const foundInAnyRoom = Array.isArray(rooms)
          ? rooms.some((g: any) =>
              g?.items?.some((it: any) => it.hwya === pendingAdd.hwya)
            )
          : false;

        if (foundInAnyRoom) {
          setPendingAdd((prev) =>
            prev ? { ...prev, opsLeft: prev.opsLeft - 1 } : prev
          );
        }
      }
    },
    [setIdentitiesCheckedItems, pendingAdd]
  );

  const handleUnknownIdentitiesData = useCallback(
    (data: any) => {
      const list = data?.success ? data?.data || [] : [];
      setUnknownIdentities(list);

      if (pendingAdd?.kind === "missing" && pendingAdd?.hwya) {
        const stillUnknown = list.some(
          (it: any) => it.hwya === pendingAdd.hwya
        );
        if (!stillUnknown) {
          setPendingAdd((prev) =>
            prev ? { ...prev, opsLeft: prev.opsLeft - 1 } : prev
          );
        }
      }
    },
    [setUnknownIdentities, pendingAdd]
  );

  // complete pending add when both confirmations land
  useEffect(() => {
    if (pendingAdd && pendingAdd.opsLeft <= 0) {
      setIsInputBusy(false);
      setPendingAdd(null);
      setSearch("");
    }
  }, [pendingAdd]);

  // socket lifecycle
  useEffect(() => {
    if (!socket || !BasicCompanyData.branchId || !BasicCompanyData.inventoryId)
      return;

    const attachAll = () => {
      socket
        .off("getBondItemsResponse", handleBondItemsResponse)
        .on("getBondItemsResponse", handleBondItemsResponse);
      socket.off("roomData", handleRoomData).on("roomData", handleRoomData);
      socket
        .off("getmissingPieceResponse", handleUnknownIdentitiesData)
        .on("getmissingPieceResponse", handleUnknownIdentitiesData);

      const addPieceCb = () => {
        socket.emit("getBondItems", BasicCompanyData);
        socket.emit("getRooms", BasicCompanyData);
      };
      const missingPieceCb = () => {
        socket.emit("getBondItems", BasicCompanyData);
        socket.emit("getRooms", BasicCompanyData);
        socket.emit("getmissingPieces", BasicCompanyData);
      };
      const deletePieceCb = (payload?: { pieceId?: string }) => {
        socket.emit("getBondItems", BasicCompanyData);
        socket.emit("getRooms", BasicCompanyData);
        socket.emit("getmissingPieces", BasicCompanyData);
        setDeletingPieceIds((prev) => {
          const next = new Set(prev);
          if (payload?.pieceId) next.delete(payload.pieceId);
          return next;
        });
      };
      const deleteRoomCb = (payload?: { roomId?: string }) => {
        handleRoomData(payload);
        socket.emit("getBondItems", BasicCompanyData);
        socket.emit("getmissingPieces", BasicCompanyData);
        setDeletingRoomIds((prev) => {
          const next = new Set(prev);
          if (payload?.roomId) next.delete(payload.roomId);
          return next;
        });
      };

      socket
        .off("addPieceToRoomResponse", addPieceCb)
        .on("addPieceToRoomResponse", addPieceCb);
      socket
        .off("missingPieceResponse", missingPieceCb)
        .on("missingPieceResponse", missingPieceCb);
      socket
        .off("deletePieceResponse", deletePieceCb)
        .on("deletePieceResponse", deletePieceCb);
      socket
        .off("deleteRoomData", deleteRoomCb)
        .on("deleteRoomData", deleteRoomCb);
    };

    const emitInitial = () => {
      socket.emit("joinBranch", BasicCompanyData);
      socket.emit("getBondItems", BasicCompanyData);
      socket.emit("getRooms", BasicCompanyData);
      socket.emit("getmissingPieces", BasicCompanyData);
    };

    if (socket.connected) {
      attachAll();
      emitInitial();
    } else if (socket.once) {
      socket.once("connect", () => {
        attachAll();
        emitInitial();
      });
      socket.connect();
    } else {
      socket.connect();
      attachAll();
      emitInitial();
    }

    return () => {
      if (!socket) return;
      socket.off("getBondItemsResponse", handleBondItemsResponse);
      socket.off("roomData", handleRoomData);
      socket.off("getmissingPieceResponse", handleUnknownIdentitiesData);
      socket.off("addPieceToRoomResponse");
      socket.off("missingPieceResponse");
      socket.off("deletePieceResponse");
      socket.off("deleteRoomData");
      socket.off("connect");
      socket.disconnect();
    };
  }, [
    socket,
    BasicCompanyData,
    handleBondItemsResponse,
    handleRoomData,
    handleUnknownIdentitiesData,
  ]);

  // actions
  const handleAddPieceToRoom = useCallback(
    (item: any) => {
      if (!currenGroup?.id || !socket) {
        notify("info", `${t("Missing room ID")}`);
        setIsInputBusy(false);
        return;
      }

      const payload = {
        roomId: currenGroup.id,
        isWeight: item.category_selling_type === "all" ? 1 : 0,
        karat_name:
          item.classification_id === 1
            ? item.karat_name
            : item.karatmineral_name,
        classification_name: item.classification_name,
        category_id: item.category_id,
        category_name: item.category_name,
        weight: item.weight,
        hwya: item.hwya,
        itemId: item.id,
        diamond_value: item.diamond_value,
      };

      socket.emit("addPieceToRoom", payload);
    },
    [currenGroup?.id, socket]
  );

  const handleAddMissingPieces = useCallback(
    (item: any) => {
      if (!socket) return;

      const payload = {
        ...BasicCompanyData,
        karat_id: item.karat_id,
        mineral_id: item.mineral_id,
        karat_name:
          item.classification_id === 1
            ? item.karat_name
            : item.karatmineral_name,
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
    },
    [socket, BasicCompanyData]
  );

  const handleDeleteRoom = useCallback(
    (roomId: string) => {
      if (!socket || !roomId) return;
      setIsInputBusy(true);
      setDeletingRoomIds((prev) => new Set(prev).add(roomId));

      socket.emit("deleteRoom", {
        branchId: BasicCompanyData.branchId,
        inventoryId: BasicCompanyData.inventoryId,
        companyKey: BasicCompanyData.companyKey,
        roomId,
      });

      localStorage.removeItem("currentGroup");
    },
    [socket, BasicCompanyData]
  );

  const handleDeleteItemFromRoom = useCallback(
    (pieceId: string, roomId: string) => {
      if (!socket || !roomId || !pieceId) return;
      setIsInputBusy(true);
      setDeletingPieceIds((prev) => new Set(prev).add(pieceId));

      socket.emit("deletePieceFromRoom", {
        branchId: BasicCompanyData.branchId,
        inventoryId: BasicCompanyData.inventoryId,
        companyKey: BasicCompanyData.companyKey,
        roomId,
        pieceId,
      });
    },
    [socket, BasicCompanyData]
  );

  const { mutate: mutateItemIdentity } = useMutate({
    mutationFn: mutateData,
    onSuccess: () => playBeep(200),
  });

  const handleItemIdentity = useCallback(
    (data: Item) => {
      const kitItems =
        data?.weightitems?.map((it: any) => ({
          category_id: it.category_id,
          weight: it.weight,
        })) || null;

      mutateItemIdentity({
        endpointName: `/inventory/api/v1/group-item`,
        values: {
          item_id: data?.item_id,
          group_id: currenGroup?.number,
          weight: Number(data?.weight),
          kitItems,
        },
      });
    },
    [mutateItemIdentity, currenGroup?.number]
  );

  const handleCheckedItem = useCallback(
    (newItemId: string, newItem: Item) => {
      const group = identitiesCheckedItems.find(
        (g: any) => g?._id === newItemId
      );
      const already = group?.items?.some((it: any) => it.hwya === newItem.hwya);

      if (already && newItem?.category_selling_type === "part") {
        notify("info", `${t("This item is already added")}`);
        setSearch("");
        setIsInputBusy(false);
        return;
      }

      if (newItem?.hwya) {
        setIsInputBusy(true);
        setPendingAdd({ hwya: newItem.hwya, opsLeft: 2 });
      }

      handleItemIdentity(newItem);
      handleAddPieceToRoom(newItem);
    },
    [identitiesCheckedItems, handleAddPieceToRoom, handleItemIdentity]
  );

  const handleUnknownItem = useCallback(
    (newItem: Item) => {
      const already = unknownIdentities.some(
        (it: any) => it.hwya === newItem.hwya
      );
      if (already) {
        notify("info", `${t("This item is already added to unknown items.")}`);
        setSearch("");
        setIsInputBusy(false);
        return;
      }
      handleAddMissingPieces(newItem);
      playBeep(1000);
    },
    [unknownIdentities, handleAddMissingPieces, playBeep]
  );

  const addItemToIdentity = useCallback(
    (groupId: string, newItem: Item, isChecked: boolean) => {
      const exists = identitiesCheckedItems.some(
        (g: any) => g?._id === groupId
      );
      if (!exists) {
        notify("info", `${t("A group must be created first.")}`);
        return;
      }
      if (newItem?.is_exist && isChecked) {
        handleCheckedItem(groupId, newItem);
      } else {
        handleUnknownItem(newItem);
      }
    },
    [identitiesCheckedItems, handleCheckedItem, handleUnknownItem]
  );

  // search
  useFetch({
    queryKey: ["branch-all-accepted-items", search],
    pagination: true,
    endpoint: `/inventory/api/v1/getItembyhwya/${userData?.branch_id}?hwya[lk]=${search}`,
    enabled: Boolean(search),
    onSuccess: (resp) => {
      if (!resp?.data) return;
      const item: Item = resp.data;
      const { weightitems, category_selling_type } = item;
      const isKit = Boolean(
        weightitems?.length && weightitems.some((i: any) => i.status === 1)
      );

      setSelectedItem(item);

      if (category_selling_type === "all") {
        setEditWeight(item);
        setOpenWeightItem(true);
        setIsInputBusy(false);
      } else if (isKit) {
        setOpenKitItems(true);
        setIsInputBusy(false);
      } else {
        if (currenGroup?.id) {
          addItemToIdentity(currenGroup.id, item, true);
        } else {
          notify("info", `${t("A group must be created first.")}`);
          setIsInputBusy(false);
        }
      }

      // setSearch("");
    },
    onError: () => {
      setIsInputBusy(false);
    },
  });

  // group creation
  const { mutateAsync, isLoading: isLoadingMutate } = useMutate({
    mutationFn: mutateData,
    onSuccess: () => {
      if (socket) socket.emit("getRooms", BasicCompanyData);
      notify("success", `${t("The group has been created successfully.")}`);
    },
  });

  const { mutateAsync: mutateGroupToNodeAsync } = useMutate({
    mutationFn: mutateData,
  });

  const handleSuccess = useCallback(
    ({ data, dataNode }: SuccessParams) => {
      const currentGroup = {
        number: data?.id,
        id: dataNode?._id || "",
        groupName: dataNode?.groupName || data?.group_name || "",
      };
      localStorage.setItem("currentGroup", JSON.stringify(currentGroup));

      const stored = localStorage.getItem("currentGroup");
      if (stored) setCurrenGroup(JSON.parse(stored));

      setIdentitiesCheckedItems((prev: any[]) => [
        ...prev,
        {
          id: currentGroup.id,
          _id: currentGroup.id,
          groupName: currentGroup.groupName,
          totalItems: 0,
          totalWeight: 0,
          items: [],
        },
      ]);
    },
    [setCurrenGroup, setIdentitiesCheckedItems]
  );

  const handleCreateGroups = useCallback(async () => {
    const hasEmpty = identitiesCheckedItems.some(
      (g: any) => g.items?.length === 0
    );
    if (hasEmpty) {
      notify("info", `${t("Group already created")}`);
      return;
    }

    const [res1, res2] = await Promise.all([
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

    handleSuccess({ data: res1, dataNode: res2 });
    if (socket) socket.emit("getRooms", BasicCompanyData);
  }, [
    identitiesCheckedItems,
    mutateAsync,
    mutateGroupToNodeAsync,
    id,
    numbers,
    nextGroup,
    userData?.id,
    userData?.branch_id,
    isGetTenantFromUrl,
    SOCKET_SERVER_URL,
    handleSuccess,
    socket,
    BasicCompanyData,
  ]);

  // finish inventory
  const handleSuccessInventoryData = useCallback(() => {
    ["currenGroup", "weightItems"].forEach((k) => localStorage.removeItem(k));
    notify("success", `${t("The inventory process has been completed.")}`);
    navigate("/selling/inventory/view");
  }, [navigate]);

  const { mutate: mutateInventoryData, isLoading: isLoadingInventoryData } =
    useMutate({
      mutationFn: mutateData,
      onSuccess: handleSuccessInventoryData,
    });

  const handlePostInventoryData = useCallback(() => {
    mutateInventoryData({
      endpointName: `/inventory/api/v1/finishedInventories`,
      values: {
        branch_id: userData?.branch_id,
        employee_id: userData?.id,
        type_employe: true,
        inventory_id: id,
      },
    });
  }, [mutateInventoryData, userData?.branch_id, userData?.id, id]);

  return (
    <div className="px-10 py-8">
      <div className="flex items-center justify-between text-mainGreen border-b-2 pb-3">
        <h2 className="text-xl font-semibold ">{t("Inventory")}</h2>
        <p className="font-semibold">
          {t("Inventory of new gold, diamonds and miscellaneous")}
        </p>
      </div>

      <Formik initialValues={{ search: "" }} onSubmit={() => {}}>
        <Form>
          <div className="flex items-end gap-x-8">
            <Button
              bordered
              className="flex items-center gap-x-2"
              loading={isLoadingMutate}
              action={handleCreateGroups}
            >
              <AddIcon size={22} />
              <span>{t("Create a group")}</span>
            </Button>

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
                  !!search && isInputBusy
                    ? `${t("loading")} ...`
                    : `${t("id code")}`
                }
                disabled={
                  (!!search && isInputBusy) ||
                  isLoadingMutate ||
                  isLoadingInventoryData
                }
                className={`py-1.5 ${
                  ((!!search && isInputBusy) ||
                    isLoadingMutate ||
                    isLoadingInventoryData) &&
                  "bg-mainDisabled"
                }`}
              />
              {!!search && isInputBusy && (
                <div className="absolute left-3.5 top-[3.2rem] -translate-y-1/2">
                  <Spinner size="medium" />
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
            {totals.map(({ name, id: key, unit, value }) => (
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
                deletingRoomIds={deletingRoomIds}
                deletingPieceIds={deletingPieceIds}
              />
            </div>
            <div className="w-[30%]">
              <UnknownIdentitiesInBranch
                unknownIdentities={unknownIdentities}
                setUnknownIdentities={setUnknownIdentities}
                setOpenDetailsItem={setOpenDetailsItem}
                setUnknownItemDetails={() => {}}
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

      <Modal
        isOpen={openDetailsItem}
        onClose={() => {
          setOpenDetailsItem(false);
        }}
      >
        <ShowDetailsItemOfInventory
          itemDetails={selectedItem ? [selectedItem] : []}
        />
      </Modal>

      <div>
        {userData?.role_id === 3 ? (
          <div className="flex justify-end mt-5">
            <Button action={() => setSteps(2)}>{t("next")}</Button>
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

// import { Form, Formik } from "formik";
// import { t } from "i18next";
// import {
//   useCallback,
//   useContext,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import { Button, Spinner } from "../../../components/atoms";
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
// import { useNavigate, useParams } from "react-router-dom";
// import { mutateData } from "../../../utils/mutateData";
// import ShowDetailsItemOfInventory from "./ShowDetailsItemOfInventory";
// import WeightAdjustmentInBranch from "../../../components/selling/Inventory/WeightAdjustmentInBranch";
// import InventoryKitInBranch from "../../../components/selling/Inventory/InventoryKitInBranch";
// import { Group_TP } from "./CreatingInventoryBond";

// type SocketLike = {
//   connected: boolean;
//   connect: () => void;
//   disconnect: () => void;
//   emit: (event: string, payload?: any) => void;
//   on: (event: string, cb: (...args: any[]) => void) => SocketLike;
//   off: (event: string, cb?: (...args: any[]) => void) => SocketLike;
//   once?: (event: string, cb: (...args: any[]) => void) => SocketLike;
// };

// interface Totals {
//   name: string;
//   unit: string;
//   value: number;
//   id: string;
// }

// interface Item {
//   id: string;
//   weight?: number;
//   is_exist?: number;
//   hwya?: string;
//   category_selling_type?: "all" | "part";
//   classification_id?: number;
//   karat_name?: string;
//   karatmineral_name?: string;
//   classification_name?: string;
//   category_id?: number;
//   category_name?: string;
//   diamond_value?: number;
//   karat_id?: number;
//   mineral_id?: number;
//   Iban?: string;
//   wage?: number;
//   [key: string]: any;
// }

// type ResponseData = {
//   id: string;
//   group_name?: string;
// };

// type SuccessParams = {
//   data?: ResponseData;
//   dataNode?: { _id?: string; groupName?: string };
// };

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
//   socket?: SocketLike;
// }

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
//   const { id } = useParams<{ id: string }>();
//   const { userData } = useContext(authCtx);
//   const { formatReyal } = numberContext();
//   const navigate = useNavigate();

//   // ui state
//   const [isInputBusy, setIsInputBusy] = useState(false);
//   const [search, setSearch] = useState<string>("");
//   const [openDetailsItem, setOpenDetailsItem] = useState(false);
//   const [openWeightItem, setOpenWeightItem] = useState(false);
//   const [openKitItems, setOpenKitItems] = useState(false);
//   const [kitItemsData, setKitItemsData] = useState<any[]>([]);
//   const [editWeight, setEditWeight] = useState<any>({});
//   const [activeTableId, setActiveTableId] = useState<string | null>(null);
//   const [nextGroup, setNextGroup] = useState<number>(0);
//   const [deletingPieceIds, setDeletingPieceIds] = useState<Set<string>>(
//     new Set()
//   );
//   const [deletingRoomIds, setDeletingRoomIds] = useState<Set<string>>(
//     new Set()
//   );

//   const numbers = ConvertNumberToWordGroup();

//   // Stable AudioContext
//   const audioCtxRef = useRef<AudioContext | null>(null);
//   const playBeep = useCallback((frequency: number) => {
//     try {
//       if (!audioCtxRef.current) {
//         const Ctx =
//           (window as any).AudioContext || (window as any).webkitAudioContext;
//         audioCtxRef.current = new Ctx();
//       }
//       const ctx = audioCtxRef.current!;
//       const osc = ctx.createOscillator();
//       osc.type = "sine";
//       osc.frequency.setValueAtTime(frequency, ctx.currentTime);
//       osc.connect(ctx.destination);
//       osc.start();
//       osc.stop(ctx.currentTime + 0.2);
//     } catch {
//       // ignore
//     }
//   }, []);

//   // Stable company data
//   const BasicCompanyData = useMemo(
//     () => ({
//       branchId: userData?.branch_id,
//       inventoryId: id,
//       companyKey: isGetTenantFromUrl,
//     }),
//     [userData?.branch_id, id, isGetTenantFromUrl]
//   );

//   // Derived counts
//   const totalIdentitiesChecked = useMemo(
//     () =>
//       identitiesCheckedItems?.reduce(
//         (sum: number, group: any) => sum + (group.items?.length || 0),
//         0
//       ),
//     [identitiesCheckedItems]
//   );

//   const totals: Totals[] = useMemo(
//     () => [
//       {
//         id: "branch-items",
//         name: t("Number of items in the branch"),
//         unit: "item",
//         value: availableItems?.length || 0,
//       },
//       {
//         id: "inspected-items",
//         name: t("Number of items inspected"),
//         unit: "item",
//         value: totalIdentitiesChecked || 0,
//       },
//       {
//         id: "uninspected-items",
//         name: t("Uninspected items"),
//         unit: "item",
//         value: Math.max(
//           (availableItems?.length || 0) - (totalIdentitiesChecked || 0),
//           0
//         ),
//       },
//       {
//         id: "unidentified-items",
//         name: t("Unidentified items"),
//         unit: "item",
//         value: unknownIdentities?.length || 0,
//       },
//     ],
//     [availableItems?.length, totalIdentitiesChecked, unknownIdentities?.length]
//   );

//   useEffect(() => {
//     setNextGroup(identitiesCheckedItems?.length || 0);
//   }, [identitiesCheckedItems?.length]);

//   // Stable socket handlers
//   const handleBondItemsResponse = useCallback(
//     (data: any) => {
//       setAvailableItems(data?.success ? data?.data?.items || [] : []);
//       setIsInputBusy(false);
//     },
//     [setAvailableItems]
//   );

//   const handleRoomData = useCallback(
//     (data: any) => {
//       setIdentitiesCheckedItems(data?.success ? data?.data || [] : []);
//       setIsInputBusy(false);
//     },
//     [setIdentitiesCheckedItems]
//   );

//   const handleUnknownIdentitiesData = useCallback(
//     (data: any) => {
//       setUnknownIdentities(data?.success ? data?.data || [] : []);
//       setIsInputBusy(false);
//     },
//     [setUnknownIdentities]
//   );

//   // One-time socket lifecycle
//   useEffect(() => {
//     if (!socket || !BasicCompanyData.branchId || !BasicCompanyData.inventoryId)
//       return;

//     const attachAll = () => {
//       socket
//         .off("getBondItemsResponse", handleBondItemsResponse)
//         .on("getBondItemsResponse", handleBondItemsResponse);

//       socket.off("roomData", handleRoomData).on("roomData", handleRoomData);

//       socket
//         .off("getmissingPieceResponse", handleUnknownIdentitiesData)
//         .on("getmissingPieceResponse", handleUnknownIdentitiesData);

//       // optional one-offs that update same stores
//       const addPieceCb = () => {
//         socket.emit("getBondItems", BasicCompanyData);
//         socket.emit("getRooms", BasicCompanyData);
//         setIsInputBusy(false);
//       };
//       const missingPieceCb = () => {
//         socket.emit("getBondItems", BasicCompanyData);
//         socket.emit("getRooms", BasicCompanyData);
//         socket.emit("getmissingPieces", BasicCompanyData);
//         setIsInputBusy(false);
//       };

//       const deletePieceCb = (payload?: { pieceId?: string }) => {
//         socket.emit("getBondItems", BasicCompanyData);
//         socket.emit("getRooms", BasicCompanyData);
//         socket.emit("getmissingPieces", BasicCompanyData);
//         setDeletingPieceIds((prev) => {
//           const next = new Set(prev);
//           if (payload?.pieceId) next.delete(payload.pieceId);
//           return next;
//         });
//         setIsInputBusy(false);
//       };

//       const deleteRoomCb = (payload?: { roomId?: string }) => {
//         handleRoomData(payload); // keep existing behavior
//         socket.emit("getBondItems", BasicCompanyData);
//         socket.emit("getmissingPieces", BasicCompanyData);
//         setDeletingRoomIds((prev) => {
//           const next = new Set(prev);
//           if (payload?.roomId) next.delete(payload.roomId);
//           return next;
//         });
//         setIsInputBusy(false);
//       };

//       // const deletePieceCb = () => {
//       //   socket.emit("getBondItems", BasicCompanyData);
//       //   socket.emit("getRooms", BasicCompanyData);
//       // };
//       // const deleteRoomCb = handleRoomData;

//       socket
//         .off("addPieceToRoomResponse", addPieceCb)
//         .on("addPieceToRoomResponse", addPieceCb);
//       socket
//         .off("missingPieceResponse", missingPieceCb)
//         .on("missingPieceResponse", missingPieceCb);
//       socket
//         .off("deletePieceResponse", deletePieceCb)
//         .on("deletePieceResponse", deletePieceCb);
//       socket
//         .off("deleteRoomData", deleteRoomCb)
//         .on("deleteRoomData", deleteRoomCb);
//     };

//     const emitInitial = () => {
//       socket.emit("joinBranch", BasicCompanyData);
//       socket.emit("getBondItems", BasicCompanyData);
//       socket.emit("getRooms", BasicCompanyData);
//       socket.emit("getmissingPieces", BasicCompanyData);
//     };

//     if (socket.connected) {
//       attachAll();
//       emitInitial();
//     } else if (socket.once) {
//       socket.once("connect", () => {
//         attachAll();
//         emitInitial();
//       });
//       socket.connect();
//     } else {
//       // fallback: try connect then attach
//       socket.connect();
//       attachAll();
//       emitInitial();
//     }

//     return () => {
//       if (!socket) return;
//       socket.off("getBondItemsResponse", handleBondItemsResponse);
//       socket.off("roomData", handleRoomData);
//       socket.off("getmissingPieceResponse", handleUnknownIdentitiesData);
//       socket.off("addPieceToRoomResponse");
//       socket.off("missingPieceResponse");
//       socket.off("deletePieceResponse");
//       socket.off("deleteRoomData");
//       socket.off("connect");
//       socket.disconnect();
//     };
//   }, [
//     socket,
//     BasicCompanyData,
//     handleBondItemsResponse,
//     handleRoomData,
//     handleUnknownIdentitiesData,
//   ]);

//   // Actions
//   const addItemToIdentity = useCallback(
//     (id: string, newItem: Item, isChecked: boolean) => {
//       const exists = identitiesCheckedItems.some((g: any) => g?._id === id);
//       if (!exists) {
//         notify("info", `${t("A group must be created first.")}`);
//         return;
//       }
//       if (newItem?.is_exist && isChecked) {
//         // known item
//         handleCheckedItem(id, newItem);
//       } else {
//         handleUnknownItem(newItem);
//       }
//     },
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     [identitiesCheckedItems]
//   );

//   const handleAddPieceToRoom = useCallback(
//     (item: any) => {
//       if (!currenGroup?.id || !socket) {
//         notify("info", `${t("Missing room ID")}`);
//         setIsInputBusy(false);
//         return;
//       }

//       const payload = {
//         roomId: currenGroup.id,
//         isWeight: item.category_selling_type === "all" ? 1 : 0,
//         karat_name:
//           item.classification_id === 1
//             ? item.karat_name
//             : item.karatmineral_name,
//         classification_name: item.classification_name,
//         category_id: item.category_id,
//         category_name: item.category_name,
//         weight: item.weight,
//         hwya: item.hwya,
//         itemId: item.id,
//         diamond_value: item.diamond_value,
//       };

//       socket.emit("addPieceToRoom", payload);
//     },
//     [currenGroup?.id, socket]
//   );

//   const handleAddMissingPieces = useCallback(
//     (item: any) => {
//       if (!socket) return;

//       const payload = {
//         ...BasicCompanyData,
//         karat_id: item.karat_id,
//         mineral_id: item.mineral_id,
//         karat_name:
//           item.classification_id === 1
//             ? item.karat_name
//             : item.karatmineral_name,
//         classification_id: item.classification_id,
//         classification_name: item.classification_name,
//         category_id: item.category_id,
//         category_name: item.category_name,
//         weight: item.weight,
//         hwya: item.hwya,
//         itemId: item.id,
//         Iban: item.Iban,
//         wage: item.wage,
//         diamond_value: item.diamond_value,
//       };

//       socket.emit("missingPieces", payload);
//     },
//     [socket, BasicCompanyData]
//   );

//   const handleDeleteRoom = useCallback(
//     (roomId: string) => {
//       if (!socket || !roomId) return;
//       setIsInputBusy(true);
//       setDeletingRoomIds((prev) => new Set(prev).add(roomId));

//       socket.emit("deleteRoom", {
//         branchId: BasicCompanyData.branchId,
//         inventoryId: BasicCompanyData.inventoryId,
//         companyKey: BasicCompanyData.companyKey,
//         roomId,
//       });

//       localStorage.removeItem("currentGroup");

//       setIsInputBusy(false);
//     },
//     [socket, BasicCompanyData]
//   );

//   const handleDeleteItemFromRoom = useCallback(
//     (pieceId: string, roomId: string) => {
//       if (!socket || !roomId || !pieceId) return;
//       setIsInputBusy(true);
//       setDeletingPieceIds((prev) => new Set(prev).add(pieceId));

//       socket.emit("deletePieceFromRoom", {
//         branchId: BasicCompanyData.branchId,
//         inventoryId: BasicCompanyData.inventoryId,
//         companyKey: BasicCompanyData.companyKey,
//         roomId,
//         pieceId,
//       });

//       setIsInputBusy(false);
//     },
//     [socket, BasicCompanyData]
//   );

//   const handleCheckedItem = useCallback(
//     (newItemId: string, newItem: Item) => {
//       const group = identitiesCheckedItems.find(
//         (g: any) => g?._id === newItemId
//       );
//       const already = group?.items?.some((it: any) => it.hwya === newItem.hwya);

//       if (already && newItem?.category_selling_type === "part") {
//         notify("info", `${t("This item is already added")}`);
//         return;
//       }

//       handleItemIdentity(newItem);
//       handleAddPieceToRoom(newItem);
//     },
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     [identitiesCheckedItems, handleAddPieceToRoom]
//   );

//   const handleUnknownItem = useCallback(
//     (newItem: Item) => {
//       const already = unknownIdentities.some(
//         (it: any) => it.hwya === newItem.hwya
//       );
//       if (already) {
//         notify("info", `${t("This item is already added to unknown items.")}`);
//         return;
//       }
//       handleAddMissingPieces(newItem);
//       playBeep(1000);
//     },
//     [unknownIdentities, handleAddMissingPieces, playBeep]
//   );

//   // Fetch by search
//   const { data } = useFetch({
//     queryKey: ["branch-all-accepted-items", search],
//     pagination: true,
//     endpoint: `/inventory/api/v1/getItembyhwya/${userData?.branch_id}?hwya[lk]=${search}`,
//     enabled: Boolean(search),
//     onSuccess: (resp) => {
//       if (!resp?.data) return;
//       const item = resp.data;
//       const { weightitems, category_selling_type } = item;
//       const isKit = Boolean(
//         weightitems?.length && weightitems.some((i: any) => i.status === 1)
//       );

//       setSelectedItem(item);

//       if (category_selling_type === "all") {
//         setEditWeight(item);
//         setOpenWeightItem(true);
//       } else if (isKit) {
//         setOpenKitItems(true);
//       } else {
//         if (currenGroup?.id) addItemToIdentity(currenGroup.id, item, true);
//         else notify("info", `${t("A group must be created first.")}`);
//       }

//       setSearch("");
//       setIsInputBusy(false);
//     },
//     onError: () => {
//       setIsInputBusy(false);
//     },
//   });

//   // Mutations
//   const { mutateAsync, isLoading: isLoadingMutate } = useMutate({
//     mutationFn: mutateData,
//     onSuccess: () => {
//       if (socket) socket.emit("getRooms", BasicCompanyData);
//       notify("success", `${t("The group has been created successfully.")}`);
//     },
//   });

//   const { mutateAsync: mutateGroupToNodeAsync } = useMutate({
//     mutationFn: mutateData,
//   });

//   const handleSuccess = useCallback(
//     ({ data, dataNode }: SuccessParams) => {
//       const currentGroup = {
//         number: data?.id,
//         id: dataNode?._id || "",
//         groupName: dataNode?.groupName || data?.group_name || "",
//       };
//       localStorage.setItem("currentGroup", JSON.stringify(currentGroup));

//       const stored = localStorage.getItem("currentGroup");
//       if (stored) setCurrenGroup(JSON.parse(stored));

//       setIdentitiesCheckedItems((prev: any[]) => [
//         ...prev,
//         {
//           id: currentGroup.id,
//           _id: currentGroup.id,
//           groupName: currentGroup.groupName,
//           totalItems: 0,
//           totalWeight: 0,
//           items: [],
//         },
//       ]);
//     },
//     [setCurrenGroup, setIdentitiesCheckedItems]
//   );

//   const { mutate: mutateItemIdentity } = useMutate({
//     mutationFn: mutateData,
//     onSuccess: () => playBeep(200),
//   });

//   const handleItemIdentity = useCallback(
//     (data: any) => {
//       const kitItems = data?.weightitems?.map((it: any) => ({
//         category_id: it.category_id,
//         weight: it.weight,
//       }));

//       mutateItemIdentity({
//         endpointName: `/inventory/api/v1/group-item`,
//         values: {
//           item_id: data?.item_id,
//           group_id: currenGroup?.number,
//           weight: Number(data?.weight),
//           kitItems: data?.weightitems?.length ? kitItems : null,
//         },
//       });
//     },
//     [mutateItemIdentity, currenGroup?.number]
//   );

//   const handleCreateGroups = useCallback(async () => {
//     const hasEmpty = identitiesCheckedItems.some(
//       (g: any) => g.items?.length === 0
//     );
//     if (hasEmpty) {
//       notify("info", `${t("Group already created")}`);
//       return;
//     }

//     const [res1, res2] = await Promise.all([
//       mutateAsync({
//         endpointName: `/inventory/api/v1/inventorygroups`,
//         values: {
//           inventory_id: id,
//           group_name: numbers?.[Number(nextGroup)],
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
//           groupName: numbers?.[Number(nextGroup)],
//           inventoryId: String(id),
//         },
//       }),
//     ]);

//     handleSuccess({ data: res1, dataNode: res2 });
//     if (socket) socket.emit("getRooms", BasicCompanyData);
//   }, [
//     identitiesCheckedItems,
//     mutateAsync,
//     mutateGroupToNodeAsync,
//     id,
//     numbers,
//     nextGroup,
//     userData?.id,
//     userData?.branch_id,
//     isGetTenantFromUrl,
//     SOCKET_SERVER_URL,
//     handleSuccess,
//     socket,
//     BasicCompanyData,
//   ]);

//   // Finish inventory
//   const handleSuccessInventoryData = useCallback(() => {
//     ["currenGroup", "weightItems"].forEach((k) => localStorage.removeItem(k));
//     notify("success", `${t("The inventory process has been completed.")}`);
//     navigate("/selling/inventory/view");
//   }, [navigate]);

//   const { mutate: mutateInventoryData, isLoading: isLoadingInventoryData } =
//     useMutate({
//       mutationFn: mutateData,
//       onSuccess: handleSuccessInventoryData,
//     });

//   const handlePostInventoryData = useCallback(() => {
//     mutateInventoryData({
//       endpointName: `/inventory/api/v1/finishedInventories`,
//       values: {
//         branch_id: userData?.branch_id,
//         employee_id: userData?.id,
//         type_employe: true,
//         inventory_id: id,
//       },
//     });
//   }, [mutateInventoryData, userData?.branch_id, userData?.id, id]);

//   return (
//     <div className="px-10 py-8">
//       <div className="flex items-center justify-between text-mainGreen border-b-2 pb-3">
//         <h2 className="text-xl font-semibold ">{t("Inventory")}</h2>
//         <p className="font-semibold">
//           {t("Inventory of new gold, diamonds and miscellaneous")}
//         </p>
//       </div>

//       <Formik initialValues={{ search: "" }} onSubmit={() => {}}>
//         <Form>
//           <div className="flex items-end gap-x-8">
//             <Button
//               bordered
//               className="flex items-center gap-x-2"
//               loading={isLoadingMutate}
//               action={handleCreateGroups}
//             >
//               <AddIcon size={22} />
//               <span>{t("Create a group")}</span>
//             </Button>

//             <div className="relative flex gap-2 items-center justify-center rounded-md p-1">
//               <BaseInputField
//                 id="search"
//                 name="search"
//                 autoFocus
//                 label={`${t("id code")}`}
//                 type="text"
//                 value={search}
//                 onChange={(e) => {
//                   const v = e.target.value;
//                   setSearch(v);
//                   setIsInputBusy(Boolean(v.trim()));
//                 }}
//                 placeholder={
//                   isInputBusy ? `${t("loading")} ...` : `${t("id code")}`
//                 }
//                 disabled={
//                   isInputBusy || isLoadingMutate || isLoadingInventoryData
//                 }
//                 className={`py-1.5 ${
//                   (isInputBusy || isLoadingMutate || isLoadingInventoryData) &&
//                   "bg-mainDisabled ps-12"
//                 }`}
//               />
//               {isInputBusy && (
//                 <div className="absolute right-3.5 top-[3.2rem] -translate-y-1/2">
//                   <Spinner size="medium" />
//                 </div>
//               )}
//             </div>

//             {!!currenGroup?.groupName && (
//               <div className="bg-mainGreen rounded-full py-1.5 px-8 text-white">
//                 <h2>
//                   {t("group")} {currenGroup?.groupName}
//                 </h2>
//               </div>
//             )}
//           </div>

//           <ul className="grid grid-cols-4 gap-6 mb-5 my-5">
//             {totals.map(({ name, id: key, unit, value }) => (
//               <BoxesDataBase variant="secondary" key={key}>
//                 <p className="bg-mainOrange px-2 py-4 flex items-center justify-center rounded-t-xl">
//                   {name}
//                 </p>
//                 <p className="bg-white px-2 py-[7px] text-black rounded-b-xl">
//                   {formatReyal(Number(value))} {t(unit)}
//                 </p>
//               </BoxesDataBase>
//             ))}
//           </ul>

//           <div className="flex items-center gap-x-4 w-full bg-[#295E5608] py-8 rounded-2xl">
//             <div className="w-[30%]">
//               <AvailableItemsInBranch
//                 selectedItem={selectedItem}
//                 setSelectedItem={setSelectedItem}
//                 availableItems={availableItems}
//                 setAvailableItems={setAvailableItems}
//                 setNumberItemsInBranch={setNumberItemsInBranch}
//                 activeTableId={activeTableId}
//                 setActiveTableId={setActiveTableId}
//                 isGetTenantFromUrl={isGetTenantFromUrl}
//                 SOCKET_SERVER_URL={SOCKET_SERVER_URL}
//               />
//             </div>
//             <div className="w-[35%]">
//               <IdentitiesCheckedByBranch
//                 identitiesCheckedItems={identitiesCheckedItems}
//                 setIdentitiesCheckedItems={setIdentitiesCheckedItems}
//                 currenGroup={currenGroup}
//                 setOpenWeightItem={setOpenWeightItem}
//                 setEditWeight={setEditWeight}
//                 setSelectedItem={setSelectedItem}
//                 activeTableId={activeTableId}
//                 setActiveTableId={setActiveTableId}
//                 handleDeleteRoom={handleDeleteRoom}
//                 handleDeleteItemFromRoom={handleDeleteItemFromRoom}
//                 deletingRoomIds={deletingRoomIds}
//                 deletingPieceIds={deletingPieceIds}
//               />
//             </div>
//             <div className="w-[30%]">
//               <UnknownIdentitiesInBranch
//                 unknownIdentities={unknownIdentities}
//                 setUnknownIdentities={setUnknownIdentities}
//                 setOpenDetailsItem={setOpenDetailsItem}
//                 setUnknownItemDetails={() => {}}
//                 setSelectedItem={setSelectedItem}
//                 activeTableId={activeTableId}
//                 setActiveTableId={setActiveTableId}
//               />
//             </div>
//             <div className="w-[25%]">
//               <IdentityInformationInBranch
//                 selectedItem={selectedItem}
//                 setOpenDetailsItem={setOpenDetailsItem}
//               />
//             </div>
//           </div>
//         </Form>
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
//           BasicCompanyData={BasicCompanyData}
//           socket={socket}
//         />
//       </Modal>

//       {/* Kit Items */}
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
//           itemDetails={selectedItem ? [selectedItem] : []}
//         />
//       </Modal>

//       <div>
//         {userData?.role_id === 3 ? (
//           <div className="flex justify-end mt-5">
//             <Button action={() => setSteps(2)}>{t("next")}</Button>
//           </div>
//         ) : (
//           <div className="flex justify-end mt-5">
//             <Button
//               loading={isLoadingInventoryData}
//               action={handlePostInventoryData}
//             >
//               {t("Finished")}
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default InventoryNewGoldDiamondsMiscellaneous;
