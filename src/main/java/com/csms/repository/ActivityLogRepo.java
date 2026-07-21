package com.csms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.csms.entity.ActivityLog;

public interface ActivityLogRepo extends JpaRepository<ActivityLog, Integer> {

    List<ActivityLog> findAllByOrderByActivityTimeDesc();

}