"use client";

import { useState, useEffect } from "react";

export default function EmailConfigPage() {
  const [configs, setConfigs] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [connectionType, setConnectionType] = useState("IMAP");
  const [host, setHost] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const response = await fetch("/api/email-ingestion");
      if (!response.ok) throw new Error("Failed to fetch configurations");
      const data = await response.json();
      setConfigs(data);
    } catch (err) {
      setError("Error fetching configurations");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/email-ingestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, connectionType, host, username, password }),
      });

      if (!response.ok) throw new Error("Failed to save configuration");

      setEmail("");
      setHost("");
      setUsername("");
      setPassword("");
      fetchConfigs();
    } catch (err) {
      setError("Error saving configuration");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/email-ingestion/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete configuration");
      fetchConfigs();
    } catch (err) {
      setError("Error deleting configuration");
    }
  };

  const handleCheckInbox = async () => {
    try {
      const response = await fetch("/api/email-ingestion/check", { method: "POST" });
      if (!response.ok) throw new Error("Inbox check failed");
      alert("Inbox checked successfully!");
    } catch (err) {
      alert("Failed to check inbox.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Email Configuration</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-6 rounded-lg shadow">
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            required
          />
          <select
            value={connectionType}
            onChange={(e) => setConnectionType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="IMAP">IMAP</option>
            <option value="POP3">POP3</option>
            <option value="Gmail API">Gmail API</option>
            <option value="Outlook/Graph API">Outlook/Graph API</option>
          </select>
          <input
            type="text"
            placeholder="Host"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password/Token"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Configuration"}
          </button>
        </div>
      </form>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Saved Configurations</h2>
      <ul className="w-full max-w-lg bg-white p-6 rounded-lg shadow">
        {configs.length > 0 ? (
          configs.map((config) => (
            <li
              key={config.id}
              className="flex justify-between items-center p-2 border-b border-gray-200"
            >
              <span className="text-black">{config.email}</span>
              <button
                onClick={() => handleDelete(config.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-600">No configurations saved.</p>
        )}
      </ul>

      <div className="text-center mt-8">
        <button
          onClick={handleCheckInbox}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition"
        >
          Check Inbox
        </button>
      </div>
    </div>
  );
}
