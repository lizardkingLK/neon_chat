"use client";

import React, { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import QRCode from "react-qr-code";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { MessageCircle } from "lucide-react";

const Index = () => {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    setUrl(`${window.location.href}chat`);
  }, []);

  return (
    <main className="flex flex-col justify-center items-center space-y-4 h-[calc(90vh)]">
      <QRCode value={url} />
      <div className="flex space-x-4 items-center">
        <MessageCircle size={32} />
        <h1 className="text-center font-black text-xl">NEON Chat</h1>
      </div>
      <h3 className="text-center text-gray-500">
        Message your people. <br />
        Let them know what you are up to.
      </h3>
      <Link href={"/chat"} className={buttonVariants()}>
        Chat Now
      </Link>
    </main>
  );
};

export default Index;
