import { useEffect, useMemo, useRef, useState } from "react";
import "../../../components/atoms/print/print.css";
import { t } from "i18next";
import { FiPrinter } from "react-icons/fi";
import { useFetch } from "../../../hooks";
import { Loading } from "../../../components/organisms/Loading";
import { Button } from "../../../components/atoms";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import PrintPage from "../../../components/atoms/print/PrintPage";
import { useReactToPrint } from "react-to-print";

const PrintingNumberIdentities = () => {
  const [printItems, setPrintItems] = useState();
  console.log("🚀 ~ PrintingNumberIdentities ~ printItems:", printItems);
  const [singlePrint, setSinglePrint] = useState(null);
  console.log("🚀 ~ PrintingNumberIdentities ~ singlePrint:", singlePrint);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPrinting, setIsPrinting] = useState(false);
  const [confirmedPrint, setConfirmedPrint] = useState("");
  const [open, setOpen] = useState(false);
  const contentRef = useRef();

  const { data, isLoading, isFetching, isRefetching, refetch } = useFetch({
    queryKey: ["print-items"],
    endpoint: `/identity/api/v1/print-items?per_page=10000`,
    onSuccess(data) {
      setPrintItems(data?.data);
    },
    pagination: true,
  });

  const {
    data: confirmPrint,
    isLoading: isLoadingConfirm,
    isFetching: isFetchingConfirm,
    isRefetching: isRefetchingConfirm,
    isSuccess: isSuccessConfirm,
    refetch: refetchConfirm,
  } = useFetch({
    queryKey: ["confirm-print"],
    endpoint: `/identity/api/v1/updata-print-item/${confirmedPrint}`,
    enabled: !!confirmedPrint,
  });

  // const handlePrintAllItems = () => {
  //   setCurrentIndex(0);
  //   setIsPrinting(true);
  // };

  // useEffect(() => {
  //   let intervalId;

  //   if (isPrinting) {
  //     setSinglePrint(printItems?.[currentIndex]);

  //     setTimeout(() => {
  //       handleReactPrint();
  //     }, 0);

  //     intervalId = setInterval(() => {
  //       setCurrentIndex((prevIndex) => {
  //         const newIndex = prevIndex + 1;
  //         if (newIndex < printItems?.length) {
  //           setSinglePrint(printItems?.[newIndex]);
  //           setTimeout(() => {
  //             handleReactPrint();
  //           }, 0);
  //           return newIndex;
  //         } else {
  //           clearInterval(intervalId);
  //           setIsPrinting(false);
  //           return prevIndex;
  //         }
  //       });
  //     }, 30000);
  //   }

  //   return () => clearInterval(intervalId);
  // }, [isPrinting, printItems, currentIndex]);

  // const handleReactPrint = useReactToPrint({
  //   content: () => contentRef.current,
  //   onAfterPrint: () => {
  //     setOpen(true);
  //   },
  // });

  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    onBeforePrint: () => console.log("before printing..."),
    onAfterPrint: () => console.log("after printing..."),
    removeAfterPrint: true,
    pageStyle: `
      @page {
        size: auto;
        margin: 20px !imporatnt;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
        .break-page {
          page-break-before: always;
        }
      }
    `,
  });

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
          return (
            <FiPrinter
              size={25}
              className="text-mainGreen m-auto cursor-pointer"
              onClick={() => {
                setSinglePrint(info.row.original);
                setTimeout(() => {
                  handleReactPrint();
                }, 0);
              }}
            />
          );
        },
      },
    ],
    []
  );

  useEffect(() => {
    if (isSuccessConfirm) {
      refetch();
      setOpen(false);
    }
  }, [isSuccessConfirm]);

  if (isFetching || isRefetching || isLoading)
    return <Loading mainTitle={t("printing numbered identities")} />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-semibold text-xl">
          {t("printing numbered identities")}
        </h2>
        <Button action={handlePrint} className="print-btn">
          {t("print all identities")}
        </Button>
      </div>

      <div className="print-table">
        <Table
          data={printItems || []}
          columns={tarqimGoldColumns}
          showNavigation
        />
      </div>

      {open && (
        <div
          className="relative z-10"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            aria-hidden="true"
          ></div>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-center justify-center">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <h3
                        className="text-lg font-semibold leading-6 text-gray-900 text-center"
                        id="modal-title"
                      >
                        {t("printing process")}
                      </h3>
                      <div className="mt-6 mb-2">
                        <p className="text-lg text-gray-500">
                          {t("Did the numbered identity print successfully?")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 pt-3 pb-5 sm:flex sm:flex-row-reverse sm:px-6 justify-center gap-5">
                  <Button type="button" action={() => setOpen(false)} bordered>
                    {t("No")}
                  </Button>
                  <Button
                    type="button"
                    action={() => setConfirmedPrint(singlePrint?.id)}
                    loading={
                      !!isLoadingConfirm ||
                      !!isFetchingConfirm ||
                      !!isRefetchingConfirm
                    }
                  >
                    {t("Yes")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

        <div
          className="print-page"
          ref={contentRef}
          style={{ direction: "ltr" }}
        >
          {printItems?.map((item) => (
            <div className="break-page">
              <PrintPage item={item} />
            </div>
          ))}
        </div>
    </div>
  );
};

export default PrintingNumberIdentities;
