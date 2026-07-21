package com.csms.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.csms.dto.ActivityLogDto;
import com.csms.responsestructure.ResponseStructure;
import com.csms.services.ActivityLogService;

@RestController
public class ActivityLogController {

    @Autowired
    private ActivityLogService activityLogService;

    @GetMapping("/api/admin/activity-logs")
    public ResponseEntity<ResponseStructure<List<ActivityLogDto>>> getAllActivities() {

        ResponseStructure<List<ActivityLogDto>> response =
                new ResponseStructure<>();

        response.setStatuscode(HttpStatus.OK.value());
        response.setMsg("Activity Logs Retrieved Successfully");
        response.setData(activityLogService.getAllActivities());
        response.setTimedate(LocalDate.now());

        return ResponseEntity.ok(response);
    }
}