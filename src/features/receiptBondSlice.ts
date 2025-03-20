import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TReceiptBondsInitialState = {
  receiptBond: null | [];
};

const initialState = {
  receiptBond: null,
};

const receiptBondSlice = createSlice({
  name: "receiptBond",
  initialState: initialState,
  reducers: {
    setReceiptBond(
      state: TReceiptBondsInitialState,
      action: PayloadAction<null | []>
    ) {
      state.receiptBond = action.payload;
    },
  },
});

export const { setReceiptBond } = receiptBondSlice.actions;
export default receiptBondSlice.reducer;
