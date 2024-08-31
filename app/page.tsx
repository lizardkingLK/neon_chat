import React from "react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import Logo from "@/components/logo";

const Index = () => {
  return (
    <main className="flex flex-col justify-center items-center space-y-4 h-[calc(90vh)]">
      <Logo />
      <div className="flex space-x-4 items-center">
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
