import React, { useContext, useState } from "react";
import { useFetch } from "../../../hooks";
import { authCtx } from "../../../context/auth-and-perm/auth";
import InventoryNewGoldDiamondsMiscellaneous from "./InventoryNewGoldDiamondsMiscellaneous";
import InventoryBrokenGoldCashBox from "./InventoryBrokenGoldCashBox";
import CompleteInventoryProcess from "./CompleteInventoryProcess";
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "https://backend.alexonsolutions.net";
const socket = io(SOCKET_SERVER_URL);

export type Group_TP = {
  id: string;
  name: string;
};
interface InventoryItem {
  id: string;
  hwya: string;
  classification_id: string;
  category_id: string;
  karat_id: string;
  mineral_id: string;
  karatmineral_id: string;
  value: number;
  wage: number;
  weight: number;
}

const CreatingInventoryBond: React.FC = () => {
  const { userData } = useContext(authCtx);
  const [steps, setSteps] = useState<number>(1);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [numberItemsInBranch, setNumberItemsInBranch] = useState<number>(0);
  const [currenGroup, setCurrenGroup] = useState<Group_TP | null>(() =>
    JSON.parse(localStorage.getItem("currentGroup") || "null")
  );
  const [availableItems, setAvailableItems] = useState<InventoryItem[]>([]);
  const [identitiesCheckedItems, setIdentitiesCheckedItems] = useState<
    InventoryItem[]
  >([]);
  const [unknownIdentities, setUnknownIdentities] = useState<InventoryItem[]>(
    []
  );
  const [goldBrokenCashBanksFinalData, setGoldBrokenCashBanksFinalData] =
    useState({});

  console.log("🚀 ~ availableItems:", availableItems);
  console.log("🚀 ~ identitiesCheckedItems:", identitiesCheckedItems);
  console.log("🚀 ~ unknownIdentities:", unknownIdentities);
 
  const { data: goldBrokenCashBanks } = useFetch({
    endpoint: `/inventory/api/v1/getAccount/${userData?.branch_id}`,
    queryKey: ["brokenGold_cash"],
  });

  const getTenantFromUrl = (() => {
    const url = window.location.hostname;
    const parts = url.split(".");
    return parts.length > 1 ? parts[0] : null;
  })();

  const isGetTenantFromUrl =
    getTenantFromUrl === null ? "alexon" : getTenantFromUrl;

  const renderStep = () => {
    switch (steps) {
      case 1:
        return (
          <InventoryNewGoldDiamondsMiscellaneous
            currenGroup={currenGroup}
            setCurrenGroup={setCurrenGroup}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            availableItems={availableItems}
            setAvailableItems={setAvailableItems}
            identitiesCheckedItems={identitiesCheckedItems}
            setIdentitiesCheckedItems={setIdentitiesCheckedItems}
            unknownIdentities={unknownIdentities}
            setUnknownIdentities={setUnknownIdentities}
            setSteps={setSteps}
            numberItemsInBranch={numberItemsInBranch}
            setNumberItemsInBranch={setNumberItemsInBranch}
            isGetTenantFromUrl={isGetTenantFromUrl}
            SOCKET_SERVER_URL={SOCKET_SERVER_URL}
            socket={socket}
          />
        );
      case 2:
        return (
          <InventoryBrokenGoldCashBox
            setSteps={setSteps}
            goldBrokenCashBanks={goldBrokenCashBanks}
            goldBrokenCashBanksFinalData={goldBrokenCashBanksFinalData}
            setGoldBrokenCashBanksFinalData={setGoldBrokenCashBanksFinalData}
          />
        );
      case 3:
        return (
          <CompleteInventoryProcess
            numberItemsInBranch={numberItemsInBranch}
            currenGroup={currenGroup}
            availableItems={availableItems}
            identitiesCheckedItems={identitiesCheckedItems}
            unknownIdentities={unknownIdentities}
            setSteps={setSteps}
            goldBrokenCashBanksFinalData={goldBrokenCashBanksFinalData}
          />
        );
      default:
        return null;
    }
  };

  return <div>{renderStep()}</div>;
};

export default CreatingInventoryBond;

// const [identitiesCheckedItems, setIdentitiesCheckedItems] = useState<
//   InventoryItem[]
// >(JSON.parse(localStorage.getItem("identitiesCheckedItems") || "[]"));

// const [unknownIdentities, setUnknownIdentities] = useState<InventoryItem[]>(
//   JSON.parse(localStorage.getItem("unknownIdentities") || "[]")
// );
