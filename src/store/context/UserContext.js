import React, { createContext, useState, useEffect } from "react";
import { auth } from "../../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

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

  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const BACKEND_URL = "https://mediassist-rho.vercel.app";

  // Auto-login logic (Session Persistence)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch user details from our PostgreSQL backend using firebase ID
          const response = await fetch(`${BACKEND_URL}/api/user/${firebaseUser.uid}`);
          const userData = await response.json();
          if (response.ok && userData) {
            setUser({
              ...userData,
              password: "" // Don't store password in context
            });
          }
        } catch (error) {
          console.error("Auto-login error:", error);
        } finally {
          setIsAuthLoading(false);
        }
      } else {
        // User is logged out
        setUser({ fullName: "", role: "" }); // Reset state
        setIsAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

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
      workingDays: [1, 2, 3, 4, 5],
      workingHoursStart: "9:00 AM",
      workingHoursEnd: "4:00 PM",
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
      workingDays: [2, 3, 4, 5, 6],
      workingHoursStart: "10:00 AM",
      workingHoursEnd: "6:00 PM",
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

    // Auto-sync medications for the patient (for local demo simulation)
    // In a real app, this would happen via backend/websocket
    if (prescription.medications && prescription.medications.length > 0) {
      const newMedications = prescription.medications.map(med => ({
        id: Math.random().toString(36).substr(2, 9),
        ...med,
        startDate: prescription.date,
        active: true,
        patientName: prescription.patientName // associate for auditing
      }));
      setMedications((prev) => [...prev, ...newMedications]);
    }
  };

  const addDoctor = (doctor) => {
    setDoctors((prev) => [...prev, doctor]);
  };

  const logout = async () => {
    try {
      const { signOut } = require("firebase/auth");
      await signOut(auth);
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
      setMedications([]);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthLoading,
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
