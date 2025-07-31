import Navbar from "@/components/Navbar";
import { Github, MessageCircle } from "lucide-react";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-gradient-to-b from-zinc-900 to-black text-white">
      <Navbar />
      {children}

      <div className="flex flex-col justify-center items-center h-[50vh]">
        <p>© 2025 Pixn. All rights reserved.</p>
        <div className="flex justify-center gap-6 text-white mt-2">
          <a
            href="https://t.me/plxor"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle />
          </a>
          <a
            href="https://github.com/braveram/pixn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github />
          </a>
        </div>
      </div>
    </div>
  );
};

export default layout;
