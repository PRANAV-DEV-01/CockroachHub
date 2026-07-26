const MOCK_ADMIN = {
  id: 1,
  name: "Admin",
  email: "admin@cockroachhub.com",
  is_super: true,
  must_reset_pw: false,
  created_at: new Date().toISOString(),
  last_login: null,
};

const MOCK_PW = "admin123";

function safeToken(): string {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return "mock_" + crypto.randomUUID();
    }
  } catch {}
  return "mock_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const MOCK_TOKEN = safeToken();

export async function mockLogin(email: string, password: string) {
  await new Promise((r) => setTimeout(r, 300));
  if (email === MOCK_ADMIN.email && password === MOCK_PW) {
    return { access_token: MOCK_TOKEN, admin: MOCK_ADMIN };
  }
  throw new Error("Invalid email or password");
}
