
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
      // useCot: useChainOfThought
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
    <div className="flex flex-col gap-2">
       {/* <div className="flex flex-col gap-2 w-[90%] max-w-2xl pt-0 pb-20 mx-auto stretch last:mb-16 mt-0">
         {messages.map((m) => (
          <div
            key={m.id}
            className={`whitespace-pre-wrap ${
              m.role === "user" ? "text-right bg-slate-50 p-2 rounded-md text-black dark:text-white dark:bg-black" : "bg-white p-2 rounded-md text-black dark:bg-black dark:text-white"
            }`}
          >
            {m.role === "user" ? (
              <div className="flex items-center justify-end">
                <span>User: </span>UserIcon
              </div>
            ) : (
              <div className="flex items-center">
                <span>AIIcon</span>
                <span>selectedModel:</span>
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
          </div>
        ))}
        </div> */}

      <div className="flex flex-col p-2 gap-2">
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
        className="flex flex-col gap-2 fixed bottom-0 p-2 w-full"
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
        <input
          value={input}
          placeholder="Send message..."
          onChange={event => {
            setInput(event.target.value);
          }}
          className="bg-zinc-100 w-full p-2 pb-6 dark:text-black"
          disabled={isLoading}
        />
      </form>
    </div>
  );
}
