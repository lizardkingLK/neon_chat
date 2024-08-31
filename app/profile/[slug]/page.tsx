"use client";

import { useOnlineSetStore } from "@/components/messaging/ably/ChatOnlineState";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { dateFormatterOptions, timeFormatterOptions } from "@/constants";
import { cn } from "@/lib/utils";
import { User } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";

const Profile = ({ params }: { params: { slug: string } }) => {
  const onlineSet = useOnlineSetStore((state) => state.onlineSet);

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
        <Skeleton className="h-[calc(200px)] w-[calc(200px)] rounded-full" />
        <Skeleton className="h-8 w-[300px] mt-4" />
        <Skeleton className="h-8 w-[150px] mt-4" />
        <Skeleton className="h-8 w-[150px] mt-4" />
      </div>
    );
  }

  return (
    <section>
      <div className="flex flex-col justify-between mx-4">
        <div>
          <h1 className="text-2xl font-black">PROFILE</h1>
          <small className="text-gray-500 mb-8">
            {params.slug} Details
          </small>
        </div>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center w-full m-4">
        <Image
          className="rounded-full w-auto h-auto"
          src={user?.imageUrl ?? "/favicon.png"}
          alt={username}
          width={200}
          height={200}
        />
        <h1 className="text-4xl mt-4">{params.slug}</h1>
        {onlineSet.includes(username) ? (
          <p className="mt-4 text-green-500">Active Now</p>
        ) : (
          <p className="mt-4 text-gray-500">{`Last Active ${new Date(
            Number(user?.lastActiveAt)
          ).toLocaleString("en-us", dateFormatterOptions)} ${new Date(
            Number(user?.lastActiveAt)
          ).toLocaleString("en-us", timeFormatterOptions)}`}</p>
        )}
        <Link
          href={"/chat"}
          className={cn(buttonVariants({ variant: "ghost" }), "mt-4")}
        >
          Close
        </Link>
      </div>
    </section>
  );
};

export default Profile;
