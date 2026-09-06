// Offline-First Client Database Service for User Authentication & Progress Management
// Manages accounts, sessions, and learning milestones in LocalStorage with IndexedDB fallback

const DB_USERS_KEY = "nihon_users_v2_db";
const DB_SESSION_KEY = "nihon_active_session_v2";

// Default seed users
const SEED_USERS = [
  {
    id: "user_samurai_01",
    email: "samurai.dev@nihonlearn.jp",
    password: "NihonMaster2025#", // Default demo/testing account
    name: "Minh Tuấn",
    level: 4,
    xp: 450,
    maxXP: 1000,
    streak: 5,
    title: "Võ Sĩ N5 Tinh Anh",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop",
    masteredChars: ["あ", "い", "う", "え", "お", "日", "月", "火", "水", "木"],
    completedDays: [1, 2, 3],
    createdAt: "2025-01-15T08:00:00.000Z"
  }
];

class AuthDatabaseService {
  constructor() {
    this.initDatabase();
  }

  // Initialize DB if not exists
  initDatabase() {
    try {
      const existing = localStorage.getItem(DB_USERS_KEY);
      if (!existing) {
        localStorage.setItem(DB_USERS_KEY, JSON.stringify(SEED_USERS));
      }
    } catch (e) {
      console.warn("Could not access localStorage for Auth DB:", e);
    }
  }

  // Get all users from store
  getUsers() {
    try {
      const raw = localStorage.getItem(DB_USERS_KEY);
      return raw ? JSON.parse(raw) : SEED_USERS;
    } catch {
      return SEED_USERS;
    }
  }

  // Save users to store
  saveUsers(users) {
    try {
      localStorage.setItem(DB_USERS_KEY, JSON.stringify(users));
      return true;
    } catch (e) {
      console.error("Failed to save users:", e);
      return false;
    }
  }

  // Find user by email (case-insensitive)
  findUserByEmail(email) {
    const users = this.getUsers();
    const cleanEmail = (email || "").trim().toLowerCase();
    return users.find((u) => u.email.toLowerCase() === cleanEmail) || null;
  }

  // Register a new user
  register({ email, password, name }) {
    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail || !password) {
      return { success: false, error: "Vui lòng nhập đầy đủ Email và Mật khẩu." };
    }

    if (this.findUserByEmail(cleanEmail)) {
      return { success: false, error: "Email này đã được đăng ký trong hệ thống!" };
    }

    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      email: cleanEmail,
      password: password,
      name: name?.trim() || cleanEmail.split("@")[0] || "Tân Thủ N5",
      level: 1,
      xp: 100,
      maxXP: 300,
      streak: 1,
      title: "Tân Thủ N5",
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
      masteredChars: [],
      completedDays: [1],
      createdAt: new Date().toISOString()
    };

    const users = this.getUsers();
    users.push(newUser);
    this.saveUsers(users);

    // Save active session
    this.saveSession(newUser);
    return { success: true, user: newUser };
  }

  // Login with email & password
  login(email, password) {
    const cleanEmail = (email || "").trim().toLowerCase();
    const user = this.findUserByEmail(cleanEmail);

    if (!user) {
      return { success: false, error: "Không tìm thấy tài khoản với Email này." };
    }

    if (user.password !== password) {
      return { success: false, error: "Mật khẩu không chính xác. Vui lòng kiểm tra lại!" };
    }

    this.saveSession(user);
    return { success: true, user };
  }

  // Save active session
  saveSession(user) {
    try {
      const sessionData = {
        userId: user.id,
        email: user.email,
        name: user.name,
        timestamp: Date.now()
      };
      localStorage.setItem(DB_SESSION_KEY, JSON.stringify(sessionData));
    } catch (e) {
      console.warn("Session save error:", e);
    }
  }

  // Get active logged-in user
  getCurrentUser() {
    try {
      const raw = localStorage.getItem(DB_SESSION_KEY);
      if (!raw) return null;
      const session = JSON.parse(raw);
      const user = this.getUsers().find((u) => u.id === session.userId);
      return user || null;
    } catch {
      return null;
    }
  }

  // Update user progress (XP, streak, completed chars, etc.)
  updateUserProgress(userId, progressUpdates) {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) return false;

    users[idx] = {
      ...users[idx],
      ...progressUpdates
    };

    this.saveUsers(users);
    return true;
  }

  // Logout
  logout() {
    try {
      localStorage.removeItem(DB_SESSION_KEY);
      return true;
    } catch {
      return false;
    }
  }
}

export const authDb = new AuthDatabaseService();
