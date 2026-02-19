import Navbar from "@/components/navbar/Navbar";
import React from "react";

export const metadata = {
  title: "Gallery | Pixn",
  description: "These are the images you have uploaded to Pixn.",
  icons: {
    icon: "/favicon.ico",
  },
};

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default layout;
