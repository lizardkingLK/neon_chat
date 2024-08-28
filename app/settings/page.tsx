"user client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import React from "react";

const Settings = () => {
  return (
    <section className="h-[calc(80vh)] mx-4">
      <h1 className="text-xl font-black">Settings</h1>
      <div className="flex items-center justify-between space-x-2 mt-4">
        <div className="flex flex-col">
          <p>Autoscroll</p>
          <small className="text-gray-400">Scolling when receiving a new message</small>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="auto-scroll-new" checked={true} />
          <Label htmlFor="auto-scroll-new">On</Label>
        </div>
      </div>
    </section>
  );
};

export default Settings;
