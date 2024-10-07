"use client";

import { useModel } from "@/app/lib/contexts/model-context";

export default function Header() {
    // const { selectedModel, setSelectedModel }  = useModel();

    // const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    //     const model = event.target.value;
    //     setSelectedModel(model);
    // };

    return (
        <header className="flex justify-between items-center mb-8">
            {/* <select
                className="px-4 py-2 rounded-lg shadow focus:outline-none bg-background dark:bg-neutral-700 dark:text-white"
                value={selectedModel}
                onChange={handleModelChange}
            >
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-4-turbo">GPT-4-turbo</option>
                <option value="gpt-4o">GPT-4o</option>
                <option value="gpt-4o-mini">GPT-4o-mini</option>
                <option value="gpt-3.5-turbo">GPT-3.5-turbo</option>
            </select> */}
            <h1 className="text-center text-xl font-semibold">
                My ChatBUDDY
            </h1>
            <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-sky-700 text-center text-white">
                    <p className="pt-3">User</p>
                </div>
            </div>
        </header>
    )
}