import { Github, MessageCircle } from "lucide-react";
import React from "react";

const Footer = () => {
  return (
    <div className="flex flex-col justify-center items-center h-[50vh] mt-[-150px] md:mt-[-50px] lg:mt-[-50px] xl:mt-[-50px]">
      <p>© 2025 Pixn. All rights reserved.</p>
      <div className="flex justify-center gap-6 text-white mt-2">
        <a href="https://t.me/plxor" target="_blank" rel="noopener noreferrer">
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
  );
};

export default Footer;
