import { assertAuthenticated, getCurrentUser } from "@/lib/session";
import React from "react";

async function DashboarPage() {
  await assertAuthenticated();

  const user = await getCurrentUser();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>put your dashboard stuff here {user?.id}</p>
    </div>
  );
}

export default DashboarPage;
