const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
require('dotenv').config();

// Firebase Admin Setup
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();

// Prisma 7 Setup with PG Adapter
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Middleware
app.use(cors());
app.use(express.json());

// --- ROUTES ---

// Test Route
app.get('/api/test', (req, res) => {
  const dbUrl = process.env.DATABASE_URL || 'MISSING';
  res.status(200).json({ 
    message: 'Backend is working and connected via Prisma 7 Adapter!',
    dbUrlPrefix: dbUrl.substring(0, 15)
  });
});

// Signup Route
app.post('/api/signup', async (req, res) => {
  console.log("Signup attempt for:", req.body.email);
  const { firebaseId, email, fullName, role, specialization, age, medicalHistory, contactNumber, cnic, gender, address } = req.body;

  try {
    const newUser = await prisma.user.create({
      data: {
        firebaseId,
        email,
        fullName,
        role: role.toUpperCase(),
        contactNumber,
        cnic,
        gender,
        address,
        doctorProfile: role.toLowerCase() === 'doctor' ? {
          create: {
            specialty: specialization || 'General',
          }
        } : undefined,
        patientProfile: role.toLowerCase() === 'patient' ? {
          create: {
            age: age ? parseInt(age) : null,
            medicalHistory: medicalHistory || '',
          }
        } : undefined,
      },
      include: {
        doctorProfile: true,
        patientProfile: true
      }
    });

    console.log("User successfully saved to DB:", newUser.email);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: error.message || 'Database error occurred' });
  }
});

// Get User Profile Route (Login ke baad data lene ke liye)
app.get('/api/user/:firebaseId', async (req, res) => {
  const { firebaseId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { firebaseId },
      include: { doctorProfile: true, patientProfile: true }
    });
    if (!user) return res.status(404).json({ error: 'User not found in Database' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update User Profile Route (Edit Profile)
app.put('/api/user/:firebaseId', async (req, res) => {
  const { firebaseId } = req.params;
  const { fullName, email, contactNumber, cnic, gender, address, role, doctorProfile, patientProfile } = req.body;
  
  try {
    const user = await prisma.user.findUnique({ where: { firebaseId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const safeParseInt = (val) => {
      const parsed = parseInt(val);
      return isNaN(parsed) ? null : parsed;
    };

    const updatedUser = await prisma.user.update({
      where: { firebaseId },
      data: {
        fullName,
        contactNumber,
        cnic,
        gender,
        address,
        doctorProfile: user.role === 'DOCTOR' && doctorProfile ? {
          upsert: {
            create: { 
              specialty: doctorProfile.specialty || 'General', 
              experience: safeParseInt(doctorProfile.experience), 
              bio: doctorProfile.bio || '' 
            },
            update: { 
              specialty: doctorProfile.specialty, 
              experience: safeParseInt(doctorProfile.experience), 
              bio: doctorProfile.bio 
            }
          }
        } : undefined,
        patientProfile: user.role === 'PATIENT' && patientProfile ? {
          upsert: {
            create: { 
              age: safeParseInt(patientProfile.age), 
              medicalHistory: patientProfile.medicalHistory || '' 
            },
            update: { 
              age: safeParseInt(patientProfile.age), 
              medicalHistory: patientProfile.medicalHistory 
            }
          }
        } : undefined,
      },
      include: { doctorProfile: true, patientProfile: true }
    });
    
    res.json(updatedUser);
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ error: 'Failed to update profile', details: error.message });
  }
});

// Get All Doctors Route (Appointment book karne se pehle list dikhane ke liye)
app.get('/api/doctors', async (req, res) => {
  try {
    const doctors = await prisma.user.findMany({
      where: { role: 'DOCTOR' },
      include: { doctorProfile: true }
    });
    res.json(doctors);
  } catch (error) {
    console.error("Fetch Doctors Error:", error);
    res.status(500).json({ error: 'Doctors fetch nahi ho sakay' });
  }
});

// Create Appointment Route (Naya appointment book karne ke liye)
app.post('/api/appointments', async (req, res) => {
  const { patientId, doctorId, date, time, notes } = req.body;
  try {
    const newAppointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        date,
        time,
        notes,
        status: "Pending" // Naya appointment default pending hota hai
      }
    });
    res.status(201).json(newAppointment);
  } catch (error) {
    console.error("Appointment Error:", error);
    res.status(500).json({ error: 'Appointment save nahi ho saka' });
  }
});

// Get Appointments (Doctors ya Patients ke appointments dekhne ke liye)
app.get('/api/appointments/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        OR: [
          { patientId: userId },
          { doctorId: userId }
        ]
      },
      include: {
        patient: true,
        doctor: true
      }
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Appointments fetch nahi ho sakay' });
  }
});

// Update Appointment Status (Doctor jab checkup "Done" kare)
app.put('/api/appointments/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: { status }
    });
    res.json(updatedAppointment);
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ error: 'Status update nahi ho saka' });
  }
});
// Create Prescription Route (Doctor jab dawai likhta hai)
app.post('/api/prescriptions', async (req, res) => {
  const { doctorId, patientId, date, medications } = req.body;
  try {
    const newPrescription = await prisma.prescription.create({
      data: {
        doctorId,
        patientId,
        date,
        medications: {
          create: medications.map(med => ({
            name: med.name,
            dosage: med.dosage,
            instructions: med.instructions,
            duration: med.duration,
            times: med.times // times string array
          }))
        }
      },
      include: {
        medications: true
      }
    });
    res.status(201).json(newPrescription);
  } catch (error) {
    console.error("Prescription Error:", error);
    res.status(500).json({ error: 'Prescription save nahi ho saki' });
  }
});

// Get Prescriptions for a Patient (Patient jab dawai dekhta hai)
app.get('/api/prescriptions/patient/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const prescriptions = await prisma.prescription.findMany({
      where: { patientId: userId },
      include: {
        doctor: true,
        medications: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(prescriptions);
  } catch (error) {
    console.error("Fetch Prescriptions Error:", error);
    res.status(500).json({ error: 'Prescriptions fetch nahi ho sakay' });
  }
});

// Delete Prescription
app.delete('/api/prescriptions/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Delete medications associated with this prescription first (cascade might not be set up)
    await prisma.medication.deleteMany({
      where: { prescriptionId: id }
    });
    
    await prisma.prescription.delete({
      where: { id }
    });
    res.json({ success: true, message: "Prescription deleted successfully" });
  } catch (error) {
    console.error("Delete Prescription Error:", error);
    res.status(500).json({ error: 'Prescription delete nahi ho saki' });
  }
});
// Start Server (Conditional for Vercel)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
  });
}

// Export for Vercel Serverless Functions
module.exports = app;
