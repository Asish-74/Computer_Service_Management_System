package com.csms.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.csms.dto.ServiceCatalogDto;
import com.csms.entity.ServiceCatalog;
import com.csms.responsestructure.ResponseStructure;
import com.csms.services.ServiceCatalogService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/services")
public class ServiceCatalogController {

    @Autowired
    private ServiceCatalogService service;

    // ==========================================
    // Admin - Add Service
    // ==========================================

    @PostMapping
    public ResponseEntity<ResponseStructure<ServiceCatalog>> save(
            @Valid @RequestBody ServiceCatalogDto dto) {

        ServiceCatalog serviceCatalog = service.save(dto).get();

        ResponseStructure<ServiceCatalog> response =
                new ResponseStructure<>();

        response.setStatuscode(HttpStatus.CREATED.value());
        response.setMsg("Service Added Successfully");
        response.setData(serviceCatalog);
        response.setTimedate(LocalDate.now());

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // ==========================================
    // Admin - Update Service
    // ==========================================

    @PutMapping
    public ResponseEntity<ResponseStructure<ServiceCatalog>> update(
            @Valid @RequestBody ServiceCatalogDto dto) {

        ServiceCatalog serviceCatalog = service.update(dto).get();

        ResponseStructure<ServiceCatalog> response =
                new ResponseStructure<>();

        response.setStatuscode(HttpStatus.OK.value());
        response.setMsg("Service Updated Successfully");
        response.setData(serviceCatalog);
        response.setTimedate(LocalDate.now());

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // Admin - Delete Service
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseStructure<String>> delete(
            @PathVariable Integer id) {

        service.delete(id);

        ResponseStructure<String> response =
                new ResponseStructure<>();

        response.setStatuscode(HttpStatus.OK.value());
        response.setMsg("Service Deleted Successfully");
        response.setData("Deleted Successfully");
        response.setTimedate(LocalDate.now());

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // Admin - Get All Services
    // ==========================================

    @GetMapping("/all")
    public ResponseEntity<ResponseStructure<List<ServiceCatalog>>> getAllServices() {

        List<ServiceCatalog> services = service.getAllServices();

        ResponseStructure<List<ServiceCatalog>> response =
                new ResponseStructure<>();

        response.setStatuscode(HttpStatus.OK.value());
        response.setMsg("All Services Fetched Successfully");
        response.setData(services);
        response.setTimedate(LocalDate.now());

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // User - Get Active Services
    // ==========================================

    @GetMapping("/active")
    public ResponseEntity<ResponseStructure<List<ServiceCatalog>>> getActiveServices() {

        List<ServiceCatalog> services = service.getActiveServices();

        ResponseStructure<List<ServiceCatalog>> response =
                new ResponseStructure<>();

        response.setStatuscode(HttpStatus.OK.value());
        response.setMsg("Services Fetched Successfully");
        response.setData(services);
        response.setTimedate(LocalDate.now());

        return ResponseEntity.ok(response);
    }

}