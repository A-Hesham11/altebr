import QRCode from "react-qr-code";
import "./print.css";
import Logo from "../../../assets/qr-logo.png";
import { useEffect, useRef } from "react";

const PrintPage = ({ item }) => {
  // console.log("🚀 ~ PrintPage ~ item:", item);
  // const contentRef = useRef();
  // useEffect(() => {
  //   window.print()
  // }, [!!item && item?.hwya])

  return (
    <>
      {/* {data?.map((item) => ( */}
      <div className="container-print" style={{ pageBreakAfter: "always" }}>
        <div className="component">
          <div className="content-wrapper">
            <div className="grid-layout">
              <img src={Logo} alt="logo" className="img" />
              <QRCode
                className="img_qr"
                value={item?.hwya}
                // value={`${Math.round(12355)}`}
                viewBox={`0 0 300 300`}
              />
              <p className="small-text">{item?.hwya}</p>
            </div>

            <div className="rotated-text">
              <p className="rotated-paragraph">
                G:
                <span className="paragraph_title">
                  {item?.classification_id === 1 ? item?.weight : 0}
                </span>
              </p>
              <p className="rotated-paragraph">
                K:<span className="paragraph_title">{item?.karat}</span>
              </p>

              <p className="rotated-paragraph">
                D:
                <span className="paragraph_title">
                  {item?.classification_id !== 1 ? item?.weight : 0}
                </span>
              </p>
              <p className="rotated-paragraph">
                S:<span className="paragraph_title">{item?.ahgar_weight}</span>
              </p>
              <p className="rotated-paragraph">
                O:<span className="paragraph_title">other</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* ))} */}
    </>
  );
};

export default PrintPage;
