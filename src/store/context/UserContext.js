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
        saveUser,
        updateUser,
        addAppointment,
        addMedication,
        setMedications,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
