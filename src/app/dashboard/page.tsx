import { assertAuthenticated } from "@/lib/session";
import React from "react";

async function DashboarPage() {
  await assertAuthenticated();
  return (
    <div>
      <h1>Dashboard</h1>

      <p>put your dashboard stuff here</p>
    </div>
  );
}

export default DashboarPage;
