package com.bloodbank.system.repository;

import com.bloodbank.system.entity.BloodRequest;
import com.bloodbank.system.entity.Donation;
import com.bloodbank.system.entity.Donor;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DonationRepository extends JpaRepository<Donation, Long> {

	

	
	
	List<Donation> findByDonor(Donor donor);
	
	List<Donation> findByStatus(com.bloodbank.system.enums.DonationStatus status);
	
	long countByDonorId(Long donorId);

    @Query("SELECT d.status, COUNT(d) FROM Donation d GROUP BY d.status")
    List<Object[]> countByStatus();

    @Query("""
        SELECT don.bloodGroup, COUNT(d)
        FROM Donation d
        JOIN d.donor don
        GROUP BY don.bloodGroup
    """)
    List<Object[]> countByBloodGroup();

	boolean existsByDonorAndBloodRequest(Donor donor, BloodRequest request);
}
