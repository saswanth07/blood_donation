package com.bloodbank.system.controller;

import com.bloodbank.system.dto.AuthResponseDTO;
import com.bloodbank.system.dto.LoginRequestDTO;
import com.bloodbank.system.dto.RegisterRequestDTO;
import com.bloodbank.system.entity.User;
import com.bloodbank.system.enums.Role;
import com.bloodbank.system.repository.UserRepository;
import com.bloodbank.system.security.JwtUtil;
import com.bloodbank.system.repository.HospitalRepository;
import com.bloodbank.system.repository.DonorRepository;
import com.bloodbank.system.entity.Hospital;
import com.bloodbank.system.entity.Donor;
import com.bloodbank.system.enums.HealthStatus;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final HospitalRepository hospitalRepository;
    private final DonorRepository donorRepository;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil,
                          HospitalRepository hospitalRepository,
                          DonorRepository donorRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.hospitalRepository = hospitalRepository;
        this.donorRepository = donorRepository;
    }

    // ================= REGISTER =================
    @PostMapping("/register")
    public String register(@RequestBody RegisterRequestDTO dto) {

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(Role.valueOf(dto.getRole().toUpperCase()));
        user.setActive(true);

        User savedUser = userRepository.save(user);

        // CREATE PROFILE BASED ON ROLE
        if (savedUser.getRole() == Role.HOSPITAL) {
            Hospital hospital = new Hospital();
            hospital.setUser(savedUser);
            // Use provided hospital name or fallback to username
            hospital.setHospitalName(dto.getFullName() != null && !dto.getFullName().isEmpty() 
                    ? dto.getFullName() : savedUser.getUsername());
            
            hospital.setCity(dto.getCity() != null ? dto.getCity() : "Unknown");
            hospital.setContactNumber(dto.getPhone() != null ? dto.getPhone() : "0000000000");
            hospitalRepository.save(hospital);
            
        } else if (savedUser.getRole() == Role.DONOR) {
            Donor donor = new Donor();
            donor.setUser(savedUser);
            // Use provided full name or fallback to username
            donor.setFullName(dto.getFullName() != null && !dto.getFullName().isEmpty() 
                    ? dto.getFullName() : savedUser.getUsername());
            
            donor.setBloodGroup(dto.getBloodGroup() != null ? dto.getBloodGroup() : "Unknown");
            donor.setCity(dto.getCity() != null ? dto.getCity() : "Unknown");
            donor.setPhone(dto.getPhone() != null ? dto.getPhone() : "0000000000");
            donor.setHealthStatus(HealthStatus.OK);
            donorRepository.save(donor);
        }

        return "User registered successfully";
    }

    // ================= LOGIN =================
    @PostMapping("/login")
    public AuthResponseDTO login(@RequestBody LoginRequestDTO dto) {

        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        
        String fullName = user.getUsername(); // Default fallback

        if (user.getRole() == Role.DONOR) {
            fullName = donorRepository.findByUser(user)
                    .map(Donor::getFullName)
                    .orElse(user.getUsername());
        } else if (user.getRole() == Role.HOSPITAL) {
            fullName = hospitalRepository.findByUser(user)
                    .map(Hospital::getHospitalName)
                    .orElse(user.getUsername());
        }

        String token = jwtUtil.generateToken(
                user.getId(),              
                user.getRole().name(),
                fullName
        );


        return new AuthResponseDTO(token,
        		user.getId(),
        		user.getRole().name(),
                fullName);
    }
}
