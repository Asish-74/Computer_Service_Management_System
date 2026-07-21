package com.csms.services;

import java.util.List;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.csms.dto.ServiceCatalogDto;
import com.csms.entity.ServiceCatalog;
import com.csms.repository.ServiceCatalogRepo;
import com.csms.exception.ResourceNotFoundException;

@Service
public class ServiceCatalogServiceImpl implements ServiceCatalogService {

    @Autowired
    private ServiceCatalogRepo repo;

    // =====================================
    // DTO -> Entity
    // =====================================

    private ServiceCatalog convert(ServiceCatalogDto dto) {

        ServiceCatalog service = new ServiceCatalog();

        service.setServiceName(dto.getServiceName());
        service.setCategory(dto.getCategory());
        service.setBasePrice(dto.getBasePrice());
        service.setActive(dto.getActive());
        service.setEstimatedDays(dto.getEstimatedDays());

        return service;
    }

    // =====================================
    // Entity -> DTO
    // =====================================

    private ServiceCatalogDto convert(ServiceCatalog service) {

        ServiceCatalogDto dto = new ServiceCatalogDto();

        dto.setId(service.getId());
        dto.setServiceName(service.getServiceName());
        dto.setCategory(service.getCategory());
        dto.setBasePrice(service.getBasePrice());
        dto.setActive(service.getActive());
        dto.setEstimatedDays(service.getEstimatedDays());

        return dto;
    }

    // =====================================
    // Add Service
    // =====================================

    @Override
    public Optional<ServiceCatalog> save(ServiceCatalogDto dto) {

        return Optional.of(
                repo.save(convert(dto)));
    }

    // =====================================
    // Update Service
    // =====================================

    @Override
    public Optional<ServiceCatalog> update(ServiceCatalogDto dto) {

        ServiceCatalog service = repo.findById(dto.getId())
                .orElseThrow(() ->
                new ResourceNotFoundException("Service Not Found"));
        Optional.ofNullable(dto.getServiceName())
                .filter(name -> !name.isBlank())
                .ifPresent(service::setServiceName);

        Optional.ofNullable(dto.getCategory())
                .filter(category -> !category.isBlank())
                .ifPresent(service::setCategory);

        Optional.ofNullable(dto.getBasePrice())
                .ifPresent(service::setBasePrice);

        Optional.ofNullable(dto.getActive())
                .ifPresent(service::setActive);

        Optional.ofNullable(dto.getEstimatedDays())
                .ifPresent(service::setEstimatedDays);

        return Optional.of(repo.save(service));
    }

    // =====================================
    // Delete Service
    // =====================================

    @Override
    public void delete(Integer id) {

        ServiceCatalog service = repo.findById(id)
                .orElseThrow(() ->
                new ResourceNotFoundException("Service Not Found"));

        repo.delete(service);
    }

    // =====================================
    // Get All Services
    // =====================================

    @Override
    public List<ServiceCatalog> getAllServices() {

        return repo.findAll();
    }

    // =====================================
    // Get Active Services
    // =====================================

    @Override
    public List<ServiceCatalog> getActiveServices() {

        return repo.findByActiveTrue();
    }

    // =====================================
    // Get Service By Id
    // =====================================

    @Override
    public Optional<ServiceCatalog> getServiceById(Integer id) {

        return repo.findById(id);
    }

}