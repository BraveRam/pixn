import Navbar from "@/components/navbar/Navbar";
import React from "react";

export const metadata = {
  title: "Upload | Pixn",
  description: "Upload your images to Pixn.",
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
