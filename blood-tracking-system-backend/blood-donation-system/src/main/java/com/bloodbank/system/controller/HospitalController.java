package com.bloodbank.system.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bloodbank.system.entity.Hospital;
import com.bloodbank.system.service.HospitalService;


@RestController
@RequestMapping("/api/hospitals")
public class HospitalController {

    private final HospitalService hospitalService;

    public HospitalController(HospitalService hospitalService) {
        this.hospitalService = hospitalService;
    }

    @PostMapping
    public Hospital create(@RequestBody Hospital hospital) {
        return hospitalService.create(hospital);
    }

    @GetMapping
    public List<Hospital> getAll() {
        return hospitalService.getAll();
    }

    @GetMapping("/{id}")
    public Hospital getById(@PathVariable Long id) {
        return hospitalService.getById(id);
    }

    @PutMapping("/{id}")
    public Hospital update(@PathVariable Long id,
                           @RequestBody Hospital hospital) {
        return hospitalService.update(id, hospital);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        hospitalService.delete(id);
        return "Hospital deleted";
    }
}
