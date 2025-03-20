import Logo from "../../../assets/bill-logo.png";
import { t } from "i18next";
import { useContext, useMemo, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { useIsRTL, useMutate } from "../../../hooks";
import { Button } from "../../../components/atoms";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { mutateData } from "../../../utils/mutateData";
import { notify } from "../../../utils/toast";
import { useNavigate, useParams } from "react-router-dom";
import { Group_TP } from "./CreatingInventoryBond";
import { formatDate } from "../../../utils/date";

interface Totals {
  name: string;
  key: number;
  unit: string;
  value: number;
  bgColor: string;
}

interface Item {
  id: string;
  weight?: number;
  is_exist?: number;
  [key: string]: any;
}

interface CompleteInventoryProcessProps {
  setSteps: (value: number) => void;
  currenGroup: Group_TP | null;
  numberItemsInBranch: number;
  availableItems: Item[];
  identitiesCheckedItems: any[];
  unknownIdentities: Item[];
  goldBrokenCashBanksFinalData: any;
}

const CompleteInventoryProcess: React.FC<CompleteInventoryProcessProps> = ({
  setSteps,
  numberItemsInBranch,
  availableItems,
  identitiesCheckedItems,
  unknownIdentities,
  goldBrokenCashBanksFinalData,
}: any) => {
  console.log("🚀 ~ availableItems:", availableItems);
  console.log("🚀 ~ numberItemsInBranch:", numberItemsInBranch);
  const { userData } = useContext(authCtx);
  const contentRef = useRef();
  const isRTL = useIsRTL();
  const { id } = useParams();
  const navigate = useNavigate();

  const identitiesCheckedItem = identitiesCheckedItems
    ?.map((group) => group.items)
    .flat();

  const allItems = [...unknownIdentities, ...identitiesCheckedItem];

  const totalNumberItemsInspected = identitiesCheckedItems?.reduce(
    (count, group) => count + group.items.length,
    0
  );

  const totals: Totals[] = [
    {
      name: t("Number of items in the branch"),
      key: 1,
      unit: "item",
      value: availableItems?.length + totalNumberItemsInspected,
      bgColor: "#295E56",
    },
    {
      name: t("Number of items inspected"),
      key: 2,
      unit: "item",
      value: totalNumberItemsInspected,
      bgColor: "#DB8028",
    },
    {
      name: t("Uninspected items"),
      key: 3,
      unit: "item",
      value: availableItems?.length,
      bgColor: "#218A7A",
    },
    {
      name: t("Unidentified items"),
      key: 4,
      unit: "item",
      value: unknownIdentities?.length,
      bgColor: "#E4A261",
    },
  ];

  const columns = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "hwya",
        header: () => <span>{t("hwya")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "classification_name",
        header: () => <span>{t("category")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "category_name",
        header: () => <span>{t("classification")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "karat_name",
        header: () => <span>{t("karat")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "weight",
        header: () => <span>{t("weight")}</span>,
      },
      {
        cell: (info: any) => t(info.getValue()) || "---",
        accessorKey: "Iban",
        header: () => <span>{t("piece status")}</span>,
      },
    ],
    []
  );

  const handleSuccessInventoryData = () => {
    notify("success");
    ["currenGroup", "weightItems"].forEach((key) =>
      localStorage.removeItem(key)
    );
    navigate("/selling/inventory/view");
  };

  const handlePostInventoryData = () => {
    const formatItems = (items: any) =>
      items?.map(({ branch_id, branchId, companyKey, ...rest }) => ({
        inventory_id: id,
        branch_id: userData?.branch_id,
        branch_exist_id: branch_id,
        item_id: rest.item_id ? rest.item_id : rest.itemId,
        value:
          rest.classification_id == 1
            ? Number(rest.wage) * Number(rest.weight)
            : rest.diamond_value,
        ...rest,
      }));

    const formattedAvailableItems = formatItems(availableItems);
    const lostItems = formatItems(unknownIdentities);
    const combinedLostItems = [...lostItems, ...formattedAvailableItems];

    const { cash, gold_18, gold_21, gold_22, gold_24, ...rest } =
      goldBrokenCashBanksFinalData;

    const goldAndCash = {
      inventory_id: id,
      branch_id: userData?.branch_id,
      cash,
      gold_18,
      gold_21,
      gold_22,
      gold_24,
    };

    mutateInventoryData({
      endpointName: `/inventory/api/v1/missinginventories`,
      values: {
        branch_id: userData?.branch_id,
        employee_id: userData?.id,
        type_employe: false,
        inventory_id: id,
        lostItems: combinedLostItems,
        goldAndCash,
        banks: rest,
      },
    });
  };

  const { mutate: mutateInventoryData, isLoading: isLoadingInventoryData } =
    useMutate({
      mutationFn: mutateData,
      onSuccess: handleSuccessInventoryData,
    });

  return (
    <div className="py-12 px-16">
      <div className="flex items-center justify-between">
        <h2 className="text-[17px]">
          <span className="font-semibold">{t("date")} : </span>{" "}
          {formatDate(new Date())}
        </h2>
        {/* <div>
          <Button action={handlePrint}>{t("print")}</Button>
        </div> */}
      </div>

      <div
        ref={contentRef}
        className={`${isRTL ? "rtl" : "ltr"} container_print`}
      >
        <div className="my-6 text-center">
          <img src={Logo} alt="logo" className="mx-auto" />
          <h2 className="text-lg font-semibold">{t("Inventory Report")}</h2>
        </div>

        <ul className="grid grid-cols-4 gap-x-8  gap-y-6 my-8">
          {totals?.map((item, index) => (
            <li
              key={index}
              className={`text-center text-white p-4 rounded-xl`}
              style={{
                backgroundColor: item.bgColor,
              }}
            >
              <h2>{item.name}</h2>
              <p className="mt-3">
                <span className="font-semibold">{item.value ?? 0}</span>{" "}
                {t("item")}
              </p>
            </li>
          ))}
        </ul>

        <Table data={allItems ?? []} columns={columns} />

        <div className="flex items-center justify-end mt-8 mb-4">
          {/* <div className="text-center">
            <h2 className="text-[17px] font-medium">
              {t("recipient's signature")}
            </h2>
            <p className="text-xl mt-1.5">
              .................................................
            </p>
          </div> */}
          <div className="flex gap-x-3 no-print">
            <Button action={() => setSteps(2)} bordered>
              {t("back")}
            </Button>
            <Button
              action={handlePostInventoryData}
              loading={isLoadingInventoryData}
            >
              {t("save")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteInventoryProcess;
