import { useEffect, useMemo, useState } from "react";
import PrintPage from "../components/atoms/print/PrintPage";
import "../components/atoms/print/print.css";
import { Table } from "../components/templates/reusableComponants/tantable/Table";
import { t } from "i18next";
import { Button } from "../components/atoms";

const Print = () => {
  const tarqimGold = JSON.parse(localStorage.getItem("tarqimGold"));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPrinting, setIsPrinting] = useState(false);
  console.log("🚀 ~ Print ~ isPrinting:", isPrinting);

  const handlePrint = () => {
    setCurrentIndex(0);
    window.print();
    setIsPrinting(true);
  };

  useEffect(() => {
    let intervalId;

    if (isPrinting) {
      intervalId = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          console.log("🚀 ~ setCurrentIndex ~ prevIndex:", prevIndex);
          if (prevIndex !== null && prevIndex < tarqimGold.length - 1) {
            return prevIndex + 1;
          } else {
            clearInterval(intervalId);
            setIsPrinting(false);
            return prevIndex;
          }
        });
        window.print();
      }, 5000);
    }

    return () => clearInterval(intervalId);
  }, [isPrinting, tarqimGold.length]);

  console.log("🚀 ~ Print ~ tarqimGold:", tarqimGold[currentIndex]);

  const tarqimGoldColumns = useMemo<any>(
    () => [
      {
        header: () => <span>{t("hwya")}</span>,
        accessorKey: "hwya",
        cell: (info: any) => info.getValue(),
      },
      {
        header: () => <span>{t("weight")}</span>,
        accessorKey: "weight",
        cell: (info: any) => info.getValue(),
      },
      {
        header: () => <span>{t("karat")}</span>,
        accessorKey: "karat",
        cell: (info: any) => info.getValue() || "---",
      },
    ],
    []
  );

  return (
    <div style={{ direction: "ltr" }}>
      <Button action={handlePrint} className="print-btn">
        Print
      </Button>
      <div className="print-table">
        <Table data={tarqimGold} columns={tarqimGoldColumns} />
      </div>

      <div className="print-page">
        <PrintPage item={tarqimGold[currentIndex]} />
      </div>
    </div>
  );
};

export default Print;
