import { t } from "i18next";
import { SizePopup_TP } from "../pages/coding/coding-types-and-helpers";
import { Category_TP, CFile_TP } from "../types";
import { ToWords } from "to-words";

//  PDF OR IMAGE
type pdfOrImageReturn = "pdf" | "image" | "unknown";
export const pdfOrImage = (file: CFile_TP): pdfOrImageReturn => {
  const pdfWordOccurrence = file.type.indexOf("pdf");
  const imageWordOccurrence = file.type.indexOf("image");
  if (pdfWordOccurrence !== -1) {
    return "pdf";
  } else if (imageWordOccurrence !== -1) {
    return "image";
  } else {
    return "unknown";
  }
};

// translate
export const requiredTranslation = () => `${t("required")}`;
export const nationalNumberMin = () =>
  `${t("national number must be at least 10 numbers")}`;
export const nationalNumberMax = () =>
  `${t("national number must be less than 30 numbers")}`;

// delete string spaces
export const deleteSpaces = (str: string) => str.replace(/\s+/g, "");

export const karatStocks = [
  { karat: "24", value: "1", id: 1 },
  { karat: "22", value: "0.91667", id: 2 },
  { karat: "21", value: "0.87500", id: 3 },
  { karat: "18", value: "0.75000", id: 4 },
];

export const prepareItemsToShowInCaseOfTa2m = (
  category: Category_TP,
  sizes: SizePopup_TP[]
) =>
  category.items?.filter((item) => {
    return (
      !!item.has_size &&
      !!item.category_sizes?.length &&
      item.id !==
        sizes.find((size) => item.id === size.category_id)?.category_id
    );
  });

