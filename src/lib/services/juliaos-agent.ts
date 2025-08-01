import { BlockchainTransaction, AgentAnalysis, JuliaAgent } from '@/types';

interface JuliaOSConfig {
  useJuliaOS: boolean;
  useMock: boolean;
  juliaOSApiKey?: string;
  juliaOSBaseUrl?: string;
  juliaOSAgentId?: string;
  customHost?: string;
  customPort?: number;
  timeout: number;
}

export class JuliaOSAgentService {
  private config: JuliaOSConfig;

  constructor() {
    // Determine which AI service to use based on environment configuration
    const useMock = process.env.USE_MOCK_AI_SERVICE === 'true';
    const juliaOSApiKey = process.env.JULIAOS_API_KEY;
    const customHost = process.env.CUSTOM_AI_HOST;
    
    this.config = {
      useJuliaOS: !useMock && !!juliaOSApiKey,
      useMock: useMock || (!juliaOSApiKey && !customHost),
      juliaOSApiKey: juliaOSApiKey,
      juliaOSBaseUrl: process.env.JULIAOS_BASE_URL || 'https://api.juliaos.ai',
      juliaOSAgentId: process.env.JULIAOS_AGENT_ID || 'blockchain-analyst',
      customHost: customHost || 'localhost',
      customPort: parseInt(process.env.CUSTOM_AI_PORT || '8052'),
      timeout: parseInt(process.env.CUSTOM_AI_TIMEOUT || '30000')
    };

    console.log('JuliaOS Service Configuration:', {
      useJuliaOS: this.config.useJuliaOS,
      useMock: this.config.useMock,
      hasJuliaOSKey: !!this.config.juliaOSApiKey,
      agentId: this.config.juliaOSAgentId
    });
  }

  async analyzeTransaction(
    transaction: BlockchainTransaction,
    addressRisks: Array<Record<string, unknown>> = [],
    pathData: Array<Record<string, unknown>> = []
  ): Promise<AgentAnalysis> {
    try {
      if (this.config.useJuliaOS) {
        return await this.analyzeWithJuliaOS(transaction, addressRisks, pathData);
      } else if (this.config.useMock) {
        return await this.analyzeWithMockService(transaction, addressRisks, pathData);
      } else {
        return await this.analyzeWithCustomService(transaction, addressRisks, pathData);
      }
    } catch (error) {
      console.error('Error in JuliaOS analysis:', error);
      return this.getFallbackAnalysis(transaction, error as Error);
    }
  }

  private async analyzeWithJuliaOS(
    transaction: BlockchainTransaction,
    addressRisks: Array<Record<string, unknown>>,
    pathData: Array<Record<string, unknown>>
  ): Promise<AgentAnalysis> {
    try {
      // JuliaOS Agent Execution using the agent.useLLM() API
      const response = await fetch(`${this.config.juliaOSBaseUrl}/v1/agents/${this.config.juliaOSAgentId}/execute`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.juliaOSApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          method: 'useLLM',
          params: {
            model: 'gpt-4',
            messages: [
              {
                role: 'system',
                content: `You are an expert blockchain transaction analyst powered by JuliaOS. Analyze the provided transaction data for risks, patterns, and compliance issues. Provide comprehensive analysis including risk scoring, pattern detection, and compliance assessment.`
              },
              {
                role: 'user',
                content: `Analyze this blockchain transaction:
                
Transaction Data:
- Hash: ${transaction.hash}
- From: ${transaction.from}
- To: ${transaction.to}
- Value: ${transaction.value}
- Network: ${transaction.network}
- Block: ${transaction.blockNumber}
- Gas Used: ${transaction.gasUsed}
- Gas Price: ${transaction.gasPrice}

Address Risk Data: ${JSON.stringify(addressRisks, null, 2)}

Path Tracing Data: ${JSON.stringify(pathData, null, 2)}

Please provide:
1. Risk score (0-100)
2. Risk level (LOW/MEDIUM/HIGH/CRITICAL)
3. Risk flags and patterns detected
4. Compliance assessment
5. Path analysis summary
6. AI-generated analysis summary

Format your response as JSON with the following structure:
{
  "riskScore": number,
  "riskLevel": "LOW|MEDIUM|HIGH|CRITICAL",
  "flags": ["flag1", "flag2"],
  "summary": "risk summary",
  "details": {
    "mixerDetected": boolean,
    "sanctionedAddresses": boolean,
    "highRiskExchange": boolean,
    "suspiciousPattern": boolean
  },
  "pathHops": [...],
  "totalHops": number,
  "mixersDetected": [...],
  "exchangesInvolved": [...],
  "aiSummary": "comprehensive AI analysis"
}`
              }
            ],
            temperature: 0.1,
            max_tokens: 2000
          }
        })
      });

      if (!response.ok) {
        throw new Error(`JuliaOS API error: ${response.statusText}`);
      }

      const result = await response.json();
      return this.formatJuliaOSResponse(transaction, result);
    } catch (error) {
      console.error('JuliaOS analysis failed:', error);
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
        summary: `JuliaOS Mock analysis of ${transaction.network} transaction ${transaction.hash.substring(0, 10)}...`,
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
    return `JuliaOS AI Analysis Complete: This ${transaction.network} transaction shows ${riskLevel.toLowerCase()} risk characteristics with a score of ${riskScore}/100. The transaction involves a transfer of ${transaction.value} tokens between ${transaction.from.substring(0, 10)}... and ${transaction.to.substring(0, 10)}... Analysis includes path tracing, compliance checks, and pattern recognition using JuliaOS agent framework. ${riskLevel === 'HIGH' || riskLevel === 'CRITICAL' ? 'Recommended for manual review by compliance team.' : 'Transaction appears within normal parameters.'}`;
  }

  private formatJuliaOSResponse(transaction: BlockchainTransaction, response: unknown): AgentAnalysis {
    // Parse JuliaOS LLM response
    let juliaOSData;
    try {
      // Extract the content from JuliaOS response
      const responseData = response as {
        content?: string;
        choices?: Array<{ message?: { content?: string } }>;
        data?: { content?: string };
      };

      let content = '';
      if (responseData.content) {
        content = responseData.content;
      } else if (responseData.choices && responseData.choices[0]?.message?.content) {
        content = responseData.choices[0].message.content;
      } else if (responseData.data?.content) {
        content = responseData.data.content;
      }

      // Try to parse JSON from the content
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        juliaOSData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found in JuliaOS response');
      }
    } catch (error) {
      console.error('Error parsing JuliaOS response:', error);
      juliaOSData = {
        riskScore: 50,
        riskLevel: 'MEDIUM',
        flags: ['Analysis parsing error'],
        summary: 'JuliaOS analysis completed but response format was unexpected',
        details: {
          mixerDetected: false,
          sanctionedAddresses: false,
          highRiskExchange: false,
          suspiciousPattern: false
        },
        pathHops: [],
        totalHops: 0,
        mixersDetected: [],
        exchangesInvolved: [],
        aiSummary: 'JuliaOS analysis completed with parsing issues.'
      };
    }

    return {
      transactionData: {
        from: transaction.from,
        to: transaction.to,
        value: transaction.value,
        token: this.getTokenSymbol(transaction.network),
        summary: `JuliaOS analysis of ${transaction.network} transaction ${transaction.hash.substring(0, 10)}...`,
        hash: transaction.hash,
        blockNumber: transaction.blockNumber,
        timestamp: transaction.timestamp,
        gasUsed: transaction.gasUsed,
        gasPrice: transaction.gasPrice,
        network: transaction.network
      },
      riskAnalysis: {
        riskScore: juliaOSData.riskScore || 0,
        riskLevel: juliaOSData.riskLevel || 'LOW',
        flags: juliaOSData.flags || [],
        summary: juliaOSData.summary || 'JuliaOS analysis completed',
        details: {
          mixerDetected: juliaOSData.details?.mixerDetected || false,
          sanctionedAddresses: juliaOSData.details?.sanctionedAddresses || false,
          highRiskExchange: juliaOSData.details?.highRiskExchange || false,
          suspiciousPattern: juliaOSData.details?.suspiciousPattern || false
        }
      },
      pathTracing: {
        hops: juliaOSData.pathHops || [],
        totalHops: juliaOSData.totalHops || 0,
        mixersDetected: juliaOSData.mixersDetected || [],
        exchangesInvolved: juliaOSData.exchangesInvolved || []
      },
      aiSummary: juliaOSData.aiSummary || 'Analysis completed using JuliaOS agent framework.'
    };
  }

  private formatCustomResponse(transaction: BlockchainTransaction, response: unknown): AgentAnalysis {
    // Format custom service response to match our AgentAnalysis interface
    return this.formatJuliaOSResponse(transaction, response);
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
        flags: ['JuliaOS service unavailable'],
        summary: `Unable to complete JuliaOS analysis: ${error?.message || 'Service error'}`,
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
      aiSummary: `JuliaOS analysis service is currently unavailable. ${this.config.useMock ? 'Mock service failed.' : this.config.useJuliaOS ? 'JuliaOS service error.' : 'Custom AI service error.'} Please check your configuration and try again.`
    };
  }

  async getAgentInfo(): Promise<JuliaAgent | null> {
    try {
      if (this.config.useJuliaOS) {
        return {
          id: this.config.juliaOSAgentId || 'juliaos-blockchain-analyst',
          name: 'JuliaOS Blockchain Analyst',
          model: 'JuliaOS-Agent-Framework',
          instructions: [
            "Expert blockchain transaction analyst powered by JuliaOS",
            "Specializes in cryptocurrency forensics and compliance using JuliaOS agent framework",
            "Provides comprehensive risk assessments and pattern detection",
            "Supports multi-network analysis and path tracing with JuliaOS capabilities"
          ],
          tools: [
            { name: 'transaction_analysis', description: 'Comprehensive transaction analysis using JuliaOS', function: {} },
            { name: 'risk_assessment', description: 'AI-powered risk scoring via JuliaOS', function: {} },
            { name: 'pattern_recognition', description: 'Suspicious pattern detection with JuliaOS', function: {} },
            { name: 'compliance_reporting', description: 'Regulatory compliance checking via JuliaOS', function: {} },
            { name: 'swarm_orchestration', description: 'Multi-agent coordination using JuliaOS swarm capabilities', function: {} }
          ]
        };
      } else if (this.config.useMock) {
        return {
          id: 'mock-juliaos-blockchain-analyst',
          name: 'Mock JuliaOS Blockchain Analyst',
          model: 'Mock-JuliaOS-Service',
          instructions: [
            "Mock blockchain transaction analyst for JuliaOS development",
            "Simulates comprehensive forensics analysis using JuliaOS framework",
            "Provides realistic but simulated risk assessments",
            "Supports development and testing workflows for JuliaOS integration"
          ],
          tools: [
            { name: 'mock_analysis', description: 'Simulated transaction analysis for JuliaOS', function: {} },
            { name: 'mock_risk_assessment', description: 'Mock risk scoring for JuliaOS testing', function: {} },
            { name: 'mock_pattern_detection', description: 'Simulated pattern detection for JuliaOS', function: {} }
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
      console.error('Error getting JuliaOS agent info:', error);
      return null;
    }
  }

  async getSystemStatus(): Promise<{ status: string; version?: string; service?: string }> {
    try {
      if (this.config.useJuliaOS) {
        // Test JuliaOS API connectivity
        const response = await fetch(`${this.config.juliaOSBaseUrl}/v1/health`, {
          headers: { 'Authorization': `Bearer ${this.config.juliaOSApiKey}` }
        });
        return {
          status: response.ok ? 'active' : 'error',
          service: 'juliaos-agent',
          version: '1.0.0'
        };
      } else if (this.config.useMock) {
        return {
          status: 'active',
          service: 'mock-juliaos',
          version: '1.0.0'
        };
      } else {
        // Test custom service
        const response = await fetch(`http://${this.config.customHost}:${this.config.customPort}/health`);
        const data = response.ok ? await response.json() : {};
        return {
          status: response.ok ? 'active' : 'error',
          service: 'custom-juliaos',
          version: data.version || '1.0.0'
        };
      }
    } catch (error) {
      console.error('Error getting JuliaOS system status:', error);
      return { status: 'error', service: 'unknown' };
    }
  }

  // JuliaOS Swarm Integration
  async createSwarm(agents: string[]): Promise<{ swarmId: string; status: string }> {
    try {
      if (!this.config.useJuliaOS) {
        throw new Error('JuliaOS swarm features require JuliaOS service');
      }

      const response = await fetch(`${this.config.juliaOSBaseUrl}/v1/swarms`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.juliaOSApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'blockchain-analysis-swarm',
          agents: agents,
          configuration: {
            coordination: 'hierarchical',
            communication: 'broadcast',
            task_distribution: 'round_robin'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`JuliaOS swarm creation failed: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        swarmId: result.swarm_id,
        status: 'created'
      };
    } catch (error) {
      console.error('JuliaOS swarm creation error:', error);
      throw error;
    }
  }

  // JuliaOS Onchain Integration
  async queryOnchainData(contractAddress: string, method: string, params: any[] = []): Promise<any> {
    try {
      if (!this.config.useJuliaOS) {
        throw new Error('JuliaOS onchain features require JuliaOS service');
      }

      const response = await fetch(`${this.config.juliaOSBaseUrl}/v1/blockchain/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.juliaOSApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contract_address: contractAddress,
          method: method,
          parameters: params,
          network: 'ethereum' // Default network
        })
      });

      if (!response.ok) {
        throw new Error(`JuliaOS onchain query failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('JuliaOS onchain query error:', error);
      throw error;
    }
  }
}