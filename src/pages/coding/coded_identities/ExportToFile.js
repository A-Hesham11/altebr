import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

export const ExportToExcel = (apiData, fileName) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  console.log(XLSX.utils);

  const ws = XLSX.utils.json_to_sheet(apiData);

  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(data, fileName + fileExtension);
};
