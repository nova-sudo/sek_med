import { useState, useEffect } from "react";
import { fetchDiagnosis, fetchReport, fetchSpecialization as fetchSpec } from "../utils/api";
import { useVitals } from '../../contexts/VitalsContext';

export default function useChat(chatRef) {
  const [messages, setMessages] = useState([]);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [specialization, setSpecialization] = useState(null);
  const [hasFetchedSpecialization, setHasFetchedSpecialization] = useState(false);
  const [sentEmergencyReport, setSentEmergencyReport] = useState(false);
  const [loadingSpec, setLoadingSpec] = useState(false);
  const [emergencyReport, setEmergencyReport] = useState(null);
  const [location, setLocation] = useState({ lat: null, lng: null }); 
  const [prematureDiagnoses, setPrematureDiagnoses] = useState("");
  const [message, setMessage] = useState("");

  // Vitals context
  const { vitals, vitalsSent, setVitalsSent } = useVitals();

  useEffect(() => {
    if (!sessionId) {
      setSessionId(crypto.randomUUID());
      setHasFetchedSpecialization(false);
    }
  }, [sessionId]);
const getLocations = () => {
    if (navigator.geolocation) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const locationData = {
              lat: latitude,
              lng: longitude,
              specialization: specialization || "medical specialist",
            };
            resolve([locationData]);
          },
          (error) => {
            console.error("Error getting location:", error);
            setMessages((prev) => [
              ...prev,
              { id: prev.length + 1, sender: "system", text: "Unable to access location." },
            ]);
            reject(error);
          }
        );
      });
    } else {
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, sender: "system", text: "Geolocation is not supported by this browser." },
      ]);
      return Promise.resolve(null);
    }
  };
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const hasRequiredKeywords = messages.some(
      (msg) => msg.sender === "system" && msg.text.includes("Diagnoses")
    );
    setShowDownload(hasRequiredKeywords);
    if (hasRequiredKeywords && sessionId && !hasFetchedSpecialization) {
      fetchSpecialization(sessionId);
      setHasFetchedSpecialization(true);
    }
  }, [messages, sessionId, hasFetchedSpecialization]);


const handleAddAlert = async (e, data = null) => {
  if (e && typeof e.preventDefault === "function") {
    e.preventDefault();
  }

  let alertData;

  try {
    // Fetch the user's current geolocation
    const locations = await getLocations();
    const userLocation = locations
      ? { lat: locations[0].lat, lng: locations[0].lng }
      : { lat: null, lng: null }; // Fallback if geolocation is unavailable

    // Prepare alertData, using provided data or constructing new data
    alertData = data || {
      Location: {
        lat: userLocation.lat,
        lng: userLocation.lng,
      },
      premature_diagnoses: emergencyReport,
    };

    // If geolocation failed and no data was provided, include a fallback message
    if (!userLocation.lat && !userLocation.lng && !data) {
      setMessage("Geolocation unavailable. Using default location data.");
    }

    // Send the alert to the API
    const response = await fetch("https://sekmed-ems-backend.vercel.app/api/add-alert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(alertData),
    });

    const responseData = await response.json();
    if (response.ok) {
      if (!data) {
        // Only reset state if called from form submission
        setLocation(userLocation); // Update location state with coordinates
        setPrematureDiagnoses("");
      }
      setMessage("Alert added successfully!");
    } else {
      setMessage(responseData.detail || "Failed to add alert");
    }
  } catch (error) {
    console.error("Error in handleAddAlert:", error);
    setMessage("Error connecting to the server or retrieving geolocation");
  }
};

useEffect(() => {
  const hasEmergencyCallers = messages.some(
    (msg) =>
      msg.sender === "system" &&
      msg.text.includes(
        "THIS IS AN EMERGANCY, CALLING AN AMBULANCE" ||
          "THIS IS AN EMERGENCY, CALLING AN AMBULANCE" ||
          "CALLING AN AMBULANCE" ||
          "Emergency"
      )
  );

  if (hasEmergencyCallers && !sentEmergencyReport) {
    setSentEmergencyReport(true); // Prevent re-runs

    fetch(`https://sekmed-backend.jollyhill-08250396.eastus2.azurecontainerapps.io/generate-emergency-report?session_id=${sessionId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to generate emergency report.");
        return response.json();
      })
      .then(async (data) => {
        const report = data.emergency_report;
        setEmergencyReport(report);

        // Update messages with the emergency report
        setMessages((prev) => [
          ...prev,
          { id: prev.length + 1, sender: "system", text: `${report}` },
        ]);

        // Fetch user location
        const locations = await getLocations();
        const userLocation = locations
          ? { lat: locations[0].lat, lng: locations[0].lng }
          : { lat: null, lng: null };

        // Create a synthetic event object
        const syntheticEvent = { preventDefault: () => {} };

        // Send the alert with location data
        await handleAddAlert(syntheticEvent, {
          Location: {
            lat: userLocation.lat,
            lng: userLocation.lng,
          },
          premature_diagnoses: report,
        });
      })
      .catch((error) => {
        console.error("Error generating emergency report:", error);
        setMessages((prev) => [
          ...prev,
          { id: prev.length + 1, sender: "system", text: "Failed to generate emergency report." },
        ]);
        setSentEmergencyReport(false); // Allow retry on failure
      });
  }
}, [messages, sessionId, sentEmergencyReport, getLocations]);

  const handleSend = async (message = input) => {
    if (message.trim() === "") return;

    let messageToSend = message;
    let vitalsJustSent = false;

    // Append vitals if available and not yet sent
    if (vitals && !vitalsSent) {
      messageToSend = `Here are my latest health vitals:\n${JSON.stringify(vitals, null, 2)}\n\n${message}`;
      setVitalsSent(true);
      vitalsJustSent = true;
    }

    // Show the user's message in chat UI
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, sender: "user", text: message }
    ]);

    // Show confirmation if we sent the vitals to the bot
    // if (vitalsJustSent) {
    //   setMessages((prev) => [
    //     ...prev,
    //     { id: prev.length + 2, sender: "system", text: "✅ Your latest health vitals have been sent to Sekmed for a more accurate assessment."}
    //   ]);
    // }

    setInput("");
    if (messages.length === 1) setShowLoadingScreen(true);
    setIsLoading(true);

    try {
      const data = await fetchDiagnosis(sessionId, messageToSend);
      setIsLoading(false);
      setShowLoadingScreen(false);

      if (data.diagnoses) {
        let currentMessage = "";
        setMessages((prev) => [...prev, { id: prev.length + 1, sender: "system", text: "" }]);
        data.diagnoses.split("").forEach((char, index) => {
          setTimeout(() => {
            currentMessage += char;
            setMessages((prev) =>
              prev.map((msg, i) => (i === prev.length - 1 ? { ...msg, text: currentMessage } : msg))
            );
          }, index * 50);
        });
      } else {
        setMessages((prev) => [
          ...prev,
          { id: prev.length + 1, sender: "system", text: "Sorry, I couldn't understand that. Can you clarify?" },
        ]);
      }
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
      setShowLoadingScreen(false);
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, sender: "system", text: "Sorry, something went wrong. Please try again later." },
      ]);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const blob = await fetchReport(sessionId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report_${sessionId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading report:", error);
      alert("Could not download the report. Please try again later.");
    }
  };

  const fetchSpecialization = async (sessionId) => {
    setLoadingSpec(true);
    try {
      const data = await fetchSpec(sessionId);
      setSpecialization(data.recommended_specialization);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoadingSpec(false);
    }
  };



  

  return {
    messages,
    setMessages,
    input,
    setInput,
    showLoadingScreen,
    isLoading,
    sessionId,
    showDownload,
    specialization,
    loadingSpec,
    handleSend,
    handleDownloadReport,
    fetchSpecialization,
    getLocations,
  };
}