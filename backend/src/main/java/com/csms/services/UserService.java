package com.csms.services;

import java.util.List;
import java.util.Optional;

import com.csms.dto.LoginResponseDto;
import com.csms.dto.ServiceRequestResponseDto;
import com.csms.dto.UserDashboardDto;
import com.csms.dto.UserDto;
import com.csms.dto.UserLoginDto;
import com.csms.dto.UserUpdateDto;
import com.csms.entity.User;

public interface UserService {

    Optional<User> save(UserDto dto);

//    Optional<User> login(UserLoginDto dto);
    Optional<LoginResponseDto> login(UserLoginDto dto);

//    List<ServiceRequestResponseDto> getMyRequests(Integer userId);
//
//    UserDashboardDto getDashboard(Integer userId);
//
//    Optional<User> updateProfile(Integer userId,
//                                 UserUpdateDto dto);
    List<ServiceRequestResponseDto> getMyRequests(String email);

    UserDashboardDto getDashboard(String email);

    Optional<User> updateProfile(String email, UserUpdateDto dto);

}