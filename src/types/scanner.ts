export type Severity = "Low" | "Medium" | "High" | "Critical";
export type IssueType = "Vulnerability" | "Error";

export interface Finding {
  fileName: string;
  issueType: IssueType;
  severity: Severity;
  simpleExplanation: string;
  solutionCode: string;
}

export interface ScanResponse {
  success: boolean;
  filename: string;
  filesAnalyzedCount: number;
  findings: Finding[];
}
