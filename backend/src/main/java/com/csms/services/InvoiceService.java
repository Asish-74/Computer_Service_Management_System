package com.csms.services;

import java.util.Optional;

import com.csms.entity.Invoice;
import com.csms.entity.ServiceRequest;

public interface InvoiceService {

    Optional<Invoice> generateInvoice(
            ServiceRequest request);

    Optional<Invoice> getInvoice(
            Integer requestId);

}