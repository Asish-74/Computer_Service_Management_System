package com.csms.services;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.csms.entity.Invoice;
import com.csms.entity.ServiceRequest;
import com.csms.invoice.InvoicePdfGenerator;
import com.csms.repository.InvoiceRepo;

@Service
public class InvoiceServiceImpl implements InvoiceService {

    @Autowired
    private InvoiceRepo repo;
    
    @Autowired
    private InvoicePdfGenerator pdfGenerator;
    
    @Override
    public Optional<Invoice> generateInvoice(ServiceRequest request) {

        Optional<Invoice> existingInvoice =repo.findByServiceRequestRequestId(request.getRequestId());

        if (existingInvoice.isPresent()) {
            return existingInvoice;
        }
        Invoice invoice = new Invoice();
        invoice.setServiceRequest(request);
        invoice.setBasePrice(request.getBasePrice());
        invoice.setGstAmount(request.getGstAmount());
        invoice.setTotalAmount(request.getTotalAmount());
        invoice.setInvoiceDate(LocalDate.now());

        String invoiceNumber =
                "INV-"
                + LocalDate.now().format(
                        DateTimeFormatter.ofPattern(
                                "yyyyMMdd"))
                + "-"
                + String.format(
                        "%04d",
                        request.getRequestId());
        invoice.setInvoiceNumber(invoiceNumber);
        Invoice savedInvoice =repo.save(invoice);
        
        try {

            String pdfPath =
                    pdfGenerator.generateInvoice(savedInvoice);

            savedInvoice.setInvoiceFile(pdfPath);

            savedInvoice = repo.save(savedInvoice);

        } catch (Exception exception) {

            exception.printStackTrace();

        }

        return Optional.of(savedInvoice);
    } 

    @Override
    public Optional<Invoice> getInvoice(Integer requestId) {
        return repo.findByServiceRequestRequestId(requestId);

    }
}