import React from "react";
import { BsSoundwave } from "react-icons/bs";
import { TbTiltShift } from "react-icons/tb";
import { TbBrandGoogleMaps } from "react-icons/tb";

export default function MessageInput({
  input,
  setInput,
  handleSend,
  isListening,
  startListening,
  showDownload,
  handleDownloadReport,
  getLocations,
}) {
  return (
    <div className="flex mx-2 flex-wrap sm:flex-nowrap items-center md:gap-2 md:p-2 p-4 bg-zinc-800 border border-gray-300  rounded-2xl shadow-md md:w-full sm:w-full sm:mb-5 sm:mx-auto sm:max-w-[600px] min-w-[300px] md:max-w-[800px] md:mb-5 ">
      <button onClick={startListening}>
        <BsSoundwave className={`text-3xl mr-2 ${isListening ? "animate-pulse text-white" : "text-zinc-100"}`} />
      </button>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        className="min-w-0 flex-1 p-2 text-zinc-100 text-lg bg-transparent outline-none border-none"
      />
      <button
        onClick={handleSend}
        className="p-1 text-zinc-800 transition-all bg-zinc-100 rounded-full hover:bg-zinc-600 hover:text-zinc-400"
      >
        <TbTiltShift className="text-2xl" />
      </button>
      {showDownload && (
        <>
          
          <button
            onClick={getLocations}
            className="p-1 ml-1 text-red-500 transition-all bg-red-100 rounded-full hover:bg-zinc-600 hover:text-zinc-400"
          >
            <TbBrandGoogleMaps className="text-2xl" />
          </button>
        </>
      )}
    </div>
  );
}