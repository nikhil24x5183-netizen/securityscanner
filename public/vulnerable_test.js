// ============================================================
// ⚠️ VULNERABLE DEMO FILE (Scans: 40/100 - Grade F)
// ============================================================

// 1. Hardcoded Secret Key
const STRIPE_SECRET_KEY = "sk_live_9876543210fedcba";

// 2. Dangerous SQL Injection Concatenation
function getUser(userId) {
  const query = "SELECT * FROM users WHERE id = " + userId;
  return db.query(query);
}

// 3. Unsafe eval() Execution
function runCode(userCode) {
  eval(userCode);
}
