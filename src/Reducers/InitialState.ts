// MISSING PIECES INITIAL STATE
export interface IMissingPiecesState {
  dataSource: any;
  selectedRowDetailsId: number | null;
  modalOpen: boolean;
  page: number;
  search: string;
}

export const MissingPiecesInitialState: IMissingPiecesState = {
  dataSource: {},
  selectedRowDetailsId: null,
  modalOpen: false,
  page: 1,
  search: "",
};
