"use client";

import clsx from "clsx";

import { useAppContext } from "@/app/lib/contexts/model-context";

export default function Sidebar() {

    const { 
        selectedModel,
        setSelectedModel,
        useChainOfThought,
        setUseChainOfThought,
        selectedParameters,
        setSelectedParameters
    } = useAppContext();

    const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const model = event.target.value;
        setSelectedModel(model);
    };

    const handleChainOfThoughtChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setUseChainOfThought(event.target.value === 'true');
    };

    const handleParametersToUsechange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedParameters(event.target.value);
    };

    return (
        <aside className="flex flex-col w-64 fixed h-screen bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white p-4 z-10">
                {/* <a href="/" className="block py-2 px-4 rounded hover:bg-gray-700">Home</a>
                <a href="/files" className="block py-2 px-4 rounded hover:bg-gray-700">Files</a> */}

            <div className="flex items-center space-x-2 pt-6">
                <h1 className="">Select model</h1>
            </div>

            <div className="pb-6">
            <select
                className="px-4 py-1 rounded-lg shadow focus:outline-none bg-background dark:bg-neutral-700 dark:text-white"
                value={selectedModel}
                onChange={handleModelChange}
            >
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-4-turbo">GPT-4-turbo</option>
                <option value="gpt-4o">GPT-4o</option>
                <option value="gpt-4o-mini">GPT-4o-mini</option>
                <option value="gpt-3.5-turbo">GPT-3.5-turbo</option>
            </select>
            </div>

            <div className="flex items-center space-x-2 pt-6">
                <h1 className="">Use Chain of Thought?</h1>
            </div>
            <select
            className="px-4 py-1 rounded-lg shadow focus:outline-none bg-background dark:bg-neutral-700 dark:text-white"
            value={useChainOfThought.toString()}
            onChange={handleChainOfThoughtChange}
            >
                <option value="false">No</option>
                <option value="true">Yes</option>
            </select>
            
            <div className={clsx(
                !useChainOfThought && "hidden"
            )}>
                <div className="flex items-center space-x-2 pt-6">
                    <h1 className="">Parameters to use</h1>
                </div>
                <select
                className="px-4 py-1 rounded-lg shadow focus:outline-none bg-background dark:bg-neutral-700 dark:text-white"
                value={selectedParameters}
                onChange={handleParametersToUsechange}
                >
                    <option value="default">Default</option>
                    <option value="custom">Custom</option>
                </select>
            </div>
        </aside>
    )
}
