import React, { useContext } from "react";
import { useFetch } from "../../hooks";
import { authCtx } from "../../context/auth-and-perm/auth";
import { t } from "i18next";

const InvoiceFooter = () => {
  const { userData } = useContext(authCtx);
  console.log("🚀 ~ InvoiceFooter ~ userData:", userData);

  const countryName = userData?.branch?.country?.name;
  const cityName = userData?.branch?.city?.name;
  const districtName = userData?.branch?.district?.name;
  const phone = userData?.branch?.company?.phone;
  const email = userData?.branch?.company?.email;

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
      <p className="my-4 py-1 border-y border-mainOrange text-[15px]">
        {data && data?.sentence}
      </p>
      <div className="flex justify-between items-center px-8 py-2 bg-[#E5ECEB] bill-shadow">
        <p>
          {t("address")} : {countryName} , {cityName} , {districtName}
        </p>
        <p>
          {t("phone")}: {phone}
        </p>
        <p>
          {t("email")}: {email}
        </p>
        <p>
          {t("tax number")}: {taxRegisteration && taxRegisteration}
        </p>
        <p>
          {t("Mineral license")}: {mineralLicence && mineralLicence}
        </p>
      </div>
    </div>
  );
};

export default InvoiceFooter;
