"use client";

import { ChatHeader } from "./components/ChatHeader";
import { ChatMessages } from "./components/ChatMessages";
import { ChatInput } from "./components/ChatInput";
import { LiveInsights } from "./components/LiveInsights";

export default function ChatPage() {
    return (
        <div className="flex h-[calc(100vh-6rem)] gap-6">
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <ChatHeader />
                <ChatMessages />
                <ChatInput />
            </div>

            {/* Right Sidebar */}
            <LiveInsights />
        </div>
    );
}
