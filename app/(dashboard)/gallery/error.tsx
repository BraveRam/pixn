"use client";

export default function Error({ error }: { error: Error }) {
  return (
    <div className="flex justify-center items-center h-[50vh]">
      {error.message}
    </div>
  );
}
