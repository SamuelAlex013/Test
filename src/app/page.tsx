// app/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/query");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="bg-white rounded-xl shadow-lg p-10 max-w-md w-full text-center">
        <h1 className="text-4xl font-extrabold text-purple-700 mb-4">
          Welcome to{" "}
          <span className="text-blue-600">DB Manager</span>
        </h1>
        <p className="mt-2 mb-8 text-gray-600 text-lg">
          Please sign in to access your data.
        </p>
        <a
          href="https://allowing-flamingo-63.accounts.dev/sign-in"
          className="inline-block px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow hover:bg-purple-700 transition"
        >
          Sign In
        </a>
      </div>
    </main>
  );
}
