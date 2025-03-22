import React, { useRef, useState } from "react";
import ChatMessages from "../SymptomCheckerPage/components/ChatMessages";
import MessageInput from "../SymptomCheckerPage/components/MessageInput";
import LoadingScreen from "../SymptomCheckerPage/components/LoadingScreen";
import useChat from "../SymptomCheckerPage/hooks/useChat";
import useSpeechRecognition from "../SymptomCheckerPage/hooks/useSpeechRecognition";
import "../App.css";

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

  if (showLoadingScreen) {
    return <LoadingScreen />;
  }

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