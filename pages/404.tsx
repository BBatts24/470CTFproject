import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 text-center px-5">
      <h1 className="text-6xl font-bold mb-5 text-gray-800">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/">
        <button className="px-5 py-2 text-base bg-blue-500 text-white border-none rounded hover:bg-blue-600 transition">
          Return to Home
        </button>
      </Link>
    </div>
  );
}
