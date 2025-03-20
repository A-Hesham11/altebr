import React, { useContext } from "react";
import { useFetch } from "../../hooks";
import { authCtx } from "../../context/auth-and-perm/auth";
import { t } from "i18next";

const InvoiceFooter = () => {
  const { userData } = useContext(authCtx);
  console.log("🚀 ~ InvoiceFooter ~ userData:", userData)

  const countryName = userData?.branch?.country?.name;
  const cityName = userData?.branch?.city?.name;
  const districtName = userData?.branch?.district?.name;
  const phone = userData?.branch?.company?.phone;
  const email = userData?.branch?.company?.email;
  const pathname = location.pathname;

  const mineralLicence = userData?.branch?.document?.filter(
    (item) => item.data.docType.label === "رخصة المعادن"
  )?.[0]?.data?.docNumber;

  const taxRegisteration = userData?.branch?.document?.filter(
    (item) => item.data.docType.label === "شهادة ضريبية"
  )?.[0]?.data?.docNumber;

  const { data } = useFetch<any>({
    endpoint: `/selling/api/v1/get_sentence`,
    queryKey: ["sentence"],
  });

  return (
    <div className="text-center">
      {/* <p className="my-4 py-1 border-y border-mainOrange text-[15px]">
        {data && data?.sentence}
      </p> */}
      <div className="border-2 border-[#00000014] rounded-lg p-2 my-5">
        <p className="bg-[#F3F3F3] font-semibold rounded-md p-1">
          {data && data?.sentence}
        </p>
      </div>

      {/* <div className="flex justify-between items-center px-8 py-2 bg-[#E5ECEB] bill-shadow">
        <p className="text-sm">
          {t("address")} : {countryName} , {cityName} , {districtName}
        </p>
        <p className="text-sm">
          {t("phone")}: {phone}
        </p>
        <p className="text-sm">
          {t("email")}: {email}
        </p>
        <p className="text-sm">
          {t("tax number")}: {taxRegisteration && taxRegisteration}
        </p>
        <p className="text-sm">
          {t("Mineral license")}: {mineralLicence && mineralLicence}
        </p>
        <p className="text-sm">
          {t("commercial register")}: {userData?.branch?.zatca_fax_number}
        </p>
      </div> */}

      <div className="grid grid-cols-3 gap-y-2 px-8 py-3 bg-mainGreen text-white">
        <p>
          <span className="font-semibold">{t("address")} :</span> {countryName}{" "}
          , {cityName} , {districtName}
        </p>
        <p className="text-sm">
          <span className="font-semibold">{t("phone")} :</span> {phone}
        </p>
        <p className="text-sm">
          <span className="font-semibold">{t("email")} :</span> {email}
        </p>
        <p className="text-sm">
          <span className="font-semibold">{t("tax number")} :</span>{" "}
          {taxRegisteration && taxRegisteration}
        </p>
        <p className="text-sm">
          <span className="font-semibold">{t("Mineral license")} :</span>{" "}
          {mineralLicence && mineralLicence}
        </p>
        <p className="text-sm">
          <span className="font-semibold">{t("commercial register")} :</span>{" "}
          {userData?.branch?.zatca_fax_number}
        </p>
      </div>
    </div>
  );
};

export default InvoiceFooter;
