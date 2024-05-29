import { t } from "i18next";
import React, { useEffect, useMemo, useState } from "react";
import { numberContext } from "../../../context/settings/number-formatter";
import { BsEye } from "react-icons/bs";
import { useFetch, useIsRTL } from "../../../hooks";
import { Loading } from "../../../components/organisms/Loading";
import { Form, Formik } from "formik";
import { formatDate, getDayAfter } from "../../../utils/date";
import { Button } from "../../../components/atoms";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { Modal } from "../../../components/molecules";
import TableEntry from "../../../components/templates/reusableComponants/tantable/TableEntry";
import { Back } from "../../../utils/utils-components/Back";
import ImportTotalsBondsEntry from "./ImportTotalsBondsEntry";

const ImportTotalsBonds = () => {
  const { formatReyal, formatGram } = numberContext();
  const [importTotalsBondsModal, setImportTotalsBondsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const isRTL = useIsRTL();

  const initialValues = {
    test: "",
  };

  const {
    data: importBonds,
    isFetching: importBondsIsFetching,
    isRefetching: importBondsIsRefetching,
    isLoading: importBondsIsLoading,
    refetch,
  } = useFetch({
    queryKey: ["pieces-data"],
    endpoint:
      search === `/tarqimGold/api/v1/getRestriction?` || search === ""
        ? `/tarqimGold/api/v1/getRestriction?page=${page}`
        : `${search}`,
    pagination: true,
  });
  console.log("🚀 ~ importBonds:", importBonds);

  useEffect(() => {
    refetch();
  }, [page]);

  useEffect(() => {
    if (page == 1) {
      refetch();
    } else {
      setPage(1);
    }
  }, [search]);

  const tableColumn = useMemo<any>(
    () => [
      // {
      //   cell: (info: any) => info.getValue() || info.row.index + 1 || "---",
      //   accessorKey: "index",
      //   header: () => <span>{t("#")}</span>,
      // },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "date",
        header: () => <span>{t("date")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "total_24",
        header: () => <span>{t("total converted to 24")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "total_diamond",
        header: () => <span>{t("total diamond")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "total_motafreqat",
        header: () => <span>{t("total motafreqat")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "count",
        header: () => <span>{t("count")}</span>,
      },
      {
        cell: (info: any) => (
          <div className="flex items-center">
            <BsEye
              onClick={() => {
                setSelectedItem(info.row.original);
                setImportTotalsBondsModal(true);
              }}
              size={23}
              className="text-mainGreen mx-auto cursor-pointer"
            />
          </div>
        ),
        accessorKey: "details",
        header: () => <span>{t("details")}</span>,
      },
    ],
    []
  );

  const getSearchResults = async (req: any) => {
    let url = `/tarqimGold/api/v1/getRestriction?`;
    let first = false;
    Object.keys(req).forEach((key) => {
      if (req[key] !== "") {
        if (first) {
          url += `?${key}=${req[key]}`;
          first = false;
        } else {
          url += `&${key}=${req[key]}`;
        }
      }
    });
    setSearch(url);
  };

  // LOADING ....
  if (importBondsIsFetching || importBondsIsFetching || importBondsIsRefetching)
    return <Loading mainTitle={`${t("loading bonds")}`} />;

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        getSearchResults({
          ...values,
          file_date: values.file_date
            ? formatDate(getDayAfter(new Date(values.file_date)))
            : "",
        });
      }}
    >
      {(formik) => (
        <Form>
          <div>
            <div className="">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-bold text-slate-700">
                  {t("totals import bonds")}
                </h3>

                <Back />
              </div>
            </div>

            <Table data={importBonds?.data || []} columns={tableColumn}>
              <div className="mt-3 flex items-center justify-center gap-5 p-2">
                <div className="flex items-center gap-2 font-bold">
                  {t("page")}
                  <span className=" text-mainGreen">{page}</span>
                  {t("from")}
                  {
                    <span className=" text-mainGreen">
                      {importBonds?.pages}
                    </span>
                  }
                </div>
                <div className="flex items-center gap-2 ">
                  <Button
                    className=" rounded bg-mainGreen p-[.18rem]"
                    action={() => {
                      setPage((prev: any) => prev - 1);
                    }}
                    disabled={page == 1}
                  >
                    {isRTL ? (
                      <MdKeyboardArrowRight className="h-4 w-4 fill-white" />
                    ) : (
                      <MdKeyboardArrowLeft className="h-4 w-4 fill-white" />
                    )}
                  </Button>

                  <Button
                    className="rounded bg-mainGreen p-[.18rem]"
                    action={() => {
                      setPage((prev: any) => prev + 1);
                    }}
                    disabled={page == importBonds?.pages}
                  >
                    {isRTL ? (
                      <MdKeyboardArrowLeft className="h-4 w-4 fill-white" />
                    ) : (
                      <MdKeyboardArrowRight className="h-4 w-4 fill-white" />
                    )}
                  </Button>
                </div>
              </div>
            </Table>

            <Modal
              isOpen={importTotalsBondsModal}
              onClose={() => setImportTotalsBondsModal(false)}
            >
              <ImportTotalsBondsEntry item={selectedItem} />
            </Modal>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ImportTotalsBonds;
