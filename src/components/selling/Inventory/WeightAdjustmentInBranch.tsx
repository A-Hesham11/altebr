import { t } from "i18next";
import { useEffect, useMemo, useState } from "react";
import { Table } from "../../templates/reusableComponants/tantable/Table";
import { Button } from "../../atoms";
import { numberContext } from "../../../context/settings/number-formatter";
import { notify } from "../../../utils/toast";

const WeightAdjustmentInBranch = ({
  editWeight,
  setOpenWeightItem,
  addItemToIdentity,
  currenGroup,
  socket,
  BasicCompanyData,
}: any) => {
  const [weightItems, setWeightItems] = useState([]);
  const [weightNumber, setWeightNumber] = useState("");
  const { formatGram } = numberContext();

  const filterWeightItemsByHwya = weightItems?.filter(
    (item) => item.hwya === editWeight.hwya
  );
  console.log("🚀 ~ filterWeightItemsByHwya:", filterWeightItemsByHwya);

  const columns = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "hwya",
        header: () => <span>{t("hwya")}</span>,
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
        accessorKey: "karat_name",
        header: () => <span>{t("karat")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "weight",
        header: () => <span>{t("weight")}</span>,
      },
    ],
    []
  );

  const handleWeightItemsResponse = (data: any) => {
    setWeightItems(data.success ? data?.data : []);
  };

  // useEffect(() => {
  //   socket.on("connect");

  //   socket.emit("getSelsal", BasicCompanyData);
  //   socket.on("getSelsalResponse", handleWeightItemsResponse);

  //   return () => {
  //     socket.off("getSelsalResponse", handleWeightItemsResponse);
  //     socket.disconnect();
  //   };
  // }, []);

  useEffect(() => {
    socket.emit("getSelsal", BasicCompanyData);

    const handleResponse = (data) => {
      handleWeightItemsResponse(data);
    };

    socket.on("getSelsalResponse", handleResponse);

    return () => {
      socket.off("getSelsalResponse", handleResponse);
    };
  }, []);

  const totalCurrentWeight = filterWeightItemsByHwya?.reduce(
    (acc, item) => Number(acc) + Number(parseFloat(item.weight || 0)),
    0
  );
  console.log("🚀 ~ totalCurrentWeight:", totalCurrentWeight);

  const totalWeight = filterWeightItemsByHwya?.reduce(
    (acc, item) => acc + parseFloat(item.weight || 0),
    0
  );

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
              </div>
            )}
            <ul className="mt-8 flex items-center flex-wrap gap-4">
              {filterWeightItemsByHwya?.map((item) => (
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
                  {totalWeight
                    ? formatGram(Number(+editWeight?.weight - +totalWeight))
                    : 0}{" "}
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
              if (!weightNumber) {
                notify("info", `${t("Enter weight for a piece")}`);
                return;
              }

              const currentWeight =
                Number(totalCurrentWeight) + Number(weightNumber);

              if (currentWeight > editWeight.weight) {
                notify("info", `${t("The full weight has been added.")}`);
                return;
              }

              const payload = {
                ...BasicCompanyData,
                id: filterWeightItemsByHwya?.length + 1,
                hwya: editWeight?.hwya,
                weight: weightNumber,
              };

              socket.emit("selsalPieces", payload);

              // socket.on("selsalPiecesResponse", () => {
              //   socket.emit("getSelsal", BasicCompanyData);
              //   socket.on("getSelsalResponse", handleWeightItemsResponse);
              // });
              socket.emit("getSelsal", BasicCompanyData);

              const data = {
                ...editWeight,
                weight: Number(weightNumber),
              };

              console.log(data, currenGroupNumber, "🔥🔥🔥🔥");

              addItemToIdentity(currenGroupNumber, data, true);
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
