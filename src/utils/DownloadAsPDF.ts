import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const DownloadAsPDF = async (currentElement: any, fileName: string) => {
  const element = currentElement;
  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  console.log("🚀 ~ DownloadAsPDF ~ pdfWidth:", pdfWidth)
  const pdfHeight = pdf.internal.pageSize.getHeight();
  console.log("🚀 ~ DownloadAsPDF ~ pdfHeight:", pdfHeight)
  let yOffset = 0;

  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");
  const imgProps = pdf.getImageProperties(imgData);
  const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

  const totalPages = Math.ceil(imgHeight / pdfHeight);
  console.log("🚀 ~ DownloadAsPDF ~ totalPages:", totalPages)

  for (let page = 0; page < totalPages; page++) {
    if (page > 0) {
      pdf.addPage();
    }
    const y = -(page * pdfHeight);
    pdf.addImage(imgData, "PNG", 0, y, pdfWidth, imgHeight);
  }

  pdf.save(`${fileName}.pdf`);
};
