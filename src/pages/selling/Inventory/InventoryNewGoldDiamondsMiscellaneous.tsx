import { Form, Formik } from "formik";
import { t } from "i18next";
import { useContext, useEffect, useState } from "react";
import { Button } from "../../../components/atoms";
import { AddIcon } from "../../../components/atoms/icons";
import { BaseInputField } from "../../../components/molecules";
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
import { useParams } from "react-router-dom";
import { mutateData } from "../../../utils/mutateData";

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

  const playBeep = (frequency: number) => {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = context.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    oscillator.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.2);
  };

  const addItemToIdentity = (id: number, newItem: Item) => {
    if (newItem?.is_exist) {
      const updatedIdentities = identitiesCheckedItems.map((identity) =>
        identity.id === id
          ? {
              ...identity,
              items: [{ ...newItem, status: "Checked" }, ...identity.items],
              totalItems: identity.items.length + 1,
              totalWeight: identity.items.reduce(
                (sum: number, item: Item) => Number(sum) + Number(item.weight),
                newItem?.weight
              ),
            }
          : identity
      );

      setIdentitiesCheckedItems(updatedIdentities);
      localStorage.setItem(
        "identitiesCheckedItems",
        JSON.stringify(updatedIdentities)
      );
      playBeep(200);
    } else {
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
  const { data, refetch, isSuccess, isRefetching, isLoading } = useFetch({
    queryKey: ["branch-all-accepted-items", search],
    pagination: true,
    endpoint: `/inventory/api/v1/getItembyhwya/${userData?.branch_id}?hwya[lk]=${search}`,
    onSuccess: (data) => {
      addItemToIdentity(currenGroupNumber, data?.data);
      setSelectedItem(data?.data);
      setSearch("");
    },
    enabled: !!search,
  });

  const {
    data: nextGroup,
    isLoading: isNextGroupLoading,
    refetch: fetchNextGroup,
  } = useFetch({
    endpoint: `/inventory/api/v1/next-group/${userData?.branch_id}`,
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
  };

  const { mutate, isLoading: isLoadingMutate } = useMutate({
    mutationFn: mutateData,
    onSuccess: (data) => handleSuccess(data),
  });

  const handleCreateGroups = async () => {
    if (isNextGroupLoading) {
      console.error("Fetching next group data. Please wait.");
      return;
    }

    if (!nextGroup) {
      console.error("Failed to fetch next group data. Retrying...");
      await fetchNextGroup();
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

  return (
    <div className="px-10 py-8">
      <div className="flex items-center justify-between text-mainGreen border-b-2 pb-3">
        <h2 className="text-xl font-semibold ">{t("Inventory")}</h2>
        <p className="font-semibold">
          {t("Inventory of new gold, diamonds and miscellaneous")}
        </p>
      </div>
      <Formik initialValues={{ hwya: "" }} onSubmit={(values) => {}}>
        {({ values }) => {
          return (
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

                <div className="flex gap-2 items-center justify-center rounded-md  p-1">
                  <BaseInputField
                    id="search"
                    name="search"
                    autoFocus
                    label={`${t("id code")}`}
                    type="text"
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
                    availableItems={availableItems}
                    setAvailableItems={setAvailableItems}
                    setNumberItemsInBranch={setNumberItemsInBranch}
                  />
                </div>
                <div className="w-[30%]">
                  <IdentitiesCheckedByBranch
                    identitiesCheckedItems={identitiesCheckedItems}
                    setIdentitiesCheckedItems={setIdentitiesCheckedItems}
                    currenGroupNumber={currenGroupNumber}
                  />
                </div>
                <div className="w-[30%]">
                  <UnknownIdentitiesInBranch
                    unknownIdentities={unknownIdentities}
                    setUnknownIdentities={setUnknownIdentities}
                  />
                </div>
                <div className="w-[25%]">
                  <IdentityInformationInBranch
                    selectedItem={selectedItem}
                    setSelectedItem={setSelectedItem}
                  />
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>

      <div className="flex justify-end mt-5">
        <Button
          action={() => {
            setSteps(2);
          }}
        >
          {t("next")}
        </Button>
      </div>
    </div>
  );
};

export default InventoryNewGoldDiamondsMiscellaneous;
