import { metadata } from "@/app/layout";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Author } from "next/dist/lib/metadata/types/metadata-types";
import Link from "next/link";
import React from "react";

const Footer = () => {
  const [{ url, name }] = metadata.authors as Author[];

  return (
    <footer className="h-[calc(5vh)]">
      <Link href={url ?? "/"} className="flex justify-center items-center space-x-4">
        <GitHubLogoIcon />
        <p>{name}</p>
      </Link>
    </footer>
  );
};

export default Footer;
