import React, { Fragment, useContext, useState } from "react";
import { t } from "i18next";
import { SellingBoxData } from "./SellingBoxData";
import { numberContext } from "../../../../context/settings/number-formatter";

const SellingBoxes = ({ sellingItemsData }: any) => {
  const { formatGram, formatReyal } = numberContext();

  const locationPath = location.pathname;

  const invoiceValueOfSelling = sellingItemsData.reduce(
    (total, item) => +total + +item.taklfa,
    0
  );
  const invoiceValueOfSalesReturn = sellingItemsData.reduce(
    (total, item) => +total + +item.cost,
    0
  );

  const invoiceTotalOfSelling = sellingItemsData.reduce(
    (total, item) => +total + +item.taklfa_after_tax,
    0
  );
  const invoiceTotalOfOfSalesReturn = sellingItemsData.reduce(
    (total, item) => +total + +item.total,
    0
  );

  const invoiceTotalVat = sellingItemsData.reduce(
    (total, item) => +total + +item.vat,
    0
  );

  const supplyPayOffTaklfa = sellingItemsData.reduce(
    (total, item) =>
      +total + (Number(item.cost) + Number(item.wage) * Number(item.weight)),
    0
  );
  console.log("🚀 ~ SellingBoxes ~ supplyPayOffTaklfa:", supplyPayOffTaklfa);

  const supplyPayOffTotalTaklfa = supplyPayOffTaklfa + invoiceTotalVat;

  const weightTotal = sellingItemsData.reduce(
    (total, item) => total + +item.weight,
    0
  );

  const sellingORSalesReturnOfCost =
    locationPath === "/selling/payoff/sales-return"
      ? Number(invoiceValueOfSalesReturn)
      : locationPath === "/supply-return"
      ? Number(supplyPayOffTaklfa)
      : Number(invoiceValueOfSelling);

  const sellingORSalesReturnOfTotal =
    locationPath === "/selling/payoff/sales-return"
      ? Number(invoiceTotalOfOfSalesReturn)
      : locationPath === "/supply-return"
      ? Number(supplyPayOffTotalTaklfa)
      : Number(invoiceTotalOfSelling);

  const supplyPayOffVat =
    locationPath === "/supply-return"
      ? Number(invoiceTotalVat)
      : Number(sellingORSalesReturnOfTotal - sellingORSalesReturnOfCost);

  const boxsData = [
    {
      id: 1,
      account: `${t("bill value")}`,
      value: formatReyal(sellingORSalesReturnOfCost) || 0,
      unit: "ر.س",
    },
    {
      id: 2,
      account: `${t("VAT")}`,
      value: formatReyal(Number(supplyPayOffVat)) || 0,
      unit: "ر.س",
    },
    {
      id: 3,
      account: `${t("total value")}`,
      value: formatReyal(sellingORSalesReturnOfTotal) || 0,
      unit: "ر.س",
    },
    {
      id: 4,
      account: `${t("number")}`,
      value: sellingItemsData.length || 0,
      unit: `${t("piece")}`,
    },
    {
      id: 5,
      account: `${t("gross weight")}`,
      value: formatGram(weightTotal) || 0,
      unit: `${t("gram")}`,
    },
    {
      id: 6,
      account: `${t("net")}`,
      value: 0,
      unit: `${t("gram")}`,
    },
  ];

  return (
    <div>
      <ul className="grid lg:grid-cols-6 grid-cols-3 gap-5 ">
        {boxsData?.map((data: any, index: any) => (
          <Fragment key={index}>
            <SellingBoxData data={data} />
          </Fragment>
        ))}
      </ul>
    </div>
  );
};

export default SellingBoxes;
