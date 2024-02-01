import React, { useRef, useState } from "react";
import QRCode from "react-qr-code";
import QRCodeGen from "../components/atoms/QRCode";
import Logo from "../assets/qr-logo.png";

const Print = () => {
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
        onClick={handlePrintClick}
      >
        Print
      </button>
    </div>
  );
};

export default Print;
