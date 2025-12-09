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
      return randomPass;
    };

    setPass(generatePassword());
  }, []);

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
            prev + `FLAG ACCEPTED\n${5 - correctFlags - 1} FLAGS REMAINING\n`
        );
        if (correctFlags === 5) {
          setLog((prev) => prev + "ALL FLAGS COLLECTED! CONGRATULATIONS!\n");
        }
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
    } else if (user?.privilege !== "admin" && user?.privilege !== "user") {
      setLog((prev) => prev + "ERROR: UNKNOWN PRIVILEGE LEVEL\n");
      setLog((prev) => prev + "LOST DATA: FLAG:{unknownPRIV}\n");
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

  const handleChange = (e: any) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (inputValue === pass) {
      setLog(log + "PRELIMINARY ACCESS GRANTED\nASSIGN DATABASE PORTFOLIO\n");
      setMasterState(1);
    } else {
      setInputValue("");
    }
  };

  const handleSubmit2 = (e: any) => {
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

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handleKeyDown2 = (e: any) => {
    if (e.key === "Enter") {
      handleSubmit2(e);
    }
  };

  const handleKeyDown3 = (e: any) => {
    if (e.key === "Enter") {
      setPrevCommand(inputValue);
      handleCommand(e);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setInputValue(prevCommand);
    }
  };

  async function handleCommand(e: any) {
    e.preventDefault();
    const command = inputValue.trim();
    if (command === "HELP") {
      setLog(
        log +
          'AVAILABLE COMMANDS:\nHELP - DISPLAY THIS MESSAGE\nDISPLAY - DISPLAY ALL READABLE DATA\nWRITE "data" - WRITE DATA\nINFO - DISPLAY SYSTEM INFO\nCLEAR - CLEAR THE LOG\nFLAG "flag" - SUBMIT A FLAG\nHINT "1-5" - GET A HINT FOR A FLAG\n'
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
    } else if (command.startsWith("HINT ")) {
      const hintNumber = command.slice(5);
      const hints: Record<string, string> = {
        "1": "HINT 1: There are files your not supposed to see",
        "2": "HINT 2: Admins get to know the super secret data.",
        "3": "HINT 3: Punch the hash until it breaks.",
        "4": "HINT 4: You have been user and admin, but not ...",
        "5": "HINT 5: When what is not found is found, watch your traffic closely.",
      };
      if (hints[hintNumber]) {
        setLog((prev) => prev + hints[hintNumber] + "\n");
      } else {
        setLog((prev) => prev + "ERROR: INVALID HINT NUMBER\n");
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
      </main>
    </div>
  );
}
