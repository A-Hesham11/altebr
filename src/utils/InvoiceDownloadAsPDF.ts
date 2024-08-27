import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const InvoiceDownloadAsPDF = async (invoiceRefs: any) => {
  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  // Define margins (adjust as needed)
  const margin = 10; // 10mm margin
  const contentWidth = pdfWidth - 2 * margin;
  const contentHeight = pdfHeight - 2 * margin;

  // Loop through each invoice reference
  for (let i = 0; i < invoiceRefs.current.length; i++) {
    const element = invoiceRefs.current[i];

    // Capture the current invoice as an image
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    // Calculate image height for the PDF page
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * contentWidth) / imgProps.width;

    // Ensure the image fits within the page height
    if (imgHeight > contentHeight) {
      console.error(
        "Image height exceeds PDF content height. Please ensure the element fits."
      );
      return;
    }

    // Add the image to the PDF with margins
    pdf.addImage(imgData, "PNG", margin, margin, contentWidth, imgHeight);

    // Add a new page if not the last invoice
    if (i < invoiceRefs.current.length - 1) {
      pdf.addPage();
    }
  }

  // Save the PDF
  pdf.save("invoices.pdf");
};
