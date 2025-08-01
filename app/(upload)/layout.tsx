import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/Navbar";
import React from "react";

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
