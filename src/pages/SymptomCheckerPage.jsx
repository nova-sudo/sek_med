import React, { useRef, useState } from "react";
import ChatMessages from "../SymptomCheckerPage/components/ChatMessages";
import MessageInput from "../SymptomCheckerPage/components/MessageInput";
import LoadingScreen from "../SymptomCheckerPage/components/LoadingScreen";
import useChat from "../SymptomCheckerPage/hooks/useChat";
import useSpeechRecognition from "../SymptomCheckerPage/hooks/useSpeechRecognition";
import "../App.css";
import SplitText from "../TextAnimations/SplitText/SplitText";

// Updated SuggestedMessages component with medical symptom-related suggestions
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
        <button
          key={index}
          onClick={() => onSuggestionClick(suggestion)}
          className="px-4 py-2 bg-gray-100 text-zinc-800 rounded-full hover:bg-gray-200 transition-all"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};

function SymptomCheckerPage() {
  const chatRef = useRef(null);
  const [showMap, setShowMap] = useState(false);
  const [mapLocation, setMapLocation] = useState(null);
  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
  };
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
    setInput(suggestion);
    handleSend(); // Automatically send the suggestion as a message
  };

  if (showLoadingScreen) {
    return <LoadingScreen />;
  }

  // If there are no messages, show the centered input box with greeting and suggestions
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center font-cool justify-center h-screen bg-white">
       
      <SplitText
          text="Hello, I am Sekmed, how can I help you today?"
          className="text-3xl text-center md:text-5xl font-bold text-zinc-800  h-20"
          delay={10}
          animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
          animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
          easing="easeOutCubic"
          threshold={1}
          rootMargin="-50px"
          onLetterAnimationComplete={handleAnimationComplete}
        />
        <MessageInput
          input={input}
          setInput={setInput}
          handleSend={handleSend}
          isListening={isListening}
          startListening={startListening}
          showDownload={showDownload}
          handleDownloadReport={handleDownloadReport}
          getLocations={handleGetLocations}
        />
        <SuggestedMessages onSuggestionClick={handleSuggestionClick} />
      </div>
    );
  }

  // Otherwise, show the regular chat view
  return (
    <div className="font-cool flex flex-col" style={{ height: "calc(100vh - 75px)" }}>
      <ChatMessages
        messages={messages}
        chatRef={chatRef}
        showDownload={showDownload}
        specialization={specialization}
        loadingSpec={loadingSpec}
        showMap={showMap}
        mapLocation={mapLocation}
      />
      <MessageInput
        input={input}
        setInput={setInput}
        handleSend={handleSend}
        isListening={isListening}
        startListening={startListening}
        showDownload={showDownload}
        handleDownloadReport={handleDownloadReport}
        getLocations={handleGetLocations}
      />
    </div>
  );
}

export default SymptomCheckerPage;