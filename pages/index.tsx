import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import React, { useState, useEffect } from 'react';
import { database } from "../firebase";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [masterState, setMasterState] = useState(0);
  const [input2, setInput2] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [pass, setPass] = useState('');

  useEffect(() => {
    const generatePassword = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let randomPass = '';
      for (let i = 0; i < 8; i++) {
        randomPass += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      console.log("Generated: ", randomPass);
      return randomPass;
    };

    setPass(generatePassword());
  }, []);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue === pass) { setMasterState(1) }
    else { setInputValue("") }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black`}
    >
      <main className="cursor-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-start py-32 px-16 bg-black text-white-500 sm:items-start">
        {masterState === 0 && (
          <>
            <div>
              <p className="break-words">SAVE ME: 01010011-01010001-01001100</p>
            </div>
            <div>
              <form onSubmit={handleSubmit} className="flex items-center">
                <label htmlFor="myTextbox" className="pr-2">{'PASSWORD:'}</label>
                <input
                  type="text"
                  id="myTextbox"
                  value={inputValue}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  className="bg-black text-white-500 focus:outline-none font-mono"
                />
              </form>
              <script>
              </script>
            </div>
          </>
        )}
        {masterState === 1 && (
          <div>
            <h1>BITCH! This chicken bland! It needs 512 grains of shalt</h1>
            <p className="max-w-md break-words">ba3253876aed6bc22d4a6ff53d8406c6ad864195ed144ab5c87621b6c233b548baeae6956df346ec8c17f5ea10f35ee3cbc514797ed7ddd3145464e2a0bab413</p>
            &nbsp;
            <p className="max-w-md break-words">c7ad44cbad762a5da0a452f9e854fdc1e0e7a52a38015f23f3eab1d80b931dd472634dfac71cd34ebc35d16ab7fb8a90c81f975113d6c7538dc69dd8de9077ec</p>
            &nbsp;
            <p className="max-w-md break-words">fa585d89c851dd338a70dcf535aa2a92fee7836dd6aff1226583e88e0996293f16bc009c652826e0fc5c706695a03cddce372f139eff4d13959da6f1f5d3eabe</p>
            &nbsp;
            <p className="max-w-md break-words">d9e6762dd1c8eaf6d61b3c6192fc408d4d6d5f1176d0c29169bc24e71c3f274ad27fcd5811b313d681f7e55ec02d73d499c95455b6b5bb503acf574fba8ffe85</p>
            &nbsp;
            <p className="max-w-md break-words">3627909a29c31381a071ec27f7c9ca97726182aed29a7ddd2e54353322cfb30abb9e3a6df2ac2c20fe23436311d678564d0c8d305930575f60e2d3d048184d79</p>
            &nbsp;
            <p className="max-w-md break-words">b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86</p>
            &nbsp;
            <p className="max-w-md break-words">5c05d25b14799ac1cfbc8a5f45109855e9fd5dd50ff910144f480371978413cb9da91446e524be1aab3a7bcdcc5a76552945596f7a065fdfb9be4610a062a9e0</p>
            &nbsp;
            <p className="max-w-md break-words">12b03226a6d8be9c6e8cd5e55dc6c7920caaa39df14aab92d5e3ea9340d1c8a4d3d0b8e4314f1f6ef131ba4bf1ceb9186ab87c801af0d5c95b1befb8cedae2b9</p>
            &nbsp;
            <p className="max-w-md break-words">eed96928d820d2de920f2294988414577c0069f878011a20f8091ed442d36ab73c93a2675567ca015a10337ae204202feab2ad3fc2353a1682f9190a33171e8a</p>
            &nbsp;
            <p className="max-w-md break-words">7fcf4ba391c48784edde599889d6e3f1e47a27db36ecc050cc92f259bfac38afad2c68a1ae804d77075e8fb722503f3eca2b2c1006ee6f6c7b7628cb45fffd1d</p>
            <form onSubmit={handleSubmit} className="flex items-center">
              <label htmlFor="myTextbox" className="pr-2">{'PASSWORD:'}</label>
              <input
                type="text"
                id="myTextbox"
                value={input2}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="bg-black text-white-500 focus:outline-none font-mono"
              />
            </form>
          </div>
        )}
        {masterState === 2 && (
          <div>

          </div>
        )}
      </main>
    </div>
  );
}
