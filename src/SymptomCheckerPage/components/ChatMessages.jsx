import React from "react";
import { TbMedicalCrossCircle } from "react-icons/tb";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export default function ChatMessages({ messages, chatRef, showDownload, specialization, loadingSpec }) {
  return (
    <div
      ref={chatRef}
      className="flex-1 overflow-y-auto px-4 py-2 space-y-4 bg-white w-full max-w-[800px] mx-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent scroll-smooth"
      style={{ scrollbarWidth: "thin", scrollbarColor: "transparent transparent" }}
    >
      {messages.map((message) => (
        <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
          <div className="flex items-start">
            {message.sender === "system" && (
              <div className="mr-1">
                <TbMedicalCrossCircle size={24} className="text-black mt-[6px]" />
              </div>
            )}
            <div
              className={`max-w-2xl py-1 px-4 rounded-3xl text-md md:text-lg transition-transform duration-300 break-words ${
                message.sender === "user" ? "bg-gray-200 text-black" : "text-black"
              }`}
            >
              <ReactMarkdown className="markdown" remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {message.text}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      ))}
      {showDownload && (
        <>
          {loadingSpec && <p className="text-center text-black mt-2 animate-pulse">Fetching specialization</p>}
          {specialization && (
            <p className="text-center rounded-full text-black font-medium mt-2">
              Recommended Specialization: {specialization}
            </p>
          )}
        </>
      )}
    </div>
  );
}