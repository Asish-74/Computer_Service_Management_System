package com.csms.services;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

    String uploadProfilePhoto(MultipartFile file);

    void deleteProfilePhoto(String fileName);

}
