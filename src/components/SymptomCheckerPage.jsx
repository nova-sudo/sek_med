import React, { useState, useEffect, useRef } from "react";
import { TbMedicalCrossCircle } from "react-icons/tb";
import "../App.css";
import { BsSoundwave } from "react-icons/bs";
import { TbTiltShift } from "react-icons/tb";


function SymptomCheckerPage() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "system", text: "I am SEKMED. How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const chatRef = useRef(null);
  const spokenMessagesRef = useRef(new Set());
  const recognitionRef = useRef(null);

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

  const speakText = (text) => {
    if (!spokenMessagesRef.current.has(text)) {
      spokenMessagesRef.current.add(text); // Mark the message as spoken
      if (window.responsiveVoice) {
        window.responsiveVoice.speak(text, "UK English Female", { rate: 1 });
      } else {
        console.error("ResponsiveVoice is not available.");
      }
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleSend = async () => {
    if (input.trim() === "") return;

    // Add the user's input to the chat history
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, sender: "user", text: input },
    ]);

    // Clear the input field
    setInput("");

    try {
      const response = await fetch("https://symptofy.vercel.app/diagnose", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symptoms: input }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from the server.");
      }

      const data = await response.json();

      if (data.diagnoses) {
        const diagnosisMessages = data.diagnoses.split().map((text, index) => ({
          id: messages.length + index + 3,
          sender: "system",
          text,
        }));

        diagnosisMessages.forEach((message, index) => {
          setTimeout(() => {
            setMessages((prev) => {
              const newMessages = [...prev, message];
              if (message.sender === "system") {
                speakText(message.text);
              }
              return newMessages;
            });
          }, 1000 * index);
        });
      } else {
        const errorMessage = "Sorry, I couldn't understand that. Can you clarify?";
        setMessages((prev) => [
          ...prev,
          { id: prev.length + 3, sender: "system", text: errorMessage },
        ]);
        speakText(errorMessage);
      }
    } catch (error) {
      console.error("Error during API request:", error);
      const errorMessage = "Sorry, something went wrong. Please try again later.";
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 3, sender: "system", text: errorMessage },
      ]);
      speakText(errorMessage);
    }
  };


  return (
    <div className="md:max-h-[600px] md:z-20 md:min-h-[700px] h-screen max-h-[600px] font-pixel font-bold flex flex-col">
      <div className="flex items-center py-4">
        <div className="md:h-10 md:w-10 bg-gray-200 rounded-full ring-1 ring-gray-300 flex items-center justify-center">
          <TbMedicalCrossCircle size={24} className="text-blue-500" />
        </div>
        <h1 className="ml-4 md:text-3xl text-2xl font-pixel font-bold text-gray-800">Symptom Checker Dashboard</h1>
      </div>

      <div ref={chatRef} className="flex-1 overflow-y-auto p-6 space-y-4 ring-gray-300 ring-1 rounded-3xl">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-2xl py-2 px-4 rounded-3xl text-md shadow-md transition-transform duration-300 break-words ${
                message.sender === "user"
                  ? "bg-gray-200 ring-gray-600 ring-2 text-gray-800"
                  : "bg-blue-100 ring-2 ring-blue-500 text-blue-800"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      <div className="py-4 border-gray-300 flex items-center">
        <button
          onClick={startListening}
          className={`px-4 py-2 ${isListening ? "bg-gray-200 ring-gray-600 ring-2 text-gray-800" : "bg-blue-100 ring-2 ring-blue-500 text-blue-800 "}  rounded-full shadow-sm text-md`}
        >
          {isListening ? "Listening..." : <><BsSoundwave />
            </>}
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 mx-4 px-4 py-2 bg-neutral-200 ring-2 ring-gray-500 rounded-full shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
        />
        <button
          onClick={handleSend}
          className="px-2 py-2 bg-blue-100 ring-2 ring-blue-500 text-blue-500 rounded-full shadow-sm text-md hover:bg-blue-600 hover:text-white focus:ring-2 focus:ring-blue-400"
        >
          <TbTiltShift />
        </button>
      </div>
    </div>
  );
}

export default SymptomCheckerPage;
