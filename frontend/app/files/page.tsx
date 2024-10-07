
"use client"

import { getTextFromDataUrl } from '@ai-sdk/ui-utils';
import { useChat } from 'ai/react';
import { useRef, useState, useEffect } from 'react';

import { MdSend, MdAttachFile } from "react-icons/md";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useDebouncedCallback } from 'use-debounce';


export default function Chat() {
  const { messages, input, setInput, append, isLoading } = useChat({
    api: 'http://localhost:8000/api/chat',
    streamProtocol: "text",
    body: {
      model: 'gpt-4o',
    }
  });

  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

//   console.log(`messages: ${JSON.stringify(messages)}`);
  const debouncedLog = useDebouncedCallback(() => {
    console.log(`Searching... ${JSON.stringify(messages)}`);
  }, 300);

useEffect(() => {
  debouncedLog();
}, [messages]);
  

  return (
    <div className="flex justify-center items-center h-full bg-gray-200 dark:bg-neutral-800">
      <div className="flex flex-col gap-2 w-[90%] max-w-2xl pt-0 pb-20 mx-auto stretch last:mb-16 mt-0">
        {messages.map(message => (
          <div key={message.id} className="flex flex-row gap-2">
            <div className="w-24 text-zinc-500 flex-shrink-0">{`${message.role}: `}</div>

            <div className="flex flex-col gap-2">
              {message.content}

              <div className="flex flex-row gap-2">
                {message.experimental_attachments?.map((attachment, index) =>
                  attachment.contentType?.includes('image/') ? (
                    <img
                      key={`${message.id}-${index}`}
                      className="w-24 rounded-md"
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
          </div>
        ))}
      </div>

      <form
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
        className="fixed bottom-0 w-full max-w-2xl bg-gray-200 dark:bg-gray-800 p-0.5 shadow-lg rounded-2xl mb-6 z-10"
      >
        <div className="flex flex-row gap-2 fixed right-2 bottom-14 items-end">
          {files
            ? Array.from(files).map(attachment => {
                const { type } = attachment;

                if (type.startsWith('image/')) {
                  return (
                    <div key={attachment.name}>
                      <img
                        className="w-24 rounded-md"
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
        <input
          type="file"
          onChange={event => {
            if (event.target.files) {
              setFiles(event.target.files);
            }
          }}
          multiple
          ref={fileInputRef}
        />
        <div className="flex items-center bg-background dark:bg-neutral-700 max-h-60 w-full grow overflow-hidden pr-4 sm:pr-6 rounded-2xl">
        <input
          value={input}
          placeholder="Send message..."
          onChange={event => {
            setInput(event.target.value);
          }}
          className="bg-zinc-100 w-full p-2 pb-6 dark:text-black"
          disabled={isLoading}
        />
          <button
            type="submit"
            disabled={isLoading}
            className="relative p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600">
            <MdSend size={24} />
          </button>
        </div>
      </form>
    </div>
  );
}
