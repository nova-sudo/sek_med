import React, { useRef } from "react";
import ChatMessages from "../SymptomCheckerPage/components/ChatMessages";
import MessageInput from "../SymptomCheckerPage/components/MessageInput";
import LoadingScreen from "../SymptomCheckerPage/components/LoadingScreen";
import useChat from "../SymptomCheckerPage/hooks/useChat";
import useSpeechRecognition from "../SymptomCheckerPage/hooks/useSpeechRecognition";
import "../SymptomCheckerPage.css";

function SymptomCheckerPage() {
  const chatRef = useRef(null);
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
      />
      <MessageInput
        input={input}
        setInput={setInput}
        handleSend={handleSend}
        isListening={isListening}
        startListening={startListening}
        showDownload={showDownload}
        handleDownloadReport={handleDownloadReport}
        getLocations={getLocations}
      />
    </div>
  );
}

export default SymptomCheckerPage;