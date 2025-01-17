import React, { useState, useEffect, useRef } from "react";
import { TbMedicalCrossCircle } from "react-icons/tb";
import { BsSoundwave } from "react-icons/bs";
import { TbTiltShift } from "react-icons/tb";
import "../App.css";
import ReactMarkdown from "react-markdown";

function SymptomCheckerPage() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "system", text: "I am SEKMED. How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(null); // Track the session ID
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Generate a session ID on component mount if none exists
    if (!sessionId) {
      setSessionId(crypto.randomUUID());
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
  setIsLoading(true);

    try {
      const response = await fetch("https://symptofy.vercel.app/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, symptoms: input, diagnoses: "" }),  // Empty diagnoses field
      });
      

      if (!response.ok) {
        throw new Error("Failed to get response from the server.");
      }
  
      const data = await response.json();
      setIsLoading(false);
  
      if (data.diagnoses) {
        const fullMessage = data.diagnoses;
  
        // Add a new system message for the streaming response
        let currentMessage = "";
        setMessages((prev) => [
          ...prev,
          { id: prev.length + 1, sender: "system", text: "" }, // Placeholder for streaming
        ]);
  
        fullMessage.split("").forEach((char, index) => {
          setTimeout(() => {
            currentMessage += char;
            setMessages((prev) =>
              prev.map((message) =>
                message.id === prev.length // Update the system message with the correct ID
                  ? { ...message, text: currentMessage }
                  : message
              )
            );
          }, index * 50); // Adjust the timing to control how fast the message appears
        });
      } else {
        const errorMessage =
          "Sorry, I couldn't understand that. Can you clarify?";
        setMessages((prev) => [
          ...prev,
          { id: prev.length + 1, sender: "system", text: errorMessage },
        ]);
      }
    } catch (error) {
      console.error("Error during API request:", error);
      setIsLoading(false);
      const errorMessage =
        "Sorry, something went wrong. Please try again later.";
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, sender: "system", text: errorMessage },
      ]);
    }
  };

  return (
    <div
      className="font-cool flex flex-col"
      style={{ height: "calc(100vh - 75px)" }}
    >
      <div className="flex items-center py-4">
        <div className="h-10 w-10 bg-gray-200 rounded-full ring-1 ring-gray-300 flex items-center justify-center">
          <TbMedicalCrossCircle size={24} className="text-blue-500" />
        </div>
        <h1 className="ml-4 text-[20px] md:text-2xl font-bold text-gray-800">
          Symptom Checker
        </h1>
      </div>

      {/* Chat Section */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 ring-gray-300 ring-1 rounded-3xl bg-white"
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
                  <TbMedicalCrossCircle size={24} className="text-blue-500 mt-[6px]" />
                </div>
              )}
              <div
                className={`max-w-2xl py-1 px-4 rounded-3xl text-md md:text-lg transition-transform duration-300 break-words ${
                  message.sender === "user"
                    ? "bg-blue-100 ring-1 ring-blue-500 text-blue-800"
                    : "text-blue-800"
                }`}
              >
                <ReactMarkdown className="markdown">{message.text}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Section */}
      <div className="mt-4 bg-gray-100 rounded-full ring-1 ring-gray-200 flex items-center px-2">
        <button
          onClick={startListening}
          className={`px-3 py-2 ${
            isListening
              ? "bg-gray-200 ring-gray-600 ring-2 text-gray-800"
              : "bg-blue-100 ring-2 ring-blue-500 text-blue-800"
          } rounded-full shadow-sm`}
        >
          {isListening ? "Listening..." : <BsSoundwave />}
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 mx-2 px-4 py-2 bg-neutral-200 ring-2 ring-gray-500 rounded-full shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
        />
        <button
          onClick={handleSend}
          className="px-2 py-2 bg-blue-100 ring-2 ring-blue-500 text-blue-500 rounded-full shadow-sm hover:bg-blue-600 hover:text-white focus:ring-2 focus:ring-blue-400"
        >
          <TbTiltShift />
        </button>
      </div>
    </div>
  );
}

export default SymptomCheckerPage;
