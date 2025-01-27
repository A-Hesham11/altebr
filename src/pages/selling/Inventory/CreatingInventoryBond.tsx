import React, { useContext, useState } from "react";
import { useFetch, useMutate } from "../../../hooks";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { notify } from "../../../utils/toast";
import { mutateData } from "../../../utils/mutateData";
import { useParams } from "react-router-dom";
import InventoryNewGoldDiamondsMiscellaneous from "./InventoryNewGoldDiamondsMiscellaneous";
import InventoryBrokenGoldCashBox from "./InventoryBrokenGoldCashBox";
import CompleteInventoryProcess from "./CompleteInventoryProcess";

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
  const { id } = useParams<{ id: string }>();
  const [steps, setSteps] = useState<number>(1);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  console.log("🚀 ~ selectedItem:", selectedItem);
  const [currenGroupNumber, setCurrenGroupNumber] = useState<number>(
    JSON.parse(localStorage.getItem("currenGroupNumber") || "0")
  );
  const [availableItems, setAvailableItems] = useState<InventoryItem[]>([]);
  const [identitiesCheckedItems, setIdentitiesCheckedItems] = useState<
    InventoryItem[]
  >(JSON.parse(localStorage.getItem("identitiesCheckedItems") || "[]"));
  console.log("🚀 ~ identitiesCheckedItems:", identitiesCheckedItems);

  const [unknownIdentities, setUnknownIdentities] = useState<InventoryItem[]>(
    JSON.parse(localStorage.getItem("unknownIdentities") || "[]")
  );
  const [numberItemsInBranch, setNumberItemsInBranch] = useState<number>(0);
  const [goldBrokenCashBanksFinalData, setGoldBrokenCashBanksFinalData] = useState({});
  console.log("🚀 ~ goldBrokenCashBanksFinalData:", goldBrokenCashBanksFinalData)

  const { data: goldBrokenCashBanks } = useFetch({
    endpoint: `/inventory/api/v1/getAccount/${userData?.branch_id}`,
    queryKey: ["brokenGold_cash"],
  });

  // if (isLoading || isRefetching) return <Loading mainTitle={t("Inventory")} />;

  return (
    <div>
      {steps === 1 && (
        <InventoryNewGoldDiamondsMiscellaneous
          currenGroupNumber={currenGroupNumber}
          setCurrenGroupNumber={setCurrenGroupNumber}
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
        />
      )}

      {steps === 2 && (
        <InventoryBrokenGoldCashBox
          setSteps={setSteps}
          goldBrokenCashBanks={goldBrokenCashBanks}
          goldBrokenCashBanksFinalData={goldBrokenCashBanksFinalData}
          setGoldBrokenCashBanksFinalData={setGoldBrokenCashBanksFinalData}
        />
      )}

      {steps === 3 && (
        <CompleteInventoryProcess
          numberItemsInBranch={numberItemsInBranch}
          currenGroupNumber={currenGroupNumber}
          availableItems={availableItems}
          identitiesCheckedItems={identitiesCheckedItems}
          unknownIdentities={unknownIdentities}
          setSteps={setSteps}
          goldBrokenCashBanksFinalData={goldBrokenCashBanksFinalData}
        />
      )}
    </div>
  );
};

export default CreatingInventoryBond;
