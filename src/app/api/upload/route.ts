import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

const ALLOWED_EXTENSIONS = new Set([
  ".py", ".js", ".jsx", ".ts", ".tsx", ".java", ".c", ".cpp",
  ".cs", ".go", ".rs", ".php", ".html", ".css", ".sql", ".sh", ".json", ".yaml", ".yml"
]);

const IGNORED_DIRS = new Set([
  "node_modules", ".git", ".venv", "venv", "env", "__pycache__",
  "dist", "build", ".next", ".idea", ".vscode"
]);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file || !file.name.endsWith(".zip")) {
      return NextResponse.json(
        { detail: "Please upload a valid .zip file." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    const extractedFiles: { fileName: string; content: string }[] = [];

    for (const [relativePath, zipEntry] of Object.entries(zip.files)) {
      if (zipEntry.dir) continue;

      const parts = relativePath.split("/");
      const isIgnored = parts.some(part => IGNORED_DIRS.has(part) || part.startsWith("."));
      if (isIgnored) continue;

      const ext = relativePath.substring(relativePath.lastIndexOf(".")).toLowerCase();
      if (ALLOWED_EXTENSIONS.has(ext)) {
        const text = await zipEntry.async("string");
        if (text.trim()) {
          extractedFiles.push({
            fileName: relativePath,
            content: text
          });
        }
      }
    }

    if (extractedFiles.length === 0) {
      return NextResponse.json(
        { detail: "No readable source code files found in the uploaded zip repository." },
        { status: 422 }
      );
    }

    const findings = await analyzeCodeWithLLM(extractedFiles);

    return NextResponse.json({
      success: true,
      filename: file.name,
      filesAnalyzedCount: extractedFiles.length,
      findings
    });

  } catch (error: any) {
    console.error("Upload handler error:", error);
    return NextResponse.json(
      { detail: error?.message || "An unexpected error occurred during zip scanning." },
      { status: 500 }
    );
  }
}

async function analyzeCodeWithLLM(files: { fileName: string; content: string }[]) {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  let combinedCode = "";
  for (const f of files.slice(0, 25)) {
    combinedCode += `\n--- FILE: ${f.fileName} ---\n${f.content}\n`;
  }

  const systemPrompt = `
You are an expert Cyber Security Specialist and Code Reviewer. 
Analyze the provided source code for security vulnerabilities (e.g., SQL injection, XSS, hardcoded secrets, weak auth) and syntax/logic errors.

STRICT OUTPUT REQUIREMENT:
Return ONLY a valid JSON array of objects. Do not include markdown block markers like \`\`\`json ... \`\`\` or any conversational text before/after.
Each object in the JSON array MUST contain these exact keys:
- fileName: string (the relative file path)
- issueType: string (Must be either 'Vulnerability' or 'Error')
- severity: string (Must be one of 'Low', 'Medium', 'High', 'Critical')
- simpleExplanation: string (A clear, plain-English explanation of what is wrong and why it matters without excessive jargon)
- solutionCode: string (The exact corrected code snippet or file fix)
`;

  if (geminiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey: geminiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `${systemPrompt}\n\nHere is the codebase to analyze:\n${combinedCode}`
      });
      if (response.text) {
        return parseLLMJson(response.text);
      }
    } catch (e) {
      console.warn("Gemini API error, using fallback scan:", e);
    }
  }

  if (openaiKey) {
    try {
      const openai = new OpenAI({ apiKey: openaiKey });
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: combinedCode }
        ],
        temperature: 0.2
      });
      const text = completion.choices[0]?.message?.content;
      if (text) {
        return parseLLMJson(text);
      }
    } catch (e) {
      console.warn("OpenAI API error:", e);
    }
  }

  // Fallback heuristic scanner when API keys aren't configured yet
  return fallbackHeuristicScan(files);
}

function parseLLMJson(rawText: string) {
  let cleaned = rawText.trim();
  if (cleaned.startsWith("```json")) cleaned = cleaned.slice(7);
  if (cleaned.startsWith("```")) cleaned = cleaned.slice(3);
  if (cleaned.endsWith("```")) cleaned = cleaned.slice(0, -3);
  cleaned = cleaned.trim();

  try {
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) return parsed;
  } catch (err) {
    console.error("JSON parse error from LLM:", err);
  }
  return [];
}

function fallbackHeuristicScan(files: { fileName: string; content: string }[]) {
  const results: any[] = [];

  for (const f of files) {
    const fname = f.fileName;
    const content = f.content;

    // Hardcoded credentials check
    if (/(api_key|password|secret|token)\s*=\s*["'][A-Za-z0-9_\-]{8,}["']/i.test(content)) {
      results.push({
        fileName: fname,
        issueType: "Vulnerability",
        severity: "Critical",
        simpleExplanation: "Hardcoded secret or API key detected in source code. Credentials stored directly in source repositories can be leaked or exposed.",
        solutionCode: "// Use environment variables instead:\nconst API_KEY = process.env.MY_API_KEY;"
      });
    }

    // SQL Injection check
    if (/SELECT\s+.*\s+FROM\s+.*\+\s*\w+|f["'].*SELECT.*\{/i.test(content) || /SELECT.*WHERE.*\+\s*\w+/i.test(content)) {
      results.push({
        fileName: fname,
        issueType: "Vulnerability",
        severity: "High",
        simpleExplanation: "Dynamic SQL query construction using string concatenation opens the application to SQL Injection attacks.",
        solutionCode: "// Use parameterized queries:\nconst result = await db.query('SELECT * FROM users WHERE id = $1', [userId]);"
      });
    }

    // Exception handling check
    if (/catch\s*\(\w*\)\s*\{\s*\}/i.test(content) || /except:\s*pass/i.test(content)) {
      results.push({
        fileName: fname,
        issueType: "Error",
        severity: "Medium",
        simpleExplanation: "Empty exception handling block silently swallows errors, masking runtime failures and making debugging difficult.",
        solutionCode: "try {\n  await performAction();\n} catch (err) {\n  console.error('Operation failed:', err);\n  throw err;\n}"
      });
    }
  }

  if (results.length === 0 && files.length > 0) {
    results.push({
      fileName: files[0].fileName,
      issueType: "Error",
      severity: "Low",
      simpleExplanation: "No high-risk vulnerabilities detected. Recommended adding automated SAST scanners and dependency auditors to your CI/CD pipeline.",
      solutionCode: "// Add automated security audit workflow to Github Actions:\n// npm audit || bandit -r ."
    });
  }

  return results;
}
