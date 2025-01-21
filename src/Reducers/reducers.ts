import {
  SET_DATA_SOURCE,
  SET_MODAL_OPEN,
  SET_PAGE,
  SET_SEARCH,
  SET_SELECTED_ROW_DETAILS_ID,
} from "./GlobalVariables";
import { IMissingPiecesState } from "./InitialState";

// MISSING PIECES ACTIONS
type TAction =
  | { type: typeof SET_DATA_SOURCE; payload: any }
  | { type: typeof SET_SELECTED_ROW_DETAILS_ID; payload: number }
  | { type: typeof SET_MODAL_OPEN; payload: boolean }
  | { type: typeof SET_PAGE; payload: number }
  | { type: typeof SET_SEARCH; payload: string };

export const missingPiecesReducer = (
  state: IMissingPiecesState,
  action: TAction
) => {
  switch (action.type) {
    case SET_DATA_SOURCE:
      return { ...state, dataSource: action.payload };
    case SET_SELECTED_ROW_DETAILS_ID:
      return { ...state, selectedRowDetailsId: action.payload };
    case SET_MODAL_OPEN:
      return { ...state, modalOpen: action.payload };
    case SET_PAGE:
      return { ...state, page: action.payload };
    case SET_SEARCH:
      return { ...state, search: action.payload };
    default:
      return state;
  }
};
