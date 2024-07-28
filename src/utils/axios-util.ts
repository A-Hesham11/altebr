import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  HttpStatusCode,
} from "axios";
import Cookies from "js-cookie";
import i18n from "../i18n";
import { notify } from "./toast";

const baseURL =
  // import.meta.env.VITE_BASE_URL || "https://api-hbesh-dev.altebr.jewelry";
  // import.meta.env.VITE_BASE_URL || "https://alexon.altebr.jewelry/";
  import.meta.env.VITE_BASE_URL || "https://api-alexon.altebr.com";
  // import.meta.env.VITE_BASE_URL || "https://api-test.altebr.com";
  // import.meta.env.VITE_BASE_URL || "https://api-almahaisen.altebr.com";

const lang = i18n.language.startsWith("ar") ? "ar" : "en";

const client = axios.create({
  baseURL,
}); 

export const request = async <T>(
  options: AxiosRequestConfig,
  pagination?: boolean
): Promise<T> => {
  const token = Cookies.get("token");

  const onSuccess = (response: AxiosResponse) => {
    if (pagination) {
      return response.data;
    } else {
      return response.data.data;
    }
  };

  try {
    const response = await client({
      ...options,
      // timeout: 3000,
      headers: {
        "Content-Type": `application/json`,
        "Accept-Language": lang,
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });
    return onSuccess(response);
  } catch (error) {
    if (
      error?.response.data.message ===
        "البريد الالكتروني او كلمة المرور غير صحيحة" ||
      error?.response.data.message === "يجب اضافة فترات عمل لهذا الموظف "
    ) {
      notify("error", error?.response.data.message);
    }
    // 👁️ i wil {l handle unauthorized in useFetch and useMutate because i can't use useContext here
    // const axiosError = error as CError_TP;
    // // handle error responses
    // if (axiosError.response) {
    //   const responseError = axiosError.response
    //   if (responseError.status === HttpStatusCode.Unauthorized) {
    //     // unauthorized => logout
    //     // notify('error', "You need to login again")
    //   }
    //   if (responseError.status === HttpStatusCode.Forbidden){
    //   // forbidden => can't access this content, this case can be handled manually for each request
    //   }
    //   // handle request errors
    // } else if (axiosError.request) {
    // } else {
    //   // handle other errors
    // }
    throw error;
  }
};
