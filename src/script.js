import "./style.css";
import * as bootstrap from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import QRCode from "qrcode";

import excuteSpreadsheet from "./spreadsheet.js"

// QRCode.toFile("QRcode.png", [
//   { data: new Uint8ClampedArray([253, 254, 255]), mode: "byte" },
// ]);

var inputCode = document.getElementById("originalCode");
var canvas = document.getElementById("canvas");

inputCode.addEventListener("keyup", (e) => {
  if (inputCode.value == "") return;
  genreateQRcode(inputCode.value);
});

function genreateQRcode(inputString) {
  QRCode.toCanvas(canvas, inputString, { width: 500 }, function (error) {
    if (error) console.error(error);
    console.log("success!");
  });
}

 excuteSpreadsheet()



