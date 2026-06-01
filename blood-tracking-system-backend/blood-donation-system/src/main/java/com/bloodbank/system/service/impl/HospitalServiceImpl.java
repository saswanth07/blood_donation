package com.bloodbank.system.service.impl;

import com.bloodbank.system.entity.Hospital;
import com.bloodbank.system.repository.HospitalRepository;
import com.bloodbank.system.service.HospitalService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HospitalServiceImpl implements HospitalService {

    private final HospitalRepository hospitalRepository;

    public HospitalServiceImpl(HospitalRepository hospitalRepository) {
        this.hospitalRepository = hospitalRepository;
    }

    @Override
    public Hospital create(Hospital hospital) {
        return hospitalRepository.save(hospital);
    }

    @Override
    public Hospital getById(Long id) {
        return hospitalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hospital not found"));
    }

    @Override
    public List<Hospital> getAll() {
        return hospitalRepository.findAll();
    }

    @Override
    public Hospital update(Long id, Hospital updated) {
        Hospital hospital = getById(id);
        hospital.setHospitalName(updated.getHospitalName());
        hospital.setCity(updated.getCity());
        hospital.setContactNumber(updated.getContactNumber());
        return hospitalRepository.save(hospital);
    }

    @Override
    public void delete(Long id) {
        hospitalRepository.deleteById(id);
    }
}
