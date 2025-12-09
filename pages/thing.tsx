import Link from "next/link";
import React from "react";
import { useEffect } from "react";
export default function Thing() {
  useEffect(() => {
    console.log("FLAG:{EXPOSEDpath}");
  }, []);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 text-center px-5">
      <h1 className="text-6xl font-bold mb-5 text-gray-800">You're not supposed to be here</h1>
    </div>
  );
}