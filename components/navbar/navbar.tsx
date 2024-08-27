import Link from "next/link";
import React from "react";
import { ThemeSwitch } from "../themes/ThemeSwitch";
import { SignedIn, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center mx-4 h-[calc(10vh)]">
      <div>
        <Link href={"/"}>
          <h1 className="font-black text-4xl">N_CHAT</h1>
        </Link>
      </div>
      <div className="flex space-x-4 items-center">
        <ThemeSwitch />
        <SignedIn >
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default Navbar;
