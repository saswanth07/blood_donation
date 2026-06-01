package com.bloodbank.system.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bloodbank.system.dto.BloodRequestDTO;
import com.bloodbank.system.dto.DonorDTO;
import com.bloodbank.system.entity.BloodRequest;
import com.bloodbank.system.service.BloodRequestService;

import jakarta.validation.Valid;



@RestController
@RequestMapping("/api/hospital/requests")
public class BloodRequestController {

    private final BloodRequestService bloodRequestService;

    public BloodRequestController(BloodRequestService bloodRequestService) {
        this.bloodRequestService = bloodRequestService;
    }
    
    @PreAuthorize("hasRole('HOSPITAL')")
    @PostMapping
    public BloodRequest create(@Valid @RequestBody BloodRequest request, java.security.Principal principal) {
        return bloodRequestService.createRequest(request, principal.getName());
    }

    
    @PreAuthorize("hasAnyRole('HOSPITAL', 'DONOR')")
    @GetMapping("/allrequest")
    public List<BloodRequestDTO> getAll() {
        return bloodRequestService.getAllRequests();
    }

    @PreAuthorize("hasRole('HOSPITAL')")
    @GetMapping("/{id}/eligible-donors")
    public List<DonorDTO> getEligibleDonors(
            @PathVariable("id") Long requestId) {

        return bloodRequestService.getEligibleDonors(requestId);
    }
    
    
    @DeleteMapping("/{id}")
    public void deleteRequest(@PathVariable Long id) {
        bloodRequestService.deleteRequest(id);
    }

   
}

