"use client";
import Image from "next/image";
import React from "react";

const ImageComponent = ({ avatar_url }: { avatar_url: string }) => {
  return (
    // <Image
    //   src={avatar_url}
    //   alt="avatar"
    //   fill
    //   loading="eager"
    //   priority
    //   className="object-cover rounded-2xl opacity-1 transition-opacity duration-500"
    //   // onLoadingComplete={(img) => img.classList.remove("opacity-0")}
    // />
    <img
      src={avatar_url}
      alt="User uploaded image"
      className="h-full w-full object-cover"
      loading="lazy"
    />
  );
};

export default ImageComponent;
