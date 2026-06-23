// Simple central place for talking to our backend.
// Change BASE_URL here if your backend runs on a different port/host.
export const BASE_URL = "http://localhost:8080";

// Small helper so every fetch call doesn't have to repeat the same boilerplate.
// Pass `auth: true` to automatically attach the saved token as a header.
export async function apiFetch(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = localStorage.getItem("token");
    if (token) headers.token = token;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    // backend always sends { message: "..." } on errors
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}
