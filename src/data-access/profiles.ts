import { db } from "@/db";
import { profiles } from "@/db/schema";
import { UserId } from "lucia";

export async function createProfile(
  userId: UserId,
  displayName: string,
  image?: string
) {
  const [profile] = await db.insert(profiles).values({
    userId,
    displayName,
    image,
  });

  return profile;
}
