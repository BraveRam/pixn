"use client";

import React from "react";

const Error = ({ error }: { error: Error }) => {
  return (
    <div>
      <h1>An error occurred while confirming your email address.</h1>
      <p>{error.message}</p>
    </div>
  );
};

export default Error;
