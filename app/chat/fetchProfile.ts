// Utility to fetch user or doctor profile for chat list
export async function fetchProfile({ userType, chat }: { userType: string, chat: any }) {
  // For doctor, fetch patient profile; for patient, fetch doctor profile
  if (userType === "doctor") {
    // Fetch patient by email
    if (!chat.patientEmail) return {};
    const res = await fetch(`/api/patient?email=${encodeURIComponent(chat.patientEmail)}`);
    if (!res.ok) return {};
    const data = await res.json();
    return {
      name: data.fullName || data.email || "Unknown",
      imageUrl: data.imageUrl || data.profileImageUrl || data.image || "",
    };
  } else {
    // Fetch doctor by id
    if (!chat.doctorId) return {};
    const res = await fetch(`/api/dentists?doctorId=${encodeURIComponent(chat.doctorId)}`);
    if (!res.ok) return {};
    const data = await res.json();
    // If API returns array, pick first
    const doc = Array.isArray(data) ? data[0] : data;
    return {
      name: doc.name || doc.fullName || `Dr. ${doc.id}`,
      imageUrl: doc.imageUrl || doc.profileImageUrl || doc.image || "",
    };
  }
}
