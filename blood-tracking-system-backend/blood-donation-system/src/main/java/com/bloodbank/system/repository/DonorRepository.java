package com.bloodbank.system.repository;

import com.bloodbank.system.dto.DonorDTO;

import com.bloodbank.system.entity.Donor;
import com.bloodbank.system.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DonorRepository extends JpaRepository<Donor, Long> {

    List<Donor> findByBloodGroupAndCityAndActiveTrue(
            String bloodGroup,
            String city
    );

	List<DonorDTO> findByActiveTrue();

	Optional<Donor> findByUser(User user);
	
}
