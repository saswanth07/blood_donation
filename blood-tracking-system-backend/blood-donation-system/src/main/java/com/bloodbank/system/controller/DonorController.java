package com.bloodbank.system.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bloodbank.system.dto.DonorDTO;
import com.bloodbank.system.service.DonorService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/donors")
public class DonorController {

    private final DonorService donorService;

    public DonorController(DonorService donorService) {
        this.donorService = donorService;
    }
    @PostMapping
    public DonorDTO create(@Valid @RequestBody DonorDTO donordto) {
        return donorService.createDonor(donordto);
    }

    @GetMapping
    public List<DonorDTO> getAll() {
        return donorService.getAllDonors();
    }

    @GetMapping("/{id}")
    public DonorDTO getById(@PathVariable Long id) {
        return donorService.getDonorById(id);
    }
    
    @GetMapping({"/profile", "/me"})
    public DonorDTO getProfile() {
        return donorService.mapToDTO(donorService.getLoggedInDonor());
    }
    
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> updateRequest) {
        try {
            donorService.updateDonorProfile(updateRequest);
            return ResponseEntity.ok("Profile updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating profile");
        }
    }
}
