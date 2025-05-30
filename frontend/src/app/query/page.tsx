// app/query/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { clerkClient } from "@clerk/clerk-sdk-node";
import QueryClientPage from "./QueryClientPage";

export default async function QueryPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("https://allowing-flamingo-63.accounts.dev/sign-in");
  }

  let user;
  try {
    user = await clerkClient.users.getUser(userId);
  } catch {
    redirect("https://allowing-flamingo-63.accounts.dev/sign-in");
  }

  return <QueryClientPage user={{
    id: user.id,
    username: user.username ?? undefined,
    emailAddresses: JSON.parse(JSON.stringify(user.emailAddresses)),
  }} />;
}
