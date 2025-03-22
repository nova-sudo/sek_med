import React from "react";
import { BsSoundwave } from "react-icons/bs";
import { TbTiltShift } from "react-icons/tb";
import { HiDownload } from "react-icons/hi";
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
    <div className="flex flex-wrap sm:flex-nowrap items-center md:gap-2 md:p-2 p-4 border border-gray-300 bg-white rounded-2xl shadow-md md:w-full sm:w-full sm:mb-5 sm:mx-auto sm:max-w-[600px] min-w-[300px] md:max-w-[800px] md:mb-5 mx-auto">
      <button onClick={startListening}>
        <BsSoundwave className={`text-3xl mr-2 ${isListening ? "animate-pulse text-gray-800" : "text-zinc-800"}`} />
      </button>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        className="min-w-0 flex-1 p-2 text-lg bg-transparent outline-none border-none"
      />
      <button
        onClick={handleSend}
        className="p-1 text-blue-500 transition-all bg-blue-100 rounded-full hover:bg-blue-600 hover:text-white"
      >
        <TbTiltShift className="text-2xl" />
      </button>
      {showDownload && (
        <>
          {/* <button
            onClick={handleDownloadReport}
            className="p-1 text-blue-500 transition-all bg-blue-100 rounded-full hover:bg-blue-600 hover:text-white"
          >
            <HiDownload className="text-2xl" />
          </button> */}
          <button
            onClick={getLocations}
            className="p-1 ml-1 text-red-500 transition-all bg-red-100 rounded-full hover:bg-red-600 hover:text-white"
          >
            <TbBrandGoogleMaps className="text-2xl" />
          </button>
        </>
      )}
    </div>
  );
}