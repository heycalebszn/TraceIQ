# 🚀 Trace IQ - JuliaOS-Powered Blockchain Analysis Platform

A sophisticated blockchain transaction analysis platform powered by **JuliaOS AI agents** for compliance and forensic investigation. This dApp demonstrates the flexibility and power of JuliaOS through real-world AI agent usage, swarm orchestration, and cross-chain deployment.

## 🧠 About JuliaOS Integration

**JuliaOS** is a modular, open-source framework for building, deploying, and managing AI-powered agents and swarms across multiple blockchains. This platform integrates JuliaOS for:

- **AI Agent Execution** - Using `agent.useLLM()` for intelligent transaction analysis
- **Swarm Orchestration** - Multi-agent coordination for complex analysis tasks
- **Onchain Capabilities** - Direct blockchain interaction and smart contract queries
- **Cross-Chain Deployment** - Support for multiple blockchain networks

## 🚀 Features

### 🔥 JuliaOS AI-Powered Analysis

- **JuliaOS Agent Integration** - Multiple AI service options including JuliaOS AI platform
- **Multi-Network Support** - Ethereum, Bitcoin, BSC, and more
- **Real-time Risk Assessment** - Comprehensive risk scoring from 0-100
- **Intelligent Pattern Recognition** - Detects mixers, sanctions, and suspicious activities

### 💡 How It Works

- **🧠 JuliaOS Agent Activated** – AI reads and analyzes the transaction hash using JuliaOS framework
- **🔍 Path Traced** – Follows transactions across wallets, bridges, and mixers  
- **📊 Risk Scored** – Returns detailed summary with suspicious activity flags
- **📄 Reports Generated** – Professional PDF and JSON reports for compliance

### 🧾 Transaction Analysis Input

- Custom animated input field (`PlaceholdersAndVanishInput`)
- Real-time API integration with blockchain networks
- Support for multiple transaction hash formats
- Production-ready transaction analysis across multiple networks

### 📈 Comprehensive Results Dashboard

- **Transaction Details** - Complete transaction metadata
- **Risk Analysis** - Visual risk indicators and compliance flags
- **JuliaOS AI Summary** - Professional analysis suitable for law enforcement
- **Interactive Graph** - Visual transaction flow with risk indicators
- **Export Options** - PDF reports and JSON data downloads

### 🧠 Advanced JuliaOS Features

- **Multiple AI Service Options** - JuliaOS AI, Mock Service, or Custom Integration
- **Risk Pattern Detection** - Identifies money laundering and compliance risks
- **Path Tracing** - Tracks funds across multiple hops and networks
- **Compliance Reporting** - Generates professional reports for regulatory use
- **Swarm Orchestration** - Multi-agent coordination for complex analysis
- **Onchain Integration** - Direct blockchain interaction capabilities

### 🔗 Blockchain Integration

- **Multi-Provider Support** - Etherscan, Alchemy, Infura, OKLink
- **Real-time Data** - Live blockchain data fetching
- **Network Coverage** - Ethereum, Bitcoin, BSC with easy extensibility
- **Fallback Systems** - Multiple data sources for reliability

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+
- JuliaOS API key (optional for production)
- Blockchain API keys (see setup guide)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd trace-iq
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local with your API keys
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### JuliaOS Service Options

**Option 1: Mock JuliaOS Service (Default)**
- Perfect for development and testing
- No external API keys required
- Provides realistic mock analysis results
- Simulates JuliaOS agent behavior

**Option 2: JuliaOS AI Platform (Recommended for Production)**
- Real AI-powered analysis using JuliaOS framework
- Sign up at [JuliaOS AI](https://juliaos.ai/)
- Add `JULIAOS_API_KEY` to your environment
- Full swarm orchestration and onchain capabilities

**Option 3: Custom JuliaOS Service**
- Integrate with your own JuliaOS deployment
- Configure `CUSTOM_AI_HOST` and `CUSTOM_AI_PORT`

### Required Blockchain API Keys

Choose one or more blockchain data providers:

1. **Etherscan**: [https://etherscan.io/apis](https://etherscan.io/apis)
2. **Alchemy**: [https://alchemy.com](https://alchemy.com)
3. **Infura**: [https://infura.io](https://infura.io)

### Optional Services

- **OKLink**: Enhanced risk analysis [https://www.oklink.com](https://www.oklink.com)
- **BSCScan**: For BSC network support

See `setup-guide.md` for detailed configuration instructions.

## 🧪 Testing

### Health Check
Visit `/api/health` to verify all services are running properly, including JuliaOS integration.

### Mock Analysis (Default)
- No setup required
- Provides realistic simulated results
- Perfect for development and testing
- Simulates JuliaOS agent behavior

### Production Analysis
Enter any valid transaction hash from supported networks for comprehensive analysis using JuliaOS agents.

### Example Transaction Hashes for Testing
- Ethereum: Get from [Etherscan](https://etherscan.io)
- Bitcoin: Get from [Blockchain.info](https://blockchain.info)
- BSC: Get from [BscScan](https://bscscan.com)

## 🏗️ Architecture

```
Frontend (Next.js)
├── Transaction Input Component
├── Results Dashboard
└── Interactive Graph Visualization

Backend API Routes
├── /api/analyze - Main analysis endpoint (JuliaOS-powered)
├── /api/health - Service health check
├── /api/swarm - JuliaOS swarm orchestration
├── /api/onchain - JuliaOS onchain queries
└── Real-time blockchain integration

JuliaOS & Data Services
├── JuliaOS Agent Service - AI analysis and risk scoring
├── JuliaOS Swarm Service - Multi-agent coordination
├── JuliaOS Onchain Service - Blockchain interaction
├── BlockchainService - Multi-network data fetching
└── AnalysisService - Service orchestration
```

## 📊 Supported Networks

| Network | Status | Data Sources |
|---------|--------|-------------|
| Ethereum | ✅ Full | Etherscan, Alchemy, Infura |
| Bitcoin | ✅ Basic | Public APIs |
| BSC | ✅ Full | BscScan |
| More | 🔄 Planned | Extensible architecture |

## 🔍 Risk Detection Capabilities

- **Mixer Detection** - Tornado Cash, other privacy tools
- **Sanctions Screening** - OFAC and other blocklists
- **Exchange Analysis** - High-risk exchange identification
- **Pattern Recognition** - Suspicious transaction patterns
- **Path Tracing** - Multi-hop fund tracking
- **Compliance Flags** - Regulatory risk indicators

## 📄 API Documentation

### Analyze Transaction
```bash
POST /api/analyze
{
  "txHash": "0x...",
  "network": "ethereum",
  "includePathTracing": true,
  "riskThreshold": 50
}
```

### JuliaOS Swarm Creation
```bash
POST /api/swarm
{
  "agents": ["agent1", "agent2", "agent3"]
}
```

### JuliaOS Onchain Query
```bash
POST /api/onchain
{
  "contractAddress": "0x...",
  "method": "balanceOf",
  "params": ["0x..."]
}
```

### Health Check
```bash
GET /api/health
```

Returns service status, JuliaOS configuration, and connectivity information.

## 🔄 JuliaOS Integration Details

### Replacing Julep with JuliaOS

This project has been **completely migrated** from Julep to JuliaOS:

1. **Service Replacement**: All Julep API calls replaced with JuliaOS equivalents
2. **Agent Framework**: Using JuliaOS agent framework instead of Julep agents
3. **Swarm Capabilities**: Added JuliaOS swarm orchestration for multi-agent tasks
4. **Onchain Integration**: Added JuliaOS onchain query capabilities
5. **Configuration**: Updated environment variables from `JULEP_*` to `JULIAOS_*`

### Key Changes Made:

- ✅ **JuliaOSAgentService** - Replaced `JuliaAgentService` (Julep)
- ✅ **Environment Variables** - `JULIAOS_API_KEY` instead of `JULEP_API_KEY`
- ✅ **API Endpoints** - Added `/api/swarm` and `/api/onchain` for JuliaOS features
- ✅ **Health Monitoring** - Updated to show JuliaOS service status
- ✅ **Mock Service** - Updated to simulate JuliaOS behavior
- ✅ **Documentation** - All references updated to JuliaOS

### JuliaOS Features Implemented:

1. **Agent Execution** (`agent.useLLM()`)
   - Intelligent transaction analysis
   - Risk scoring and pattern detection
   - Compliance assessment

2. **Swarm Orchestration**
   - Multi-agent coordination
   - Task distribution
   - Hierarchical communication

3. **Onchain Capabilities**
   - Smart contract queries
   - Blockchain data access
   - Cross-chain functionality

## 🚀 Production Deployment

1. Set environment to production
2. Configure real JuliaOS service (recommended)
3. Set up blockchain API keys
4. Configure rate limiting
5. Set up monitoring
6. Secure API key management

## 🛠️ Development Guide

### JuliaOS Service Configuration

The platform supports three JuliaOS service modes:

1. **Mock Service** (`USE_MOCK_AI_SERVICE=true`)
   - No external dependencies
   - Realistic simulated results
   - Perfect for development
   - Simulates JuliaOS agent behavior

2. **JuliaOS AI** (`JULIAOS_API_KEY=your_key`)
   - Real AI analysis via JuliaOS
   - Production-ready
   - Advanced pattern recognition
   - Full swarm and onchain capabilities

3. **Custom Service** (`CUSTOM_AI_HOST=localhost`)
   - Integrate your own JuliaOS deployment
   - Flexible configuration
   - Custom analysis logic

### Adding New Blockchain Networks

1. Extend `BlockchainService` with new network support
2. Add network configuration to environment
3. Update frontend network selector
4. Test with real transactions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📜 License

This project is licensed under the MIT License.

## 🔒 Security

- All API keys stored in environment variables
- No sensitive data in version control
- Rate limiting and error handling implemented
- Professional-grade security practices

## 📞 Support

- Check `setup-guide.md` for detailed setup instructions
- Review console logs for debugging
- Test health endpoint for service status
- Verify JuliaOS API key configuration

## 🎯 Roadmap

- [x] Complete JuliaOS integration (replacing Julep)
- [x] JuliaOS swarm orchestration
- [x] JuliaOS onchain capabilities
- [x] Multiple AI service integration options
- [x] Mock service for development
- [x] Comprehensive error handling
- [ ] Additional blockchain networks
- [ ] Advanced ML risk models
- [ ] Real-time monitoring dashboards
- [ ] Compliance workflow integration
- [ ] Multi-language support
- [ ] Enterprise features

---

**Built with ❤️ using Next.js, TypeScript, and JuliaOS AI framework**

## 🔗 JuliaOS Resources

- [📚 JuliaOS GitHub](#)  
- [📖 JuliaOS Documentation](#)  
- [🌐 JuliaOS Website](#)  
- [🐦 Follow on X](#)  
- [💬 Join Discord](#)

> For technical help with JuliaOS integration, tag **@Euraxluo** in the **Tech Support** channel on Discord  
> or open an issue on the JuliaOS GitHub repo.
