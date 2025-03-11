export async function fetchDiagnosis(sessionId, symptoms) {
    const response = await fetch("https://symptofy.vercel.app/diagnose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, symptoms, diagnoses: "" }),
    });
    if (!response.ok) throw new Error("Failed to get response from the server.");
    return await response.json();
  }
  
  export async function fetchReport(sessionId) {
    const response = await fetch(`https://symptofy.vercel.app/report?session_id=${sessionId}`, {
      method: "POST",
    });
    if (!response.ok) throw new Error("Failed to generate report.");
    return await response.blob();
  }
  
  export async function fetchSpecialization(sessionId) {
    const response = await fetch(`https://symptofy.vercel.app/getspec?session_id=${sessionId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to fetch specialization.");
    return await response.json();
  }