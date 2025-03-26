import { useState, useEffect } from "react";
import { fetchDiagnosis, fetchReport, fetchSpecialization as fetchSpec } from "../utils/api";

export default function useChat(chatRef) {
  const [messages, setMessages] = useState([]);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [specialization, setSpecialization] = useState(null);
  const [hasFetchedSpecialization, setHasFetchedSpecialization] = useState(false);
  const [loadingSpec, setLoadingSpec] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setSessionId(crypto.randomUUID());
      setHasFetchedSpecialization(false);
    }
  }, [sessionId]);

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

  const handleSend = async (message = input) => {
    if (message.trim() === "") return;
    setMessages((prev) => [...prev, { id: prev.length + 1, sender: "user", text: message }]);
    setInput(""); // Clear the input field
    if (messages.length === 1) setShowLoadingScreen(true);
    setIsLoading(true);

    try {
      const data = await fetchDiagnosis(sessionId, message);
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