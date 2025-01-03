import { Form, Formik } from "formik";
import { t } from "i18next";
import React, { useContext, useState } from "react";
import { Button } from "../../../components/atoms";
import { AddIcon } from "../../../components/atoms/icons";
import { BaseInputField } from "../../../components/molecules";
import { useFetch, useMutate } from "../../../hooks";
import { authCtx } from "../../../context/auth-and-perm/auth";
import AvailableItemsInBranch from "../../../components/selling/Inventory/AvailableItemsInBranch";
import { BoxesDataBase } from "../../../components/atoms/card/BoxesDataBase";
import { numberContext } from "../../../context/settings/number-formatter";
import IdentitiesCheckedByBranch from "../../../components/selling/Inventory/IdentitiesCheckedByBranch";
import UnknownIdentitiesInBranch from "../../../components/selling/Inventory/UnknownIdentitiesInBranch";
import IdentityInformationInBranch from "../../../components/selling/Inventory/IdentityInformationInBranch";
import { Loading } from "../../../components/organisms/Loading";
import { notify } from "../../../utils/toast";
import { mutateData } from "../../../utils/mutateData";
import { useParams } from "react-router-dom";
import ConvertNumberToWordGroup from "../../../utils/number to arabic words/convertNumToArWordGroup";

const CreatingInventoryBond = () => {
  const [search, setSearch] = useState<string>("");
  const { userData } = useContext(authCtx);
  const { id } = useParams();
  console.log("🚀 ~ CreatingInventoryBond ~ bondID:", id);
  const { formatGram, formatReyal } = numberContext();
  const numbers = ConvertNumberToWordGroup();
  const [newGroup, setNewGroup] = useState<any>({});
  console.log("🚀 ~ CreatingInventoryBond ~ newGroup:", newGroup);
  console.log("🚀 ~ CreatingInventoryBond ~ newGroup:", newGroup);
  console.log("🚀 ~ CreatingInventoryBond ~ newGroup:", newGroup);
  const [availableItems, setAvailableItems] = useState<any>([]);
  const [identitiesCheckedItems, setIdentitiesCheckedItems] = useState<any>([]);
  console.log(
    "🚀 ~ CreatingInventoryBond ~ identitiesCheckedItems:",
    identitiesCheckedItems
  );
  const [unknownIdentities, setUnknownIdentities] = useState<any>([]);
  const [selectedItem, setSelectedItem] = useState<any>({});

  const { data, refetch, isSuccess, isRefetching, isLoading } = useFetch({
    queryKey: ["branch-all-accepted-items", search],
    pagination: true,
    endpoint: `/inventory/api/v1/getItembyhwya/${userData?.branch_id}?hwya[lk]=${search}`,
    onSuccess: (data) => {
      setSelectedItem(data?.data?.[0]);
      setSearch("");
    },
    enabled: !!search,
  });

  // const { data: groupsData } = useFetch({
  //   endpoint: `/inventory/api/v1/inventorygroups/${userData?.branch_id}`,
  //   queryKey: ["inventorygroups"],
  // });
  // console.log("🚀 ~ CreatingInventoryBond ~ groupsData:", groupsData);

  const {
    data: nextGroup,
    isLoading: isNextGroupLoading,
    refetch: fetchNextGroup,
  } = useFetch({
    endpoint: `/inventory/api/v1/next-group/${userData?.branch_id}`,
    queryKey: ["next-group"],
  });
  console.log("🚀 ~ CreatingInventoryBond ~ groupsData:", nextGroup);

  const totals = [
    {
      name: t("Number of items in the branch"),
      key: crypto.randomUUID(),
      unit: t(""),
      value: 1000,
    },
    {
      name: t("Number of items inspected"),
      key: crypto.randomUUID(),
      unit: t("gram"),
      value: 2000,
    },
    {
      name: t("Uninspected items"),
      key: crypto.randomUUID(),
      unit: t("gram"),
      value: 3000,
    },
    {
      name: t("Unidentified items"),
      key: crypto.randomUUID(),
      unit: t("gram"),
      value: 4000,
    },
  ];

  const handleSuccess = (data) => {
    notify("success");
    setNewGroup(data);
    setIdentitiesCheckedItems((prev) => [
      ...prev,
      {
        id: data?.id,
        groupName: data?.group_name,
        totalItems: 3500,
        totalWeight: 1500,
        items: [],
      },
    ]);
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
      await fetchNextGroup(); // Fetch data manually if not already fetched
      return;
    }

    mutate({
      endpointName: "/inventory/api/v1/inventorygroups",
      values: {
        inventory_id: id,
        group_name: numbers?.[Number(nextGroup?.group_num - 1)],
        employee_id: userData?.id,
        branch_id: userData?.branch_id,
      },
    });
  };

  // if (isLoading || isRefetching) return <Loading mainTitle={t("Inventory")} />;

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
          console.log("🚀 ~ CreatingInventoryBond ~ values:", values);
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
                    value={search}
                    autoFocus
                    label={t("id code")}
                    type="search"
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={`${t("id code")}`}
                    className="placeholder-slate-400  p-[.18rem] w-80 !shadow-transparent focus:border-transparent"
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
                  />
                </div>
                <div className="w-[30%]">
                  <IdentitiesCheckedByBranch
                    identitiesCheckedItems={identitiesCheckedItems}
                    setIdentitiesCheckedItems={setIdentitiesCheckedItems}
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
    </div>
  );
};

export default CreatingInventoryBond;
