"use client";

import {
  useSettingsStore,
  useSettingsStoreManager,
} from "@/components/navbar/SettingsState";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";

const settingsApi = "/api/settings";

const Settings = () => {
  const [isLoading, setLoading] = useState(true);

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
        console.log({ settings: data?.settings });
        initializeSettings(data?.settings!);
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
        console.log("updated settings");
      }
    });
  };

  useEffect(() => {
    getSettings();
  }, [getSettings]);

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
            <Label htmlFor="auto-scroll-new">{autoScroll ? "On" : "Off"}</Label>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2 mt-4">
        <Link
          href="/chat"
          className={buttonVariants({ variant: "destructive" })}
        >
          Cancel
        </Link>
        <Button variant={"secondary"} onClick={handleSave}>
          Save
        </Button>
      </div>
    </section>
  );
};

export default Settings;
