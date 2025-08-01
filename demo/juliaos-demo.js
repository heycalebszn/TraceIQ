#!/usr/bin/env node

/**
 * JuliaOS Integration Demo
 * 
 * This demo showcases the JuliaOS integration features:
 * - Agent execution with LLM
 * - Swarm orchestration
 * - Onchain queries
 * - Transaction analysis
 */

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(`🧠 ${title}`, 'cyan');
  console.log('='.repeat(60));
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

async function checkHealth() {
  logSection('JuliaOS Health Check');
  
  try {
    const response = await fetch(`${BASE_URL}/api/health`);
    const data = await response.json();
    
    logInfo('Service Status:');
    console.log(`  Overall: ${data.status}`);
    console.log(`  Blockchain: ${data.services.blockchain.status}`);
    console.log(`  JuliaOS AI: ${data.services.ai.status}`);
    console.log(`  Service Type: ${data.services.ai.serviceType}`);
    
    logInfo('Configuration:');
    console.log(`  Using Mock AI: ${data.configuration.usingMockAI}`);
    console.log(`  Has JuliaOS Key: ${data.configuration.hasJuliaOSKey}`);
    console.log(`  Environment: ${data.environment}`);
    
    if (data.status === 'healthy') {
      logSuccess('All services are healthy!');
    } else {
      logError('Some services are unhealthy');
    }
    
    return data.status === 'healthy';
  } catch (error) {
    logError(`Health check failed: ${error.message}`);
    return false;
  }
}

async function demoTransactionAnalysis() {
  logSection('JuliaOS Transaction Analysis Demo');
  
  const testTransactions = [
    {
      hash: '0x5c504ed432cb51138bcf09aa5e8a410dd4a1e204ef84bfed1be16dfba1b22060',
      network: 'ethereum',
      description: 'Genesis block transaction'
    },
    {
      hash: '0e3e2357e806b6cdb1f70b54c3a3a17b6714ee1f0e68bebb44a74b1efd512098',
      network: 'bitcoin',
      description: 'First Bitcoin transaction'
    }
  ];
  
  for (const tx of testTransactions) {
    logInfo(`Analyzing ${tx.network} transaction: ${tx.hash.substring(0, 20)}...`);
    logInfo(`Description: ${tx.description}`);
    
    try {
      const response = await fetch(`${BASE_URL}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          txHash: tx.hash,
          network: tx.network,
          includePathTracing: true,
          riskThreshold: 50
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        logSuccess('Analysis completed successfully!');
        console.log(`  Risk Score: ${result.data.riskAnalysis.riskScore}/100`);
        console.log(`  Risk Level: ${result.data.riskAnalysis.riskLevel}`);
        console.log(`  AI Summary: ${result.data.aiSummary.substring(0, 100)}...`);
        console.log(`  Path Hops: ${result.data.pathTracing.totalHops}`);
      } else {
        logError(`Analysis failed: ${result.error}`);
      }
    } catch (error) {
      logError(`Request failed: ${error.message}`);
    }
    
    console.log('');
  }
}

async function demoSwarmOrchestration() {
  logSection('JuliaOS Swarm Orchestration Demo');
  
  const swarmConfigs = [
    {
      name: 'Compliance Analysis Swarm',
      agents: ['blockchain-analyst', 'compliance-checker', 'risk-scorer']
    },
    {
      name: 'Forensic Analysis Swarm',
      agents: ['transaction-tracer', 'pattern-detector', 'mixer-detector']
    },
    {
      name: 'Multi-Network Swarm',
      agents: ['ethereum-analyst', 'bitcoin-analyst', 'bsc-analyst']
    }
  ];
  
  for (const config of swarmConfigs) {
    logInfo(`Creating swarm: ${config.name}`);
    console.log(`  Agents: ${config.agents.join(', ')}`);
    
    try {
      const response = await fetch(`${BASE_URL}/api/swarm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          agents: config.agents
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        logSuccess(`Swarm created successfully!`);
        console.log(`  Swarm ID: ${result.data.swarmId}`);
        console.log(`  Status: ${result.data.status}`);
      } else {
        logError(`Swarm creation failed: ${result.error}`);
        console.log(`  Note: This is expected in demo mode without real JuliaOS API`);
      }
    } catch (error) {
      logError(`Request failed: ${error.message}`);
    }
    
    console.log('');
  }
}

async function demoOnchainQueries() {
  logSection('JuliaOS Onchain Queries Demo');
  
  const onchainQueries = [
    {
      name: 'ERC-20 Balance Check',
      contractAddress: '0xA0b86a33E6441b8c4C8C1C1B8c4C8C1C1B8c4C8C',
      method: 'balanceOf',
      params: ['0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'],
      description: 'Check token balance for an address'
    },
    {
      name: 'NFT Owner Check',
      contractAddress: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
      method: 'ownerOf',
      params: ['1234'],
      description: 'Check NFT ownership'
    },
    {
      name: 'DeFi Pool Info',
      contractAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
      method: 'getAmountsOut',
      params: ['1000000000000000000', ['0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', '0xA0b86a33E6441b8c4C8C1C1B8c4C8C1C1B8c4C8C']],
      description: 'Get swap amounts from Uniswap router'
    }
  ];
  
  for (const query of onchainQueries) {
    logInfo(`Executing onchain query: ${query.name}`);
    console.log(`  Contract: ${query.contractAddress}`);
    console.log(`  Method: ${query.method}`);
    console.log(`  Description: ${query.description}`);
    
    try {
      const response = await fetch(`${BASE_URL}/api/onchain`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contractAddress: query.contractAddress,
          method: query.method,
          params: query.params
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        logSuccess('Onchain query executed successfully!');
        console.log(`  Result: ${JSON.stringify(result.data, null, 2)}`);
      } else {
        logError(`Onchain query failed: ${result.error}`);
        console.log(`  Note: This is expected in demo mode without real JuliaOS API`);
      }
    } catch (error) {
      logError(`Request failed: ${error.message}`);
    }
    
    console.log('');
  }
}

async function demoJuliaOSFeatures() {
  logSection('JuliaOS Feature Showcase');
  
  logInfo('JuliaOS Integration Features:');
  console.log('  🧠 Agent Execution (agent.useLLM())');
  console.log('  🐝 Swarm Orchestration (Multi-agent coordination)');
  console.log('  ⛓️  Onchain Queries (Smart contract interaction)');
  console.log('  🔍 Transaction Analysis (Risk assessment)');
  console.log('  📊 Pattern Detection (Compliance monitoring)');
  console.log('  🌐 Cross-Chain Support (Multi-network analysis)');
  
  console.log('');
  
  logInfo('Migration from Julep to JuliaOS:');
  console.log('  ✅ Complete service replacement');
  console.log('  ✅ Environment variables updated');
  console.log('  ✅ New API endpoints added');
  console.log('  ✅ Enhanced capabilities');
  console.log('  ✅ Production-ready integration');
  
  console.log('');
  
  logInfo('Development Features:');
  console.log('  🧪 Mock service for development');
  console.log('  🔧 Easy configuration switching');
  console.log('  📝 Comprehensive documentation');
  console.log('  🧪 Test coverage included');
  console.log('  🚀 Production deployment ready');
}

async function main() {
  log('🚀 JuliaOS Integration Demo', 'magenta');
  log('Trace IQ - Blockchain Analysis Platform', 'bright');
  log('Powered by JuliaOS AI Framework', 'cyan');
  
  // Check if server is running
  const isHealthy = await checkHealth();
  
  if (!isHealthy) {
    logError('Server is not healthy. Please ensure the application is running on http://localhost:3000');
    logInfo('Start the server with: npm run dev');
    process.exit(1);
  }
  
  // Run demos
  await demoTransactionAnalysis();
  await demoSwarmOrchestration();
  await demoOnchainQueries();
  await demoJuliaOSFeatures();
  
  logSection('Demo Complete');
  logSuccess('JuliaOS integration demo completed successfully!');
  logInfo('For more information, check the README.md and setup-guide.md files.');
  logInfo('Join the JuliaOS community on Discord for support.');
}

// Handle errors gracefully
process.on('unhandledRejection', (reason, promise) => {
  logError(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  process.exit(1);
});

// Run the demo
if (require.main === module) {
  main().catch(error => {
    logError(`Demo failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  checkHealth,
  demoTransactionAnalysis,
  demoSwarmOrchestration,
  demoOnchainQueries,
  demoJuliaOSFeatures
};