import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import React, { useState, useEffect, use } from "react";
import { database, auth } from "../firebase";
import { ref, set, get, push } from "firebase/database";
import { createHash } from "crypto";
import {
  signInAnonymously,
  linkWithCredential,
  GoogleAuthProvider,
} from "firebase/auth";

interface User {
  id: string;
  username: string;
  p: string;
  privilege: string;
  data: Record<string, any>;
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [masterState, setMasterState] = useState(1);
  const [input2, setInput2] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [input3, setInput3] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [pass, setPass] = useState("");
  const [log, setLog] = useState("");
  const [prevCommand, setPrevCommand] = useState("");
  const [correctFlags, setCorrectFlags] = useState(0);

  useEffect(() => {
    const generatePassword = () => {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let randomPass = "";
      for (let i = 0; i < 8; i++) {
        randomPass += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      console.log("INFO");
      console.log("Boot successful.");
      console.log("Preliminary access necessary.");
      console.log("LOGS");
      console.log("LOGs");
      console.log("LOgs");
      console.log("Logs");
      console.log("logs");
      console.log("LOG");
      console.log("LOg");
      console.log("Log");
      console.log("log");
      console.log("Character Set: ", chars);
      console.log("Password Length: 8");
      console.log("Total Combinations: ", Math.pow(chars.length, 8));
      console.log(
        "super secret ultimate password generated successfully: ",
        randomPass
      );
      console.log("data");
      console.log("testing");
      console.log("stuff");
      console.log("more stuff");
      console.log("successfull things");
      console.log("great progress");
      console.log("logging info");
      return randomPass;
    };

    setPass(generatePassword());
  }, []);

  (function () {
    async function writeUserData(
      name: string,
      pass: string,
      privilege?: string,
      uid?: string
    ) {
      // Prefer an explicit uid (argument) or the currently-authenticated user id.
      // If neither is available, fall back to push() which generates a new key.
      const targetUid = uid ?? (auth.currentUser ? auth.currentUser.uid : null);

      if (targetUid) {
        const userQuery = ref(database, `users/${targetUid}`);
        const userSnapshot = await get(userQuery);
        if (userSnapshot.exists()) {
          const existingUser = userSnapshot.val() as User;
          const updatedUser: User = {
            ...existingUser,
            username: name ? name : existingUser.username,
            p: pass ? pass : existingUser.p,
            privilege: privilege ? privilege : existingUser.privilege,
          };
          await set(userQuery, updatedUser);
          return;
        }

        const newUser: User = {
          id: targetUid,
          username: name,
          p: pass,
          privilege: privilege ? privilege : "user",
          data: {},
        };
        // Store the user object at users/<targetUid> so the UID is the object key.
        await set(userQuery, newUser);
        return;
      }

      // No uid available — create a new entry with a generated key.
      const pushedRef = push(ref(database, `users/`));
      const generatedKey = pushedRef.key ?? "unknown";
      const newUserFallback: User = {
        id: generatedKey,
        username: name,
        p: pass,
        privilege: privilege ? privilege : "user",
        data: {},
      };
      await set(pushedRef, newUserFallback);
    }
    if (typeof window !== "undefined" && window.hasOwnProperty("document")) {
      (window as any).writeUserData = writeUserData;
    }
  })();

  async function fetchUserData(): Promise<User | undefined> {
    const userQuery = ref(
      database,
      `users/${auth.currentUser ? auth.currentUser.uid : "unknown"}`
    );
    console.log("UID: ", auth.currentUser ? auth.currentUser.uid : "unknown");
    const userSnapshot = await get(userQuery);
    console.log("User snapshot: ", userSnapshot.val());
    if (userSnapshot.exists()) {
      return userSnapshot.val() as User;
    }
  }

  async function checkFLag(flag: string) {
    const flagQuery = ref(database, "flags/");
    const flagSnapshot = await get(flagQuery);
    if (flagSnapshot.exists()) {
      if (Object.values(flagSnapshot.val()).includes(flag)) {
        setCorrectFlags(correctFlags + 1);
        setLog(
          (prev) =>
            prev + `FLAG ACCEPTED\n${5 - correctFlags} FLAGS REMAINING\n`
        );
      } else {
        setLog((prev) => prev + "FLAG REJECTED\n");
      }
    }
  }

  async function display() {
    const collectionRef = ref(database, "data/");
    const snapshot = await get(collectionRef);
    const user = await fetchUserData();
    console.log("User fetched for display:", user);
    if (snapshot.exists()) {
      const data = Object.values(snapshot.val()) as string[];
      setLog((prev) => prev + "DATA:\n");
      for (let item of data) {
        setLog((prev) => prev + item + "\n");
      }
    }
    if (user?.privilege === "admin") {
      const secureCollectionRef = ref(database, "secureData/");
      const secureSnapshot = await get(secureCollectionRef);
      if (secureSnapshot.exists()) {
        const secureData = Object.values(secureSnapshot.val()) as string[];
        setLog((prev) => prev + "SECURE DATA:\n");
        for (let item of secureData) {
          setLog((prev) => prev + item + "\n");
        }
      }
    }
  }

  async function writeToUser(data: string, locale?: number) {
    if (locale === 1) {
      const userRef = push(ref(database, "secureData/"));
      await set(userRef, data);
    } else if (locale === 2) {
      const userRef = push(ref(database, "flags/"));
      await set(userRef, data);
    } else {
      const userRef = push(ref(database, `data/`));
      await set(userRef, data);
    }
  }

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue === pass) {
      setLog(log + "PRELIMINARY ACCESS GRANTED\nASSIGN DATABASE PORTFOLIO\n");
      setMasterState(1);
    } else {
      setInputValue("");
    }
  };

  const handleSubmit2 = (e) => {
    e.preventDefault();
    if (!username) {
      setUsername(inputValue);
      setLog(log + `USERNAME SET TO: ${inputValue}\n`);
      setInputValue("");
    } else if (!password) {
      setPassword(inputValue);
      signInAnonymously(auth);
      setLog(
        log +
          `PASSWORD SET TO: ${inputValue}\nASSIGNED ROLE: USER\nLIMITED QUERY ACCESS GRANTED\nTYPE 'HELP' FOR A LIST OF COMMANDS\n`
      );
      writeUserData(username, password);
      setInputValue("");
      //setMasterState(2);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handleKeyDown2 = (e) => {
    if (e.key === "Enter") {
      handleSubmit2(e);
    }
  };

  const handleKeyDown3 = (e) => {
    if (e.key === "Enter") {
      setPrevCommand(inputValue);
      handleCommand(e);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setInputValue(prevCommand);
    }
  };

  async function handleCommand(e) {
    e.preventDefault();
    const command = inputValue.trim();
    if (command === "HELP") {
      setLog(
        log +
          'AVAILABLE COMMANDS:\nHELP - DISPLAY THIS MESSAGE\nDISPLAY - DISPLAY ALL READABLE DATA\nWRITE "data" - WRITE DATA\nINFO - DISPLAY SYSTEM INFO\nCLEAR - CLEAR THE LOG\nFLAG "flag" - SUBMIT A FLAG\n'
      );
    } else if (command === "DISPLAY") {
      display();
    } else if (command.startsWith("WRITE ")) {
      let dataToWrite = command.slice(6);
      if (dataToWrite.startsWith("-FLAG ")) {
        dataToWrite = dataToWrite.slice(6);
        if (dataToWrite.length > 0) {
          writeToUser(dataToWrite, 2);
          setLog((prev) => prev + `DATA WRITTEN: ${dataToWrite}\n`);
        } else {
          setLog((prev) => prev + "ERROR: NO DATA PROVIDED\n");
        }
        setInputValue("");
        return;
      }
      if (dataToWrite.startsWith("-SECURE ")) {
        dataToWrite = dataToWrite.slice(8);
        if (dataToWrite.length > 0) {
          writeToUser(dataToWrite, 1);
          setLog((prev) => prev + `DATA WRITTEN: ${dataToWrite}\n`);
        } else {
          setLog((prev) => prev + "ERROR: NO DATA PROVIDED\n");
        }
        setInputValue("");
        return;
      }
      if (dataToWrite.length > 0) {
        writeToUser(dataToWrite);
        setLog((prev) => prev + `DATA WRITTEN: ${dataToWrite}\n`);
      } else {
        setLog((prev) => prev + "ERROR: NO DATA PROVIDED\n");
      }
    } else if (command === "INFO") {
      setLog(
        (prev) =>
          prev +
          `CURRENT CONFIGURATION:\n PRIVILEGE CAN EITHER BE user OR admin\n ASSIGNED THROUGH GLOBAL\n FLAGS HIGHLIGHTED BY {}\n`
      );
    } else if (command === "CLEAR") {
      setLog("");
    } else if (command.startsWith("FLAG")) {
      if (command.length === 4) {
        setLog((prev) => prev + `YOU HAVE ${correctFlags}/5 FLAGS\n`);
        setInputValue("");
        return;
      }
      const flag = command.slice(5);
      if (flag.length > 0) {
        checkFLag(flag);
      } else {
        setLog((prev) => prev + "ERROR: NO FLAG PROVIDED\n");
      }
    } else {
      setLog(
        (prev) =>
          prev +
          `UNKNOWN COMMAND: ${command}\nTYPE 'HELP' FOR A LIST OF COMMANDS\n`
      );
    }
    setInputValue("");
  }

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black`}
    >
      <main className="cursor-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-start py-32 px-16 bg-black text-white-500 sm:items-start">
        {masterState === 0 && (
          <>
            <div>
              <p className="break-words">PRELIMINARY ACCESS</p>
            </div>
            <div>
              <form onSubmit={handleSubmit} className="flex items-center">
                <label htmlFor="myTextbox" className="pr-2">
                  {"PASSWORD:"}
                </label>
                <input
                  type="text"
                  id="myTextbox"
                  value={inputValue}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  className="bg-black text-white-500 focus:outline-none border-none font-mono whitespace-pre-wrap break-words"
                  autoComplete="off"
                />
              </form>
            </div>
          </>
        )}
        {masterState === 1 && (
          <div>
            {!username && (
              <div>
                <pre>{log}</pre>
                <form onSubmit={handleSubmit2} className="flex items-center">
                  <label htmlFor="myTextbox" className="pr-2">
                    {"USERNAME >"}
                  </label>
                  <input
                    type="text"
                    id="myTextbox"
                    value={inputValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown2}
                    className="bg-black text-white-500 focus:outline-none border-none font-mono whitespace-pre-wrap break-words"
                    autoFocus
                    autoComplete="off"
                  />
                </form>
              </div>
            )}
            {username && !password && (
              <div>
                <pre>{log}</pre>
                <form onSubmit={handleSubmit2} className="flex items-center">
                  <label htmlFor="myTextbox" className="pr-2">
                    {"PASSWORD >"}
                  </label>
                  <input
                    type="text"
                    id="myTextbox"
                    value={inputValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown2}
                    className="bg-black text-white-500 focus:outline-none border-none font-mono overflow-auto break-words"
                    autoFocus
                    autoComplete="off"
                  />
                </form>
              </div>
            )}
            {username && password && (
              <div>
                <pre dangerouslySetInnerHTML={{ __html: log }}></pre>
                <form onSubmit={handleSubmit2} className="flex items-center">
                  <label htmlFor="myTextbox" className="pr-2">
                    {">"}
                  </label>
                  <input
                    type="text"
                    id="myTextbox"
                    value={inputValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown3}
                    className="bg-black text-white-500 focus:outline-none border-none font-mono w-full break-words"
                    autoFocus
                    autoComplete="off"
                  />
                </form>
              </div>
            )}
          </div>
        )}
        {masterState === 2 && (
          <div>
            <h1>BITCH! This chicken bland! It needs 512 grains of shalt</h1>
            <p className="max-w-md break-words">
              ba3253876aed6bc22d4a6ff53d8406c6ad864195ed144ab5c87621b6c233b548baeae6956df346ec8c17f5ea10f35ee3cbc514797ed7ddd3145464e2a0bab413
            </p>
            &nbsp;
            <p className="max-w-md break-words">
              c7ad44cbad762a5da0a452f9e854fdc1e0e7a52a38015f23f3eab1d80b931dd472634dfac71cd34ebc35d16ab7fb8a90c81f975113d6c7538dc69dd8de9077ec
            </p>
            &nbsp;
            <p className="max-w-md break-words">
              fa585d89c851dd338a70dcf535aa2a92fee7836dd6aff1226583e88e0996293f16bc009c652826e0fc5c706695a03cddce372f139eff4d13959da6f1f5d3eabe
            </p>
            &nbsp;
            <p className="max-w-md break-words">
              d9e6762dd1c8eaf6d61b3c6192fc408d4d6d5f1176d0c29169bc24e71c3f274ad27fcd5811b313d681f7e55ec02d73d499c95455b6b5bb503acf574fba8ffe85
            </p>
            &nbsp;
            <p className="max-w-md break-words">
              3627909a29c31381a071ec27f7c9ca97726182aed29a7ddd2e54353322cfb30abb9e3a6df2ac2c20fe23436311d678564d0c8d305930575f60e2d3d048184d79
            </p>
            &nbsp;
            <p className="max-w-md break-words">
              b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86
            </p>
            &nbsp;
            <p className="max-w-md break-words">
              5c05d25b14799ac1cfbc8a5f45109855e9fd5dd50ff910144f480371978413cb9da91446e524be1aab3a7bcdcc5a76552945596f7a065fdfb9be4610a062a9e0
            </p>
            &nbsp;
            <p className="max-w-md break-words">
              12b03226a6d8be9c6e8cd5e55dc6c7920caaa39df14aab92d5e3ea9340d1c8a4d3d0b8e4314f1f6ef131ba4bf1ceb9186ab87c801af0d5c95b1befb8cedae2b9
            </p>
            &nbsp;
            <p className="max-w-md break-words">
              eed96928d820d2de920f2294988414577c0069f878011a20f8091ed442d36ab73c93a2675567ca015a10337ae204202feab2ad3fc2353a1682f9190a33171e8a
            </p>
            &nbsp;
            <p className="max-w-md break-words">
              7fcf4ba391c48784edde599889d6e3f1e47a27db36ecc050cc92f259bfac38afad2c68a1ae804d77075e8fb722503f3eca2b2c1006ee6f6c7b7628cb45fffd1d
            </p>
            <form onSubmit={handleSubmit} className="flex items-center">
              <label htmlFor="myTextbox" className="pr-2">
                {"PASSWORD:"}
              </label>
              <input
                type="text"
                id="myTextbox"
                value={input2}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="bg-black text-white-500 focus:outline-none border-none font-mono whitespace-pre-wrap break-words"
              />
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
