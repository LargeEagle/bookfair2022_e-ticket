import * as XLSX from "xlsx/xlsx.mjs";
import canvasDatagrid from "canvas-datagrid";
import CryptoJS from "crypto-js";
import aesjs  from "aes-js"

export default function excuteSpreadsheet() {
  var spreadsheetUpload = document.getElementById("spreadsheetUpload");
  spreadsheetUpload.addEventListener("change", (e) => {

    handleSpreadsheetUpload(e.target.files[0]);
    spreadsheetUpload.disabled = true;
  });

  async function handleSpreadsheetUpload(spreadsheet) {
    //e.stopPropagation();
    //e.preventDefault();
    const f = spreadsheet;
    /* f is a File */
    const data = await f.arrayBuffer();
    /* data is an ArrayBuffer */
    const workbook = XLSX.read(data);
    // console.log(workbook);

    // var html = XLSX.utils.sheet_to_html(workbook.Sheets[0]);
    // var container = document.getElementById("speadsheetTable");
    // container.innerHTML = XLSX.utils.sheet_to_html(workbook.Sheets[0]);

    var grid = canvasDatagrid({
      parentNode: document.getElementById("spreadsheetContainer"),
      data: [],
    });

    var ws = workbook.Sheets[workbook.SheetNames[0]];
    grid.data = XLSX.utils.sheet_to_json(ws, { header: 1 });

    grid.style.height = "100%";
    grid.style.width = "100%";
    var range = XLSX.utils.decode_range(ws["!ref"]);

    //grid.data[0][1] = "new value!"
    var firstRowData = grid.data[0];
    var TicketTitle = "Ticket#";
    var encryptedTicketTitle = "Encrypted Ticket#"
    var ticketURLTitle = "Ticket URL"

    
    
    var generateButton = document.getElementById("generateButton");
    var LoadingGenerateButton = document.getElementById("LoadingGenerateButton")
    var encryptedTicketTextbox = document.getElementById("encryptedTicketTextbox");
    var ciphertext = "";
    // var secretKeyTextbox  = document.getElementById("secretKeyTextbox");
    var secretKey =  [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
    var targetLinkTextbox = document.getElementById("targetLinkTextbox")

    // secretKeyTextbox.addEventListener("keyup",()=>{
    //   secretKey = secretKeyTextbox.value;
    // })


    generateButton.addEventListener("click", () => {

      var ticketNumCol = findTitleCol(TicketTitle)
      var encryptedTicketNumCol = findTitleCol(encryptedTicketTitle)
      var ticketURLNumCol = findTitleCol(ticketURLTitle)
   
  
  
      function findTitleCol(targetTitle){
        var ColNum;
      firstRowData.forEach((title, index) => {
        if (title === targetTitle) ColNum =  index;
      });
      return ColNum
    }
  
  
    
      var tickets = [];
      var encryptedTicket = [];
      var TicketURL = [];
  
   
      grid.data.forEach((row) => {
        if (row[ticketNumCol] === TicketTitle) return;
        tickets.push(row[ticketNumCol]);
      });
  

      grid.data.forEach((row) => {
        if (row[ticketNumCol] === TicketTitle) return;
        encryptedTicket.push(Encryption(row[ticketNumCol].toString()));
      });

  

     grid.data.forEach((row,index)=>{
      if( grid.data[index][encryptedTicketNumCol] === encryptedTicketTitle) return
      grid.data[index][encryptedTicketNumCol] = encryptedTicket[index-1]

     })


     if(targetLinkTextbox.value ==="") return
     TicketURL = []

     encryptedTicket.forEach(encryptedValue=>{
      TicketURL.push(targetLinkTextbox.value+ encryptedValue)
     })

     grid.data.forEach((row,index)=>{
      if( grid.data[index][ticketURLNumCol] === ticketURLTitle) return
      grid.data[index][ticketURLNumCol] = TicketURL[index-1]


     })
     

    //  console.log("done")



    });


    var export_xlsx = (function() {
      function prep(arr) {
        var out = [];
        for(var i = 0; i < arr.length; ++i) {
          if(!arr[i]) continue;
          if(Array.isArray(arr[i])) { out[i] = arr[i]; continue };
          var o = new Array();
          Object.keys(arr[i]).forEach(function(k) { o[+k] = arr[i][k] });
          out[i] = o;
        }
        return out;
      }
    
      return function export_xlsx() {
        if(!grid) return;
        /* convert canvas-datagrid data to worksheet */
        var new_ws = XLSX.utils.aoa_to_sheet(prep(grid.data));
    
        /* build workbook */
        var new_wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(new_wb, new_ws, 'SheetJS');
    
        /* write file and trigger a download */
        XLSX.writeFile(new_wb, 'tickets.xlsx', {bookSST:true});


        var alertPlaceholder = document.getElementById('downloadExcelAlertPlaceholder')
        alert('Excel file has been downloaded to your local drive!', 'success')
      };
    })();


    var downloadExcelButton = document.getElementById("downloadExcelButton")
    downloadExcelButton.addEventListener("click",()=>{
      export_xlsx()
    })

    var decryptedTicketTextbox = document.getElementById("decryptedTicketTextbox");
    var decryptButton = document.getElementById("decryptButton");

    decryptButton.addEventListener("click", () => {
        Decrypton()
    });

    function Encryption(valutToEncrypt){
        //  console.log(valutToEncrypt, secretKey)
        // ciphertext = CryptoJS.AES.encrypt(valutToEncrypt, secretKey).toString();
        var textBytes = aesjs.utils.utf8.toBytes(valutToEncrypt);
        var aesCtr = new aesjs.ModeOfOperation.ctr(secretKey, new aesjs.Counter(5));
        var encryptedBytes = aesCtr.encrypt(textBytes);
        var ciphertext = aesjs.utils.hex.fromBytes(encryptedBytes);

        return ciphertext
    }

    function Decrypton(){
      // console.log(secretKey)
        // var bytes = CryptoJS.AES.decrypt(encryptedTicketTextbox.value, secretKey);
        // var originalText = bytes.toString(CryptoJS.enc.Utf8);
        var encryptedBytes = aesjs.utils.hex.toBytes(encryptedTicketTextbox.value);
        var aesCtr = new aesjs.ModeOfOperation.ctr(secretKey, new aesjs.Counter(5));
        var decryptedBytes = aesCtr.decrypt(encryptedBytes);
        var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);

        decryptedTicketTextbox.value = decryptedText     
    }

    var closeExcelButton = document.getElementById("closeExcelButton");
    closeExcelButton.addEventListener("click",()=>{

      grid.data=[];
      spreadsheetUpload.value ="";
      spreadsheetUpload.disabled = false;
      var excelPanel = document.querySelector("#spreadsheetContainer >*")
     if(!excelPanel) return
     excelPanel.remove()
    })



    
    function alert(message, type) {

      var alertPlaceholder = document.getElementById('downloadExcelAlertPlaceholder')
      var wrapper = document.createElement('div')
      wrapper.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
    
      alertPlaceholder.append(wrapper)
    }
    
    


    /* DO SOMETHING WITH workbook HERE */
  }

 

  
}
