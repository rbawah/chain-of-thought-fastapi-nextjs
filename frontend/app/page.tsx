"use client";

// import { useChat } from "@ai-sdk/react";
import { useChat } from 'ai/react';
import { MdSend, MdAttachFile } from "react-icons/md";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { getTextFromDataUrl } from '@ai-sdk/ui-utils';
import clsx from 'clsx';

import { useEnterSubmit } from "@/app/lib/hooks/use-enter-submit";
import React, { useState, useRef, useEffect } from "react";
import { useAppContext } from "@/app/lib/contexts/model-context";


export default function Chat() {
  const { formRef, onKeyDown } = useEnterSubmit();
  const {
    selectedModel,
    setSelectedModel,
    useChainOfThought,
    setUseChainOfThought,
    selectedParameters,
    setSelectedParameters
  } = useAppContext();

  const getApi = (useCot: boolean) => {
    if (useCot) return "http://localhost:8000/api/chat-cot";
    return "http://localhost:8000/api/chat"
  }

  const { messages, input, append, setInput, isLoading } = useChat({
    api: getApi(useChainOfThought),
    streamProtocol: "text",
    body: {
      model: selectedModel,
      parameters: selectedParameters,
    }
  });

  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const UserIcon = () => {
    return (
    <div className="flex items-center space-x-4">
      <div className="w-8 h-8 rounded-full bg-sky-700 text-center text-white">
        <p className="pt-1">U</p>
      </div>
    </div>
    )
  }

  const AIIcon = () => {
    return (
    <div className="w-8 h-8 rounded-full bg-gray-700 text-center text-white flex items-center justify-center">
      <img src="/assets/openai-icon.svg" alt="AI Icon" className="w-6 h-6" />
    </div>
    )
  }

  return (
    <div className="flex justify-center items-center h-full bg-gray-200 dark:bg-neutral-800">
      <div className="flex flex-col gap-2 w-[90%] max-w-2xl pt-0 pb-20 mx-auto stretch last:mb-16 mt-0">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`whitespace-pre-wrap ${
              m.role === "user" ? "text-right bg-slate-50 p-2 rounded-md text-black dark:text-white dark:bg-black" : "bg-white p-2 rounded-md text-black dark:bg-black dark:text-white"
            }`}
          >
            {m.role === "user" ? (
              <div className="flex items-center justify-end">
                <span>User: </span><UserIcon />
              </div>
            ) : (
              <div className="flex items-center">
                <AIIcon />
                <span>{selectedModel}:</span>
              </div>
              )}
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={tomorrow}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {m.content}
            </ReactMarkdown>
            <div className="flex flex-row gap-2">
                {m.experimental_attachments?.map((attachment, index) =>
                  attachment.contentType?.includes('image/') ? (
                    <img
                      key={`${m.id}-${index}`}
                      className="w-24 h-24 rounded-md"
                      src={attachment.url}
                      alt={attachment.name}
                    />
                  ) : attachment.contentType?.includes('text/') ? (
                    <div className="w-32 h-24 rounded-md text-xs ellipsis overflow-hidden p-2 text-zinc-500 border">
                      {getTextFromDataUrl(attachment.url)}
                    </div>
                  ) : null,
                )}
              </div>
          </div>
        ))}
        </div>

        <form
          ref={formRef}
          // onSubmit={handleSubmit}
          onSubmit={event => {
            event.preventDefault();
  
            append(
              { role: 'user', content: input },
              {
                experimental_attachments: files,
              },
            );
  
            setFiles(undefined);
            setInput('');
  
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }}
          className="fixed bottom-0 w-full max-w-2xl bg-gray-200 dark:bg-gray-800 p-0.5 shadow-lg rounded-full mb-6 z-10"
        >
          <div className="flex flex-row fixed left bottom-32 items-end">
            {files
              ? Array.from(files).map(attachment => {
                  const { type } = attachment;
                  if (type.startsWith('image/')) {
                    return (
                      <div key={attachment.name}>
                        <img
                          className="w-24 h-24 rounded-md"
                          src={URL.createObjectURL(attachment)}
                          alt={attachment.name}
                        />
                        <span className="text-sm text-zinc-500">
                          {attachment.name}
                        </span>
                      </div>

                    );
                  } else if (type.startsWith('text/')) {
                    return (
                      <div
                        key={attachment.name}
                        className="w-24 text-zinc-500 flex-shrink-0 text-sm flex flex-col gap-1"
                      >
                        <div className="w-16 h-20 bg-zinc-100 rounded-md" />
                        {attachment.name}
                      </div>
                    );
                  }
                })
              : ''}
          </div>

          <div className="flex items-center bg-background dark:bg-neutral-700 max-h-60 w-full grow overflow-hidden pr-4 sm:pr-4 rounded-full">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              // className="p-2 bg-gray-200 rounded-full text-black hover:bg-gray-300"
              className={clsx(
                "p-2 bg-gray-200 rounded-full text-black hover:bg-gray-300",
                useChainOfThought && "hidden"
              )}
            >
              <MdAttachFile size={24} />
            </button>
            
            {/* Hidden File Input */}
            <input
              type="file"
              onChange={event => {
                if (event.target.files) {
                  setFiles(event.target.files);
                }
              }}
              multiple
              ref={fileInputRef}
              className="hidden"
            />

            <textarea
              value={input}
              placeholder="Ask something..."
              onChange={event => {
                setInput(event.target.value);
              }}
              className="border-gray-300 min-h-[60px] w-full resize-none bg-transparent px-2 py-0 focus-within:outline-none sm:text-lg rounded-full"
              disabled={isLoading}
              onKeyDown={onKeyDown}
            />
            <button
              type='submit'
              disabled={isLoading}
              className="relative text-xl text-gray-400 hover:text-gray-900"
            >
              <MdSend size={28} />
            </button>
            </div>
        </form>
    </div>
  );
}
