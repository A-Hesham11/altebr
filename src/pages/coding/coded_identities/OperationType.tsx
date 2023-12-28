import { t } from "i18next";
import React, { useState } from "react";
import { Button } from "../../../components/atoms";
import { Back } from "../../../utils/utils-components/Back";
import { Modal } from "../../../components/molecules";
import TransformToBranch from "./TransformToBranch";
import MergeHwya from "./MergeHwya";
import SeperateHwya from "./SeperateHwya";
import { notify } from "../../../utils/toast";

const OperationType = ({
  operationTypeSelect,
  setOperationTypeSelect,
  refetch,
  setIsSuccessPost,
}) => {
  const [transformToBranchModal, setOpenTransformToBranchModal] =
    useState(false);
  const [mergeModal, setOpenMergeModal] = useState(false);
  const [seperateModal, setOpenSeperateModal] = useState(false);
  const [formData, setFormData] = useState({});

  return (
    <>
      <div className="py-12 flex flex-col gap-8">
        <h2 className="text-xl font-bold text-slate-700">
          {t("choose operation type")}
        </h2>

        {/* BUTTONS */}
        <div className="flex justify-center items-center gap-4">
          <Button
            action={() => setOpenTransformToBranchModal(true)}
            className="border-2 border-mainGreen bg-mainGreen text-white flex items-center gap-2"
          >
            <span>{t("transfer to branch")}</span>
          </Button>
          <Button
            action={() => setOpenMergeModal(true)}
            className="border-2 border-mainGreen bg-transparent text-mainGreen flex items-center gap-2"
          >
            <span>{t("merging identities")}</span>
          </Button>
          <Button
            action={() => {
              if (operationTypeSelect.length > 1) {
                notify(
                  "error",
                  t("You can only select one identity to separate")
                );
                return;
              }

              if (!operationTypeSelect[0]?.category_items) {
                notify("error", t("must select taqm"));
                return;
              }

              setOpenSeperateModal(true);
            }}
            className="border-2 border-mainGreen bg-transparent text-mainGreen  flex items-center gap-2"
          >
            <span>{t("separating identities")}</span>
          </Button>
        </div>

        {/* MODAL */}
        <Modal
          isOpen={transformToBranchModal}
          onClose={() => setOpenTransformToBranchModal(false)}
        >
          <TransformToBranch
            refetch={refetch}
            setOperationTypeSelect={setOperationTypeSelect}
            setOpenSeperateModal={setOpenSeperateModal}
            setIsSuccessPost={setIsSuccessPost}
            operationTypeSelect={operationTypeSelect}
            setOpenTransformToBranchModal={setOpenTransformToBranchModal}
          />
        </Modal>
        <Modal isOpen={mergeModal} onClose={() => setOpenMergeModal(false)}>
          <MergeHwya
            refetch={refetch}
            setOperationTypeSelect={setOperationTypeSelect}
            setOpenSeperateModal={setOpenSeperateModal}
            mergeModal={mergeModal}
            setIsSuccessPost={setIsSuccessPost}
            operationTypeSelect={operationTypeSelect}
            setOpenTransformToBranchModal={setOpenTransformToBranchModal}
          />
        </Modal>
        <Modal
          isOpen={seperateModal}
          onClose={() => setOpenSeperateModal(false)}
        >
          <SeperateHwya
            setFormData={setFormData}
            formData={formData}
            refetch={refetch}
            setOperationTypeSelect={setOperationTypeSelect}
            setOpenSeperateModal={setOpenSeperateModal}
            setIsSuccessPost={setIsSuccessPost}
            operationTypeSelect={operationTypeSelect}
            setOpenTransformToBranchModal={setOpenTransformToBranchModal}
          />
        </Modal>
      </div>
    </>
  );
};

export default OperationType;
