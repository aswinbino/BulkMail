import { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

function App() {
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState(false);
  const [emailList, setEmailList] = useState([]);

  function handleMsg(e) {
    setMsg(e.target.value);
  }

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".xlsx")) {
      alert("Please upload an Excel (.xlsx) file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      
      const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const emails = rows
        .map(row => row[0])
        .filter(email => typeof email === "string" && email.includes("@"));

      setEmailList(emails);
    };

    reader.readAsArrayBuffer(file);
  }

  function send() {
    if (!msg || emailList.length === 0) {
      alert("Message or email list missing");
      return;
    }

    setStatus(true);

    axios
      .post("http://localhost:5000/sendmail", { msg, emailList })
      .then(() => {
        alert("Emails sent successfully");
        setStatus(false);
      })
      .catch(() => {
        alert("Failed to send emails");
        setStatus(false);
      });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-100 to-blue-100 p-6">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-lg p-6 space-y-5 text-center">

        <h1 className="text-3xl font-bold text-blue-700">BulkMail</h1>

        <p className="text-blue-600">
          Send multiple emails at once using Excel files
        </p>

        <textarea
          value={msg}
          onChange={handleMsg}
          placeholder="Enter your email message..."
          className="w-full h-32 p-3 border-2 border-blue-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-700"
        />

        <input
          type="file"
          accept=".xlsx"
          onChange={handleFile}
          className="w-full border-2 border-dashed border-blue-600 rounded-lg p-3 cursor-pointer bg-blue-50 hover:bg-blue-100"
        />

        <p className="font-medium text-blue-700">
          Total Emails: {emailList.length}
        </p>

        <button
          onClick={send}
          disabled={status}
          className={`w-full py-3 rounded-full text-white font-bold transition
            ${status
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-blue-800 hover:-translate-y-0.5 hover:shadow-lg"
            }`}
        >
          {status ? "Sending..." : "Send Emails"}
        </button>
      </div>
    </div>
  );
}

export default App;
