import { useEffect, useMemo, useState } from "react";
import { useFetch, useIsRTL } from "../../hooks";
import { numberContext } from "../../context/settings/number-formatter";
import { t } from "i18next";
import { Loading } from "../../components/organisms/Loading";
import { Back } from "../../utils/utils-components/Back";
import { Table } from "../../components/templates/reusableComponants/tantable/Table";
import { Button } from "../../components/atoms";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const EdaraStocks = () => {
  // STATE
  const isRTL = useIsRTL();
  const [dataSource, setDataSource] = useState([]);
  const [page, setPage] = useState(1);
  const { formatGram, formatReyal } = numberContext();

  // FETCHING CREDITS DATA FROM API
  const {
    data: edaraCredit,
    isLoading,
    isFetching,
    isRefetching,
    refetch,
  } = useFetch({
    queryKey: ["credits-edara-data", page],
    endpoint: `/branchAccount/api/v1/getAllAccountEdara?page=${page}`,
    select: (data: object[]) => {
      return {
        ...data,
        data: data?.data?.map((credit: any, i: number) => ({
          ...credit,
          index: i + 1,
        })),
      };
    },
    pagination: true,
  });

  // COLUMNS FOR THE TABLE
  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "index",
        header: () => <span>{t("#")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "numeric_system",
        header: () => <span>{t("numeric system")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "accountable",
        header: () => <span>{t("account name")}</span>,
      },
      {
        cell: (info: any) => {
          return info.row.original.unit_id === 1
            ? formatReyal(Number(info.getValue()).toFixed(2))
            : formatGram(Number(info.getValue()).toFixed(2));
        },
        accessorKey: "debtor",
        header: () => <span>{t("debtor")}</span>,
      },
      {
        cell: (info: any) => {
          return info.row.original.unit_id === 1
            ? formatReyal(Number(info.getValue()).toFixed(2))
            : formatGram(Number(info.getValue()).toFixed(2));
        },
        accessorKey: "creditor",
        header: () => <span>{t("creditor")}</span>,
      },
      {
        cell: (info: any) => {
          const balance =
            Number(info?.row?.original?.debtor) -
            Number(info?.row?.original?.creditor);

          return balance > 0 ? formatReyal(balance.toFixed(2)) : "---";
        },
        accessorKey: "debtor_balance",
        header: () => <span>{t("debtor balance")}</span>,
      },
      {
        cell: (info: any) => {
          const balance =
            Number(info?.row?.original?.debtor) -
            Number(info?.row?.original?.creditor);

          return balance > 0
            ? "---"
            : formatReyal(Math.abs(balance.toFixed(2)));
        },
        accessorKey: "creditor_balance",
        header: () => <span>{t("creditor balance")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "unit",
        header: () => <span>{t("unit id")}</span>,
      },
    ],
    []
  );

  // EFFECTS
  useEffect(() => {
    if (edaraCredit) {
      setDataSource(edaraCredit?.data);
    }
  }, [edaraCredit]);

  // LOADING ....
  if (isLoading || isRefetching || isFetching)
    return <Loading mainTitle={`${t("loading credits")}`} />;

  return (
    <div className="">
      <div className="flex justify-between items-center mb-8">
        <h2 className=" text-base font-bold">{t("edara credits")}</h2>
      </div>

      <div className="">
        <Table data={dataSource || []} columns={tableColumn}>
          {dataSource?.length === 0 ? (
            <p className="text-center text-xl text-mainGreen font-bold">
              {t("there is no pieces available")}
            </p>
          ) : (
            <div className="mt-3 flex items-center justify-center gap-5 p-2">
              <div className="flex items-center gap-2 font-bold">
                {t("page")}
                <span className=" text-mainGreen">
                  {edaraCredit?.current_page}
                </span>
                {t("from")}
                {<span className=" text-mainGreen">{edaraCredit?.pages}</span>}
              </div>
              <div className="flex items-center gap-2 ">
                <Button
                  className=" rounded bg-mainGreen p-[.18rem]"
                  action={() => setPage((prev) => prev - 1)}
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
                  action={() => setPage((prev) => prev + 1)}
                  disabled={page == edaraCredit?.pages}
                >
                  {isRTL ? (
                    <MdKeyboardArrowLeft className="h-4 w-4 fill-white" />
                  ) : (
                    <MdKeyboardArrowRight className="h-4 w-4 fill-white" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </Table>
      </div>
    </div>
  );
};

export default EdaraStocks;
