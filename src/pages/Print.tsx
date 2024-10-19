import { useEffect, useMemo, useState } from "react";
import PrintPage from "../components/atoms/print/PrintPage";
import "../components/atoms/print/print.css";
import { Table } from "../components/templates/reusableComponants/tantable/Table";
import { t } from "i18next";
import { Button } from "../components/atoms";
import { useFetch } from "../hooks";
import { Loading } from "../components/organisms/Loading";
import { FiPrinter } from "react-icons/fi";

const Print = () => {
  // const tarqimGold = JSON.parse(localStorage.getItem("tarqimGold"));
  const [printItems, setPrintItems] = useState();
  console.log("🚀 ~ Print ~ printItems:", printItems);
  const [singlePrint, setSinglePrint] = useState(null);
  const [multiPrint, setMultiPrint] = useState(null);
  console.log("🚀 ~ Print ~ multiPrint:", multiPrint)
  console.log("🚀 ~ Print ~ singlePrint:", singlePrint);
  const [currentIndex, setCurrentIndex] = useState(0);
  console.log("🚀 ~ Print ~ currentIndex:", currentIndex)
  const [isPrinting, setIsPrinting] = useState(false);
  console.log("🚀 ~ Print ~ isPrinting:", isPrinting);

  const { data, isLoading, isFetching, isRefetching, refetch } = useFetch({
    queryKey: ["print-items"],
    endpoint: `/identity/api/v1/print-items`,
    onSuccess(data) {
      setPrintItems(data?.data);
    },
    pagination: true,
  });
  console.log("🚀 ~ Print ~ printItems:", printItems);

  const handlePrint = () => {
    setCurrentIndex(0);
    // setMultiPrint()
    // window.print();
    setIsPrinting(true);
  };

  useEffect(() => {
    let intervalId;

    if (isPrinting) {
      intervalId = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          if (prevIndex !== null && prevIndex < printItems?.length - 1) {
            return prevIndex + 1;
          } else {
            clearInterval(intervalId);
            setIsPrinting(false);
            return prevIndex;
          }
        });
        setMultiPrint(printItems?.[currentIndex])
        // window.print();
      }, 5000);
    }

    return () => clearInterval(intervalId);
  }, [isPrinting, printItems?.length, currentIndex]);

  // console.log("🚀 ~ Print ~ tarqimGold:", printItems?.[currentIndex]);

  // const handleSinglePrint = () => {

  // }

  const tarqimGoldColumns = useMemo<any>(
    () => [
      {
        header: () => <span>{t("identification")}</span>,
        accessorKey: "hwya",
        cell: (info: any) => info.getValue(),
      },
      {
        header: () => <span>{t("classification")}</span>,
        accessorKey: "classification_name",
        cell: (info: any) => info.getValue(),
      },
      {
        header: () => <span>{t("karat")}</span>,
        accessorKey: "karat_name",
        cell: (info: any) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("weight")}</span>,
        accessorKey: "weight",
        cell: (info: any) => info.getValue(),
      },
      {
        header: () => <span>{t("print")}</span>,
        accessorKey: "print",
        cell: (info: any) => {
          // console.log("🚀 ~ Print ~ info.row.original:", info.row.original)
          return (
            <FiPrinter
              size={25}
              className="text-mainGreen m-auto cursor-pointer"
              onClick={() => {
                setSinglePrint(info.row.original);
              }}
            />
          );
        },
      },
    ],
    []
  );

  const printData = singlePrint ? singlePrint : printItems?.[currentIndex];

  // useEffect(() => {
  //   window.print();
  // }, [singlePrint && singlePrint?.hwya]);

  if (isFetching || isRefetching || isLoading)
    return <Loading mainTitle="loading" />;

  return (
    <div>
      <Button action={handlePrint} className="print-btn">
        Print
      </Button>
      <div className="print-table">
        <Table data={printItems} columns={tarqimGoldColumns} />
      </div>

      {!!singlePrint && (
        <div className="print-page" style={{ direction: "ltr" }}>
          <PrintPage item={singlePrint} />
        </div>
      )}
    </div>
  );
};

export default Print;
