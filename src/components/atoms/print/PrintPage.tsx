import QRCode from "react-qr-code";
import "./print.css";
import Logo from "../../../assets/qr-logo.png";

const PrintPage = () => {
  return (
    <>
      <div className="container-print no-print">
        <div className="component">
          <div className="content-wrapper">
            <div className="grid-layout">
              <img src={Logo} alt="logo" className="img" />
              <QRCode
                className="img_qr"
                value={`${Math.round(12355)}`}
                viewBox={`0 0 300 300`}
              />
              <p className="small-text">2305W1</p>
            </div>

            <div className="rotated-text">
              <p className="rotated-paragraph">
                G:<span className="paragraph_title">342.71</span>
              </p>
              <p className="rotated-paragraph">
                K:<span className="paragraph_title">24</span>
              </p>
              <p className="rotated-paragraph">
                D:<span className="paragraph_title">125.860</span>
              </p>
              <p className="rotated-paragraph">
                S:<span className="paragraph_title">125.804</span>
              </p>
              <p className="rotated-paragraph">
                O:<span className="paragraph_title">other</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrintPage;

{
  /* <div style={{ width: "160px" }} className="no-print">
        <div
          ref={componentRef}
          style={
            {
              // width: "22px",
              // transform: "rotate(270deg)",
              // marginRight: "62px"
            }
          }
        >
          <div
            style={{
              height: "40px",
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "grid",
                gap: "0px",
                gridTemplateColumns: "30px 25px 10px",
                alignItems: "center",
              }}
            >
              <img
                src={Logo}
                alt="logo"
                className="img"
                style={{
                  width: "28px",
                  height: "28px",
                  transform: "rotate(270deg)",
                }}
              />
              <QRCode
                style={{
                  width: "22px",
                  height: "22px",
                  transform: "rotate(270deg)",
                }}
                value={`${Math.round(12355)}`}
                viewBox={`0 0 300 300`}
              />
              <p
                style={{
                  fontSize: "6px",
                  fontWeight: "900",
                  height: "12px",
                  width: "3px",
                  textAlign: "left",
                  transform: "rotate(270deg)",
                  alignSelf: "normal",
                }}
              >
                2305w1
              </p>
            </div>

            <div
              style={{
                transform: "rotate(270deg)",
              }}
            >
              <p
                style={{
                  fontSize: "6px",
                  fontWeight: "700",
                  textAlign: "center",
                }}
              >
                G:12
              </p>
              <p
                style={{
                  fontSize: "6px",
                  fontWeight: "700",
                  textAlign: "center",
                }}
              >
                K:12
              </p>
              <p
                style={{
                  fontSize: "6px",
                  fontWeight: "700",
                  textAlign: "center",
                }}
              >
                D:0.71
              </p>
              <p
                style={{
                  fontSize: "6px",
                  fontWeight: "700",
                  textAlign: "center",
                }}
              >
                S
              </p>
            </div>
          </div>
        </div>
      </div>
      <ReactToPrint
        trigger={() => <button>Print</button>}
        content={() => componentRef.current}
      /> */
}
