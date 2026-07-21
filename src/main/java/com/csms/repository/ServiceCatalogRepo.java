package com.csms.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.csms.entity.ServiceCatalog;

public interface ServiceCatalogRepo extends JpaRepository<ServiceCatalog, Integer> {

    List<ServiceCatalog> findByActiveTrue();
    Optional<ServiceCatalog> findByServiceName(String serviceName);

}