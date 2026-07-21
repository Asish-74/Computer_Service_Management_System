package com.csms.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.csms.exception.BadRequestException;

@Service
public class FileStorageServiceImpl
        implements FileStorageService {

    private final Path uploadPath =
            Paths.get("uploads/profile");

    @Override
    public String uploadProfilePhoto(MultipartFile file) {

        try {
            Files.createDirectories(uploadPath);
            
            String originalName =
                    Optional.ofNullable(file.getOriginalFilename())
                            .orElse("image");

            String extension =
                    originalName.substring(
                            originalName.lastIndexOf("."));

            String fileName =
                    UUID.randomUUID() + extension;

            Files.copy(
                    file.getInputStream(),
                    uploadPath.resolve(fileName),
                    StandardCopyOption.REPLACE_EXISTING);

            return fileName;

        } catch (IOException exception) {

        	throw new BadRequestException("Unable to upload image.");

        }

    }

    @Override
    public void deleteProfilePhoto(String fileName) {

        try {
            Optional.ofNullable(fileName)
                    .filter(name -> !name.isBlank())
                    .ifPresent(name -> {
                        try {
                            Files.deleteIfExists(
                                    uploadPath.resolve(name));
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    });
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

}
