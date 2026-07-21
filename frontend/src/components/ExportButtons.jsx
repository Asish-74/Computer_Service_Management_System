import {
  exportToExcel,
  exportToPDF,
} from "../utils/exportUtils";

import "../assets/css/components/exportButtons.css";

export default function ExportButtons({
  data = [],
  excelData = [],
  pdfColumns = [],
  pdfRows = [],
  fileName = "Report",
  title = "Report",
}) {

  return (

    <div className="export-buttons">

      <button
        className="excel-btn"
        onClick={() =>
          exportToExcel(
            excelData.length
              ? excelData
              : data,
            fileName
          )
        }
      >
        Export Excel
      </button>

      <button
        className="pdf-btn"
        onClick={() =>
          exportToPDF(
            pdfColumns,
            pdfRows.length
              ? pdfRows
              : data.map(Object.values),
            title,
            fileName
          )
        }
      >
        Export PDF
      </button>

    </div>

  );

}