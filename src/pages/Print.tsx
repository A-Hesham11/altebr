import React, { useRef, useState } from "react";
import QRCode from "react-qr-code";
import QRCodeGen from "../components/atoms/QRCode";
import Logo from "../assets/qr-logo.png";

const Print = () => {
  // console.log("🚀 ~ ZebraPrintWrapper:", new ZebraBrowserPrintWrapper().device);

  const handlePrintClick = () => {
    const contentToPrint = document.getElementById("content-to-print");
    const printWindow = window.open("");
    if (printWindow) {
      printWindow.document.write(`
            <html>
              <body>
                ${contentToPrint.innerHTML}
              </body>
            </html>
          `);
      printWindow.print();
      printWindow.document.close();
    } else {
      alert(
        "Pop-up blocked. Please enable pop-ups for this website and try again."
      );
    }
  };

  // const handlePrintClick = () => {
  //   // Get the HTML content you want to print
  //   const contentToPrint = document.getElementById('content-to-print').outerHTML;
  //   console.log("🚀 ~ handlePrintClick ~ contentToPrint:", contentToPrint)

  //   // Use the ZebraPrintWrapper library to send the content to the printer
  //   new ZebraBrowserPrintWrapper().print({
  //     printerName: 'zebra', // Replace with the name of your Zebra printer
  //     data: contentToPrint,
  //     type: 'html',
  //   });
  // };

  // const printBarcode = async (serial) => {
  //   // Create a new instance of the object
  //   const browserPrint = new ZebraBrowserPrintWrapper();
  //   console.log("🚀 ~ printBarcode ~ browserPrint:", browserPrint);

  //   // Select default printer
  //   const defaultPrinter = await browserPrint.getDefaultPrinter();
  //   console.log("🚀 ~ printBarcode ~ defaultPrinter:", defaultPrinter);

  //   // Set the printer
  //   browserPrint.setPrinter(defaultPrinter);

  //   // Check printer status
  //   const printerStatus = await browserPrint.checkPrinterStatus();
  //   console.log("🚀 ~ printBarcode ~ printerStatus:", printerStatus);

  //   // Check if the printer is ready
  //   if (printerStatus.isReadyToPrint) {
  //     // ZPL script to print a simple barcode
  //     const zpl = `^XA
  //                       ^BY2,2,100
  //                       ^FO20,20^BC^FD${serial}^FS
  //                       ^XZ`;
  //     console.log("🚀 ~ printBarcode ~ zpl:", zpl);

  //     browserPrint.print(zpl);
  //   } else {
  //     console.log("Error/s", printerStatus.errors);
  //   }
  // };

  return (
    <div>
      <div
        id="content-to-print"
        style={{
          width: "60px",
          height: "23px",
          padding: "3.7px",
        }}
      >
        <img
          src={Logo}
          alt="logo"
          className="img"
          style={{ width: "15.2px", height: "19px", marginBottom: "3px" }}
        />
        <QRCode
          style={{ width: "16px", height: "18px", display: "block" }}
          value={`${Math.round(12355)}`}
          viewBox={`0 0 300 300`}
        />
        <p style={{ fontSize: "5px", fontWeight: "700" }}>2305w1</p>
        <div style={{ marginTop: "6px" }}>
          <p style={{ fontSize: "6px", fontWeight: "700" }}>G:12</p>
          <p style={{ fontSize: "6px", fontWeight: "700" }}>K:12</p>
          <p style={{ fontSize: "5px", fontWeight: "700" }}>D:0.71</p>
          <p style={{ fontSize: "6px", fontWeight: "700" }}>S</p>
        </div>
      </div>
      <button
        className="bg-mainGreen p-2 text-white mt-20"
        type="submit"
        onClick={() => {
          console.log("dkfmskvmekm");
          handlePrintClick();
        }}
      >
        Print
      </button>
    </div>
  );
};

export default Print;
