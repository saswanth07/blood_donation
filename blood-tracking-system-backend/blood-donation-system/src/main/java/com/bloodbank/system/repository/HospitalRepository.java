package com.bloodbank.system.repository;

import com.bloodbank.system.entity.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HospitalRepository extends JpaRepository<Hospital, Long> {
    java.util.Optional<Hospital> findByUser(com.bloodbank.system.entity.User user);
}
