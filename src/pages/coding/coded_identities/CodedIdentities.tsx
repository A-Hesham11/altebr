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
import { useFetch, useMutate } from "../../../hooks";
import { Back } from "../../../utils/utils-components/Back";
import { formatDate } from "../../../utils/date";
import { ExportToExcel } from "../../../components/ExportToFile";
import { Modal } from "../../../components/molecules";
import { FilesUpload } from "../../../components/molecules/files/FileUpload";
import { notify } from "../../../utils/toast";
import { mutateData } from "../../../utils/mutateData";
import { useQueryClient } from "@tanstack/react-query";
import ImportTotals from "./ImportTotals";
import * as fileSaver from "file-saver";

type CodedIdentitiesProps_TP = {
  title: string;
};

const CodedIdentities = ({ title }: CodedIdentitiesProps_TP) => {
  const navigate = useNavigate();
  const [activeClass, setActiveClass] = useState("هويات في الإدارة");
  const [dataSource, setDataSource] = useState([]);
  const [page, setPage] = useState(1);
  const [importPageResponse, setImportPageResponse] = useState(1);
  const [operationTypeSelect, setOperationTypeSelect] = useState([]);
  const [importModal, setImportModal] = useState<boolean>(false);
  const [importFiles, setImportFiles] = useState<any>([]);
  const [importData, setImportData] = useState(null);
  const queryClient = useQueryClient();
  const [fetchKey, setFetchKey] = useState(["edara-hwya"]);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [rejectedPieces, setRejectedPieces] = useState([]);
  const [piecesState, setPiecesState] = useState([]);
  const [search, setSearch] = useState("");
  const [isSuccessPost, setIsSuccessPost] = useState(false);
  const [fetchEndPoint, setFetchEndPoint] = useState(
    `identity/api/v1/pieces_in_edara`
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

  // FETCHING DATA FROM API TO EXPORT ALL THE DATA TO EXCEL
  const { data: dataExcel, refetch: dataExcelRefetch } = useFetch({
    queryKey: ["excel-data"],
    endpoint:
      search === `${fetchEndPoint}?page=${page}&per_page=10000` || search === ""
        ? `${fetchEndPoint}?page=${page}&per_page=10000`
        : `${search}`,
    pagination: true,
    select: (data: any) =>
      data?.data?.map((arr: any) => ({
        hwya: arr?.hwya,
        classification_id: arr?.classification_id,
        category_id: arr?.category_id,
        karat_id: arr?.karat_id,
        karatmineral_id: arr?.karatmineral_id,
        karat_name: arr?.karat_name,
        model_number: arr?.model_number,
        weight: arr?.weight,
        wage: arr?.wage,
        selling_price: arr?.selling_price,
        bond_id: arr?.bond_id,
        mineral_id: arr?.mineral_id,
        country_id: arr?.country_id,
        color_id: arr?.color_id,
        size_unit_id: arr?.size_unit_id,
        has_stones: arr?.has_stones,
        mezan_type: arr?.mezan_type,
        cost: arr?.cost,
        mezan_weight: arr?.mezan_weight,
        cost_item: arr?.cost_item,
        ahgar_count: arr?.ahgar_count,
        ahgar_weight: arr?.ahgar_weight,
      })),
  });

  const {
    mutate,
    isLoading: postIsLoading,
    isSuccess,
  } = useMutate({
    mutationFn: mutateData,
    mutationKey: ["files"],
    onSuccess: (data: any) => {
      setImportData(data);
      setPiecesState(data[1]);
      notify("success", t("imported has successfully"));
    },
    onError: (error: any) => {
      notify("error", error?.message);
    },
  });

  const { mutate: finalMutate } = useMutate({
    mutationFn: mutateData,
    mutationKey: ["final-files"],
    onSuccess: (data) => {
      notify("success", t("confirmed successfully"));
      queryClient.refetchQueries(fetchKey);
      navigate("/coding/total/import");
    },
    onError: (error: any) => {
      notify("error", error?.message);
    },
  });

  // HANDLE MANAGEMENT EDARA
  const handleManagement = () => {
    setFetchKey(["edara-hwya"]);
    setFetchEndPoint(`identity/api/v1/pieces_in_edara`);
  };

  // HANDLE BRANCH
  const handleBranch = () => {
    setFetchKey(["branch-hwya"]);
    setFetchEndPoint(`identity/api/v1/pieces_in_branch`);
  };

  // HANDLE WAY TO BRANCH
  const handleWayToBranch = () => {
    setFetchKey(["way-to-branch-hwya"]);
    setFetchEndPoint(`identity/api/v1/way_to_branch`);
  };

  // HANDLE WAY TO EDARA
  const handleWayToEdara = () => {
    setFetchKey(["way-to-edara-hwya"]);
    setFetchEndPoint(`identity/api/v1/way_to_edara`);
  };

  // HANDLE PIECE BY WEIGHT
  const handlePieceByWeight = () => {
    setFetchKey(["piece_by_weight"]);
    setFetchEndPoint(`identity/api/v1/ItemWeight`);
  };

  // SEARCH FUNCTIONALITY
  const getSearchResults = async (req: any) => {
    let url = `${fetchEndPoint}?`;
    let first = false;
    Object.keys(req).forEach((key) => {
      if (req[key] !== "") {
        if (first) {
          if (key === "created_at") url += `?cAt[lk]=${formatDate(req[key])}`;
          else if (key === "coding_date_from")
            url += `?cAt[gte]=${formatDate(req[key])}`;
          else if (key === "coding_date_to")
            url += `?cAt[lte]=${formatDate(req[key])}`;
          else url += `?${key}[eq]=${req[key]}`;

          first = false;
        } else {
          if (key === "created_at") url += `&cAt[lk]=${formatDate(req[key])}`;
          else if (key === "coding_date_from")
            url += `&cAt[gte]=${formatDate(req[key])}`;
          else if (key === "coding_date_to")
            url += `&cAt[lte]=${formatDate(req[key])}`;
          else url += `&${key}[eq]=${req[key]}`;
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
    // dataExcelRefetch();
  }, [page, isSuccessPost, search]);

  useEffect(() => {
    setPage(1);
  }, [fetchKey]);

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

  const handleImportFiles = async () => {
    await mutate({
      endpointName: `/tarqimGold/api/v1/import?page=${importPageResponse}`,
      values: { file: importFiles[0], key: "get" },
      dataType: "formData",
    });
  };

  const handleFinalImportFiles = async () => {
    await finalMutate({
      endpointName: "/tarqimGold/api/v1/import",
      values: { file: importFiles[0], key: "post" },
      dataType: "formData",
    });

    if (rejectedPieces?.length > 0) {
      ExportToExcel(
        rejectedPieces,
        `rejected pieces ${formatDate(new Date())}`
      );
    }
    setImportFiles([]);
    setRejectedPieces([]);
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <h2 className="text-xl font-bold text-slate-700">{title}</h2>
        <div className="flex flex-wrap gap-6 items-center">
          <Button
            action={() => navigate("/coding/total/import")}
            className="border-2 border-mainGreen bg-mainGreen text-white flex items-center gap-2"
          >
            {t("import total")}
          </Button>
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
      <SearchFilter getSearchResults={getSearchResults} refetch={refetch} />

      {/* TABLE OF IDENTITIES */}
      <div className="flex flex-col gap-4 mt-8">
        <div className="flex items-center gap-4 self-end">
          <Button
            action={() => {
              // setCheckboxChecked(false)
              // refetch();
              // setPage(1)
              setOperationTypeSelect([]);
              // localStorage.clear()
            }}
            className="bg-mainGreen text-white"
          >
            {t("unselect all")}
          </Button>
          <Button
            action={(e) => {
              setImportData(null);
              setImportModal(true);
            }}
            className="bg-mainGreen text-white"
          >
            {t("import")}
          </Button>
          <Button
            action={(e) => {
              // COMPONENT FOR EXPORT DATA TO EXCEL FILE ACCEPT DATA AND THE NAME OF THE FILE

              ExportToExcel(dataExcel, formatDate(new Date()));
            }}
            className="bg-mainGreen text-white"
          >
            {t("export")}
          </Button>
        </div>
        <TableOfIdentities
          isLoading={isLoading}
          isFetching={isFetching}
          isRefetching={isRefetching}
          dataSource={dataSource}
          setPage={setPage}
          page={page}
          fetchKey={fetchKey}
          operationTypeSelect={operationTypeSelect}
          setOperationTypeSelect={setOperationTypeSelect}
          checkboxChecked={checkboxChecked}
          setCheckboxChecked={setCheckboxChecked}
        />
      </div>

      {/* OPERATION TYPE */}
      {(activeClass === "قطع بالوزن" || activeClass === "هويات في الإدارة") && (
        <OperationType
          refetch={refetch}
          setPage={setPage}
          setOperationTypeSelect={setOperationTypeSelect}
          setIsSuccessPost={setIsSuccessPost}
          operationTypeSelect={operationTypeSelect}
        />
      )}

      {/* BUTTON TO BACK */}
      <Back className="w-32 self-end mt-6" />

      <Modal isOpen={importModal} onClose={() => setImportModal(false)}>
        <div className="mt-14 mb-10 flex items-center gap-8">
          <FilesUpload files={importFiles} setFiles={setImportFiles} />

          <Button
            action={handleImportFiles}
            className="bg-mainGreen text-white self-end ml-9"
          >
            {t("add")}
          </Button>
        </div>

        {importData && (
          <>
            <div>
              <ImportTotals
                totals={importData && importData[0]}
                pieces={piecesState}
                setPiecesState={setPiecesState}
                setRejectedPieces={setRejectedPieces}
                setImportFiles={setImportFiles}
              />
            </div>

            <div className="flex justify-end my-6 gap-4">
              <Button
                action={() => {
                  setImportFiles([]);
                  setImportData(null);
                  setImportModal(false);
                }}
                className="bg-mainGreen text-white"
              >
                {t("refuse")}
              </Button>
              <Button
                action={handleFinalImportFiles}
                className="bg-mainGreen text-white"
              >
                {t("confirm")}
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default CodedIdentities;
