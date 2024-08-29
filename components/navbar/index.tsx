"use client";

import Link from "next/link";
import React from "react";
import { ThemeSwitch } from "../themes/ThemeSwitch";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { SettingsIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center mx-4 h-[calc(10vh)]">
      <div>
        <Link href={"/"}>
          <h1 className="font-black text-4xl">N_CHAT</h1>
        </Link>
      </div>
      <div className="flex space-x-4 items-center">
        <SignedIn>
          <UserButton />
        </SignedIn>
        <ThemeSwitch />
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/settings")}
        >
          <SettingsIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
