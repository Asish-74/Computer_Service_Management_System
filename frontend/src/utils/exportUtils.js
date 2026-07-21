import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportToExcel = (
  data,
  fileName
) => {

  const worksheet =
    XLSX.utils.json_to_sheet(data);

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Sheet1"
  );

  const excelBuffer =
    XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

  const file =
    new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

  saveAs(file, `${fileName}.xlsx`);
};

export const exportToPDF = (
  columns,
  rows,
  title,
  fileName
) => {

  const doc = new jsPDF();

  doc.setFontSize(18);

  doc.text(title, 14, 18);

  autoTable(doc, {
    head: [columns],
    body: rows,
    startY: 28,
  });

  doc.save(`${fileName}.pdf`);
};