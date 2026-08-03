const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

function formatDoctorDisplayName(name) {
  const cleanName = (name || 'Doctor').trim();
  return /^dr\.?\s/i.test(cleanName) ? cleanName : `Dr. ${cleanName}`;
}

function buildAppointmentNotification(recipientRole, doctorName, patientName, date, time, appointmentId) {
  if (recipientRole === 'PATIENT') {
    return {
      title: 'Appointment Booked',
      body: `Your appointment with ${formatDoctorDisplayName(doctorName)} on ${date} at ${time} is booked.`,
      data: {
        type: 'appointment-booked',
        appointmentId,
        recipientRole,
      },
    };
  }

  return {
    title: 'New Appointment Booked',
    body: `${patientName} has booked an appointment for ${date} at ${time}.`,
    data: {
      type: 'new-appointment',
      appointmentId,
      recipientRole,
    },
  };
}

async function sendExpoPushNotifications(messages) {
  const validMessages = Array.isArray(messages) ? messages.filter((message) => message?.to) : [];

  if (validMessages.length === 0) {
    return { skipped: true };
  }

  const response = await fetch(EXPO_PUSH_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-Encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(validMessages),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(`Expo push request failed with status ${response.status}: ${JSON.stringify(payload)}`);
  }

  return payload;
}

async function sendAppointmentBookedNotifications({
  appointmentId,
  date,
  time,
  patient,
  doctor,
  sendToPatient = true,
  sendToDoctor = true,
}) {
  const messages = [];

  if (sendToPatient && patient?.expoPushToken) {
    const notification = buildAppointmentNotification(
      'PATIENT',
      doctor?.fullName || 'Doctor',
      patient.fullName || 'Patient',
      date,
      time,
      appointmentId
    );

    messages.push({
      to: patient.expoPushToken,
      sound: 'default',
      priority: 'high',
      channelId: 'default',
      ...notification,
    });
  }

  if (sendToDoctor && doctor?.expoPushToken) {
    const notification = buildAppointmentNotification(
      'DOCTOR',
      doctor.fullName || 'Doctor',
      patient?.fullName || 'Patient',
      date,
      time,
      appointmentId
    );

    messages.push({
      to: doctor.expoPushToken,
      sound: 'default',
      priority: 'high',
      channelId: 'default',
      ...notification,
    });
  }

  return sendExpoPushNotifications(messages);
}

module.exports = {
  sendAppointmentBookedNotifications,
  sendExpoPushNotifications,
};
