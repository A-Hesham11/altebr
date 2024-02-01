import QRCode from "react-qr-code";
type QRCodeGen_TP = {
    value: any
    ref:any
}
const QRCodeGen = ({ value }: QRCodeGen_TP) => {
    return (
        <div style={{ height: "auto", margin: "0 auto", maxWidth: 64, width: "100%" }}>
            <QRCode
                size={300}
                style={{ height: "auto", maxWidth: "150%", width: "150%" }}
                value={value}
                viewBox={`0 0 300 300`}
            />
        </div>
    )
}

export default QRCodeGen