/////////// IMPORTS
///
import { t } from "i18next";
import { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../../components/atoms";
import { Modal } from "../../../components/molecules";
import { useLocalStorage, useMutate } from "../../../hooks";
import { CError_TP } from "../../../types";
import { mutateData } from "../../../utils/mutateData";
import { notify } from "../../../utils/toast";
import { ExpandableTable } from "../../GoldTables/ExapndableTable";
import {
  GoldCodingSanad_initialValues_TP,
  GoldSanad_TP,
} from "../coding-types-and-helpers";
import { CodingSanad } from "./CodingSanad";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { useReactToPrint } from "react-to-print";
import { FiPrinter } from "react-icons/fi";
import PrintPage from "../../../components/atoms/print/PrintPage";
import "../../../components/atoms/print/print.css";
///
/////////// Types
///
type GoldCodingWrapperProps_TP = {
  title: string;
};
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const GoldCodingWrapper = ({ title }: GoldCodingWrapperProps_TP) => {
  /////////// VARIABLES
  ///
  const { sanadId } = useParams();
  // const [successData, setSuccessData] = useState();
  // console.log("🚀 ~ GoldCodingWrapper ~ successData:", successData);
  const navigate = useNavigate();
  const [selectedSanadLocal, setSelectedSanadLocal] =
    useLocalStorage<GoldSanad_TP>(`selectedSanadLocal_${sanadId}`);

  const [addedPiecesLocal, setAddedPiecesLocal] = useLocalStorage<
    GoldCodingSanad_initialValues_TP[]
  >(`addedPiecesLocal_${sanadId}`);
  const [openModal, setOpenModal] = useState(false);
  const [openFinishedModal, setOpenFinishedModal] = useState(false);
  ///
  /////////// CUSTOM HOOKS
  ///
  const [addedPieces, setAddedPieces] = useState<
    GoldCodingSanad_initialValues_TP[]
  >(addedPiecesLocal || []);

  const { mutate, error, mutateAsync, isLoading, isSuccess } =
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
  ///
  /////////// SIDE EFFECTS
  ///

  ///
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  const sendPieces = async (pieces: GoldCodingSanad_initialValues_TP[]) => {
    if (pieces.length === 0) {
      return;
    }

    const [piece, ...remainingPieces] = pieces;
    console.log("🚀 ~ sendPieces ~ piece:", piece);

    try {
      const result = await mutateAsync({
        endpointName: "tarqimGold/api/v1/tarqim_gold",
        dataType: "formData",
        values: piece,
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
      notify("error", error?.response?.data?.message);

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
    }
  }, [addedPieces]);

  // start Print
  const [open, setOpen] = useState(false);
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

  ///
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
          isSuccess={isSuccess}
        />
      )}
      {stage === 2 && !!addedPieces.length && (
        <div className="flex flex-col mx-auto relative">
          <ExpandableTable
            setSelectedSanad={setSelectedSanad}
            setAddedPieces={setAddedPieces}
            addedPieces={addedPieces}
            showDetails={true}
            key={tableKey}
          />
          <div className=" flex item-center gap-x-2 mr-auto my-4">
            <Button action={() => setStage(1)} bordered>
              رجوع
            </Button>
            <Button
              loading={isLoading}
              action={() => {
                sendPieces(addedPieces);
              }}
            >
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

      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
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
                action={() => setOpen(false)}
                bordered
                className="cursor-pointer z-50"
              >
                {t("No")}
              </Button>
              <Button
                type="button"
                action={() => {
                  setOpenFinishedModal(true);
                  localStorage.removeItem("printItems")
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
            <div className="flex justify-center items-center mt-8 mb-2">
              <Button
                type="button"
                action={() => {
                  handlePrint();
                }}
              >
                {t("printing numbered identities")}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={openFinishedModal} onClose={() => setOpenFinishedModal(false)}>
        <div className="flex gap-x-2 p-16 justify-center items-center">
          <Button
            type="button"
            action={() => {
              setOpenModal(false);
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
