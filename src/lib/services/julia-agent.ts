import { BlockchainTransaction, AgentAnalysis, JuliaAgent } from '@/types';

interface AIServiceConfig {
  useJulep: boolean;
  useMock: boolean;
  julepApiKey?: string;
  julepBaseUrl?: string;
  customHost?: string;
  customPort?: number;
  timeout: number;
}

export class JuliaAgentService {
  private config: AIServiceConfig;

  constructor() {
    // Determine which AI service to use based on environment configuration
    const useMock = process.env.USE_MOCK_AI_SERVICE === 'true';
    const julepApiKey = process.env.JULEP_API_KEY;
    const customHost = process.env.CUSTOM_AI_HOST;
    
    this.config = {
      useJulep: !useMock && !!julepApiKey,
      useMock: useMock || (!julepApiKey && !customHost),
      julepApiKey: julepApiKey,
      julepBaseUrl: process.env.JULEP_BASE_URL || 'https://api.julep.ai',
      customHost: customHost || 'localhost',
      customPort: parseInt(process.env.CUSTOM_AI_PORT || '8052'),
      timeout: parseInt(process.env.CUSTOM_AI_TIMEOUT || '30000')
    };

    console.log('AI Service Configuration:', {
      useJulep: this.config.useJulep,
      useMock: this.config.useMock,
      hasJulepKey: !!this.config.julepApiKey
    });
  }

  async analyzeTransaction(
    transaction: BlockchainTransaction,
    addressRisks: Array<Record<string, unknown>> = [],
    pathData: Array<Record<string, unknown>> = []
  ): Promise<AgentAnalysis> {
    try {
      if (this.config.useJulep) {
        return await this.analyzeWithJulep(transaction, addressRisks, pathData);
      } else if (this.config.useMock) {
        return await this.analyzeWithMockService(transaction, addressRisks, pathData);
      } else {
        return await this.analyzeWithCustomService(transaction, addressRisks, pathData);
      }
    } catch (error) {
      console.error('Error in AI analysis:', error);
      return this.getFallbackAnalysis(transaction, error as Error);
    }
  }

  private async analyzeWithJulep(
    transaction: BlockchainTransaction,
    addressRisks: Array<Record<string, unknown>>,
    pathData: Array<Record<string, unknown>>
  ): Promise<AgentAnalysis> {
    try {
      // Implementation for Julep AI platform
      const response = await fetch(`${this.config.julepBaseUrl}/v1/agents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.julepApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'blockchain-analyst',
          model: 'gpt-4',
          instructions: 'You are an expert blockchain transaction analyst. Analyze the provided transaction data for risks, patterns, and compliance issues.',
          task: {
            transaction: transaction,
            addressRisks: addressRisks,
            pathData: pathData
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Julep API error: ${response.statusText}`);
      }

      const result = await response.json();
      return this.formatJulepResponse(transaction, result);
    } catch (error) {
      console.error('Julep analysis failed:', error);
      throw error;
    }
  }

  private async analyzeWithMockService(
    transaction: BlockchainTransaction,
    addressRisks: Array<Record<string, unknown>>,
    pathData: Array<Record<string, unknown>>
  ): Promise<AgentAnalysis> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate realistic mock analysis based on transaction data
    const riskScore = this.calculateMockRiskScore(transaction, addressRisks);
    const riskLevel = this.getRiskLevel(riskScore);
    
    return {
      transactionData: {
        from: transaction.from,
        to: transaction.to,
        value: transaction.value,
        token: this.getTokenSymbol(transaction.network),
        summary: `Mock analysis of ${transaction.network} transaction ${transaction.hash.substring(0, 10)}...`,
        hash: transaction.hash,
        blockNumber: transaction.blockNumber,
        timestamp: transaction.timestamp,
        gasUsed: transaction.gasUsed,
        gasPrice: transaction.gasPrice,
        network: transaction.network
      },
      riskAnalysis: {
        riskScore: riskScore,
        riskLevel: riskLevel,
        flags: this.generateMockFlags(riskScore),
        summary: this.generateRiskSummary(riskLevel, riskScore),
        details: {
          mixerDetected: riskScore > 70 && Math.random() > 0.7,
          sanctionedAddresses: riskScore > 80 && Math.random() > 0.8,
          highRiskExchange: riskScore > 60 && Math.random() > 0.6,
          suspiciousPattern: riskScore > 50 && Math.random() > 0.5
        }
      },
      pathTracing: {
        hops: this.generateMockPathHops(pathData, riskScore),
        totalHops: pathData.length,
        mixersDetected: riskScore > 70 ? ['TornadoCash', 'ChipMixer'] : [],
        exchangesInvolved: riskScore > 40 ? ['Binance', 'KuCoin'] : ['Coinbase', 'Kraken']
      },
      aiSummary: this.generateMockAISummary(transaction, riskLevel, riskScore)
    };
  }

  private async analyzeWithCustomService(
    transaction: BlockchainTransaction,
    addressRisks: Array<Record<string, unknown>>,
    pathData: Array<Record<string, unknown>>
  ): Promise<AgentAnalysis> {
    const baseUrl = `http://${this.config.customHost}:${this.config.customPort}`;
    
    const response = await fetch(`${baseUrl}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transaction: transaction,
        addressRisks: addressRisks,
        pathData: pathData
      }),
      signal: AbortSignal.timeout(this.config.timeout)
    });

    if (!response.ok) {
      throw new Error(`Custom AI service error: ${response.statusText}`);
    }

    const result = await response.json();
    return this.formatCustomResponse(transaction, result);
  }

  private calculateMockRiskScore(
    transaction: BlockchainTransaction, 
    addressRisks: Array<Record<string, unknown>>
  ): number {
    let baseScore = 10; // Base risk score
    
    // Add risk based on transaction value
    const value = parseFloat(transaction.value);
    if (value > 100) baseScore += 20;
    if (value > 1000) baseScore += 30;
    
    // Add risk based on address risks
    addressRisks.forEach(risk => {
      if (risk.riskScore && typeof risk.riskScore === 'number') {
        baseScore += risk.riskScore * 0.5;
      }
    });
    
    // Add some randomness for realistic variation
    baseScore += Math.random() * 20;
    
    return Math.min(Math.max(Math.round(baseScore), 0), 100);
  }

  private getRiskLevel(score: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (score >= 80) return 'CRITICAL';
    if (score >= 60) return 'HIGH';
    if (score >= 30) return 'MEDIUM';
    return 'LOW';
  }

  private generateMockFlags(riskScore: number): string[] {
    const flags: string[] = [];
    
    if (riskScore > 70) flags.push('High-value transaction');
    if (riskScore > 60) flags.push('Cross-border activity');
    if (riskScore > 80) flags.push('Multiple exchange interactions');
    if (riskScore > 90) flags.push('Potential money laundering pattern');
    
    return flags;
  }

  private generateRiskSummary(riskLevel: string, riskScore: number): string {
    const summaries = {
      'LOW': `Low risk transaction (${riskScore}/100). Standard blockchain activity with no significant compliance concerns.`,
      'MEDIUM': `Medium risk transaction (${riskScore}/100). Some elevated risk factors detected, recommend monitoring.`,
      'HIGH': `High risk transaction (${riskScore}/100). Multiple risk indicators present, requires compliance review.`,
      'CRITICAL': `Critical risk transaction (${riskScore}/100). Immediate attention required, potential AML/compliance violations detected.`
    };
    
    return summaries[riskLevel as keyof typeof summaries] || 'Risk assessment completed.';
  }

  private generateMockPathHops(pathData: Array<Record<string, unknown>>, riskScore: number): Array<{
    from: string;
    to: string;
    value: string;
    timestamp: number;
    riskScore: number;
  }> {
    return pathData.slice(0, 5).map((hop, index) => ({
      from: hop.from as string || `0x${Math.random().toString(16).substring(2, 42)}`,
      to: hop.to as string || `0x${Math.random().toString(16).substring(2, 42)}`,
      value: hop.value as string || (Math.random() * 10).toFixed(4),
      timestamp: Date.now() - (index * 3600000), // 1 hour intervals
      riskScore: Math.max(0, riskScore - (index * 10))
    }));
  }

  private generateMockAISummary(transaction: BlockchainTransaction, riskLevel: string, riskScore: number): string {
    return `AI Analysis Complete: This ${transaction.network} transaction shows ${riskLevel.toLowerCase()} risk characteristics with a score of ${riskScore}/100. The transaction involves a transfer of ${transaction.value} tokens between ${transaction.from.substring(0, 10)}... and ${transaction.to.substring(0, 10)}... Analysis includes path tracing, compliance checks, and pattern recognition. ${riskLevel === 'HIGH' || riskLevel === 'CRITICAL' ? 'Recommended for manual review by compliance team.' : 'Transaction appears within normal parameters.'}`;
  }

  private formatJulepResponse(transaction: BlockchainTransaction, response: unknown): AgentAnalysis {
    // Format Julep response to match our AgentAnalysis interface
    const julepData = response as {
      summary?: string;
      riskScore?: number;
      riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
      flags?: string[];
      riskSummary?: string;
      mixerDetected?: boolean;
      sanctionedAddresses?: boolean;
      highRiskExchange?: boolean;
      suspiciousPattern?: boolean;
      pathHops?: Array<{
        from: string;
        to: string;
        value: string;
        timestamp: number;
        riskScore: number;
      }>;
      totalHops?: number;
      mixersDetected?: string[];
      exchangesInvolved?: string[];
    };

    return {
      transactionData: {
        from: transaction.from,
        to: transaction.to,
        value: transaction.value,
        token: this.getTokenSymbol(transaction.network),
        summary: julepData.summary || 'Julep AI analysis completed',
        hash: transaction.hash,
        blockNumber: transaction.blockNumber,
        timestamp: transaction.timestamp,
        gasUsed: transaction.gasUsed,
        gasPrice: transaction.gasPrice,
        network: transaction.network
      },
      riskAnalysis: {
        riskScore: julepData.riskScore || 0,
        riskLevel: julepData.riskLevel || 'LOW',
        flags: julepData.flags || [],
        summary: julepData.riskSummary || 'No significant risks detected',
        details: {
          mixerDetected: julepData.mixerDetected || false,
          sanctionedAddresses: julepData.sanctionedAddresses || false,
          highRiskExchange: julepData.highRiskExchange || false,
          suspiciousPattern: julepData.suspiciousPattern || false
        }
      },
      pathTracing: {
        hops: julepData.pathHops || [],
        totalHops: julepData.totalHops || 0,
        mixersDetected: julepData.mixersDetected || [],
        exchangesInvolved: julepData.exchangesInvolved || []
      },
      aiSummary: julepData.summary || 'Analysis completed using Julep AI platform.'
    };
  }

  private formatCustomResponse(transaction: BlockchainTransaction, response: unknown): AgentAnalysis {
    // Format custom service response to match our AgentAnalysis interface
    return this.formatJulepResponse(transaction, response);
  }

  private getTokenSymbol(network: string): string {
    const tokenMap: { [key: string]: string } = {
      'ethereum': 'ETH',
      'bitcoin': 'BTC',
      'bsc': 'BNB',
      'polygon': 'MATIC'
    };
    return tokenMap[network.toLowerCase()] || 'ETH';
  }

  private getFallbackAnalysis(transaction: BlockchainTransaction, error?: Error): AgentAnalysis {
    return {
      transactionData: {
        from: transaction.from,
        to: transaction.to,
        value: transaction.value,
        token: this.getTokenSymbol(transaction.network),
        summary: 'Analysis failed - using fallback data',
        hash: transaction.hash,
        blockNumber: transaction.blockNumber,
        timestamp: transaction.timestamp,
        gasUsed: transaction.gasUsed,
        gasPrice: transaction.gasPrice,
        network: transaction.network
      },
      riskAnalysis: {
        riskScore: 0,
        riskLevel: 'LOW',
        flags: ['AI service unavailable'],
        summary: `Unable to complete AI analysis: ${error?.message || 'Service error'}`,
        details: {
          mixerDetected: false,
          sanctionedAddresses: false,
          highRiskExchange: false,
          suspiciousPattern: false
        }
      },
      pathTracing: {
        hops: [],
        totalHops: 0,
        mixersDetected: [],
        exchangesInvolved: []
      },
      aiSummary: `AI analysis service is currently unavailable. ${this.config.useMock ? 'Mock service failed.' : this.config.useJulep ? 'Julep AI service error.' : 'Custom AI service error.'} Please check your configuration and try again.`
    };
  }

  async getAgentInfo(): Promise<JuliaAgent | null> {
    try {
      if (this.config.useJulep) {
        return {
          id: 'julep-blockchain-analyst',
          name: 'Julep Blockchain Analyst',
          model: 'Julep-AI-Agent',
          instructions: [
            "Expert blockchain transaction analyst using Julep AI",
            "Specializes in cryptocurrency forensics and compliance",
            "Provides comprehensive risk assessments and pattern detection",
            "Supports multi-network analysis and path tracing"
          ],
          tools: [
            { name: 'transaction_analysis', description: 'Comprehensive transaction analysis', function: {} },
            { name: 'risk_assessment', description: 'AI-powered risk scoring', function: {} },
            { name: 'pattern_recognition', description: 'Suspicious pattern detection', function: {} },
            { name: 'compliance_reporting', description: 'Regulatory compliance checking', function: {} }
          ]
        };
      } else if (this.config.useMock) {
        return {
          id: 'mock-blockchain-analyst',
          name: 'Mock Blockchain Analyst',
          model: 'Mock-AI-Service',
          instructions: [
            "Mock blockchain transaction analyst for development",
            "Simulates comprehensive forensics analysis",
            "Provides realistic but simulated risk assessments",
            "Supports development and testing workflows"
          ],
          tools: [
            { name: 'mock_analysis', description: 'Simulated transaction analysis', function: {} },
            { name: 'mock_risk_assessment', description: 'Mock risk scoring', function: {} },
            { name: 'mock_pattern_detection', description: 'Simulated pattern detection', function: {} }
          ]
        };
      } else {
        // Try to get info from custom service
        const response = await fetch(`http://${this.config.customHost}:${this.config.customPort}/agent/info`);
        if (response.ok) {
          return await response.json();
        }
        throw new Error('Custom service not available');
      }
    } catch (error) {
      console.error('Error getting agent info:', error);
      return null;
    }
  }

  async getSystemStatus(): Promise<{ status: string; version?: string; service?: string }> {
    try {
      if (this.config.useJulep) {
        // Test Julep API connectivity
        const response = await fetch(`${this.config.julepBaseUrl}/v1/health`, {
          headers: { 'Authorization': `Bearer ${this.config.julepApiKey}` }
        });
        return {
          status: response.ok ? 'active' : 'error',
          service: 'julep-ai',
          version: '1.0.0'
        };
      } else if (this.config.useMock) {
        return {
          status: 'active',
          service: 'mock-ai',
          version: '1.0.0'
        };
      } else {
        // Test custom service
        const response = await fetch(`http://${this.config.customHost}:${this.config.customPort}/health`);
        const data = response.ok ? await response.json() : {};
        return {
          status: response.ok ? 'active' : 'error',
          service: 'custom-ai',
          version: data.version || '1.0.0'
        };
      }
    } catch (error) {
      console.error('Error getting system status:', error);
      return { status: 'error', service: 'unknown' };
    }
  }
}