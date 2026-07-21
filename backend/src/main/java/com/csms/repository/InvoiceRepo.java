package com.csms.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.csms.entity.Invoice;

public interface InvoiceRepo
        extends JpaRepository<Invoice, Integer> {

    Optional<Invoice> findByServiceRequestRequestId(
            Integer requestId);

}