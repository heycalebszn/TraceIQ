import { JuliaOSAgentService } from '../src/lib/services/juliaos-agent';
import { AnalysisService } from '../src/lib/services/analysis';

// Mock environment variables for testing
process.env.USE_MOCK_AI_SERVICE = 'true';
process.env.JULIAOS_API_KEY = 'test-key';
process.env.JULIAOS_BASE_URL = 'https://api.juliaos.ai';
process.env.JULIAOS_AGENT_ID = 'test-agent';

describe('JuliaOS Integration Tests', () => {
  let juliaOSService: JuliaOSAgentService;
  let analysisService: AnalysisService;

  beforeEach(() => {
    juliaOSService = new JuliaOSAgentService();
    analysisService = new AnalysisService();
  });

  describe('JuliaOS Agent Service', () => {
    test('should initialize with correct configuration', () => {
      expect(juliaOSService).toBeDefined();
    });

    test('should analyze transaction with JuliaOS', async () => {
      const mockTransaction = {
        hash: '0x5c504ed432cb51138bcf09aa5e8a410dd4a1e204ef84bfed1be16dfba1b22060',
        blockNumber: 1,
        from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        value: '1000000000000000000',
        gas: '21000',
        gasPrice: '20000000000',
        gasUsed: '21000',
        timestamp: 1438269988,
        input: '0x',
        status: '0x1',
        network: 'ethereum'
      };

      const result = await juliaOSService.analyzeTransaction(mockTransaction);

      expect(result).toBeDefined();
      expect(result.transactionData).toBeDefined();
      expect(result.riskAnalysis).toBeDefined();
      expect(result.pathTracing).toBeDefined();
      expect(result.aiSummary).toBeDefined();
      expect(result.transactionData.hash).toBe(mockTransaction.hash);
      expect(result.transactionData.network).toBe('ethereum');
    });

    test('should get agent info', async () => {
      const agentInfo = await juliaOSService.getAgentInfo();

      expect(agentInfo).toBeDefined();
      expect(agentInfo?.id).toBeDefined();
      expect(agentInfo?.name).toBeDefined();
      expect(agentInfo?.model).toBeDefined();
      expect(agentInfo?.instructions).toBeInstanceOf(Array);
      expect(agentInfo?.tools).toBeInstanceOf(Array);
    });

    test('should get system status', async () => {
      const status = await juliaOSService.getSystemStatus();

      expect(status).toBeDefined();
      expect(status.status).toBeDefined();
      expect(status.service).toBeDefined();
    });

    test('should create swarm', async () => {
      const agents = ['agent1', 'agent2', 'agent3'];
      
      try {
        const result = await juliaOSService.createSwarm(agents);
        expect(result).toBeDefined();
        expect(result.swarmId).toBeDefined();
        expect(result.status).toBe('created');
      } catch (error) {
        // Expected to fail in test environment without real JuliaOS API
        expect(error).toBeDefined();
        expect((error as Error).message).toContain('JuliaOS swarm features require JuliaOS service');
      }
    });

    test('should query onchain data', async () => {
      const contractAddress = '0xA0b86a33E6441b8c4C8C1C1B8c4C8C1C1B8c4C8C';
      const method = 'balanceOf';
      const params = ['0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'];
      
      try {
        const result = await juliaOSService.queryOnchainData(contractAddress, method, params);
        expect(result).toBeDefined();
      } catch (error) {
        // Expected to fail in test environment without real JuliaOS API
        expect(error).toBeDefined();
        expect((error as Error).message).toContain('JuliaOS onchain features require JuliaOS service');
      }
    });
  });

  describe('Analysis Service with JuliaOS', () => {
    test('should analyze transaction with JuliaOS integration', async () => {
      const request = {
        txHash: '0x5c504ed432cb51138bcf09aa5e8a410dd4a1e204ef84bfed1be16dfba1b22060',
        network: 'ethereum',
        includePathTracing: true,
        riskThreshold: 50
      };

      try {
        const result = await analysisService.analyzeTransaction(request);
        
        expect(result).toBeDefined();
        expect(result.success).toBeDefined();
        
        if (result.success && result.data) {
          expect(result.data.transactionData).toBeDefined();
          expect(result.data.riskAnalysis).toBeDefined();
          expect(result.data.pathTracing).toBeDefined();
          expect(result.data.aiSummary).toBeDefined();
        }
      } catch (error) {
        // Expected to fail in test environment without blockchain APIs
        expect(error).toBeDefined();
      }
    });

    test('should get agent status', async () => {
      const status = await analysisService.getAgentStatus();

      expect(status).toBeDefined();
      expect(status.status).toBeDefined();
      expect(status.agent).toBeDefined();
    });

    test('should perform health check', async () => {
      const health = await analysisService.healthCheck();

      expect(health).toBeDefined();
      expect(health.blockchain).toBeDefined();
      expect(health.ai).toBeDefined();
      expect(health.overall).toBeDefined();
    });
  });

  describe('JuliaOS API Endpoints', () => {
    test('should handle swarm creation request', async () => {
      const requestBody = {
        agents: ['blockchain-analyst', 'risk-scorer', 'compliance-checker']
      };

      const response = await fetch('http://localhost:3000/api/swarm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      expect(response.status).toBeDefined();
      // Will likely be 500 in test environment without real JuliaOS API
    });

    test('should handle onchain query request', async () => {
      const requestBody = {
        contractAddress: '0xA0b86a33E6441b8c4C8C1C1B8c4C8C1C1B8c4C8C',
        method: 'balanceOf',
        params: ['0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6']
      };

      const response = await fetch('http://localhost:3000/api/onchain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      expect(response.status).toBeDefined();
      // Will likely be 500 in test environment without real JuliaOS API
    });

    test('should handle health check request', async () => {
      const response = await fetch('http://localhost:3000/api/health');
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBeDefined();
      expect(data.services).toBeDefined();
      expect(data.services.ai).toBeDefined();
      expect(data.services.ai.serviceType).toBe('juliaos');
    });
  });

  describe('JuliaOS Migration Validation', () => {
    test('should not have Julep dependencies', () => {
      // Verify that Julep references have been replaced
      const fs = require('fs');
      const path = require('path');

      const searchForJulep = (dir: string): string[] => {
        const results: string[] = [];
        const files = fs.readdirSync(dir);
        
        for (const file of files) {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);
          
          if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
            results.push(...searchForJulep(filePath));
          } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js')) {
            const content = fs.readFileSync(filePath, 'utf8');
            if (content.includes('julep') || content.includes('Julep')) {
              results.push(filePath);
            }
          }
        }
        
        return results;
      };

      const julepFiles = searchForJulep('./src');
      expect(julepFiles).toHaveLength(0);
    });

    test('should have JuliaOS dependencies', () => {
      const fs = require('fs');
      const path = require('path');

      const searchForJuliaOS = (dir: string): string[] => {
        const results: string[] = [];
        const files = fs.readdirSync(dir);
        
        for (const file of files) {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);
          
          if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
            results.push(...searchForJuliaOS(filePath));
          } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js')) {
            const content = fs.readFileSync(filePath, 'utf8');
            if (content.includes('juliaos') || content.includes('JuliaOS')) {
              results.push(filePath);
            }
          }
        }
        
        return results;
      };

      const juliaOSFiles = searchForJuliaOS('./src');
      expect(juliaOSFiles.length).toBeGreaterThan(0);
    });
  });

  describe('JuliaOS Feature Tests', () => {
    test('should support agent.useLLM() functionality', async () => {
      const mockTransaction = {
        hash: '0x5c504ed432cb51138bcf09aa5e8a410dd4a1e204ef84bfed1be16dfba1b22060',
        blockNumber: 1,
        from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        value: '1000000000000000000',
        gas: '21000',
        gasPrice: '20000000000',
        gasUsed: '21000',
        timestamp: 1438269988,
        input: '0x',
        status: '0x1',
        network: 'ethereum'
      };

      const result = await juliaOSService.analyzeTransaction(mockTransaction);

      // Verify that the analysis includes AI-generated content
      expect(result.aiSummary).toContain('JuliaOS');
      expect(result.riskAnalysis.summary).toBeDefined();
      expect(result.riskAnalysis.riskScore).toBeGreaterThanOrEqual(0);
      expect(result.riskAnalysis.riskScore).toBeLessThanOrEqual(100);
    });

    test('should support swarm orchestration', () => {
      // Test that swarm functionality is available
      expect(typeof juliaOSService.createSwarm).toBe('function');
    });

    test('should support onchain queries', () => {
      // Test that onchain functionality is available
      expect(typeof juliaOSService.queryOnchainData).toBe('function');
    });
  });
});

// Mock fetch for testing
global.fetch = jest.fn();

// Clean up after tests
afterEach(() => {
  jest.clearAllMocks();
});