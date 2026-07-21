package com.csms.services;

import java.util.List;

import com.csms.dto.ActivityLogDto;

public interface ActivityLogService {

    void saveActivity(String role,String userName, String email,String action,String details);
    List<ActivityLogDto> getAllActivities();

}