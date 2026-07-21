package com.csms.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.csms.dto.ActivityLogDto;
import com.csms.entity.ActivityLog;
import com.csms.repository.ActivityLogRepo;
@Service
public class ActivityLogServiceImpl
        implements ActivityLogService {

    @Autowired
    private ActivityLogRepo repo;

    @Override
    public void saveActivity(
            String role,
            String userName,
            String email,
            String action,
            String details) {

        ActivityLog log = new ActivityLog();

        log.setRole(role);
        log.setUserName(userName);
        log.setUserEmail(email);
        log.setAction(action);
        log.setDetails(details);
        log.setActivityTime(LocalDateTime.now());

        repo.save(log);
    }

    @Override
    public List<ActivityLogDto> getAllActivities() {

        return repo.findAllByOrderByActivityTimeDesc()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

    }

    private ActivityLogDto convertToDto(ActivityLog log) {

        ActivityLogDto dto = new ActivityLogDto();

        dto.setId(log.getId());
        dto.setRole(log.getRole());
        dto.setUserName(log.getUserName());
        dto.setUserEmail(log.getUserEmail());
        dto.setAction(log.getAction());
        dto.setDetails(log.getDetails());
        dto.setActivityTime(log.getActivityTime());

        return dto;

    }

}