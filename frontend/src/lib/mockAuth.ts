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
const MOCK_TOKEN = "mock_" + crypto.randomUUID();

export async function mockLogin(email: string, password: string) {
  await new Promise((r) => setTimeout(r, 400));
  if (email === MOCK_ADMIN.email && password === MOCK_PW) {
    return { access_token: MOCK_TOKEN, admin: MOCK_ADMIN };
  }
  throw new Error("Invalid credentials");
}
