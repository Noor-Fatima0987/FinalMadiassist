import React, { createContext, useState } from "react";

// Context create
export const UserContext = createContext();
export const roleFields = {
  patient: ["fullName", "userName", "email", "phone", "age", "history"],
  doctor: ["fullName", "email", "phone", "specialization", "qualification"],
};


// Provider component
export const UserProvider = ({ children }) => {
  // store all user info in one object
  const [user, setUser] = useState({
    fullName: "",
    userName: "",
    gender: "",
    role: "",
    cnic: "",
    contactNumber: "",
    address: "",
    password: "",
    specialization: "",
    licenseNo: "",
    age: "",
    medicalHistory: "",
  });

  const [appointments, setAppointments] = useState([
    {
      id: "101",
      doctorName: "Dr. Ahmed Khan",
      doctorSpecialization: "Cardiologist",
      date: "2025-12-20",
      time: "10:30 AM",
      status: "Completed",
      patientName: "M. Ahmed",
      patientAge: "45",
      patientContact: "0312-4455667"
    },
    {
      id: "102",
      doctorName: "Dr. Ahmed Khan",
      doctorSpecialization: "Cardiologist",
      date: new Date().toISOString().split('T')[0],
      time: "11:45 AM",
      status: "Scheduled",
      patientName: "Ali Raza",
      patientAge: "28",
      patientContact: "0300-1234567"
    },
    {
      id: "103",
      doctorName: "Dr. Sarah Sheikh",
      doctorSpecialization: "Dermatologist",
      date: "2026-01-05",
      time: "02:15 PM",
      status: "Scheduled",
      patientName: "Zoya Ahmed",
      patientAge: "24",
      patientContact: "0321-7654321"
    }
  ]);
  const [medications, setMedications] = useState([
    {
      id: "1",
      name: "Paracetamol",
      dosage: "1 Tablet",
      instructions: "After meal",
      duration: "5 days",
      times: ["08:00", "14:00", "21:00"], // 24-hour format
      startDate: new Date().toISOString().split("T")[0],
      active: true,
    },
    {
      id: "2",
      name: "Vitamin C",
      dosage: "2 Capsules",
      instructions: "With water",
      duration: "30 days",
      times: ["09:00"],
      startDate: new Date().toISOString().split("T")[0],
      active: true,
    },
    {
      id: "3",
      name: "Ibuprofen",
      dosage: "1 Tablet",
      instructions: "If pain persists",
      duration: "3 days",
      times: ["22:00"],
      startDate: new Date().toISOString().split("T")[0],
      active: true,
    },
  ]);

  const [prescriptions, setPrescriptions] = useState([
    {
      id: "p1",
      doctorName: "Dr. Ahmed Khan",
      patientName: "M. Ahmed",
      date: new Date().toISOString().split("T")[0],
      medications: [
        {
          name: "Paracetamol",
          dosage: "1 Tablet",
          instructions: "After meal",
          duration: "5 days",
          times: ["08:00", "14:00", "21:00"]
        },
        {
          name: "Vitamin C",
          dosage: "2 Capsules",
          instructions: "With water",
          duration: "30 days",
          times: ["09:00"]
        }
      ]
    }
  ]);

  // Doctors state - stores all registered doctors
  const [doctors, setDoctors] = useState([
    {
      id: "1",
      fullName: "Dr. Ayesha Khan",
      specialization: "Cardiologist",
      licenseNo: "MED-12345",
      contactNumber: "+92 300 4567890",
      email: "ayesha.khan@mediassist.com",
      experience: "10 years",
      location: "Lahore, Pakistan",
      availableTime: "Mon - Fri | 9:00 AM - 4:00 PM"
    },
    {
      id: "2",
      fullName: "Dr. Ahmed Khan",
      specialization: "Cardiologist",
      licenseNo: "MED-54321",
      contactNumber: "+92 333 9876543",
      email: "ahmed.khan@mediassist.com",
      experience: "8 years",
      location: "Karachi, Pakistan",
      availableTime: "Tue - Sat | 10:00 AM - 6:00 PM"
    }
  ]);

  const saveUser = (userData) => {
    setUser(userData);
  };

  const updateUser = (field, value) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const addAppointment = (appointment) => {
    setAppointments((prev) => [...prev, appointment]);
  };

  const addMedication = (medication) => {
    setMedications((prev) => [...prev, medication]);
  };

  const addPrescription = (prescription) => {
    setPrescriptions((prev) => [...prev, prescription]);
  };

  const addDoctor = (doctor) => {
    setDoctors((prev) => [...prev, doctor]);
  };

  const logout = () => {
    setUser({
      fullName: "",
      userName: "",
      gender: "",
      role: "",
      cnic: "",
      contactNumber: "",
      address: "",
      password: "",
      specialization: "",
      licenseNo: "",
      age: "",
      medicalHistory: "",
    });
    // setAppointments([]); // Modified: Persist appointments for demo flow
    setMedications([]);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        appointments,
        medications,
        prescriptions,
        doctors,
        saveUser,
        updateUser,
        addAppointment,
        addMedication,
        addPrescription,
        addDoctor,
        setMedications,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
