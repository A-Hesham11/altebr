/////////// IMPORTS
///
import { t } from "i18next";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
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
    
    try {
      const result = await mutateAsync({
        endpointName: "tarqimGold/api/v1/tarqim_gold",
        dataType: "formData",
        values: piece,
      });

      if (result) {
        // const filteredPieces = remainingPieces.filter(
        //   (p) => p.front_key !== result.front_key
        // );

        // const filteredPieces = addedPieces.filter(
        //   (p) => p.front_key !== result.front_key
        // )
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
      // if(error.response.status === 404){
      //   notify("error",`${t('try to send to non existing url')}`)
      // }
      // if(error.response.status === 401){
      //   notify("error", `${t('you must login first')}`)
      // }
      // if(error.response.status === 503){
      //   notify("error", `${t('you are unauthorized to do the process')}`)
      // }
      // if(error.response.status === 422){
      //   const errors = Object.entries(error.response.data.errors).map(([key,value])=>`${value}`).join(' & ')
      //   notify("error", `${t(errors)}`)
      // }
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
            <Button loading={isLoading} action={() => {
              sendPieces(addedPieces)

              }}>
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
