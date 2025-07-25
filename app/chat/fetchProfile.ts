// Utility to fetch user or doctor profile for chat list
export async function fetchProfile({ userType, chat }: { userType: string, chat: any }) {
  // Debug: Log input
  console.log('[fetchProfile] called with:', { userType, chat });

  if (userType === "doctor") {
    if (!chat.patientEmail) {
      console.error('[fetchProfile] No patientEmail provided', chat);
      return {};
    }
    const patientEmail = (chat.patientEmail || '').trim().toLowerCase();
    console.log('[fetchProfile] Fetching patient profile for email:', patientEmail);
    const res = await fetch(`/api/patient?email=${encodeURIComponent(patientEmail)}`);
    if (!res.ok) {
      console.error(`[fetchProfile] Patient API returned status ${res.status}`);
      return {};
    }
    const data = await res.json();
    console.log('[fetchProfile] Patient API response:', data);
    return {
      name: data.fullName || data.email || "Unknown",
      imageUrl: data.imageUrl || data.profileImageUrl || data.image || "",
      email: data.email || "",
    };
  } else {
    // For patient, fetch doctor by email, and also return id if found
    let doctorEmail = chat.doctorEmail || chat.email;
    if (!doctorEmail) {
      console.error('[fetchProfile] No doctorEmail provided to fetchProfile', chat);
      return {};
    }
    doctorEmail = doctorEmail.trim().toLowerCase();
    console.log('[fetchProfile] Fetching doctor profile for email:', doctorEmail);
    const res = await fetch(`/api/dentists`);
    if (!res.ok) {
      console.error(`[fetchProfile] Dentist API returned status ${res.status}`);
      return {};
    }
    const all = await res.json();
    // Debug: Log all emails in the dentist list
    console.log('[fetchProfile] All dentist emails:', all.map((d: any) => d.email));
    // Find doctor by email (case-insensitive)
    const doc = all.find((d: any) => (d.email || '').trim().toLowerCase() === doctorEmail);
    if (!doc) {
      console.error('[fetchProfile] Doctor not found by email', doctorEmail, 'in', all.map((d: any) => d.email));
      return {};
    }
    // Debug: Log found doctor
    console.log('[fetchProfile] Found doctor:', doc);
    return {
      id: doc.id,
      name: doc.name || doc.fullName || `Dr. ${doc.email}`,
      imageUrl: doc.imageUrl || doc.profileImageUrl || doc.image || "",
      email: doc.email || "",
      specialty: doc.specialty || "",
      bio: doc.bio || "",
      qualifications: doc.qualifications || [],
      services: doc.services || [],
      availability: doc.availability || {},
    };
  }
}
