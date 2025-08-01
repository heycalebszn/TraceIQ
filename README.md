## Trace IQ - Blockchain Transaction Analysis Platform

A sophisticated blockchain transaction analysis platform powered by AI agents for compliance and forensic investigation.

## 🚀 Features

### 🔥 AI-Powered Analysis

- **AI Agent Integration** - Multiple AI service options including Julia OS AI platform
- **Multi-Network Support** - Ethereum, Bitcoin, BSC, and more
- **Real-time Risk Assessment** - Comprehensive risk scoring from 0-100
- **Intelligent Pattern Recognition** - Detects mixers, sanctions, and suspicious activities

### 💡 How It Works

- **🧠 Agent Activated** – AI reads and analyzes the transaction hash
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
- **AI Agent Summary** - Professional analysis suitable for law enforcement
- **Interactive Graph** - Visual transaction flow with risk indicators
- **Export Options** - PDF reports and JSON data downloads

### 🧠 Advanced AI Features

- **Multiple AI Service Options** - JuliaOS AI, Mock Service, or Custom Integration
- **Risk Pattern Detection** - Identifies money laundering and compliance risks
- **Path Tracing** - Tracks funds across multiple hops and networks
- **Compliance Reporting** - Generates professional reports for regulatory use

### 🔗 Blockchain Integration

- **Multi-Provider Support** - Etherscan, Alchemy, Infura, OKLink
- **Real-time Data** - Live blockchain data fetching
- **Network Coverage** - Ethereum, Bitcoin, BSC with easy extensibility
- **Fallback Systems** - Multiple data sources for reliability

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+
- API keys (see setup guide)

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

### AI Service Options

**Option 1: Mock AI Service (Default)**
- Perfect for development and testing
- No external API keys required
- Provides realistic mock analysis results

**Option 2: Julep AI Platform (Recommended for Production)**
- Real AI-powered analysis
- Sign up at [Julep AI](https://docs.julep.ai/)
- Add `JULEP_API_KEY` to your environment

**Option 3: Custom AI Service**
- Integrate with your own AI service
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
Visit `/api/health` to verify all services are running properly.

### Mock Analysis (Default)
- No setup required
- Provides realistic simulated results
- Perfect for development and testing

### Production Analysis
Enter any valid transaction hash from supported networks for comprehensive analysis.

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
├── /api/analyze - Main analysis endpoint
├── /api/health - Service health check
└── Real-time blockchain integration

AI & Data Services
├── AI Service (Julep/Mock/Custom) - Analysis and risk scoring
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

### Health Check
```bash
GET /api/health
```

Returns service status, configuration, and connectivity information.

## 🚀 Production Deployment

1. Set environment to production
2. Configure real AI service (Julep recommended)
3. Set up blockchain API keys
4. Configure rate limiting
5. Set up monitoring
6. Secure API key management

## 🛠️ Development Guide

### AI Service Configuration

The platform supports three AI service modes:

1. **Mock Service** (`USE_MOCK_AI_SERVICE=true`)
   - No external dependencies
   - Realistic simulated results
   - Perfect for development

2. **Julep AI** (`JULEP_API_KEY=your_key`)
   - Real AI analysis
   - Production-ready
   - Advanced pattern recognition

3. **Custom Service** (`CUSTOM_AI_HOST=localhost`)
   - Integrate your own AI
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
- Verify API key configuration

## 🎯 Roadmap

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

**Built with ❤️ using Next.js, TypeScript, and modern AI technologies**
