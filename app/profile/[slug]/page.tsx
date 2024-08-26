"use client";

import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { User } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";

const Profile = ({ params }: { params: { slug: string } }) => {
  const [isLoading, setLoading] = useState(true);
  const [username] = useState(params.slug);
  const [user, setUser] = useState<User | null>(null);

  const getUser = useCallback(async () => {
    await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify({ username }),
    })
      .then((response) => response.json())
      .then((data) => setUser(data?.user));
  }, [username]);

  useEffect(() => {
    const initialize = async () => {
      await getUser();
      setLoading(false);
    };

    initialize();
  }, [getUser]);

  if (isLoading) {
    return (
      <div className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center w-full m-4">
        <Skeleton className="h-[calc(100px)] w-[calc(100px)] rounded-full" />
        <Skeleton className="h-8 w-[300px] mt-4" />
        <Skeleton className="h-8 w-[150px] mt-4" />
        <Skeleton className="h-8 w-[150px] mt-4" />
      </div>
    );
  }

  return (
    <div className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center w-full m-4">
      <Image
        src={user?.imageUrl ?? "/favicon.png"}
        alt={username}
        width={100}
        height={100}
      />
      <h1 className="text-4xl mt-4">{params.slug}</h1>
      <p className="mt-4 text-gray-500">
        Last Active {new Date(Number(user?.lastActiveAt)).toLocaleDateString()}
      </p>
      <Link
        href={"/chat"}
        className={cn(buttonVariants({ variant: "ghost" }), "mt-4")}
      >
        Go Back
      </Link>
    </div>
  );
};

export default Profile;
