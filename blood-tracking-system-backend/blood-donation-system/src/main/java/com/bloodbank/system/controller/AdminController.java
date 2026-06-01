package com.bloodbank.system.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bloodbank.system.dto.BloodRequestDTO;
import com.bloodbank.system.dto.UserResponseDTO;
import com.bloodbank.system.entity.BloodRequest;
import com.bloodbank.system.entity.Donor;
import com.bloodbank.system.entity.Hospital;
import com.bloodbank.system.entity.User;
import com.bloodbank.system.enums.RequestStatus;
import com.bloodbank.system.repository.UserRepository;
import com.bloodbank.system.repository.DonorRepository;
import com.bloodbank.system.repository.HospitalRepository;
import com.bloodbank.system.repository.BloodRequestRepository;
import com.bloodbank.system.repository.DonationRepository;
import com.bloodbank.system.service.BloodRequestService;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final DonorRepository donorRepository;
    private final HospitalRepository hospitalRepository;
    private final BloodRequestRepository bloodRequestRepository;
    private final DonationRepository donationRepository;
    private final BloodRequestService bloodRequestService;
    
    public AdminController(UserRepository userRepository,DonorRepository donorRepository,
    		HospitalRepository hospitalRepository,BloodRequestRepository bloodRequestRepository,
    		 DonationRepository donationRepository,BloodRequestService bloodRequestService) {
    	this.userRepository=userRepository;
    	this.donorRepository=donorRepository;
    	this.hospitalRepository = hospitalRepository;
    	this.bloodRequestRepository=bloodRequestRepository;
    	this.donationRepository=donationRepository;
    	this.bloodRequestService=bloodRequestService;
    	
    }

    // ========== DASHBOARD STATISTICS ==========
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalUsers", userRepository.count());
        stats.put("totalDonors", donorRepository.count());
        stats.put("totalHospitals", hospitalRepository.count());
        stats.put("totalRequests", bloodRequestRepository.count());
        stats.put("totalDonations", donationRepository.count());
        stats.put("activeRequests", bloodRequestRepository.countByStatus(RequestStatus.OPEN));
        
        return ResponseEntity.ok(stats);
    }

    // ========== USER MANAGEMENT ==========
    @GetMapping("/users")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<UserResponseDTO> users = userRepository.findAll()
            .stream()
            .map(user -> new UserResponseDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name(),
                user.isActive()
            ))
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(users);
    }

    @PatchMapping("/users/{id}/activate")
    public ResponseEntity<Map<String, String>> activateUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setActive(true);
        userRepository.save(user);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "User activated successfully");
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/users/{id}/deactivate")
    public ResponseEntity<Map<String, String>> deactivateUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setActive(false);
        userRepository.save(user);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "User deactivated successfully");
        return ResponseEntity.ok(response);
    }

    // ========== DONOR MANAGEMENT ==========
    @GetMapping("/donors")
    public ResponseEntity<List<Map<String, Object>>> getAllDonors() {
        List<Map<String, Object>> donors = donorRepository.findAll()
            .stream()
            .map(donor -> {
                Map<String, Object> donorData = new HashMap<>();
                donorData.put("id", donor.getId());
                donorData.put("name", donor.getFullName());
                donorData.put("bloodGroup", donor.getBloodGroup());
                donorData.put("city", donor.getCity());
                donorData.put("phone", donor.getPhone());
                donorData.put("active", donor.isActive());
                donorData.put("healthStatus", donor.getHealthStatus());
                donorData.put("lastDonationDate", donor.getLastDonationDate());
                return donorData;
            })
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(donors);
    }

    @PatchMapping("/donors/{id}/disable")
    public ResponseEntity<Map<String, String>> disableDonor(@PathVariable Long id) {
        Donor donor = donorRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Donor not found"));
        
        donor.setActive(false);
        donorRepository.save(donor);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Donor disabled successfully");
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/donors/{id}/enable")
    public ResponseEntity<Map<String, String>> enableDonor(@PathVariable Long id) {
        Donor donor = donorRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Donor not found"));
        
        donor.setActive(true);
        donorRepository.save(donor);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Donor enabled successfully");
        return ResponseEntity.ok(response);
    }

    // ========== HOSPITAL MANAGEMENT ==========
    @GetMapping("/hospitals")
    public ResponseEntity<List<Map<String, Object>>> getAllHospitals() {
        List<Map<String, Object>> hospitals = hospitalRepository.findAll()
            .stream()
            .map(hospital -> {
                Map<String, Object> hospitalData = new HashMap<>();
                hospitalData.put("id", hospital.getId());
                hospitalData.put("name", hospital.getHospitalName());
                hospitalData.put("city", hospital.getCity());
                hospitalData.put("contactNumber", hospital.getContactNumber());
                hospitalData.put("userId", hospital.getUser() != null ? hospital.getUser().getId() : null);
                hospitalData.put("active", hospital.getUser() != null ? hospital.getUser().isActive() : false);
                return hospitalData;
            })
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(hospitals);
    }

    @PatchMapping("/hospitals/{id}/activate")
    public ResponseEntity<Map<String, String>> activateHospital(@PathVariable Long id) {
        Hospital hospital = hospitalRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Hospital not found"));
        
        // Activate the associated user
        if (hospital.getUser() != null) {
            hospital.getUser().setActive(true);
            userRepository.save(hospital.getUser());
        }
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hospital activated successfully");
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/hospitals/{id}/deactivate")
    public ResponseEntity<Map<String, String>> deactivateHospital(@PathVariable Long id) {
        Hospital hospital = hospitalRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Hospital not found"));
        
        // Deactivate the associated user
        if (hospital.getUser() != null) {
            hospital.getUser().setActive(false);
            userRepository.save(hospital.getUser());
        }
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hospital deactivated successfully");
        return ResponseEntity.ok(response);
    }

    // ========== BLOOD REQUEST MANAGEMENT ==========
    @GetMapping("/requests")
    public ResponseEntity<List<BloodRequestDTO>> getAllRequests() {
        return ResponseEntity.ok(bloodRequestService.getAllRequests());
    }

    @PatchMapping("/requests/{id}/close")
    public ResponseEntity<Map<String, String>> closeRequest(@PathVariable Long id) {
        BloodRequest request = bloodRequestRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Blood request not found"));
        
        request.setStatus(RequestStatus.CLOSED);
        bloodRequestRepository.save(request);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Request closed successfully");
        return ResponseEntity.ok(response);
    }

    // ========== DONATION MANAGEMENT ==========
    @GetMapping("/donations")
    public ResponseEntity<List<Map<String, Object>>> getAllDonations() {
        List<Map<String, Object>> donations = donationRepository.findAll()
            .stream()
            .map(donation -> {
                Map<String, Object> donationData = new HashMap<>();
                donationData.put("id", donation.getId());
                donationData.put("donorId", donation.getDonor().getId());
                donationData.put("donorName", donation.getDonor().getFullName());
                donationData.put("requestId", donation.getBloodRequest().getId());
                donationData.put("status", donation.getStatus());
                donationData.put("bloodGroup", donation.getDonor().getBloodGroup());
                return donationData;
            })
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(donations);
    }
}
