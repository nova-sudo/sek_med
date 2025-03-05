import React, { useState, useEffect, useRef } from "react";
import { TbMedicalCrossCircle } from "react-icons/tb";
import { BsSoundwave } from "react-icons/bs";
import { TbTiltShift } from "react-icons/tb";
import { HiDownload } from "react-icons/hi";
import { TbBrandGoogleMaps } from "react-icons/tb";
import "../App.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import rehypeRaw from "rehype-raw";
import "./SymtomCheckerPage.css";


function SymptomCheckerPage() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "system", text: "I am SEKMED. How can I assist you today?" },
  ]);
  
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(null); // Track the session ID
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef(null);
  const recognitionRef = useRef(null);
  const [showDownload, setShowDownload] = useState(false); // New state for download button visibility
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
    // Initialize SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false); // Stop listening once input is received
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false); // Ensure listening stops when recognition ends
      };

      recognitionRef.current = recognition;
    } else {
      console.warn("SpeechRecognition is not supported in this browser.");
    }
  }, []);

  useEffect(() => {
    // Scroll to the bottom when a new message is added
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const hasRequiredKeywords = messages.some(
      (msg) =>
        msg.sender === "system" &&
        msg.text.includes("Diagnoses")
    );
  
    setShowDownload(hasRequiredKeywords);
  
    if (hasRequiredKeywords && sessionId && !hasFetchedSpecialization) {
      fetchSpecialization(sessionId);
      setHasFetchedSpecialization(true);
    }
  }, [messages, sessionId, hasFetchedSpecialization]);
  
  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleSend = async () => {
    if (input.trim() === "") return;
  
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, sender: "user", text: input }, // Add user message
    ]);
    setInput("");
  
    if (messages.length === 1) { // Show loading screen only after the first message
      setShowLoadingScreen(true);
    }
  
    setIsLoading(true);
  
    try {
      const response = await fetch("https://symptofy.vercel.app/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, symptoms: input, diagnoses: "" }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to get response from the server.");
      }
  
      const data = await response.json();
      setIsLoading(false);
      setShowLoadingScreen(false); // Hide loading screen when response starts streaming
  
      if (data.diagnoses) {
        const fullMessage = data.diagnoses;
        let currentMessage = "";
  
        // Add placeholder system message for streaming
        setMessages((prev) => [
          ...prev,
          { id: prev.length + 1, sender: "system", text: "" },
        ]);
  
        fullMessage.split("").forEach((char, index) => {
          setTimeout(() => {
            currentMessage += char;
            setMessages((prev) =>
              prev.map((message, i) =>
                i === prev.length - 1 // Update only the last system message
                  ? { ...message, text: currentMessage }
                  : message
              )
            );
          }, index * 50); // Adjust speed of streaming
        });
  
        // // Fetch specialization only once per diagnosis
        // if (data.diagnoses && !hasFetchedSpecialization) {
        //   await fetchSpecialization(data.session_id);
        //   setHasFetchedSpecialization(true);
        // // }
  
        // console.log(data.diagnoses);
      } else {
        setMessages((prev) => [
          ...prev,
          { id: prev.length + 1, sender: "system", text: "Sorry, I couldn't understand that. Can you clarify?" },
        ]);
      }
    } catch (error) {
      console.error("Error during API request:", error);
      setIsLoading(false);
      setShowLoadingScreen(false); // Hide loading screen on error
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, sender: "system", text: "Sorry, something went wrong. Please try again later." },
      ]);
    }
  };
  
  
  

  const handleDownloadReport = async () => {
    try {
      const response = await fetch(
        `https://symptofy.vercel.app/report?session_id=${sessionId}`,
        { method: "POST" }
      );

      if (!response.ok) {
        throw new Error("Failed to generate report.");
      }

      const blob = await response.blob();
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

  const handleInputChange = (e) => setInput(e.target.value);

  
  if (showLoadingScreen) {
    return (
      <div className="flex items-center justify-center h-screen bg-white/30">
        <div className="text-center w-3/4 max-w-md">
          <p className="mb-4 text-black text-lg font-cool animate-pulse">Loading session...</p>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-300 rounded-full h-1 overflow-hidden">
            <div className="bg-black h-full progress-bar"></div>
          </div>
        </div>
      </div>
    );
  }
  
  const fetchSpecialization = async () => {
    setLoadingSpec(true);
    
    // Extract diagnoses from messages
    const diagnosisMessage = messages.find(msg => msg.sender === "system" && msg.text.includes("Diagnoses"));
    const diagnoses = diagnosisMessage ? diagnosisMessage.text : "";
  
    try {
      const response = await fetch(`https://symptofy.vercel.app/getspec?session_id=${sessionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) throw new Error("Failed to fetch specialization.");
      
      const data = await response.json();
      setSpecialization(data.recommended_specialization.summary);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoadingSpec(false);
    }
  };
  

  const getLocations = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const query = specialization ? encodeURIComponent(specialization) : "medical specialist";
          const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}&near=${latitude},${longitude}`;
  
          setMessages((prev) => [
            ...prev,
            {
              id: prev.length + 1,
              sender: "system",
              text: `[Open Google Maps](${googleMapsUrl})`,
            },
          ]);
        },
        (error) => {
          console.error("Error getting location:", error);
          setMessages((prev) => [
            ...prev,
            { id: prev.length + 1, sender: "system", text: "Unable to access location." },
          ]);
        }
      );
    } else {
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, sender: "system", text: "Geolocation is not supported by this browser." },
      ]);
    }
  };

  
  return (
    <div
      className="font-cool flex flex-col "
      style={{ height: "calc(100vh - 75px)" }}
    >
     

      {/* Chat Section */}
<div
  ref={chatRef}
  className="flex-1 overflow-c px-4 py-2 space-y-4 bg-white w-full max-w-[800px] mx-auto"
>
  {messages.map((message) => (
    <div
      key={message.id}
      className={`flex ${
        message.sender === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div className="flex items-start">
        {message.sender === "system" && (
          <div className="mr-1">
            <TbMedicalCrossCircle size={24} className="text-black mt-[6px]" />
          </div>
        )}
        <div
          className={`max-w-2xl py-1 px-4 rounded-3xl text-md md:text-lg transition-transform duration-300 break-words ${
            message.sender === "user"
              ? "bg-gray-200 text-black"
              : "text-black"
          }`}
        >
          {message.isMap ? (
            <iframe
              src={message.mapUrl}
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
            ></iframe>
          ) : (
            <ReactMarkdown
              className="markdown"
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {message.text}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  ))}

  {showDownload && (
    <>
      {loadingSpec && (
        <p className="text-center text-black mt-2 animate-pulse">
          Fetching specialization
        </p>
      )}
      {specialization && (
        <p className="text-center rounded-full text-black font-medium mt-2">
          Recommended Specialization: {specialization}
        </p>
      )}
    </>
  )}
</div>


      {/* Input Section */}
<div className="flex  items-center gap-2 p-2 border border-gray-300 bg-white rounded-2xl shadow-md w-full max-w-[800px] mb-5 mx-auto">
  {/* Voice Button */}
  <button
    onClick={startListening}
    className={`p-2 transition-all ${
      isListening ? "bg-gray-200 ring-2 ring-gray-600" : "bg-gray-300"
    } rounded-full`}
  >
    <BsSoundwave className={`text-xl ${isListening ? "animate-pulse text-gray-800" : "text-gray-600"}`} />
  </button>

  {/* Single-line Input */}
  <input
    type="text"
    value={input}
    onChange={(e) => setInput(e.target.value)}
    placeholder="Type a message..."
    className="flex-1 p-2 text-lg bg-transparent outline-none border-none whitespace-nowrap overflow-hidden"
  />

  {/* Send Button */}
  <button
    onClick={handleSend}
    className="p-2 text-blue-500 transition-all bg-blue-100 rounded-full hover:bg-blue-600 hover:text-white"
  >
    <TbTiltShift />
  </button>

  {/* Additional Actions */}
  {showDownload && (
    <>
      <button
        onClick={handleDownloadReport}
        className="p-2 text-blue-500 transition-all bg-blue-100 rounded-full hover:bg-blue-600 hover:text-white"
      >
        <HiDownload />
      </button>
      <button
        onClick={getLocations}
        className="p-2 text-red-500 transition-all bg-red-100 rounded-full hover:bg-red-600 hover:text-white"
      >
        <TbBrandGoogleMaps />
      </button>
    </>
  )}
</div>



    </div>
  );
}

export default SymptomCheckerPage;
