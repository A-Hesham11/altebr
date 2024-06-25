//@ts-nocheck
/////////// IMPORTS
///
///
/////////// Types
import { t } from "i18next";
import { Dispatch, SetStateAction, useState } from "react";
import { supplierTax_TP } from "../../pages/supply/Supply";
import { notify } from "../../utils/toast";
import { Button } from "../atoms";
import { OuterFormLayout } from "../molecules";
import { DiamondTable } from "../templates/reusableComponants/diamond-table/DiamondTable";
import { GoldTable } from "../templates/reusableComponants/gold-table/GoldTable";
import { Box_TP, BoxesView } from "./BoxesView";
import { FirstFormView } from "./FirstFormView";
import { FirstFormInitValues_TP } from "./formInitialValues_types";
import { AccessoriesTable } from "../templates/reusableComponants/accessories-table/AccessoriesTable";
///
type GoldSupplySecondFormProps_TP = {
  supplierTax: supplierTax_TP;
  setBoxesView: Dispatch<SetStateAction<Box_TP[] | undefined>>;
  supply: Supply_TP;
  formValues: FirstFormInitValues_TP | undefined;
  setStage: Dispatch<SetStateAction<number>>;
  setFormValues: Dispatch<SetStateAction<FirstFormInitValues_TP | undefined>>;
  setFinalData: Dispatch<SetStateAction<FinalData_TP | undefined>>;
  data: OTableDataTypes[];
  setData: Dispatch<SetStateAction<OTableDataTypes[]>>;
  boxValues: OTableDataTypes[];
  setBoxValues: Dispatch<SetStateAction<OTableDataTypes[]>>;
  editData: OTableDataTypes;
  setEditData: Dispatch<SetStateAction<OTableDataTypes>>;
};
export type BoxesTypes = {
  karat_24_aggregate: number;
  karat_22_aggregate: number;
  karat_21_aggregate: number;
  karat_18_aggregate: number;
  total_24_gold_by_stock: number;
  total_wages: number;
  total_tax: number;
  total_weight: number;
};
export type GoldTableProperties_TP = {
  id: string;
  number: string;
  category_id: string;
  weight: string;
  karat_id: string;
  stock: string;
  wage: string;
  total_wages: string;
  wage_tax: string;
  gold_tax: string;
};
export type TableHelperValues_TP = {
  karat_value: string;
  category_value: string;
};
export type OTableDataTypes = GoldTableProperties_TP & TableHelperValues_TP;

///
export const SupplySecondForm = ({
  supplierTax,
  formValues,
  supply,
  setStage,
  setFormValues,
  setFinalData,
  data,
  setData,
  boxValues,
  setBoxesView,
  setBoxValues,
  editData,
  setEditData,
}: GoldSupplySecondFormProps_TP) => {
  console.log(editData.karatmineral_id);

  const [dirty, setDirty] = useState(false);
  const defaultValues: OTableDataTypes =
    supply == "gold"
      ? {
          id: crypto.randomUUID(),
          number: editData.number || "",
          category_id: editData.category_id || "",
          weight: editData.weight || "",
          karat_id: editData.karat_id || "",
          stock: editData.stock || "",
          wage: editData.wage || "",
          total_wages: editData.total_wages || "",
          wage_tax: editData.wage_tax || "",
          gold_tax: editData.gold_tax || "",
          karat_value: "",
          category_value: "",
          front_key_twred: "",
        }
      : supply == "diamond"
      ? {
          id: crypto.randomUUID(),
          number: editData.number || "",
          category_id: editData.category_id || "",
          weight: editData.weight || "",
          gold_weight: editData.gold_weight || "",
          mineral_id: editData.mineral_id || "",
          karatmineral_id: editData.karatmineral_id || "",
          stock: editData.stock || "",
          diamond_value: editData.diamond_value || "",
          diamond_value_ryal: editData.diamond_value_ryal || "",
          diamond_amount: editData.diamond_amount || "",
          diamond_stone_weight: editData.diamond_stone_weight || "",
          other_stones_weight: editData.other_stones_weight || "",
          diamond_tax: editData.diamond_tax || "",
          karat_value: "",
          category_value: "",
          front_key_twred: "",
        }
      : {
          id: crypto.randomUUID(),
          number: editData.number || "",
          category_id: editData.category_id || "",
          weight: editData.weight || "",
          gold_weight: editData.gold_weight || "",
          mineral_id: editData.mineral_id || "",
          karatmineral_id: editData.karatmineral_id || "",
          stock: editData.stock || "",
          accessory_value: editData.accessory_value || "",
          accessory_value_ryal: editData.accessory_value_ryal || "",
          accessory_amount: editData.accessory_amount || "",
          accessory_weight: editData.accessory_weight || "",
          other_stones_weight: editData.other_stones_weight || "",
          accessory_tax: editData.accessory_tax || "",
          karat_value: "",
          category_value: "",
          front_key_twred: "",
        };
  const karat_24_values = boxValues.filter((item) => item.karat_value === "24");
  const karat_22_values = boxValues.filter((item) => item.karat_value === "22");
  const karat_21_values = boxValues.filter((item) => item.karat_value === "21");
  const karat_18_values = boxValues.filter((item) => item.karat_value === "18");

  const boxes =
    supply === "gold"
      ? {
          karat_24_aggregate: {
            title: "total 24 gold box",
            value: karat_24_values.reduce((acc, curr) => {
              return +acc + Number(curr.weight);
            }, 0),
            unit: "gram",
          },
          karat_22_aggregate: {
            title: "total 22 gold box",
            value: karat_22_values.reduce((acc, curr) => {
              return +acc + Number(curr.weight);
            }, 0),
            unit: "gram",
          },
          karat_21_aggregate: {
            title: "total 21 gold box",
            value: karat_21_values.reduce((acc, curr) => {
              return +acc + Number(curr.weight);
            }, 0),
            unit: "gram",
          },
          karat_18_aggregate: {
            title: "total 18 gold box",
            value: karat_18_values.reduce((acc, curr) => {
              return +acc + Number(curr.weight);
            }, 0),
            unit: "gram",
          },
          total_24_gold_by_stock: {
            title: "total 24 gold by stock",
            value: boxValues.reduce((acc, curr) => {
              return +acc + Number(curr.weight) * Number(curr.stock);
            }, 0),
            unit: "gram",
          },
          total_wages: {
            title: "total wages",
            value: boxValues.reduce((acc, curr) => {
              return +acc + Number(curr.wage) * Number(curr.weight);
            }, 0),
            unit: "reyal",
          },
          total_tax: {
            title: "total value added tax",
            value: boxValues.reduce((acc, curr) => {
              if (curr.karat_value == "24") {
                if (supplierTax === "no" || supplierTax === "gold") {
                  return 0;
                } else {
                  return (
                    +acc + (Number(curr.weight) * Number(curr.wage) * 0.15 + 0)
                  );
                }
              } else {
                if (supplierTax === "no") {
                  return 0;
                } else if (supplierTax === "gold") {
                  return (
                    +acc +
                    (0 +
                      Number(curr.weight) *
                        Number(curr.stock) *
                        Number(formValues?.api_gold_price) *
                        0.15)
                  );
                } else if (supplierTax === "wages") {
                  return (
                    +acc + (Number(curr.weight) * Number(curr.wage) * 0.15 + 0)
                  );
                } else {
                  return (
                    +acc +
                    (Number(curr.weight) * Number(curr.wage) * 0.15 +
                      Number(curr.weight) *
                        Number(curr.stock) *
                        Number(formValues?.api_gold_price) *
                        0.15)
                  );
                }
              }
            }, 0),
            unit: "reyal",
          },
          total_weight: {
            title: "total weight",
            value: boxValues.reduce((acc, curr) => {
              return +acc + Number(curr.weight);
            }, 0),
            unit: "gram",
          },
        }
      : supply === "diamond"
      ? {
          total_diamond_value: {
            title: "total diamond value",
            value: boxValues.reduce((acc, curr) => {
              return +acc + Number(curr.diamond_value_ryal);
            }, 0),
            unit: "reyal",
          },
          total_tax: {
            title: "total value added tax",
            value: boxValues.reduce((acc, curr) => {
              return +acc + Number(curr.diamond_value_ryal) * 0.15;
            }, 0),
            unit: "reyal",
          },
          total_weight: {
            title: "total weight",
            value: boxValues.reduce((acc, curr) => {
              return (
                +acc +
                Number(curr.gold_weight) +
                Number(curr.diamond_stone_weight) / 5 +
                Number(curr.other_stones_weight) / 5
              );
            }, 0),
            unit: "gram",
          },
          total_other_stones_weight: {
            title: "total other stones weight",
            value: boxValues.reduce((acc, curr) => {
              return +acc + Number(curr.other_stones_weight);
            }, 0),
            unit: "karat",
          },
          total_diamond_amount: {
            title: "total diamond amount",
            value: boxValues.reduce((acc, curr) => {
              return +acc + Number(curr.diamond_amount);
            }, 0),
            unit: "item",
          },
          total_diamond_stone_weight: {
            title: "total diamond stone weight",
            value: boxValues.reduce((acc, curr) => {
              return +acc + Number(curr.diamond_stone_weight);
            }, 0),
            unit: "karat",
          },
          total_gold_weight: {
            title: "total mineral weight",
            value: boxValues.reduce((acc, curr) => {
              return +acc + Number(curr.gold_weight);
            }, 0),
            unit: "gram",
          },
        }
      : supply === "accessories" && {
          total_accessories_value: {
            title: "total accessories value",
            value: boxValues.reduce((acc, curr) => {
              return +acc + Number(curr.accessory_value_ryal);
            }, 0),
            unit: "reyal",
          },
          total_tax: {
            title: "total value added tax",
            value: boxValues.reduce((acc, curr) => {
              return +acc + Number(curr.accessory_value_ryal) * 0.15;
            }, 0),
            unit: "reyal",
          },
          total_weight: {
            title: "total weight",
            value: boxValues.reduce((acc, curr) => {
              return (
                +acc +
                Number(curr.gold_weight) +
                Number(curr.other_stones_weight) / 5
              );
            }, 0),
            unit: "gram",
          },
          total_other_stones_weight: {
            title: "total other stones weight",
            value: boxValues.reduce((acc, curr) => {
              return +acc + Number(curr.other_stones_weight);
            }, 0),
            unit: "karat",
          },

          total_accessory_amount: {
            title: "total accessory amount",
            value: boxValues.reduce((acc, curr) => {
              return +acc + Number(curr.accessory_amount);
            }, 0),
            unit: "item",
          },
          // total_accessory_weight: {
          //     title: 'total accessory weight',
          //     value: boxValues.reduce((acc, curr) => {
          //         return +acc + (Number(curr.accessory_weight))
          //     }, 0),
          //     unit: 'karat'
          // },
          total_gold_weight: {
            title: "total mineral weight",
            value: boxValues.reduce((acc, curr) => {
              return +acc + Number(curr.gold_weight);
            }, 0),
            unit: "gram",
          },
        };

  const boxesView = Object.values(boxes).map((box) => {
    return {
      title: box.title,
      value: box.value,
      unit: box.unit,
    };
  });

  ///
  return (
    <>
      <OuterFormLayout>
        <FirstFormView
          supply={supply}
          formValues={formValues}
          setStage={setStage}
          setFormValues={setFormValues}
        />
      </OuterFormLayout>
      <div className="px-4">
        <h1 className="text-2xl mb-5 mt-10">{t("bond total")}</h1>
        {boxesView.length > 0 && <BoxesView boxes={boxesView} />}
        <h1 className="text-2xl mt-10">{t("bond items")}</h1>
        <div className="flex flex-col gap-6 items-center">
          {supply == "gold" ? (
            <GoldTable
              supplierTax={supplierTax}
              dirty={dirty}
              setDirty={setDirty}
              data={data}
              setData={setData}
              defaultValues={defaultValues}
              setEditData={setEditData}
              editData={editData}
              formValues={formValues}
              setBoxValues={setBoxValues}
            />
          ) : supply == "diamond" ? (
            <DiamondTable
              dirty={dirty}
              setDirty={setDirty}
              data={data}
              setData={setData}
              defaultValues={defaultValues}
              setEditData={setEditData}
              editData={editData}
              formValues={formValues}
              setBoxValues={setBoxValues}
            />
          ) : supply == "accessories" ? (
            <AccessoriesTable
              dirty={dirty}
              setDirty={setDirty}
              data={data}
              setData={setData}
              defaultValues={defaultValues}
              setEditData={setEditData}
              editData={editData}
              formValues={formValues}
              setBoxValues={setBoxValues}
            />
          ) : null}
          <div className="flex justify-end gap-4 w-full">
            <Button
              action={() => setStage(1)}
              className="bg-mainGray border-mainGreen text-mainGreen"
            >
              {t("back")}
            </Button>
            <Button
              action={() => {
                setFinalData({
                  boxes:
                    supply == "gold"
                      ? {
                          karat_24_aggregate: boxes.karat_24_aggregate.value,
                          karat_22_aggregate: boxes.karat_22_aggregate.value,
                          karat_21_aggregate: boxes.karat_21_aggregate.value,
                          karat_18_aggregate: boxes.karat_18_aggregate.value,
                          total_24_gold_by_stock:
                            boxes.total_24_gold_by_stock.value,
                          total_wages: boxes.total_wages.value,
                          total_tax: boxes.total_tax.value,
                          total_weight: boxes.total_weight.value,
                        }
                      : supply == "diamond"
                      ? {
                          total_diamond_value: boxes.total_diamond_value.value,
                          total_tax: boxes.total_tax.value,
                          total_weight: boxes.total_weight.value,
                          total_other_stones_weight:
                            boxes.total_other_stones_weight.value,
                          total_diamond_amount:
                            boxes.total_diamond_amount.value,
                          total_diamond_stone_weight:
                            boxes.total_diamond_stone_weight.value,
                        }
                      : {
                          total_accessories_value:
                            boxes.total_accessories_value.value,
                          total_tax: boxes.total_tax.value,
                          total_weight: boxes.total_weight.value,
                          total_other_stones_weight:
                            boxes.total_other_stones_weight.value,
                          total_accessory_amount:
                            boxes.total_accessory_amount.value,
                          // total_accessory_weight: boxes.total_accessory_weight.value,
                        },
                  table: data.map((item, i) => {
                    return supply == "gold"
                      ? {
                          ...item,
                          number: `${i + 1}`,
                          total_wages: Number(item.weight) * Number(item.wage),
                          wage_tax:
                            supplierTax === "no" || supplierTax === "gold"
                              ? 0
                              : Number(item.weight) * Number(item.wage) * 0.15,
                          gold_tax:
                            supplierTax === "no" || supplierTax === "wages"
                              ? 0
                              : item.karat_value == "24"
                              ? 0
                              : Number(item.weight) *
                                  Number(formValues?.api_gold_price) *
                                  Number(item.stock) *
                                  0.15 || 0,
                        }
                      : supply == "diamond"
                      ? {
                          ...item,
                          number: `${i + 1}`,
                          weight:
                            Number(item.gold_weight) +
                            Number(item.diamond_stone_weight) / 5 +
                            Number(item.other_stones_weight) / 5,
                          diamond_tax: Number(item.diamond_value_ryal) * 0.15,
                        }
                      : {
                          ...item,
                          number: `${i + 1}`,
                          weight:
                            Number(item.gold_weight) +
                            Number(item.other_stones_weight) / 5,
                          accessory_tax:
                            Number(item.accessory_value_ryal) * 0.15,
                        };
                  }),
                });
                if (data.length > 0) {
                  if (dirty) {
                    notify("error", `${t("must add the item")}`);
                  } else {
                    setBoxesView(boxesView);
                    setStage((prev) => prev + 1);
                  }
                } else {
                  notify("error", `${t("must add one item at least")}`);
                }
              }}
            >
              {t("next")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
