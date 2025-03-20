/////////// IMPORTS
///
import { t } from "i18next";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../../components/atoms";
import { Modal } from "../../../components/molecules";
import { useFetch, useLocalStorage, useMutate } from "../../../hooks";
import { CError_TP } from "../../../types";
import { mutateData } from "../../../utils/mutateData";
import { notify } from "../../../utils/toast";
import { DiamondExapndableTable } from "../../diamoundTables/DiamondExapndableTable";
import {
  GoldCodingSanad_initialValues_TP,
  GoldSanad_TP,
} from "../coding-types-and-helpers";
import { CodingSanad } from "./CodingSanad";
import { useReactToPrint } from "react-to-print";
import PrintPage from "../../../components/atoms/print/PrintPage";
///
/////////// Types
///
type DiamondCodingWrapperProps_TP = {
  title: string;
};
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const DiamondCodingWrapper = ({
  title,
}: DiamondCodingWrapperProps_TP) => {
  /////////// VARIABLES
  ///
  const { sanadId } = useParams();
  const navigate = useNavigate();
  const [selectedSanadLocal, setSelectedSanadLocal] =
    useLocalStorage<GoldSanad_TP>(`selectedSanadLocal_${sanadId}`);

  const [addedPiecesLocal, setAddedPiecesLocal] = useLocalStorage<
    GoldCodingSanad_initialValues_TP[]
  >(`addedPiecesLocal_${sanadId}`);
  const [openModal, setOpenModal] = useState(false);
  ///
  /////////// CUSTOM HOOKS
  ///
  const [addedPieces, setAddedPieces] = useState<
    GoldCodingSanad_initialValues_TP[]
  >(addedPiecesLocal || []);

  const { mutate, error, mutateAsync, isLoading } =
    useMutate<GoldCodingSanad_initialValues_TP>({
      mutationFn: mutateData,
      onError(error) {
        null;
      },
    });
  useEffect(() => {
    if (addedPiecesLocal?.length && stage === 1)
      notify(
        "info",
        `${t("there are items already existed you can save it")}`,
        "top-right",
        5000
      );
  }, []);

  ///
  /////////// STATES
  ///
  const [selectedSanad, setSelectedSanad] = useState<GoldSanad_TP | undefined>(
    selectedSanadLocal
  );
  const [stage, setStage] = useState(1);
  const [tableKey, setTableKey] = useState(1);
  const [openFinishedModal, setOpenFinishedModal] = useState(false);
  ///
  /////////// SIDE EFFECTS
  ///
  const {
    data: sanadData,
    isSuccess: sanadDataSuccess,
    failureReason,
    isRefetching: isSanadRefetching,
    refetch,
  } = useFetch<GoldSanad_TP>({
    endpoint: `tarqimDiamond/api/v1/open-bonds/${sanadId}`,
    queryKey: [`DiamondCodingSanads/${sanadId}`],
    enabled: false,
  });

  ///
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  const sendPieces = async (pieces: GoldCodingSanad_initialValues_TP[]) => {
    if (pieces.length === 0) {
      return;
    }

    const [piece, ...remainingPieces] = pieces;

    const diamondStoneWeight = piece?.stones?.reduce((acc, curr) => {
      return +acc + Number(curr.diamondWeight);
    }, 0);

    const otherStoneWeight = piece?.stones?.reduce((acc, curr) => {
      return +acc + Number(curr.weight);
    }, 0);

    try {
      const result = await mutateAsync({
        endpointName: "tarqimDiamond/api/v1/tarqimdiamonds", // must be tarqim gold
        dataType: "formData",
        values: {
          ...piece,
          diamondWeightStone: diamondStoneWeight || 0,
          weightStone: otherStoneWeight || 0,
        },
      });

      if (result) {
        setAddedPieces((curr) =>
          curr.filter((p) => p.front_key !== result.front_key)
        );
        setAddedPiecesLocal((curr) =>
          curr.filter((p) => p.front_key !== result.front_key)
        );

        const savedPieces = JSON.parse(
          localStorage.getItem("printItems") || "[]"
        );
        savedPieces.push(result); // Add the new piece
        localStorage.setItem("printItems", JSON.stringify(savedPieces));
      }
    } catch (err) {
      const error = err as CError_TP;
      notify("error", error.response.data.message);

      setAddedPieces((curr) =>
        curr.map((p) =>
          p.front_key === piece.front_key
            ? { ...p, status: error.response.data.message }
            : p
        )
      );

      setAddedPiecesLocal((curr) =>
        curr.map((p) =>
          p.front_key === piece.front_key
            ? { ...p, status: error.response.data.message }
            : p
        )
      );
    }

    await sendPieces(remainingPieces).then(() => {
      setTableKey((prev) => prev + 1);
    });
  };

  useEffect(() => {
    if (!!!addedPieces.length && stage === 2) {
      setOpenModal(true);
      refetch();
    }
  }, [addedPieces]);

  useEffect(() => {
    if (addedPieces.length === 0 && stage === 1) {
      refetch();
    }
  }, [addedPieces, stage]);

  // start Print
  const [open, setOpen] = useState(false);
  console.log("🚀 ~ GoldCodingWrapper ~ open:", open);
  const contentRef = useRef();
  const printItems = JSON.parse(localStorage.getItem("printItems") || "[]");

  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    onBeforePrint: () => console.log("before printing..."),
    onAfterPrint: () => setOpen(true),
    removeAfterPrint: true,
    pageStyle: `
        @page {
          size: auto;
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

  // End Print

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {stage === 1 && (
        <CodingSanad
          selectedSanad={selectedSanad}
          setSelectedSanad={setSelectedSanad}
          stage={stage}
          setStage={setStage}
          addedPieces={addedPieces}
          setAddedPieces={setAddedPieces}
        />
      )}
      {stage === 2 && !!addedPieces.length && (
        <div className="flex flex-col mx-auto relative">
          <DiamondExapndableTable
            setSelectedSanad={setSelectedSanad}
            selectedSanad={selectedSanad}
            setAddedPieces={setAddedPieces}
            addedPieces={addedPieces}
            showDetails={true}
            key={tableKey}
          />
          <div className=" flex item-center gap-x-2 mr-auto">
            <Button action={() => setStage(1)} bordered>
              رجوع
            </Button>
            <Button loading={isLoading} action={() => sendPieces(addedPieces)}>
              ارسال
            </Button>
          </div>
        </div>
      )}
      {stage === 2 && !!!addedPieces.length && (
        <div className="flex justify-between mx-auto relative">
          <h2 className="text-mainGreen text-xl">لا يوجد قطع مرقمة</h2>
          <Button action={() => setStage(1)} bordered>
            رجوع
          </Button>
        </div>
      )}

      <Modal isOpen={openModal} onClose={() => {}} icon>
        {open ? (
          <>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3
                className="text-lg font-semibold leading-6 text-gray-900 text-center"
                id="modal-title"
              >
                {t("printing process")}
              </h3>

              <p className="text-lg text-gray-500 mt-6 mb-2 text-center">
                {t("Did the numbered identity print successfully?")}
              </p>
            </div>
            <div className="bg-gray-50 px-4 pt-3 pb-5 sm:flex sm:flex-row-reverse sm:px-6 justify-center gap-5 z-50">
              <Button
                type="button"
                action={() => {
                  setOpen(false);
                  localStorage.removeItem("printItems");
                }}
                bordered
                className="cursor-pointer z-50"
              >
                {t("No")}
              </Button>
              <Button
                type="button"
                action={() => {
                  setOpenFinishedModal(true);
                  localStorage.removeItem("printItems");
                  setOpenModal(false);
                }}
              >
                {t("Yes")}
              </Button>
            </div>
          </>
        ) : (
          <div>
            <h3
              className="text-lg font-semibold leading-6 text-gray-900 text-center"
              id="modal-title"
            >
              {t("printing process")}
            </h3>
            <div className="flex justify-center items-center mt-8 mb-2 gap-4">
              <Button type="button" action={handlePrint}>
                {t("printing numbered identities")}
              </Button>
              <Button
                type="button"
                bordered
                action={() => {
                  setOpen(false);
                  localStorage.removeItem("printItems");
                  setOpenModal(false);
                }}
              >
                {t("Later")}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={openFinishedModal} onClose={() => {}} icon>
        <div className="flex gap-x-2 p-16 justify-center items-center">
          <Button
            type="button"
            action={() => {
              setOpenModal(false);
              setOpenFinishedModal(false);
              setOpen(false);
              setStage(1);
              setAddedPiecesLocal([]);
            }}
            bordered
          >
            {t("back to digitization page")}
          </Button>

          <Button
            type="button"
            action={() => {
              setOpenModal(false);
              setAddedPiecesLocal([]);
              navigate("/coding-react");
            }}
          >
            {t("go to identification management")}
          </Button>
        </div>
      </Modal>

      <div>
        <div
          className="print-page"
          ref={contentRef}
          style={{ direction: "ltr" }}
        >
          {printItems?.length &&
            printItems?.map((item) => (
              <div className="break-page">
                <PrintPage item={item} />
              </div>
            ))}
        </div>
      </div>
    </>
  );
};
