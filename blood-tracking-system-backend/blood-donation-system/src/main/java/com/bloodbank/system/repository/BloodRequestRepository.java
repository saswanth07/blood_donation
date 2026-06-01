package com.bloodbank.system.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bloodbank.system.entity.BloodRequest;
import com.bloodbank.system.enums.RequestStatus;

public interface BloodRequestRepository extends JpaRepository<BloodRequest, Long> {


    List<BloodRequest> findByStatus(RequestStatus status);
    
    long countByStatus(RequestStatus status);
}
