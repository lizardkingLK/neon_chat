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

const EnterIsSend = () => {
  const settings = useSettingsStore((state) => state);

  const updateSettings = useSettingsStoreManager(
    (state) => state.updateSettings
  );

  const { enterIsSend } = settings;

  return (
    <>
      <div className="flex flex-col">
        <p>Enter Is Send</p>
        <small className="text-gray-400">
          When pressing enter message gets sent
        </small>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="enter-is-send"
          defaultChecked={enterIsSend}
          onClick={() =>
            updateSettings({ ...settings, enterIsSend: !enterIsSend })
          }
        />
      </div>
    </>
  );
};

const MessagesExpiring = () => {
  const settings = useSettingsStore((state) => state);

  const updateSettings = useSettingsStoreManager(
    (state) => state.updateSettings
  );

  const { expiringMessages } = settings;

  return (
    <>
      <div className="flex flex-col">
        <p>Expiring Messages</p>
        <small className="text-gray-400">
          Messages to be deleted after 24hrs
        </small>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="expiring-messages"
          defaultChecked={expiringMessages}
          onClick={() =>
            updateSettings({ ...settings, expiringMessages: !expiringMessages })
          }
        />
      </div>
    </>
  );
};

const AutoScrolling = () => {
  const settings = useSettingsStore((state) => state);

  const updateSettings = useSettingsStoreManager(
    (state) => state.updateSettings
  );

  const { autoScroll } = settings;

  return (
    <>
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
    </>
  );
};

function Settings() {
  const [isInitializing, setInitializing] = useState(true);

  const { toast } = useToast();

  const settings = useSettingsStore((state) => state);
  const initializeSettings = useSettingsStoreManager(
    (state) => state.initializeSettings
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

  return (
    <section className="flex flex-col justify-between h-[calc(85vh)] mx-4">
      <div>
        <h1 className="text-2xl font-black">SETTINGS</h1>
        <small className="text-gray-500 mb-8">Personalize your Chat Experience</small>
        <div className="flex items-center justify-between space-x-2 mt-8">
          <AutoScrolling />
        </div>
        <div className="flex items-center justify-between space-x-2 mt-8">
          <EnterIsSend />
        </div>
        <div className="flex items-center justify-between space-x-2 mt-8">
          <MessagesExpiring />
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
}

export default Settings;
