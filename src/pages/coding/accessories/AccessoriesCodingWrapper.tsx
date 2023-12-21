/////////// IMPORTS
///
import { t } from "i18next";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { Button } from "../../../components/atoms";
import { Modal } from "../../../components/molecules";
import { useFetch, useLocalStorage, useMutate } from "../../../hooks";
import { CError_TP } from "../../../types";
import { mutateData } from "../../../utils/mutateData";
import { notify } from "../../../utils/toast";
// import { AccessoriesExapndableTable } from "../../diamoundTables/DiamondExapndableTable"
import { AccessoriesExapndableTable } from "../../accessoriesTables/AccessoriesExapndableTable";
import {
  GoldCodingSanad_initialValues_TP,
  GoldSanad_TP,
} from "../coding-types-and-helpers";
import { CodingSanad } from "./AccessoriesCodingSanad";
///
/////////// Types
///
type AccessoriesCodingWrapperProps_TP = {
  title: string;
};
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const AccessoriesCodingWrapper = ({
  title,
}: AccessoriesCodingWrapperProps_TP) => {
  /////////// VARIABLES
  ///
  const { sanadId } = useParams();
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
    endpoint: `tarqimAccessory/api/v1/open-bonds/${sanadId}`,
    queryKey: [`AccessoryCodingSanads/${sanadId}`],
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
        endpointName: "tarqimAccessory/api/v1/tarqimaccessories", // must be tarqim gold
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
          <AccessoriesExapndableTable
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
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <div className="flex gap-x-2 p-16 justify-center items-center">
          <Button
            type="button"
            action={() => {
              setOpenModal(false);
              setStage(1);
            }}
            bordered
          >
            {t("back to digitization page")}
          </Button>

          <Button
            type="button"
            action={() => {
              setOpenModal(false);
              setAddedPiecesLocal((prev) => (prev = []));
              setAddedPieces((prev) => (prev = []));
            }}
          >
            <a href="http://api-almehaisen.altebr.jewelry/identity/admin/identities?twrdStat[eq]=inedara">
              {t("go to identification management")}
            </a>
          </Button>
        </div>
      </Modal>
    </>
  );
};
