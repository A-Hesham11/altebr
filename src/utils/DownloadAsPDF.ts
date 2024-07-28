import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const DownloadAsPDF = async (currentElement: any, fileName: string) => {
  const element = currentElement;
  const canvas = await html2canvas(element);
  const data = canvas.toDataURL("image/png");

  const pdf = new jsPDF();
  const imgProperties = pdf.getImageProperties(data);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

  pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(`${fileName}.pdf`);
};
