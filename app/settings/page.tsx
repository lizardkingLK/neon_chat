"use client";

import CircularLoader from "@/components/loader/circular";
import {
  useSettingsStore,
  useSettingsStoreManager,
} from "@/components/navbar/SettingsState";
import { Button, buttonVariants } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";

const settingsApi = "/api/settings";

const Settings = () => {
  const { toast } = useToast();

  const [isInitializing, setInitializing] = useState(true);

  const settings = useSettingsStore((state) => state);
  const initializeSettings = useSettingsStoreManager(
    (state) => state.initializeSettings
  );
  const updateSettings = useSettingsStoreManager(
    (state) => state.updateSettings
  );

  const getSettings = useCallback(async () => {
    await fetch(settingsApi)
      .then((response) => response.json())
      .then((data) => {
        initializeSettings(data?.settings!);
        setInitializing(false);
      });
  }, [initializeSettings]);

  const handleUpdateRequest = async () => {
    const response = await fetch(settingsApi, {
      method: "POST",
      body: JSON.stringify(settings),
    });

    return await response.json();
  };

  const handleSave = async () => {
    await handleUpdateRequest().then(({ success }) => {
      if (success) {
        toast({ description: "Settings Updated!" });
      }
    });
  };

  useEffect(() => {
    getSettings();
  }, [getSettings]);

  if (isInitializing) {
    return (
      <section className="flex flex-col justify-center h-[calc(85vh)] w-full">
        <CircularLoader />
      </section>
    );
  }

  const { autoScroll } = settings;

  return (
    <section className="flex flex-col justify-between h-[calc(85vh)] mx-4">
      <div>
        <h1 className="text-xl font-black">Settings</h1>
        <div className="flex items-center justify-between space-x-2 mt-4">
          <div className="flex flex-col">
            <p>Autoscroll</p>
            <small className="text-gray-400">
              Scolling when a new message receives
            </small>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-scroll-new"
              defaultChecked={autoScroll}
              onClick={() =>
                updateSettings({ ...settings, autoScroll: !autoScroll })
              }
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2 mt-4">
        <Link href="/chat" className={buttonVariants({ variant: "outline" })}>
          Close
        </Link>
        <Button variant={"secondary"} onClick={handleSave}>
          Save
        </Button>
      </div>
    </section>
  );
};

export default Settings;
