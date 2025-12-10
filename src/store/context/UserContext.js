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

  const saveUser = (userData) => {
    setUser(userData);
  };

  const updateUser = (field, value) => {
    setUser((prev) => ({ ...prev, [field]: value }));
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
};

  return (
    <UserContext.Provider value={{ user, saveUser, updateUser ,logout}}>
      {children}
    </UserContext.Provider>
  );
};
