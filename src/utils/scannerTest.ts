import { runSecurityScan } from './scannerEngine';

const VULNERABLE_TEST_SAMPLE = `
const API_KEY = "sk_test_123456789";

const user = {
    id: 1,
    email: "admin@test.com",
    password: "Admin123",
    passwordHash: "$2b$10$abcdefghijklmnop",
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake",
    refreshToken: "refresh-token",
    apiKey: API_KEY
};

app.get("/users", (req, res) => {
    res.json(user);
});
`;

const SAFE_TEST_SAMPLE = `
import express from 'express';

const app = express();
const API_KEY = process.env.API_KEY;

app.get("/users", async (req, res) => {
    const userId = req.query.id;
    const safeUser = await db.user.findUnique({
        where: { id: String(userId) },
        select: { id: true, email: true, name: true }
    });
    res.json(safeUser);
});
`;

export function runAutomatedTests() {
  console.log("=== VIBESHIELD AUTOMATED TEST SUITE ===");
  
  // Test 1: Intentionally Vulnerable Sample
  const vulnResult = runSecurityScan(VULNERABLE_TEST_SAMPLE, 'vulnerable_sample.js', 'file');
  console.log(`\n[TEST 1] Vulnerable Sample Result:`);
  console.log(`Score: ${vulnResult.score}/100`);
  console.log(`Total Findings: ${vulnResult.totalIssues}`);
  console.log(`Critical Count: ${vulnResult.criticalCount}`);
  
  const test1Passed = vulnResult.score < 10 && vulnResult.totalIssues >= 3;
  console.log(`Test 1 Passed (Score < 10 & Findings >= 3): ${test1Passed ? '✅ YES' : '❌ NO'}`);

  // Test 2: Clean Safe Sample
  const safeResult = runSecurityScan(SAFE_TEST_SAMPLE, 'safe_sample.js', 'file');
  console.log(`\n[TEST 2] Safe Sample Result:`);
  console.log(`Score: ${safeResult.score}/100`);
  console.log(`Total Findings: ${safeResult.totalIssues}`);
  
  const test2Passed = safeResult.score === 100 && safeResult.totalIssues === 0;
  console.log(`Test 2 Passed (Score == 100 & 0 Findings): ${test2Passed ? '✅ YES' : '❌ NO'}`);

  return test1Passed && test2Passed;
}
