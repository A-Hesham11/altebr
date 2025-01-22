// MISSING PIECES INITIAL STATE
export interface IMissingPiecesState {
  dataSource: any;
  selectedRowDetailsId: number | null;
  modalOpen: boolean;
  page: number;
  search: string;
}

export const MissingPiecesInitialState: IMissingPiecesState = {
  dataSource: [],
  selectedRowDetailsId: null,
  modalOpen: false,
  page: 1,
  search: "",
};

// EDARA EXPENSES INITIAL STATE
export interface IEdaraExpensesInitialState {
  dataSource: any;
  selectedRowDetails: {} | undefined;
  invoiceModalOpen: boolean;
  entryModalOpen: boolean;
  page: number;
  search: string;
}

export const EdaraExpensesInitialState: IEdaraExpensesInitialState = {
  dataSource: [],
  selectedRowDetails: {},
  invoiceModalOpen: false,
  entryModalOpen: false,
  page: 1,
  search: "",
};
