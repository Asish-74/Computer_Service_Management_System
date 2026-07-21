package com.csms.controller;

import java.io.File;
import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.csms.dto.InvoiceDto;
import com.csms.entity.Invoice;
import com.csms.responsestructure.ResponseStructure;
import com.csms.services.InvoiceService;

@RestController
@RequestMapping("/api/invoice")
public class InvoiceController {

    @Autowired
    private InvoiceService service;

    private InvoiceDto convert(Invoice invoice) {

        InvoiceDto dto = new InvoiceDto();

        dto.setInvoiceId(invoice.getInvoiceId());
        dto.setInvoiceNumber(invoice.getInvoiceNumber());
        dto.setInvoiceDate(invoice.getInvoiceDate());

        dto.setBasePrice(invoice.getBasePrice());
        dto.setGstAmount(invoice.getGstAmount());
        dto.setTotalAmount(invoice.getTotalAmount());

        dto.setCustomerName(
                invoice.getServiceRequest()
                        .getUser()
                        .getName());

        dto.setCustomerEmail(
                invoice.getServiceRequest()
                        .getUser()
                        .getEmail());

        dto.setServiceType(
                invoice.getServiceRequest()
                        .getServiceType());

        dto.setBrandName(
                invoice.getServiceRequest()
                        .getBrandName());

        dto.setModelNumber(
                invoice.getServiceRequest()
                        .getModelNumber());

        return dto;
    }

    // ==========================================
    // Get Invoice
    // ==========================================

    @GetMapping("/{requestId}")
    public ResponseEntity<ResponseStructure<InvoiceDto>> getInvoice(
            @PathVariable Integer requestId) {

        Invoice invoice = service.getInvoice(requestId).get();

        ResponseStructure<InvoiceDto> response =
                new ResponseStructure<>();

        response.setStatuscode(HttpStatus.OK.value());
        response.setMsg("Invoice Fetched Successfully");
        response.setData(convert(invoice));
        response.setTimedate(LocalDate.now());

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // Download Invoice
    // ==========================================

    @GetMapping("/download/{requestId}")
    public ResponseEntity<Resource> downloadInvoice(
            @PathVariable Integer requestId) throws Exception {

        Invoice invoice = service.getInvoice(requestId).get();

        File file = new File(invoice.getInvoiceFile());

        Resource resource = new UrlResource(file.toURI());

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=" + file.getName())
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }

}