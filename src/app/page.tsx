import { redirect } from "next/navigation";

export default async function Homepage() {
  redirect("/sign-in");
}
