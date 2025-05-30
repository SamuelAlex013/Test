"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

type DataEntry = {
  id: number;
  title: string;
  structured_data: string;
  semi_structured_data: string | object;
};

type User = {
  id: string;
  username?: string;
  emailAddresses: { emailAddress: string }[];
};

export default function QueryClientPage({ user }: { user: User }) {
  const { getToken } = useAuth();
  const [data, setData] = useState<DataEntry[]>([]);
  const [title, setTitle] = useState("");
  const [structured, setStructured] = useState("");
  const [semiStructured, setSemiStructured] = useState("");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch("http://localhost:8000/data/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      setError("Failed to fetch data");
      setData([]); // fallback to empty array
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
    setError(null);
    const payload = {
      title,
      structured_data: structured,
      semi_structured_data: (() => {
        try {
          return JSON.parse(semiStructured);
        } catch {
          return semiStructured;
        }
      })(),
    };

    try {
      const token = await getToken();
      if (!token) {
        setError("No token found");
        return;
      }
      const res = await fetch(
        editId ? `http://localhost:8000/data/${editId}` : "http://localhost:8000/data/",
        {
          method: editId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      console.log("Fetch sent");
      if (!res.ok) throw new Error("Failed to save data");

      await loadData();
      setTitle("");
      setStructured("");
      setSemiStructured("");
      setEditId(null);
    } catch (err: any) {
      setError(err instanceof Error ? err.message : "Error occurred");
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = await getToken();
      const res = await fetch(`http://localhost:8000/data/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete");

      await loadData();
    } catch (err: any) {
      setError(err.message || "Error occurred");
    }
  };

  const startEdit = (entry: DataEntry) => {
    setEditId(entry.id);
    setTitle(entry.title);
    setStructured(entry.structured_data);
    setSemiStructured(
      typeof entry.semi_structured_data === "string"
        ? entry.semi_structured_data
        : JSON.stringify(entry.semi_structured_data)
    );
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-100 to-blue-200">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-6xl w-full">
        <h1 className="text-3xl font-extrabold text-purple-700 mb-6 text-center">
          Data Management Table
        </h1>

        <p className="mb-4 text-gray-600 text-center">
          Logged in as {" "}
          <span className="font-semibold">
            {user.username || user.emailAddresses[0]?.emailAddress}
          </span>
        </p>

        <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-2 border rounded text-gray-900"
            required
          />
          <input
            type="text"
            placeholder="Structured Field"
            value={structured}
            onChange={(e) => setStructured(e.target.value)}
            className="p-2 border rounded text-gray-900"
          />
          <input
            type="text"
            placeholder="Semi-Structured Field"
            value={semiStructured}
            onChange={(e) => setSemiStructured(e.target.value)}
            className="p-2 border rounded text-gray-900"
          />
          <button
            type="submit"
            className="md:col-span-3 py-2 px-4 bg-purple-600 text-white font-semibold rounded hover:bg-purple-700 transition"
          >
            {editId ? "Update" : "Create"} Data
          </button>
            {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setTitle("");
                setStructured("");
                setSemiStructured("");
              }}
              className="md:col-span-3 py-2 px-4 bg-gray-300 text-gray-800 font-semibold rounded hover:bg-gray-400 transition mt-2"
            >
              Cancel
            </button>
          )}
        </form>

        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 bg-white shadow-sm rounded-lg">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 border-b text-gray-700 font-bold text-center">ID</th>
                  <th className="p-3 border-b text-gray-700 font-bold text-center">Title</th>
                  <th className="p-3 border-b text-gray-700 font-bold text-center">Structured</th>
                  <th className="p-3 border-b text-gray-700 font-bold text-center">Semi-Structured</th>
                  <th className="p-3 border-b text-gray-700 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={`text-sm text-gray-900 text-center ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-purple-50 transition`}
                  >
                    <td className="p-2 border-b">{item.id}</td>
                    <td className="p-2 border-b">{item.title}</td>
                    <td className="p-2 border-b">{item.structured_data}</td>
                    <td className="p-2 border-b whitespace-pre-wrap">
                      {typeof item.semi_structured_data === "string"
                        ? item.semi_structured_data
                        : JSON.stringify(item.semi_structured_data)}
                    </td>
                    <td className="p-2 border-b space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditId(item.id);
                          setTitle(item.title);
                          setStructured(item.structured_data);
                          setSemiStructured(
                            typeof item.semi_structured_data === "string"
                              ? item.semi_structured_data
                              : JSON.stringify(item.semi_structured_data)
                          );
                        }}
                        className="text-blue-700 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="text-red-700 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
