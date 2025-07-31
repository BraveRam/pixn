"use client";

export default function Error({ error }: { error: Error }) {
  return <div>An error occured: {error.message}</div>;
}
