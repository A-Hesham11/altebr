import { useMutation } from "@tanstack/react-query";
import { HttpStatusCode } from "axios";
import { useContext, useRef } from "react";
import { authCtx } from "../context/auth-and-perm/auth";
import { CError_TP, MutateDataParameters_TP } from "../types";
import { notify } from "../utils/toast";
import { useErrorModal } from "@/context/modal/ErrorModalProvider";

// T => response data type
type Args_TP<T> = {
  // values?: any,
  // values?: any,
  mutationKey?: [string] | [string, string] | [string, number];
  // values?: any,
  mutationFn: (comingData: MutateDataParameters_TP) => Promise<T | undefined>;
  onSuccess?: (data: T | undefined) => void | undefined;
  onError?: (error: CError_TP) => void;
};

export const useMutate = <T>({ ...args }: Args_TP<T>) => {
  const { logOutHandler, frontLogOutHandler } = useContext(authCtx);
  const { open: openErrorModal } = useErrorModal();
  const openedOnceRef = useRef(false);

  const { mutationKey, mutationFn, onSuccess, onError } = args;
  // useQuery infers queryFn return type
  const mutation = useMutation({
    // retry: 4,
    mutationKey,
    mutationFn,
    onSuccess: onSuccess ? onSuccess : () => notify("success"),
    onError: (err: CError_TP) => {
      const status = err?.response?.status;

      if (status === HttpStatusCode.Unauthorized) {
        frontLogOutHandler();
        return;
      }

      if (status === HttpStatusCode.InternalServerError) {
        if (!openedOnceRef.current) {
          openErrorModal();
          openedOnceRef.current = true;
        }
        return;
      }

      if (!!onError) {
        onError(err);
      }

      if (!!!err.response?.data.errors && !!err.response?.data.message) {
        notify("error", err.response.data.message);
      }
      //  else {
      //   if (!!!err.response?.data.errors && !!err.response?.data.message) {
      //     notify("error", err.response.data.message)
      //   } else {
      //     notify("error")
      //   }
      // }
      // if (err.response.status === HttpStatusCode.NotFound) {
      //   notify("error", err.response.data.message)
      // }
      // if (err.response.status === HttpStatusCode.Unauthorized) {
      //   notify("error",err.response.data.message)
      // }
      // if (err.response.status === HttpStatusCode.ServiceUnavailable) {
      //   notify("error", err.response.data.message)
      // }
      // if(error.response.status === 422){
      //   const errors = Object.entries(error.response.data.errors).map(([key,value])=>`${value}`).join(' & ')
      //   notify("error", `${t(errors)}`)
      // }
    },
  });

  return mutation;
};
