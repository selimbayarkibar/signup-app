import { createClient } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic"; // always fetch fresh data per request

export default async function AdminPage() {
  const supabase = createClient();

  // ✅ Fetch authenticated user (session-aware)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // If user somehow reached this page without login
    return (
      <div className="p-6 text-center text-red-600">
        You must be logged in to view this page.
      </div>
    );
  }

  // ✅ Fetch all registered users
  const { data: users, error } = await supabase
    .from("users")
    .select("name, email, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error:", error.message);
    return (
      <div className="p-6 text-center text-red-600">
        Error loading users: {error.message}
      </div>
    );
  }

  return (
    <main className="min-h-screen p-6 bg-gray-100 relative flex flex-col items-center">
      {/* ✅ User info top-right */}
      <div className="absolute top-6 right-6 bg-white shadow px-4 py-2 rounded text-sm text-gray-700">
        Logged in as: <span className="font-semibold">{user.email}</span>
      </div>

      {/* ✅ Users Table */}
      <div className="max-w-4xl w-full bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Registered Users
        </h1>

        {users.length === 0 ? (
          <p className="text-center">No users found.</p>
        ) : (
          <table className="w-full table-auto border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">Email</th>
                <th className="border px-4 py-2 text-left">Signed Up</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={`${user.email}-${user.created_at}`}
                  className="hover:bg-gray-100"
                >
                  <td className="border px-4 py-2">{user.name}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">
                    {new Date(user.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ✅ Back Button */}
      <Link
        href="/"
        className="mt-6 block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-200 text-center max-w-xs"
      >
        ← Back to Homepage
      </Link>
    </main>
  );
}
