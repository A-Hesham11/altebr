import { Button } from "../../../components/atoms";
import { AiOutlinePlus } from "react-icons/ai";
import { t } from "i18next";
import TarqeemTotals from "./TarqeemTotals";
import SearchFilter from "./SearchFilter";
import TableOfIdentities from "./TableOfIdentities";
import OperationType from "./OperationType";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loading } from "../../../components/organisms/Loading";
import { useFetch } from "../../../hooks";
import { Back } from "../../../utils/utils-components/Back";

type CodedIdentitiesProps_TP = {
  title: string;
};

const CodedIdentities = ({ title }: CodedIdentitiesProps_TP) => {
  const navigate = useNavigate();
  const [activeClass, setActiveClass] = useState("هويات في الإدارة");
  const [dataSource, setDataSource] = useState([]);
  const [page, setPage] = useState(1);
  const [operationTypeSelect, setOperationTypeSelect] = useState([]);
  const [fetchKey, setFetchKey] = useState(["edara-hwya"]);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [search, setSearch] = useState("");
  const [isSuccessPost, setIsSuccessPost] = useState(false);
  const [fetchEndPoint, setFetchEndPoint] = useState(
    `identity/api/v1/pieces_in_edara?`
  );

  const shouldCheck = operationTypeSelect.length === 0;

  useEffect(() => {
    if (shouldCheck) {
      setCheckboxChecked(true);
    } else {
      setCheckboxChecked(false);
    }
  }, [shouldCheck]);

  // FETCHING DATA FROM API
  const { data, isLoading, isFetching, isRefetching, refetch } = useFetch({
    queryKey: fetchKey,
    endpoint:
      search === `${fetchEndPoint}?page=${page}` || search === ""
        ? `${fetchEndPoint}?page=${page}`
        : `${search}`,
    pagination: true,
  });

  // HANDLE MANAGEMENT EDARA
  const handleManagement = () => {
    setFetchKey(["edara-hwya"]);
    setFetchEndPoint(`identity/api/v1/pieces_in_edara?`);
  };

  // HANDLE BRANCH
  const handleBranch = () => {
    setFetchKey(["branch-hwya"]);
    setFetchEndPoint(`identity/api/v1/pieces_in_branch?`);
  };

  // HANDLE WAY TO BRANCH
  const handleWayToBranch = () => {
    setFetchKey(["way-to-branch-hwya"]);
    setFetchEndPoint(`identity/api/v1/way_to_branch?`);
  };

  // HANDLE WAY TO EDARA
  const handleWayToEdara = () => {
    setFetchKey(["way-to-edara-hwya"]);
    setFetchEndPoint(`identity/api/v1/way_to_edara?`);
  };

  // HANDLE PIECE BY WEIGHT
  const handlePieceByWeight = () => {
    setFetchKey(["piece_by_weight"]);
    setFetchEndPoint(`identity/api/v1/ItemWeight?`);
  };

  // SEARCH FUNCTIONALITY
  const getSearchResults = async (req: any) => {
    let url = `${fetchEndPoint}`;
    let first = false;
    Object.keys(req).forEach((key) => {
      if (req[key] !== "") {
        if (first) {
          url += `?${key}[eq]=${req[key]}`;
          first = false;
        } else {
          url += `&${key}[eq]=${req[key]}`;
        }
      }
    });
    setSearch(url);
  };

  // EFFECTS
  useEffect(() => {
    if (data) {
      setDataSource(data);
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [page, isSuccessPost, search]);

  useEffect(() => {
    setPage(1);
  }, [fetchKey]);

  // LOADING ....
  if (isLoading || isRefetching || isFetching)
    return <Loading mainTitle={`${t("loading items")}`} />;

  // HANDLE ACTIVE BUTTON
  const handleActiveButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    const clickedButton = event.target as HTMLButtonElement;
    const buttonName = clickedButton.innerText;

    if (buttonName === "هويات في الإدارة") setActiveClass("هويات في الإدارة");
    if (buttonName === "هويات في الفرع") setActiveClass("هويات في الفرع");
    if (buttonName === "هويات جاري تسليمها في الفرع")
      setActiveClass("هويات جاري تسليمها في الفرع");
    if (buttonName === "هويات جاري تسليمها في الإدارة")
      setActiveClass("هويات جاري تسليمها في الإدارة");
    if (buttonName === "قطع بالوزن") setActiveClass("قطع بالوزن");
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <h2 className="text-xl font-bold text-slate-700">{title}</h2>
        <div className="flex flex-wrap gap-6 items-center">
          <Button
            action={() => navigate("/coding/gold")}
            className="border-2 border-mainOrange bg-transparent text-mainOrange flex items-center gap-2"
          >
            <AiOutlinePlus className="text-xl" />
            <span>{t("gold coded")}</span>
          </Button>
          <Button
            action={() => navigate("/coding/diamond")}
            className="border-2 border-mainOrange bg-transparent text-mainOrange flex items-center gap-2"
          >
            <AiOutlinePlus className="text-xl" />
            <span>{t("diamond coded")}</span>
          </Button>
          <Button
            action={() => navigate("/coding/accessories")}
            className="border-2 border-mainOrange bg-transparent text-mainOrange  flex items-center gap-2"
          >
            <AiOutlinePlus className="text-xl" />
            <span>{t("miscellaneous coded")}</span>
          </Button>
        </div>
      </div>

      {/* TARQIM TOTALS */}
      <TarqeemTotals />

      {/* STATUS OF IDENTITIES */}
      <div className="flex flex-col justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-700 flex-shrink-0">
          {t("status of identities")}
        </h2>
        <div className="flex flex-wrap items-center gap-6 self-center">
          <Button
            action={(e) => {
              handleManagement();
              handleActiveButton(e);
            }}
            className={`${
              activeClass === "هويات في الإدارة"
                ? "bg-mainOrange text-white"
                : "bg-transparent text-mainOrange"
            } border-2 text-sm border-mainOrange flex items-center gap-2`}
          >
            {t("management identities")}
          </Button>
          <Button
            action={(e) => {
              handlePieceByWeight();
              handleActiveButton(e);
            }}
            className={`${
              activeClass === "قطع بالوزن"
                ? "bg-mainOrange text-white"
                : "bg-transparent text-mainOrange"
            } border-2 text-sm border-mainOrange flex items-center gap-2`}
          >
            {t("pieces by weight")}
          </Button>
          <Button
            action={(e) => {
              handleBranch();
              handleActiveButton(e);
            }}
            className={`${
              activeClass === "هويات في الفرع"
                ? "bg-mainOrange text-white"
                : "bg-transparent text-mainOrange"
            } border-2 text-sm border-mainOrange flex items-center gap-2`}
          >
            {t("branch identities")}
          </Button>
          <Button
            action={(e) => {
              handleWayToBranch();
              handleActiveButton(e);
            }}
            className={`${
              activeClass === "هويات جاري تسليمها في الفرع"
                ? "bg-mainOrange text-white"
                : "bg-transparent text-mainOrange"
            } border-2 text-sm border-mainOrange flex items-center gap-2`}
          >
            {t("identities are being delivered to the branch")}
          </Button>
          <Button
            action={(e) => {
              handleWayToEdara();
              handleActiveButton(e);
            }}
            className={`${
              activeClass === "هويات جاري تسليمها في الإدارة"
                ? "bg-mainOrange text-white"
                : "bg-transparent text-mainOrange"
            } border-2 text-sm border-mainOrange flex items-center gap-2`}
          >
            {t("identities are being submitted to the administration")}
          </Button>
        </div>
      </div>

      {/* SEARCH FILTER */}
      <SearchFilter getSearchResults={getSearchResults} />

      {/* TABLE OF IDENTITIES */}
      <div className="flex flex-col gap-4 mt-8">
        <Button
          action={() => {
            // setCheckboxChecked(false)
            setOperationTypeSelect([]);
          }}
          className="bg-mainGreen text-white self-end"
        >
          تفريغ الجدول
        </Button>
        <TableOfIdentities
          dataSource={dataSource}
          setPage={setPage}
          page={page}
          fetchKey={fetchKey}
          setOperationTypeSelect={setOperationTypeSelect}
          checkboxChecked={checkboxChecked}
          setCheckboxChecked={setCheckboxChecked}
        />
      </div>

      {/* OPERATION TYPE */}
      {(activeClass === "قطع بالوزن" || activeClass === "هويات في الإدارة") && (
        <OperationType
          setIsSuccessPost={setIsSuccessPost}
          operationTypeSelect={operationTypeSelect}
        />
      )}

      {/* BUTTON TO BACK */}
      <Back className="w-32 self-end mt-6" />
    </div>
  );
};

export default CodedIdentities;
