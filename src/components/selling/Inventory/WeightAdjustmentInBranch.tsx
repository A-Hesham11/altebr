import { t } from "i18next";
import React, { useEffect, useMemo, useState } from "react";
import { Table } from "../../templates/reusableComponants/tantable/Table";
import { Button } from "../../atoms";
import { numberContext } from "../../../context/settings/number-formatter";

const WeightAdjustmentInBranch = ({
  editWeight,
  setOpenWeightItem,
  addItemToIdentity,
  currenGroup,
}: any) => {
  const [weightItems, setWeightItems] = useState({});
  const [weightNumber, setWeightNumber] = useState("");
  const { formatGram } = numberContext();

  useEffect(() => {
    const storedWeights = localStorage.getItem("weightItems");
    if (storedWeights) {
      setWeightItems(JSON.parse(storedWeights));
    }
  }, []);

  const columns = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "hwya",
        header: () => <span>{t("الكود")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "classification_name",
        header: () => <span>{t("category")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "category_name",
        header: () => <span>{t("classification")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "weight",
        header: () => <span>{t("weight")}</span>,
      },
    ],
    []
  );

  const handleAddWeight = () => {
    if (weightNumber.trim() === "") return;

    setWeightItems((prev) => {
      const updatedWeights = { ...prev };

      if (!updatedWeights[editWeight?.hwya]) {
        updatedWeights[editWeight?.hwya] = [];
      }

      updatedWeights[editWeight?.hwya].push({
        id: updatedWeights[editWeight?.hwya].length + 1,
        weight: weightNumber,
      });

      localStorage.setItem("weightItems", JSON.stringify(updatedWeights));

      return updatedWeights;
    });
  };

  const totalWeight = weightItems?.[editWeight?.hwya]?.reduce(
    (acc, item) => acc + parseFloat(item.weight || 0),
    0
  );

  const currentWeight = weightItems?.[editWeight?.hwya]?.at(-1);

  return (
    <div>
      <div className="my-8">
        <p className="text-lg">{t("hwya")}</p>
        <h2 className="text-mainGreen text-xl font-semibold">
          #{editWeight.hwya}
        </h2>
      </div>

      <Table data={[editWeight]} columns={columns} />

      <div>
        <h2 className="mt-8 mb-5 text-lg font-semibold">
          {t("Enter the total weight of the item:")}
        </h2>
        <div className="flex gap-x-5 w-full">
          <div className="bg-[#F4F7F6] rounded-2xl p-8 w-3/4">
            {!editWeight?.details_weight && (
              <div>
                <input
                  name="weight"
                  placeholder={`${t("weight")}`}
                  onChange={(e) => setWeightNumber(e.target.value)}
                  value={weightNumber}
                  className="border-none p-3 rounded-xl me-5"
                />
                <Button bordered action={handleAddWeight}>
                  {t("add")}
                </Button>
              </div>
            )}
            <ul className="mt-8 flex items-center gap-x-4">
              {weightItems?.[editWeight?.hwya]?.map((item) => (
                <li className="bg-[#DB802833] text-mainOrange w-fit px-5 py-2 rounded-2xl text-[15px]">
                  <p>
                    <span className="font-semibold">
                      {t("weight")} {item.id} :
                    </span>{" "}
                    {item.weight} {t("gram")}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-1/4">
            <ul>
              <li className="border border-mainGreen rounded-xl mb-3">
                <p className="bg-mainGreen text-white px-2 py-2.5 flex items-center justify-center rounded-t-xl">
                  {t("total weight")}
                </p>
                <p className="px-2 py-[7px] text-mainGreen text-center rounded-b-xl">
                  {formatGram(Number(editWeight?.weight))} {t("gram")}
                </p>
              </li>
              <li className="border border-mainOrange rounded-xl">
                <p className="bg-mainOrange text-white px-2 py-2.5 flex items-center justify-center rounded-t-xl">
                  {t("remaining weight")}
                </p>
                <p className="px-2 py-[7px] text-mainOrange rounded-b-xl text-center">
                  {formatGram(Number(editWeight?.weight - totalWeight))}{" "}
                  {t("gram")}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {!editWeight?.details_weight && (
        <div className="flex justify-end mt-10">
          <Button
            action={() => {
              const currenGroupNumber = currenGroup?.id;
              const { weight, ...rest } = editWeight;
              addItemToIdentity(
                currenGroupNumber,
                {
                  ...editWeight,
                  weight: Number(currentWeight?.weight),
                },
                true
              );
              setOpenWeightItem(false);
            }}
          >
            {t("confirm")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default WeightAdjustmentInBranch;

// setIdentitiesCheckedItems((prevState) => {
//   return prevState.map((group) => {
//     return {
//       ...group,
//       items: group.items.map((item) => {
//         if (editWeight?.hwya == item.hwya) {
//           return {
//             ...item,
//             weight: totalWeight,
//           };
//         }
//         return item;
//       }),
//     };
//   });
// });
