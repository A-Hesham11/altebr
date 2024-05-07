// import { t } from "i18next";
// import { notify } from "../../utils/toast";
// import PaymentBoxes from "../../components/selling/selling components/data/paymentBoxs";
// import PaymentProcessing, {
//   Payment_TP,
// } from "../../components/selling/selling components/data/PaymentProcessing";
// import { Button } from "../../components/atoms";
// import { useContext, useEffect, useState } from "react";
// import { authCtx } from "../../context/auth-and-perm/auth";
// import { useFetch, useMutate } from "../../hooks";
// import { mutateData } from "../../utils/mutateData";
// import { numberContext } from "../../context/settings/number-formatter";
// import { useNavigate } from "react-router-dom";
// import SupplierPaymentProccessing from "./SupplierPaymentProccessing";
// import { Select } from "../../components/molecules";
// import { KaratValues_TP, SelectOption_TP } from "../../types";
// import { Supplier_TP } from "../../components/templates/systemEstablishment/supplier/supplier-types";
// import { Form, Formik } from "formik";
// import { ClientData_TP } from "../selling/PaymentSellingPage";

// const SupplierPayment = () => {
//   const [paymentData, setPaymentData] = useState<Payment_TP[]>([]);
//   const [sellingItemsData, setSellingItemsData] = useState([]);
//   const [stage, setStage] = useState<number>(1);
//   const [selectedCardId, setSelectedCardId] = useState(null);
//   const [selectedCardName, setSelectedCardName] = useState(null);
//   const [cardId, setCardId] = useState("");
//   const navigate = useNavigate();
//   const { userData } = useContext(authCtx);
//   const taxRate = (userData?.tax_rate * 0.01) + 1;
//   const { formatGram, formatReyal } = numberContext();
//   const [supplierId, setSupplierId] = useState(0);
//   const [boxValues, setBoxValues] = useState();

//   const { data, refetch: supplierGetCount } = useFetch({
//     endpoint: `/sadadSupplier/api/v1/get-count/${supplierId}`,
//     queryKey: ["dataOfPaymentToSupplier"],
//     onSuccess(data) {
//       return data.data;
//     },
//   });

//   const { data: invoiceDataNumber } = useFetch({
//     endpoint: `/sdad/api/v1/sdadbonds/${userData?.branch_id}?per_page=10000`,
//     queryKey: ["payment-sdadbonds"],
//     onSuccess(data) {
//       return data.data;
//     },
//   });

//   const { data: goldPrice } = useFetch<ClientData_TP>({
//     endpoint: `/buyingUsedGold/api/v1/get-gold-price`,
//     queryKey: ["get-gold-price-sadad"],
//   });

//   const {
//     data: suppliers,
//     isLoading: suppliersLoading,
//     failureReason: suppliersErrorReason,
//     refetch: refetchSupplier,
//   } = useFetch<SelectOption_TP[], Supplier_TP[]>({
//     endpoint: "/supplier/api/v1/suppliers?per_page=10000",
//     queryKey: ["suppliers"],
//     onSuccess(data) {},
//     select: (suppliers) =>
//       suppliers.map((supplier) => {
//         return {
//           //@ts-ignore
//           id: supplier.id,
//           value: supplier.name,
//           label: supplier.name,
//           name: supplier.name,
//         };
//       }),
//   });

//   const { mutate: mutatePaymentsData, isLoading } = useMutate({
//     mutationFn: mutateData,
//     onSuccess: (data) => {
//       notify("success");
//       navigate(`/bonds/supplier-payment`);
//     },
//   });

//   const {
//     data: boxesResponse,
//     isLoading: boxesLoading,
//     refetch: boxesRefetch,
//   } = useFetch<any>({
//     endpoint: `/sadadSupplier/api/v1/boxes/${supplierId}`,
//     queryKey: ["sadadSupplier_response"],
//   });

//   useEffect(() => {
//     supplierGetCount();
//     boxesRefetch();
//   }, [supplierId]);

//   const { data: karatValues } = useFetch<KaratValues_TP[]>({
//     endpoint: "classification/api/v1/allkarats",
//     queryKey: ["sadad_karat_bond_select"],
//   });

//   const paymentWeightItems = paymentData.filter((item) =>
//     ["24", "22", "21", "18"].includes(item.card_id)
//   );

//   const getMyKarat = (value: string) => {
//     const myKarat = karatValues!.find((item) => item.karat == value);
//     return Number(myKarat?.value);
//   };

//   const karat_24_values = paymentData?.filter((item) => item.frontkey === "24");
//   const karat_22_values = paymentData?.filter((item) => item.frontkey === "22");
//   const karat_21_values = paymentData?.filter((item) => item.frontkey === "21");
//   const karat_18_values = paymentData?.filter((item) => item.frontkey === "18");
//   const sadad_supplier_cash = paymentData?.filter(
//     (item) => item.frontkey === "cash"
//   );
//   const gold_discount_sadad = paymentData?.filter(
//     (item) => item.frontkey === "discount"
//   );

//   const card = paymentData.reduce((acc, curr) => {
//     acc[curr.frontkey] = Number(curr.amount);
//     return acc;
//   }, {});

//   const accountBanksData = {};
//   for (const key in card) {
//     if (Object.prototype.hasOwnProperty.call(card, key)) {
//       const modifiedKey = key.replace(/_1$/, "");
//       accountBanksData[modifiedKey] = {
//         title: modifiedKey,
//         value: card[key],
//         unit: "reyal",
//       };
//     }
//   }

//   const boxes = {
//     sadad_supplier_cash: {
//       title: "sadad supplier cash",
//       value: sadad_supplier_cash?.reduce((acc, curr) => {
//         return +acc + Number(curr.amount);
//       }, 0),
//       unit: "reyal",
//     },
//     karat_24_aggregate: {
//       title: "total 24 gold box",
//       value: karat_24_values?.reduce((acc, curr) => {
//         return +acc + Number(curr.weight);
//       }, 0),
//       unit: "gram",
//     },
//     karat_22_aggregate: {
//       title: "total 22 gold box",
//       value: karat_22_values?.reduce((acc, curr) => {
//         return +acc + Number(curr.weight);
//       }, 0),
//       unit: "gram",
//     },
//     karat_21_aggregate: {
//       title: "total 21 gold box",
//       value: karat_21_values?.reduce((acc, curr) => {
//         return +acc + Number(curr.weight);
//       }, 0),
//       unit: "gram",
//     },
//     karat_18_aggregate: {
//       title: "total 18 gold box",
//       value: karat_18_values?.reduce((acc, curr) => {
//         return +acc + Number(curr.weight);
//       }, 0),
//       unit: "gram",
//     },
//     gold_purities_sadad: {
//       title: "gold purities sadad main",
//       value: paymentWeightItems.reduce((acc, curr) => {
//         return (
//           +acc +
//           (Number(curr.weight) * Number(curr.stock_difference) -
//             Number(curr.weight) * Number(curr.stock_difference_mian))
//         );
//       }, 0),
//       unit: "gram",
//     },
//     total_money: {
//       title: "total money",
//       value: paymentData?.reduce((acc, curr) => {
//         return +acc + Number(curr.amount);
//       }, 0),
//       unit: "reyal",
//     },
//     total_weight: {
//       title: "total weight",
//       value: paymentData?.reduce((acc, curr) => {
//         return +acc + Number(curr.weight);
//       }, 0),
//       unit: "gram",
//     },
//     gold_discount: {
//       title: "gold discount",
//       value: gold_discount_sadad?.reduce((acc, curr) => {
//         return +acc + Number(curr.amount);
//       }, 0),
//       unit: "gram",
//     },
//     ...accountBanksData,
//   };

//   const mapBox = (item: any) => {
//     switch (item.front_key) {
//       case "sdad_supplier_money":
//         let total_payment_cost = 0;
//         paymentData?.forEach((row) => {
//           total_payment_cost = Number(total_payment_cost) + Number(row.amount);
//         });

//         const total_weight_tax = paymentWeightItems.reduce((acc, curr) => {
//           return (
//             +acc +
//             Number(curr.weight) *
//               Number(curr.stock_difference) *
//               Number(goldPrice[curr?.card_id]) *
//               (curr?.card_id === "24" ? 0 : Number(userData?.tax_rate * 0.01))
//           );
//         }, 0);

//         const total_money_tax =
//           Number(boxes?.total_money.value) -
//           Number(boxes?.total_money.value) / Number(taxRate);
//         return {
//           ...item,
//           value: boxes?.total_money.value + total_money_tax + total_weight_tax,
//         };
//       case "sdad_supplier_gold":
//         let total_payment_karat = 0;
//         paymentWeightItems?.forEach((row) => {
//           total_payment_karat =
//             Number(total_payment_karat) +
//             Number(row.weight) * Number(getMyKarat(row?.frontkey));
//         });

//         let karat_difference =
//           Number(boxes?.total_weight.value) - Number(total_payment_karat);
//         return {
//           ...item,
//           value:
//             Number(boxes?.total_weight.value) -
//             Number(karat_difference) +
//             boxes?.gold_purities_sadad.value,
//         };
//       case "gold3yar_sadad_supplier":
//         let total_24_gold_by_karat2 = 0;

//         paymentWeightItems?.forEach((row) => {
//           total_24_gold_by_karat2 =
//             Number(total_24_gold_by_karat2) +
//             Number(row.weight) * Number(getMyKarat(row?.frontkey));
//         });
//         let value =
//           Number(boxes?.total_weight.value) - Number(total_24_gold_by_karat2);
//         if (value < 0) {
//           value = value * -1;
//           const computational_movement =
//             item.nature === "debtor" ? "creditor" : "debtor";
//           return {
//             ...item,
//             value,
//             computational_movement,
//           };
//         } else {
//           return {
//             ...item,
//             value,
//           };
//         }
//       case "sadad_supplier_cash":
//         return {
//           ...item,
//           value: boxes?.sadad_supplier_cash.value,
//         };
//       case "gold_discount_sadad_supplier":
//         return {
//           ...item,
//           value: boxes?.gold_discount.value,
//         };
//       case "goldpurities_sadad_supplier":
//         let val = boxes?.gold_purities_sadad.value;
//         if (val < 0) {
//           val = val * -1;
//           const computational_movement =
//             item.nature === "debtor" ? "creditor" : "debtor";
//           return {
//             ...item,
//             value: val,
//             computational_movement,
//           };
//         } else {
//           return {
//             ...item,
//             value: val,
//           };
//         }
//       // بنوك
//       case "total_tax_sadad_supplier":
//         const total_weight_sadad_tax = paymentWeightItems.reduce(
//           (acc, curr) => {
//             return (
//               +acc +
//               Number(curr.weight) *
//                 Number(curr.stock_difference) *
//                 Number(goldPrice[curr?.card_id]) *
//                 (curr?.card_id === "24" ? 0 : Number(userData?.tax_rate * 0.01))
//             );
//           },
//           0
//         );

//         const total_money_sadad_tax =
//           Number(boxes?.total_money.value) -
//           Number(boxes?.total_money.value) / Number(taxRate);

//         return {
//           ...item,
//           value: total_money_sadad_tax + total_weight_sadad_tax,
//         };
//       case "gold_box_fractional_18_sadad_suppliers":
//         return {
//           ...item,
//           value: boxes?.karat_18_aggregate.value,
//         };
//       case "gold_box_fractional_21_sadad_suppliers":
//         return {
//           ...item,
//           value: boxes?.karat_21_aggregate.value,
//         };
//       case "gold_box_fractional_22_sadad_suppliers":
//         return {
//           ...item,
//           value: boxes?.karat_22_aggregate.value,
//         };
//       case "gold_box_fractional_24_sadad_suppliers":
//         return {
//           ...item,
//           value: boxes?.karat_24_aggregate.value,
//         };
//       default:
//         const frontKeyExists = accountBanksData.hasOwnProperty(item.front_key);
//         if (frontKeyExists) {
//           return {
//             ...item,
//             value: boxes[item.front_key]?.value,
//           };
//         }
//         return item;
//     }
//   };

//   const boxesFinal = boxesResponse?.map(mapBox);

//   const handleSeccessedData = () => {
//     const postPaymentData: any = [];
//     const postPaymentAllData: any = [];

//     Object.keys(paymentData).forEach((key) => {
//       const keyValueObject = {
//         id: paymentData[key]?.id,
//         front_key:
//           paymentData[key]?.frontKeyAccept || paymentData[key]?.frontKeySadad,
//         value: paymentData[key]?.amount || paymentData[key]?.weight,
//       };
//       postPaymentData.push(keyValueObject);

//       const keyAllValueObject = {
//         card_id: paymentData[key]?.id,
//         front_key:
//           paymentData[key]?.frontKeyAccept || paymentData[key]?.frontKeySadad,
//         value_reyal: paymentData[key]?.amount,
//         value_gram: paymentData[key]?.weight,
//         card_name: paymentData[key]?.card,
//         stock_difference: paymentData[key]?.stock_difference,
//       };
//       postPaymentAllData.push(keyAllValueObject);
//     });

//     if (paymentData.length === 0) {
//       notify("info", "fill fields first");
//       return;
//     }

//     mutatePaymentsData({
//       endpointName: "/sadadSupplier/api/v1/create",
//       values: {
//         bond: {
//           branch_id: userData?.branch_id,
//           invoice_number: invoiceDataNumber.length + 1,
//           bond_date: new Date()?.toISOString().slice(0, 10),
//           employee_id: userData?.id,
//           supplier_id: supplierId,
//         },
//         items: postPaymentAllData,
//         boxes: boxesFinal,
//       },
//       method: "post",
//     });

//     console.log({
//       bond: {
//         branch_id: userData?.branch_id,
//         invoice_number: invoiceDataNumber.length + 1,
//         bond_date: new Date()?.toISOString().slice(0, 10),
//         employee_id: userData?.id,
//         supplier_id: supplierId,
//       },
//       items: postPaymentAllData,
//       boxes: boxesFinal,
//     });
//   };

//   const paymentDataToManagement = [
//     {
//       name: t("Supplier current account (GRAM)"),
//       key: 1,
//       unit: t("gram"),
//       value: data && data[0]?.account_edara_gram,
//     },
//     {
//       name: t("Supplier current account (SAR)"),
//       key: 2,
//       unit: t("ر.س"),
//       value: data && data[0]?.account_edara_reyal,
//     },
//   ];

//   return (
//     <div className="relative p-10">
//       <h2 className="mb-8 text-base font-bold">{t("supplier payment")}</h2>
//       <div className="bg-lightGreen h-[100%] rounded-lg sales-shadow px-6 py-5">
//         <div className="bg-flatWhite rounded-lg bill-shadow  py-5 px-6 h-41 my-5">
//           <h2 className="mb-8 text-base font-bold">
//             {t("Payment data from the supplier to management")}
//           </h2>
//           <Formik
//             initialValues={{ supplier_id: null }}
//             onSubmit={(values) => {
//               setBoxValues(values);
//             }}
//           >
//             <Form className="mb-8 w-1/3">
//               <Select
//                 id="supplier_id"
//                 label={`${t("supplier name")}`}
//                 name="supplier_id"
//                 placeholder={`${t("supplier name")}`}
//                 loadingPlaceholder={`${t("loading")}`}
//                 options={suppliers}
//                 fieldKey="id"
//                 loading={suppliersLoading}
//                 isDisabled={!suppliersLoading && !!suppliersErrorReason}
//                 onChange={(option: any) => {
//                   setSupplierId(option?.id);
//                 }}
//               />
//             </Form>
//           </Formik>

//           <ul className="flex justify-around py-1 w-full mb-2">
//             {paymentDataToManagement.map(({ name, key, unit, value }) => (
//               <li className="flex flex-col justify-end h-28 rounded-xl text-center font-bold text-white shadow-md bg-transparent w-4/12">
//                 <p className="bg-mainOrange  p-2 flex items-center justify-center h-[65%] rounded-t-xl text-white">
//                   {name}
//                 </p>
//                 <p className="bg-white px-2 py-2 text-black h-[35%] rounded-b-xl">
//                   {formatGram(Number(value))} {t(unit)}
//                 </p>
//               </li>
//             ))}
//           </ul>
//         </div>

//         <div className="bg-flatWhite rounded-lg bill-shadow py-5 px-6 h-41 my-5">
//           <h2 className="mb-4 text-base font-bold">
//             {t("Choose your payment method")}
//           </h2>
//           <div>
//             <SupplierPaymentProccessing
//               paymentData={paymentData}
//               setPaymentData={setPaymentData}
//               sellingItemsData={sellingItemsData}
//               selectedCardId={selectedCardId}
//               setSelectedCardId={setSelectedCardId}
//               setCardId={setCardId}
//               cardId={cardId}
//               setSelectedCardName={setSelectedCardName}
//               selectedCardName={selectedCardName}
//               supplierId={supplierId}
//               boxValues={boxValues}
//             />
//           </div>
//         </div>

//         <div className="bg-flatWhite rounded-lg bill-shadow  py-5 px-6 h-41 my-5">
//           <h2 className="mb-8 text-base font-bold">{t("Total payment")}</h2>
//           <div className="border-mainGray">
//             <PaymentBoxes
//               paymentData={paymentData}
//               sellingItemsData={sellingItemsData}
//               selectedCardId={selectedCardId}
//             />
//           </div>
//         </div>
//       </div>
//       <div className="flex gap-3 justify-end mt-14">
//         <Button
//           type="submit"
//           action={() => {
//             setStage(1);
//           }}
//           bordered
//         >
//           {t("back")}
//         </Button>
//         <Button action={handleSeccessedData} loading={isLoading}>
//           {t("save")}
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default SupplierPayment;

import { t } from "i18next";
import { notify } from "../../utils/toast";
import PaymentBoxes from "../../components/selling/selling components/data/paymentBoxs";
import PaymentProcessing, {
  Payment_TP,
} from "../../components/selling/selling components/data/PaymentProcessing";
import { Button } from "../../components/atoms";
import { useContext, useEffect, useState } from "react";
import { authCtx } from "../../context/auth-and-perm/auth";
import { useFetch, useMutate } from "../../hooks";
import { mutateData } from "../../utils/mutateData";
import { numberContext } from "../../context/settings/number-formatter";
import { useNavigate } from "react-router-dom";
import SupplierPaymentProccessing from "./SupplierPaymentProccessing";
import { Select } from "../../components/molecules";
import { KaratValues_TP, SelectOption_TP } from "../../types";
import { Supplier_TP } from "../../components/templates/systemEstablishment/supplier/supplier-types";
import { Form, Formik } from "formik";
import { ClientData_TP } from "../selling/PaymentSellingPage";

const SupplierPayment = () => {
  const [paymentData, setPaymentData] = useState<Payment_TP[]>([]);
  console.log("🚀 ~ SupplierPayment ~ paymentData:", paymentData);
  const [sellingItemsData, setSellingItemsData] = useState([]);
  const [stage, setStage] = useState<number>(1);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [selectedCardName, setSelectedCardName] = useState(null);
  const [cardId, setCardId] = useState("");
  const navigate = useNavigate();
  const { userData } = useContext(authCtx);
  const taxRate = userData?.tax_rate * 0.01 + 1;
  const { formatGram, formatReyal } = numberContext();
  const [supplierId, setSupplierId] = useState(0);
  const [boxValues, setBoxValues] = useState();

  const { data, refetch: supplierGetCount } = useFetch({
    endpoint: `/sadadSupplier/api/v1/get-count/${supplierId}`,
    queryKey: ["dataOfPaymentToSupplier"],
    onSuccess(data) {
      return data.data;
    },
  });

  const { data: invoiceDataNumber } = useFetch({
    endpoint: `/sdad/api/v1/sdadbonds/${userData?.branch_id}?per_page=10000`,
    queryKey: ["payment-sdadbonds"],
    onSuccess(data) {
      return data.data;
    },
  });

  const { data: goldPrice } = useFetch<ClientData_TP>({
    endpoint: `/buyingUsedGold/api/v1/get-gold-price`,
    queryKey: ["get-gold-price-sadad"],
  });

  const {
    data: suppliers,
    isLoading: suppliersLoading,
    failureReason: suppliersErrorReason,
    refetch: refetchSupplier,
  } = useFetch<SelectOption_TP[], Supplier_TP[]>({
    endpoint: "/supplier/api/v1/suppliers?per_page=10000",
    queryKey: ["suppliers"],
    onSuccess(data) {},
    select: (suppliers) =>
      suppliers.map((supplier) => {
        return {
          //@ts-ignore
          id: supplier.id,
          value: supplier.name,
          label: supplier.name,
          name: supplier.name,
        };
      }),
  });

  const { mutate: mutatePaymentsData, isLoading } = useMutate({
    mutationFn: mutateData,
    onSuccess: (data) => {
      notify("success");
      navigate(`/bonds/supplier-payment`);
    },
  });

  const {
    data: boxesResponse,
    isLoading: boxesLoading,
    refetch: boxesRefetch,
  } = useFetch<any>({
    endpoint: `/sadadSupplier/api/v1/boxes/${supplierId}`,
    queryKey: ["sadadSupplier_response"],
  });

  useEffect(() => {
    supplierGetCount();
    boxesRefetch();
  }, [supplierId]);

  const { data: karatValues } = useFetch<KaratValues_TP[]>({
    endpoint: "classification/api/v1/allkarats",
    queryKey: ["sadad_karat_bond_select"],
  });

  const paymentWeightItems = paymentData.filter((item) =>
    ["24", "22", "21", "18"].includes(item.card_id)
  );

  const getMyKarat = (value: string) => {
    const myKarat = karatValues!.find((item) => item.karat == value);
    return Number(myKarat?.value);
  };

  const karat_24_values = paymentData?.filter((item) => item.frontkey === "24");
  const karat_22_values = paymentData?.filter((item) => item.frontkey === "22");
  const karat_21_values = paymentData?.filter((item) => item.frontkey === "21");
  const karat_18_values = paymentData?.filter((item) => item.frontkey === "18");
  const sadad_supplier_cash = paymentData?.filter(
    (item) => item.frontkey === "cash"
  );
  const gold_discount_sadad = paymentData?.filter(
    (item) => item.frontkey === "discount"
  );
  const supplier_tax_sadad = paymentData?.filter(
    (item) => item.frontkey === "total_tax_sadad_supplier"
  );
  console.log("🚀 ~ SupplierPayment ~ supplier_tax_sadad:", supplier_tax_sadad);

  const card = paymentData.reduce((acc, curr) => {
    acc[curr.frontkey] = Number(curr.amount);
    return acc;
  }, {});

  const accountBanksData = {};
  for (const key in card) {
    if (Object.prototype.hasOwnProperty.call(card, key)) {
      const modifiedKey = key.replace(/_1$/, "");
      accountBanksData[modifiedKey] = {
        title: modifiedKey,
        value: card[key],
        unit: "reyal",
      };
    }
  }

  const boxes = {
    sadad_supplier_cash: {
      title: "sadad supplier cash",
      value: sadad_supplier_cash?.reduce((acc, curr) => {
        return +acc + Number(curr.amount);
      }, 0),
      unit: "reyal",
    },
    karat_24_aggregate: {
      title: "total 24 gold box",
      value: karat_24_values?.reduce((acc, curr) => {
        return +acc + Number(curr.weight);
      }, 0),
      unit: "gram",
    },
    karat_22_aggregate: {
      title: "total 22 gold box",
      value: karat_22_values?.reduce((acc, curr) => {
        return +acc + Number(curr.weight);
      }, 0),
      unit: "gram",
    },
    karat_21_aggregate: {
      title: "total 21 gold box",
      value: karat_21_values?.reduce((acc, curr) => {
        return +acc + Number(curr.weight);
      }, 0),
      unit: "gram",
    },
    karat_18_aggregate: {
      title: "total 18 gold box",
      value: karat_18_values?.reduce((acc, curr) => {
        return +acc + Number(curr.weight);
      }, 0),
      unit: "gram",
    },
    gold_purities_sadad: {
      title: "gold purities sadad main",
      value: paymentWeightItems.reduce((acc, curr) => {
        return (
          +acc +
          (Number(curr.weight) * Number(curr.stock_difference) -
            Number(curr.weight) * Number(curr.stock_difference_mian))
        );
      }, 0),
      unit: "gram",
    },
    total_tax_sadad_supplier: {
      title: "total tax",
      value: paymentData?.reduce((acc, curr) => {
        return +acc + Number(curr.supplier_vat_sadad);
      }, 0),
      unit: "reyal",
    },
    total_money: {
      title: "total money",
      value: paymentData?.reduce((acc, curr) => {
        return +acc + Number(curr.amount);
      }, 0),
      unit: "reyal",
    },
    total_weight: {
      title: "total weight",
      value: paymentData?.reduce((acc, curr) => {
        return +acc + Number(curr.weight);
      }, 0),
      unit: "gram",
    },
    gold_discount: {
      title: "gold discount",
      value: gold_discount_sadad?.reduce((acc, curr) => {
        return +acc + Number(curr.amount);
      }, 0),
      unit: "gram",
    },
    ...accountBanksData,
  };
  console.log("🚀 ~ SupplierPayment ~ boxes:", boxes);

  const mapBox = (item: any) => {
    switch (item.front_key) {
      case "sdad_supplier_money":
        return {
          ...item,
          value: boxes?.total_money.value,
        };
      case "sdad_supplier_gold":
        let total_payment_karat = 0;
        paymentWeightItems?.forEach((row) => {
          total_payment_karat =
            Number(total_payment_karat) +
            Number(row.weight) * Number(getMyKarat(row?.frontkey));
        });

        let karat_difference =
          Number(boxes?.total_weight.value) - Number(total_payment_karat);
        return {
          ...item,
          value:
            Number(boxes?.total_weight.value) -
            Number(karat_difference) +
            boxes?.gold_purities_sadad.value,
        };
      case "gold3yar_sadad_supplier":
        let total_24_gold_by_karat2 = 0;

        paymentWeightItems?.forEach((row) => {
          total_24_gold_by_karat2 =
            Number(total_24_gold_by_karat2) +
            Number(row.weight) * Number(getMyKarat(row?.frontkey));
        });
        let value =
          Number(boxes?.total_weight.value) - Number(total_24_gold_by_karat2);
        if (value < 0) {
          value = value * -1;
          const computational_movement =
            item.nature === "debtor" ? "creditor" : "debtor";
          return {
            ...item,
            value,
            computational_movement,
          };
        } else {
          return {
            ...item,
            value,
          };
        }
      case "sadad_supplier_cash":
        return {
          ...item,
          value: boxes?.sadad_supplier_cash.value,
        };
      case "gold_discount_sadad_supplier":
        return {
          ...item,
          value: boxes?.gold_discount.value,
        };
      case "goldpurities_sadad_supplier":
        let val = boxes?.gold_purities_sadad.value;
        if (val < 0) {
          val = val * -1;
          const computational_movement =
            item.nature === "debtor" ? "creditor" : "debtor";
          return {
            ...item,
            value: val,
            computational_movement,
          };
        } else {
          return {
            ...item,
            value: val,
          };
        }
      // بنوك
      case "total_tax_sadad_supplier":
        return {
          ...item,
          value: boxes?.total_tax_sadad_supplier.value,
        };
      case "gold_box_fractional_18_sadad_suppliers":
        return {
          ...item,
          value: boxes?.karat_18_aggregate.value,
        };
      case "gold_box_fractional_21_sadad_suppliers":
        return {
          ...item,
          value: boxes?.karat_21_aggregate.value,
        };
      case "gold_box_fractional_22_sadad_suppliers":
        return {
          ...item,
          value: boxes?.karat_22_aggregate.value,
        };
      case "gold_box_fractional_24_sadad_suppliers":
        return {
          ...item,
          value: boxes?.karat_24_aggregate.value,
        };
      default:
        const frontKeyExists = accountBanksData.hasOwnProperty(item.front_key);
        if (frontKeyExists) {
          return {
            ...item,
            value: boxes[item.front_key]?.value,
          };
        }
        return item;
    }
  };

  const boxesFinal = boxesResponse?.map(mapBox);

  const handleSeccessedData = () => {
    const postPaymentData: any = [];
    const postPaymentAllData: any = [];

    Object.keys(paymentData).forEach((key) => {
      const keyValueObject = {
        id: paymentData[key]?.id,
        front_key:
          paymentData[key]?.frontKeyAccept || paymentData[key]?.frontKeySadad,
        value: paymentData[key]?.amount || paymentData[key]?.weight,
      };
      postPaymentData.push(keyValueObject);

      const keyAllValueObject = {
        card_id: paymentData[key]?.id,
        front_key:
          paymentData[key]?.frontKeyAccept || paymentData[key]?.frontKeySadad,
        value_reyal: paymentData[key]?.amount,
        value_gram: paymentData[key]?.weight,
        card_name: paymentData[key]?.card,
        stock_difference: paymentData[key]?.stock_difference,
      };
      postPaymentAllData.push(keyAllValueObject);
    });

    if (paymentData.length === 0) {
      notify("info", "fill fields first");
      return;
    }

    mutatePaymentsData({
      endpointName: "/sadadSupplier/api/v1/create",
      values: {
        bond: {
          branch_id: userData?.branch_id,
          invoice_number: invoiceDataNumber.length + 1,
          bond_date: new Date()?.toISOString().slice(0, 10),
          employee_id: userData?.id,
          supplier_id: supplierId,
        },
        items: postPaymentAllData,
        boxes: boxesFinal,
      },
      method: "post",
    });

    console.log({
      bond: {
        branch_id: userData?.branch_id,
        invoice_number: invoiceDataNumber.length + 1,
        bond_date: new Date()?.toISOString().slice(0, 10),
        employee_id: userData?.id,
        supplier_id: supplierId,
      },
      items: postPaymentAllData,
      boxes: boxesFinal,
    });
  };

  const paymentDataToManagement = [
    {
      name: t("Supplier current account (GRAM)"),
      key: 1,
      unit: t("gram"),
      value: data ? data[0]?.account_edara_gram : 0,
    },
    {
      name: t("Supplier current account (SAR)"),
      key: 2,
      unit: t("ر.س"),
      value: data ? data[0]?.account_edara_reyal : 0,
    },
  ];

  return (
    <div className="relative p-4">
      <h2 className="mb-8 text-base font-bold">{t("supplier payment")}</h2>
      <div className="bg-lightGreen h-[100%] rounded-lg sales-shadow px-6 py-5">
        <div className="bg-flatWhite rounded-lg bill-shadow  py-5 px-6 h-41 my-5">
          <h2 className="mb-8 text-base font-bold">
            {t("Payment data from the supplier to management")}
          </h2>
          <Formik
            initialValues={{ supplier_id: null }}
            onSubmit={(values) => {
              setBoxValues(values);
            }}
          >
            <Form className="mb-8 w-1/3">
              <Select
                id="supplier_id"
                label={`${t("supplier name")}`}
                name="supplier_id"
                placeholder={`${t("supplier name")}`}
                loadingPlaceholder={`${t("loading")}`}
                options={suppliers}
                fieldKey="id"
                loading={suppliersLoading}
                isDisabled={!suppliersLoading && !!suppliersErrorReason}
                onChange={(option: any) => {
                  setSupplierId(option?.id);
                }}
              />
            </Form>
          </Formik>

          <ul className="flex justify-around py-1 w-full mb-2">
            {paymentDataToManagement.map(({ name, key, unit, value }) => (
              <li key={key} className="flex flex-col justify-end h-28 rounded-xl text-center font-bold text-white shadow-md bg-transparent w-4/12">
                <p className="bg-mainOrange  p-2 flex items-center justify-center h-[65%] rounded-t-xl text-white">
                  {name}
                </p>
                <p className="bg-white px-2 py-2 text-black h-[35%] rounded-b-xl">
                  {formatGram(Number(value))} {t(unit)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-flatWhite rounded-lg bill-shadow py-5 px-6 h-41 my-5">
          <h2 className="mb-4 text-base font-bold">
            {t("Choose your payment method")}
          </h2>
          <div>
            <SupplierPaymentProccessing
              paymentData={paymentData}
              setPaymentData={setPaymentData}
              sellingItemsData={sellingItemsData}
              selectedCardId={selectedCardId}
              setSelectedCardId={setSelectedCardId}
              setCardId={setCardId}
              cardId={cardId}
              setSelectedCardName={setSelectedCardName}
              selectedCardName={selectedCardName}
              supplierId={supplierId}
              boxValues={boxValues}
            />
          </div>
        </div>

        <div className="bg-flatWhite rounded-lg bill-shadow  py-5 px-6 h-41 my-5">
          <h2 className="mb-8 text-base font-bold">{t("Total payment")}</h2>
          <div className="border-mainGray">
            <PaymentBoxes
              paymentData={paymentData}
              sellingItemsData={sellingItemsData}
              selectedCardId={selectedCardId}
            />
          </div>
        </div>
      </div>
      <div className="flex gap-3 justify-end mt-14">
        <Button
          type="submit"
          action={() => {
            setStage(1);
          }}
          bordered
        >
          {t("back")}
        </Button>
        <Button action={handleSeccessedData} loading={isLoading}>
          {t("save")}
        </Button>
      </div>
    </div>
  );
};

export default SupplierPayment;
