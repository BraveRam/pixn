import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/Navbar";
import React from "react";

export const metadata = {
  title: "Favorite | Pixn",
  description: "These are the images you have favorited in Pixn.",
  icons: {
    icon: "/favicon.ico",
  },
};

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mt-20">
      <Navbar />
      {children}

      <Footer />
    </div>
  );
};

export default layout;
