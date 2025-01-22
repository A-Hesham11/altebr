import React from "react";
import { Modal } from "../../../components/molecules";
import {
  SET_ENTRY_MODAL_OPEN,
  SET_INVOICE_MODAL_OPEN,
} from "../../../Reducers/Constants";
import ExpensesBondsPreview from "../../expenses/Bonds/ExpensesBondsPreview";
import ExpensesBondsEntry from "../../expenses/Bonds/ExpensesBondsEntry";

type TEdaraExpensesModalsProps = {
  invoiceModalOpen: boolean;
  entryModalOpen: boolean;
  selectedRowDetails: any;
  dispatch: any;
};

const EdaraExpensesModals: React.FC<TEdaraExpensesModalsProps> = ({
  invoiceModalOpen,
  entryModalOpen,
  selectedRowDetails,
  dispatch,
}) => {
  return (
    <>
      <Modal
        isOpen={invoiceModalOpen}
        onClose={() =>
          dispatch({ type: SET_INVOICE_MODAL_OPEN, payload: false })
        }
      >
        <ExpensesBondsPreview item={selectedRowDetails} />
      </Modal>

      <Modal
        isOpen={entryModalOpen}
        onClose={() => dispatch({ type: SET_ENTRY_MODAL_OPEN, payload: false })}
      >
        <ExpensesBondsEntry item={selectedRowDetails} />
      </Modal>
    </>
  );
};

export default EdaraExpensesModals;
