export type VulnerabilitySeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type VulnerabilityCategory = 'SECRET' | 'DATABASE' | 'ENDPOINT' | 'INJECTION' | 'RLS' | 'PII' | 'CRYPTO' | 'AUTH';

export interface AttackStep {
  stepNumber: number;
  phase: string;
  action: string;
  payload?: string;
  result: string;
  status: 'pending' | 'active' | 'exploited';
}

export interface FinancialRiskInfo {
  estimatedHourlyCost: number;
  maxPotentialLoss: number;
  vector: string;
  riskDescription: string;
}

export interface Vulnerability {
  id: string;
  title: string;
  cwe: string;
  owasp?: string;
  confidence: 'HIGH' | 'CONFIRMED';
  category: VulnerabilityCategory;
  severity: VulnerabilitySeverity;
  file: string;
  lineStart: number;
  lineEnd: number;
  vulnerableVariable?: string;
  vulnerableSnippet: string;
  secureSnippet: string;
  whyVulnerable: string;
  attackPath: string;
  impact: string;
  secureExplanation: string;
  laymanExplanation: {
    analogy: string;
    description: string;
    impact: string;
  };
  engineerExplanation: {
    vector: string;
    cweDescription: string;
    technicalDetails: string;
    protocolRisk: string;
  };
  attackSteps: AttackStep[];
  financialRisk: FinancialRiskInfo;
}

export interface SecurityMetrics {
  secretScore: number;
  dbScore: number;
  endpointScore: number;
}

export interface ScanReport {
  score: number;
  totalIssues: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  metrics: SecurityMetrics;
  vulnerabilities: Vulnerability[];
  scannedAt: string;
  fileName: string;
  inputMode: 'text' | 'prompt' | 'file' | 'directory';
}

export * from './scanner';
