package com.csms.invoice;

import java.io.File;
import java.io.FileOutputStream;

import org.springframework.stereotype.Component;

import com.csms.entity.Invoice;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;

@Component
public class InvoicePdfGenerator {

	public String generateInvoice(Invoice invoice)
	        throws Exception {

	    String folder = "invoices";

	    File directory = new File(folder);

	    if (!directory.exists()) {
	        directory.mkdirs();
	    }

	    String filePath =
	            folder + File.separator
	                    + invoice.getInvoiceNumber()
	                    + ".pdf";

	    Document document =
	            new Document(PageSize.A4,40,40,40,40);

	    PdfWriter.getInstance(
	            document,
	            new FileOutputStream(filePath));

	    document.open();

	    Font titleFont =
	            new Font(Font.FontFamily.HELVETICA,
	                    22,
	                    Font.BOLD,
	                    BaseColor.WHITE);

	    Font headingFont =
	            new Font(Font.FontFamily.HELVETICA,
	                    13,
	                    Font.BOLD);

	    Font normalFont =
	            new Font(Font.FontFamily.HELVETICA,
	                    11);

	    Font totalFont =
	            new Font(Font.FontFamily.HELVETICA,
	                    13,
	                    Font.BOLD,
	                    BaseColor.RED);

	    PdfPTable header =
	            new PdfPTable(1);

	    header.setWidthPercentage(100);

	    PdfPCell cell =
	            new PdfPCell(
	                    new Phrase(
	                            "COMPUTER SERVICE MANAGEMENT SYSTEM\nSERVICE INVOICE",
	                            titleFont));

	    cell.setHorizontalAlignment(Element.ALIGN_CENTER);
	    cell.setBackgroundColor(BaseColor.DARK_GRAY);
	    cell.setPadding(15);
	    cell.setBorder(Rectangle.NO_BORDER);

	    header.addCell(cell);

	    document.add(header);

	    document.add(new Paragraph(" "));

	    PdfPTable info =
	            new PdfPTable(2);

	    info.setWidthPercentage(100);

	    info.addCell("Invoice Number");
	    info.addCell(invoice.getInvoiceNumber());

	    info.addCell("Invoice Date");
	    info.addCell(invoice.getInvoiceDate().toString());

	    document.add(info);

	    document.add(new Paragraph(" "));

	    document.add(new Paragraph(
	            "Customer Details",
	            headingFont));

	    document.add(new Paragraph(
	            "Name : "
	                    + invoice.getServiceRequest()
	                    .getUser()
	                    .getName(),
	            normalFont));

	    document.add(new Paragraph(
	            "Email : "
	                    + invoice.getServiceRequest()
	                    .getUser()
	                    .getEmail(),
	            normalFont));

	    document.add(new Paragraph(" "));

	    document.add(new Paragraph(
	            "Device Details",
	            headingFont));

	    document.add(new Paragraph(
	            "Service : "
	                    + invoice.getServiceRequest()
	                    .getServiceType(),
	            normalFont));

	    document.add(new Paragraph(
	            "Brand : "
	                    + invoice.getServiceRequest()
	                    .getBrandName(),
	            normalFont));

	    document.add(new Paragraph(
	            "Model : "
	                    + invoice.getServiceRequest()
	                    .getModelNumber(),
	            normalFont));

	    document.add(new Paragraph(" "));

	    PdfPTable charges =
	            new PdfPTable(2);

	    charges.setWidthPercentage(100);
	    charges.addCell("Base Price");
	    charges.addCell("₹ " + invoice.getBasePrice());
	    charges.addCell("GST (10%)");
	    charges.addCell("₹ " + invoice.getGstAmount());

	    PdfPCell total1 =
	            new PdfPCell(
	                    new Phrase(
	                            "Grand Total",
	                            totalFont));

	    PdfPCell total2 =
	            new PdfPCell(
	                    new Phrase(
	                            "₹ " + invoice.getTotalAmount(),
	                            totalFont));

	    total1.setBackgroundColor(BaseColor.LIGHT_GRAY);
	    total2.setBackgroundColor(BaseColor.LIGHT_GRAY);

	    charges.addCell(total1);
	    charges.addCell(total2);
	    
	    document.add(charges);
	    document.add(new Paragraph(" "));
	    Paragraph thank =
	            new Paragraph(
	                    "Thank you for choosing Computer Service Management System.",
	                    headingFont);

	    thank.setAlignment(Element.ALIGN_CENTER);
	    document.add(thank);

	    Paragraph footer =
	            new Paragraph(
	                    "This is a computer generated invoice. No signature required.",
	                    normalFont);

	    footer.setAlignment(Element.ALIGN_CENTER);
	    document.add(footer);
	    document.close();
	    return filePath;
	}

}