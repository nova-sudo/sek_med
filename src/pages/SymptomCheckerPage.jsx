import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatMessages from "../SymptomCheckerPage/components/ChatMessages";
import MessageInput from "../SymptomCheckerPage/components/MessageInput";
import LoadingScreen from "../SymptomCheckerPage/components/LoadingScreen";
import useChat from "../SymptomCheckerPage/hooks/useChat";
import useSpeechRecognition from "../SymptomCheckerPage/hooks/useSpeechRecognition";
import "../App.css";

// SuggestedMessages component with animation
const SuggestedMessages = ({ onSuggestionClick }) => {
  const suggestions = [
    "I have a headache",
    "I feel feverish",
    "I’m experiencing chest pain",
    "I have a sore throat",
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4">
      {suggestions.map((suggestion, index) => (
        <motion.button
          key={index}
          onClick={() => onSuggestionClick(suggestion)}
          className="px-4 py-2 bg-gray-100 text-zinc-800 rounded-full hover:bg-gray-200 transition-all"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          {suggestion}
        </motion.button>
      ))}
    </div>
  );
};

function SymptomCheckerPage() {
  const chatRef = useRef(null);
  const [showMap, setShowMap] = useState(false);
  const [mapLocation, setMapLocation] = useState(null);

  const {
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
  } = useChat(chatRef);

  const { isListening, startListening } = useSpeechRecognition(setInput);

  const handleGetLocations = async () => {
    try {
      const locations = await getLocations();
      if (locations && locations.length > 0) {
        setMapLocation(locations[0]); // { lat, lng, specialization }
        setShowMap(true);
      }
    } catch (error) {
      console.error("Failed to get locations:", error);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion); // Update the input for the UI
    handleSend(suggestion); // Pass the suggestion directly to handleSend
  };

  return (
    <AnimatePresence mode="wait">
      {messages.length === 0 ? (
        <motion.div
          key="initial-view"
          className="flex flex-col items-center font-cool justify-center h-screen bg-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-3xl md:text-4xl text-center font-bold text-zinc-800 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Hello, I am Sekmed, how can I help you today?
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <MessageInput
              input={input}
              setInput={setInput}
              handleSend={() => handleSend(input)} // Pass the input directly when the user types and sends
              isListening={isListening}
              startListening={startListening}
              showDownload={showDownload}
              handleDownloadReport={handleDownloadReport}
              getLocations={handleGetLocations}
            />
          </motion.div>
          <SuggestedMessages onSuggestionClick={handleSuggestionClick} />
        </motion.div>
      ) : (
        <motion.div
          key="chat-view"
          className="font-cool flex flex-col"
          style={{ height: "calc(100vh - 75px)" }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ChatMessages
            messages={messages}
            chatRef={chatRef}
            showDownload={showDownload}
            specialization={specialization}
            loadingSpec={loadingSpec}
            showMap={showMap}
            mapLocation={mapLocation}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <MessageInput
              input={input}
              setInput={setInput}
              handleSend={() => handleSend(input)} // Pass the input directly when the user types and sends
              isListening={isListening}
              startListening={startListening}
              showDownload={showDownload}
              handleDownloadReport={handleDownloadReport}
              getLocations={handleGetLocations}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SymptomCheckerPage;