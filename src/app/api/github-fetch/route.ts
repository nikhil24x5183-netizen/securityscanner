import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { detail: "Please provide a valid GitHub repository URL." },
        { status: 400 }
      );
    }

    const match = url.trim().match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) {
      return NextResponse.json(
        { detail: "Invalid GitHub URL format. Example: https://github.com/owner/repository" },
        { status: 400 }
      );
    }

    const owner = match[1];
    const repo = match[2].replace(/\.git$/, "");

    // Fetch zipball from GitHub API server-side to avoid CORS restrictions
    const githubApiUrl = `https://api.github.com/repos/${owner}/${repo}/zipball`;
    const response = await fetch(githubApiUrl, {
      headers: {
        "User-Agent": "VibeShield-Security-Scanner",
        "Accept": "application/vnd.github.v3+json"
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { detail: `GitHub repository '${owner}/${repo}' was not found. Please verify the URL and ensure the repository is Public.` },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { detail: `GitHub API returned status ${response.status}. Could not fetch repository archive.` },
        { status: response.status }
      );
    }

    const arrayBuffer = await response.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${repo}.zip"`
      }
    });

  } catch (error: any) {
    console.error("GitHub fetch proxy error:", error);
    return NextResponse.json(
      { detail: error?.message || "Failed to fetch GitHub repository." },
      { status: 500 }
    );
  }
}
