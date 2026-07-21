package com.csms.services;

import java.util.List;
import java.util.Optional;

import com.csms.dto.ServiceCatalogDto;
import com.csms.entity.ServiceCatalog;

public interface ServiceCatalogService {

    // Admin
    Optional<ServiceCatalog> save(ServiceCatalogDto dto);

    Optional<ServiceCatalog> update(ServiceCatalogDto dto);

    void delete(Integer id);

    // Admin & User
    List<ServiceCatalog> getAllServices();

    // User
    List<ServiceCatalog> getActiveServices();

    Optional<ServiceCatalog> getServiceById(Integer id);

}