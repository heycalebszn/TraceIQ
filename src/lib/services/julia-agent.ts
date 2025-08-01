import { BlockchainTransaction, AgentAnalysis, JuliaAgent } from '@/types';

interface JuliaAgentData {
  id: string;
  name: string;
  type: string;
  config: Record<string, unknown>;
  capabilities: string[];
  networks: string[];
}

interface JuliaBridgeConfig {
  host: string;
  port: number;
  timeout: number;
}

export class JuliaAgentService {
  private bridgeConfig: JuliaBridgeConfig;
  private agent: JuliaAgentData | null = null;
  private baseUrl: string;

  constructor() {
    const host = process.env.JULIAOS_HOST || 'localhost';
    const port = parseInt(process.env.JULIAOS_PORT || '8052');
    const timeout = parseInt(process.env.JULIAOS_TIMEOUT || '30000');

    if (!host || !port) {
      throw new Error('JULIAOS_HOST and JULIAOS_PORT environment variables are required');
    }

    this.bridgeConfig = { host, port, timeout };
    this.baseUrl = `http://${host}:${port}`;
  }

  private async runJuliaCommand(command: string, payload: Record<string, unknown>): Promise<unknown> {
    try {
      const response = await fetch(`${this.baseUrl}/command`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command,
          payload
        }),
        signal: AbortSignal.timeout(this.bridgeConfig.timeout)
      });

      if (!response.ok) {
        throw new Error(`JuliaOS command failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error executing Julia command ${command}:`, error);
      throw error;
    }
  }

  async initializeAgent(): Promise<void> {
    try {
      // Create blockchain forensics agent
      const agentConfig = {
        name: "TraceIQ-BlockchainAnalyst",
        type: "ForensicsAgent",
        config: {
          analysis_depth: "deep",
          risk_threshold: 0.3,
          pattern_detection: true,
          compliance_mode: true,
          networks: ["ethereum", "bitcoin", "bsc", "polygon"],
          temperature: 0.3
        },
        capabilities: [
          "transaction_analysis",
          "risk_assessment", 
          "pattern_recognition",
          "compliance_reporting",
          "path_tracing",
          "mixer_detection",
          "sanctions_screening"
        ],
        networks: ["ethereum", "bitcoin", "bsc", "polygon"]
      };

      this.agent = await this.runJuliaCommand('agents.create_agent', agentConfig);
      console.log('JuliaOS agent initialized:', this.agent.id);
    } catch (error) {
      console.error('Error initializing JuliaOS agent:', error);
      throw error;
    }
  }

  async analyzeTransaction(
    transaction: BlockchainTransaction,
    addressRisks: Array<Record<string, unknown>> = [],
    pathData: Array<Record<string, unknown>> = []
  ): Promise<AgentAnalysis> {
    try {
      if (!this.agent) {
        await this.initializeAgent();
      }

      // Prepare comprehensive analysis request
      const analysisRequest = {
        agent_id: this.agent!.id,
        transaction: {
          hash: transaction.hash,
          network: transaction.network,
          from: transaction.from,
          to: transaction.to,
          value: transaction.value,
          block: transaction.blockNumber,
          status: transaction.status,
          gas_used: transaction.gasUsed,
          gas_price: transaction.gasPrice,
          timestamp: transaction.timestamp,
          input_data: transaction.input
        },
        context: {
          address_risks: addressRisks,
          transaction_path: pathData,
          analysis_mode: "comprehensive",
          include_path_analysis: true,
          risk_scoring: true,
          compliance_check: true
        }
      };

      // Execute analysis through JuliaOS
      const analysisResult = await this.runJuliaCommand('agents.analyze_transaction', analysisRequest);

      // Format the response according to our interface
      const analysis: AgentAnalysis = {
        transactionData: {
          from: transaction.from,
          to: transaction.to,
          value: transaction.value,
          token: this.getTokenSymbol(transaction.network),
          summary: analysisResult.summary || 'Transaction analyzed successfully',
          hash: transaction.hash,
          blockNumber: transaction.blockNumber,
          timestamp: transaction.timestamp,
          gasUsed: transaction.gasUsed,
          gasPrice: transaction.gasPrice,
          network: transaction.network
        },
        riskAnalysis: {
          riskScore: analysisResult.risk_score || 0,
          riskLevel: analysisResult.risk_level || 'LOW',
          flags: analysisResult.risk_flags || [],
          summary: analysisResult.risk_summary || 'No significant risks detected',
          details: {
            mixerDetected: analysisResult.mixer_detected || false,
            sanctionedAddresses: analysisResult.sanctioned_addresses || false,
            highRiskExchange: analysisResult.high_risk_exchange || false,
            suspiciousPattern: analysisResult.suspicious_patterns || false
          }
        },
        pathTracing: {
          hops: (analysisResult.transaction_path || []).map((hop: Record<string, unknown>, index: number) => ({
            from: hop.from || 'Unknown',
            to: hop.to || 'Unknown',
            value: hop.value || '0',
            timestamp: hop.timestamp || Date.now(),
            riskScore: hop.risk_score || Math.max(0, (analysisResult.risk_score || 0) - (index * 5))
          })),
          totalHops: analysisResult.path_length || 0,
          mixersDetected: analysisResult.mixers_in_path || [],
          exchangesInvolved: analysisResult.exchanges_in_path || []
        },
        aiSummary: analysisResult.ai_summary || 'Transaction analysis completed using JuliaOS blockchain forensics engine.'
      };

      return analysis;
    } catch (error) {
      console.error('Error analyzing transaction with JuliaOS agent:', error);
      
      // Return fallback analysis
      return this.getFallbackAnalysis(transaction);
    }
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

  private getFallbackAnalysis(transaction: BlockchainTransaction): AgentAnalysis {
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
        flags: ['Analysis service unavailable'],
        summary: 'Unable to complete risk analysis due to JuliaOS service error',
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
      aiSummary: 'JuliaOS analysis service is currently unavailable. Please ensure your JuliaOS instance is running and properly configured.'
    };
  }

  async getAgentInfo(): Promise<JuliaAgent | null> {
    try {
      if (!this.agent) {
        await this.initializeAgent();
      }

      // Get agent status from JuliaOS (for future use)
      await this.runJuliaCommand('agents.get_agent', { id: this.agent!.id });

      return {
        id: this.agent!.id,
        name: this.agent!.name,
        model: `JuliaOS-${this.agent!.type}`,
        instructions: [
          "Expert blockchain transaction analyst using JuliaOS",
          "Specializes in cryptocurrency forensics and compliance",
          "Provides comprehensive risk assessments and pattern detection",
          "Supports multi-network analysis and path tracing"
        ],
        tools: this.agent!.capabilities.map(cap => ({
          name: cap,
          description: `JuliaOS ${cap.replace('_', ' ')} capability`,
          function: {}
        }))
      };
    } catch (error) {
      console.error('Error getting JuliaOS agent info:', error);
      return null;
    }
  }

  async getSystemStatus(): Promise<{ status: string; version?: string; uptime?: number }> {
    try {
      const status = await this.runJuliaCommand('system.get_status', {});
      return {
        status: status.status || 'unknown',
        version: status.version,
        uptime: status.uptime
      };
    } catch (error) {
      console.error('Error getting JuliaOS system status:', error);
      return { status: 'error' };
    }
  }
}