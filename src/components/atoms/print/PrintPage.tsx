import QRCode from "react-qr-code";
import "./print.css";
import Logo from "../../../assets/qr-logo.png";
import { GlobalDataContext } from "../../../context/settings/GlobalData";
import B2 from "../../../assets/b2.png";
import { numberContext } from "../../../context/settings/number-formatter";

const PrintPage = ({ item }: any) => {
  const { invoice_logo } = GlobalDataContext();
  const { formatGram, formatReyal } = numberContext();

  const totalDiamondWeight = item?.stonesDetails?.reduce(
    (acc: number, curr: any) => {
      return (acc += curr?.diamondWeight);
    },
    0
  );

  return (
    <>
      <div
        className={
          item?.classification_id == 1
            ? "container-print-gold"
            : "container-print-accessory"
        }
      >
        <div className="component">
          <div className="content-wrapper">
            <div className="grid-layout">
              <img src={invoice_logo?.QR_Code} alt="logo" className="img" />
              <QRCode
                className="img_qr"
                value={item?.hwya || 0}
                viewBox={`0 0 300 300`}
              />
              <p className="small-text">{item?.hwya}</p>
            </div>

            <div className="rotated-text">
              {/* {item?.classification_id == 1 && ( */}
              <p className="rotated-paragraph">
                G:
                <span className="paragraph_title">
                  {item?.classification_id != 1
                    ? item?.mezan_weight
                    : item?.weight}
                </span>
              </p>
              {/* )} */}
              <p className="rotated-paragraph">
                K:
                <span className="paragraph_title">
                  {item?.classification_id == 1
                    ? item?.karat_value || item?.karat_name
                    : item?.karatmineral_name || item?.karat_name}
                </span>
              </p>
              {item?.classification_id !== 1 && (
                <p className="rotated-paragraph">
                  D:
                  <span className="paragraph_title">
                    {item?.classification_id !== 1
                      ? formatGram(Number(totalDiamondWeight))
                      : 0}
                  </span>
                </p>
              )}
              <p className="rotated-paragraph">
                S:
                <span className="paragraph_title">
                  {formatGram(Number(item?.ahgar_weight))}
                </span>
              </p>
              {item?.classification_id != 1 && (
                <p className="rotated-paragraph">
                  {formatReyal(Number(item?.selling_price))}
                </p>
              )}
              {/* <p className="rotated-paragraph">
                O:<span className="paragraph_title">other</span>
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrintPage;
