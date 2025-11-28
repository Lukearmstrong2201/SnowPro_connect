export async function loginUser(email, password) {
  console.log("Password being sent:", password);
  const response = await fetch("http://localhost:8000/auth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      username: email,
      password,
    }),
  });

  let data;

  try {
    data = await response.json(); // may fail
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.detail || "Login failed");
  }

  return data;
}
