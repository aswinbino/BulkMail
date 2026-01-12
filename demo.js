const fileIn = document.getElementById("fileIn");

fileIn.addEventListener("change", function (event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const emailList = XLSX.utils.sheet_to_json(worksheet);
    console.log(emailList);
  };

  reader.readAsArrayBuffer(file);
});


