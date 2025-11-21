import React from "react";
import FileUploadFormDemo from "./UploadForm";

const page = () => {
  return (
    <div className="min-h-screen bg-background pt-24 pb-10 flex flex-col items-center">
      <div className="w-full max-w-2xl px-4 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Publish an Image</h1>
          <p className="text-muted-foreground">
            Upload your best images to share with your collection.
          </p>
        </div>

        <div className="bg-card border border-border rounded-3xl shadow-sm p-6 sm:p-10">
          <FileUploadFormDemo />
        </div>
      </div>
    </div>
  );
};

export default page;
