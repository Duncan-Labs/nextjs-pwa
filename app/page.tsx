"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import logo from "../public/icons/apple-touch-icon.png";
import Image from "next/image";

const base64ToUint8Array = (base64: string | undefined) => {
  const padding = "=".repeat((4 - ((base64?.length ?? 0) % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(b64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const Home = () => {
  const router = useRouter();

  return (
    <main className="flex min-h-screen items-center p-12 space-y-4">
      <div className="w-full">
        <form className="bg-white rounded px-8 pt-6 pb-8 mb-4">
          <div className="w-full pb-10">
            <Image src={logo} alt="Accelerant Research" />
            {/* <h1 className="text-4xl font-bold text-center">
              Accelerant Research
            </h1> */}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Username"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="******************"
            />
            <p className="text-red-500 text-xs italic">
              Please choose a password.
            </p>
          </div>
          <div className="flex flex-col items-center justify-between">
            <button
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => router.push("/notify")}
            >
              Sign In
            </button>
            <a
              className="inline-block align-baseline mt-4 text-xs text-blue-500 hover:text-blue-800"
              href="#"
            >
              Forgot Password?
            </a>
          </div>
        </form>
        <p className="text-center text-gray-500 text-xs">
          &copy;2020 Accelerant Research. All rights reserved.
        </p>
      </div>
    </main>
  );
};

export default Home;
