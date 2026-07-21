package com.csms.controller;

import java.time.LocalDate;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.csms.responsestructure.ResponseStructure;
import com.csms.services.FileStorageService;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/profile")
    public ResponseEntity<ResponseStructure<Map<String, String>>> uploadProfilePhoto(
            @RequestParam("file") MultipartFile file) {

        String fileName = fileStorageService.uploadProfilePhoto(file);

        ResponseStructure<Map<String, String>> response =
                new ResponseStructure<>();

        response.setStatuscode(HttpStatus.OK.value());
        response.setMsg("Profile Photo Uploaded Successfully");
        response.setData(Map.of("fileName", fileName));
        response.setTimedate(LocalDate.now());

        return ResponseEntity.ok(response);
    }
}