# TraceIQ - Backend Setup Guide

## 🚀 Getting Started

This guide will help you set up the TraceIQ backend with AI agent integration for blockchain transaction analysis.

## 📋 Prerequisites

- Node.js 18+ installed
- API keys for blockchain data providers (optional for mock mode)
- AI service configuration (optional - mock service works out of the box)

## 🔧 Environment Configuration

1. Copy the environment template and update with your API keys:

```bash
cp .env.local.example .env.local
# Edit .env.local with your configuration
```

### Complete Environment Configuration

```bash
# Application Settings
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
DEBUG=false

# AI Service Configuration
# Option 1: Use Mock AI Service (Default - perfect for development)
USE_MOCK_AI_SERVICE=true

# Option 2: Use Julep AI Platform (Recommended for production)
# Get your API key from https://docs.julep.ai/
# JULEP_API_KEY=your_julep_api_key_here
# JULEP_BASE_URL=https://api.julep.ai

# Option 3: Custom AI Service Integration
# If you have your own AI service, configure these:
# CUSTOM_AI_HOST=localhost
# CUSTOM_AI_PORT=8052
# CUSTOM_AI_TIMEOUT=30000

# Blockchain API Keys (Required for transaction analysis)
ETHERSCAN_API_KEY=your_etherscan_api_key_here
ALCHEMY_API_KEY=your_alchemy_api_key_here
INFURA_PROJECT_ID=your_infura_project_id_here
BSCSCAN_API_KEY=your_bscscan_api_key_here

# Risk Analysis Services (Optional)
OKLINK_API_KEY=your_oklink_api_key_here
```

## 🤖 AI Service Options

### Option 1: Mock AI Service (Default)
- **Perfect for development and testing**
- No external API keys required
- Provides realistic simulated analysis results
- Zero configuration needed

**To use**: Set `USE_MOCK_AI_SERVICE=true` in your `.env.local`

### Option 2: Julep AI Platform (Recommended for Production)
- **Real AI-powered analysis**
- Advanced pattern recognition
- Professional-grade results

**Setup steps**:
1. Visit [Julep AI Documentation](https://docs.julep.ai/)
2. Sign up and get your API key
3. Add `JULEP_API_KEY=your_key_here` to `.env.local`
4. Set `USE_MOCK_AI_SERVICE=false`

### Option 3: Custom AI Service
- **Integrate your own AI service**
- Maximum flexibility and control

**Setup steps**:
1. Configure `CUSTOM_AI_HOST` and `CUSTOM_AI_PORT`
2. Set `USE_MOCK_AI_SERVICE=false`
3. Ensure your service implements the expected API endpoints

## 🔑 Blockchain API Setup

### Required: Choose at least one blockchain data provider

#### Etherscan (Recommended)
- Visit [https://etherscan.io/apis](https://etherscan.io/apis)
- Create a free account and generate an API key
- Add to `ETHERSCAN_API_KEY`

#### Alchemy
- Visit [https://alchemy.com](https://alchemy.com)
- Create a free account and create an app
- Add the API key to `ALCHEMY_API_KEY`

#### Infura
- Visit [https://infura.io](https://infura.io)
- Create a free account and create a project
- Add the project ID to `INFURA_PROJECT_ID`

### Optional: Enhanced Features

#### OKLink (for enhanced risk analysis)
- Visit [https://www.oklink.com](https://www.oklink.com)
- Create an account and apply for API access
- Add to `OKLINK_API_KEY`

#### BSCScan (for BSC network support)
- Visit [https://bscscan.com/apis](https://bscscan.com/apis)
- Create account and get API key
- Add to `BSCSCAN_API_KEY`

## 🚀 Running the Application

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🧪 Testing the Setup

### Quick Start (No API Keys Required)
1. Run the application with default mock service
2. Enter any Ethereum transaction hash format (0x...)
3. See realistic mock analysis results

### Health Check
Visit [http://localhost:3000/api/health](http://localhost:3000/api/health) to check:
- Service status and configuration
- AI service type and status
- Blockchain API connectivity
- Environment configuration

### Production Transaction Analysis
1. Configure blockchain API keys
2. Optionally configure Julep AI for real analysis
3. Find real transaction hashes from:
   - [Etherscan](https://etherscan.io) for Ethereum
   - [Blockchain.info](https://blockchain.info) for Bitcoin
   - [BscScan](https://bscscan.com) for BSC
4. Enter the hash for real data analysis

## 🏗️ Architecture Overview

```
Frontend (Next.js) → API Routes → Services
                                    ├── AI Service (Mock/Julep/Custom)
                                    ├── BlockchainService (Multi-provider)
                                    └── AnalysisService (Orchestration)
```

### Key Components

1. **AI Service Layer**: Configurable AI analysis (Mock/Julep/Custom)
2. **BlockchainService**: Multi-provider blockchain data fetching
3. **AnalysisService**: Orchestrates the complete analysis pipeline
4. **API Routes**: RESTful endpoints for frontend communication

## 🔍 Supported Networks

- **Ethereum**: Full support with Etherscan/Alchemy/Infura
- **Bitcoin**: Basic support with public APIs
- **BSC (Binance Smart Chain)**: Full support with BscScan
- **More networks**: Easily extensible architecture

## 📊 Features Available

### Core Analysis (All Modes)
- ✅ Transaction data fetching
- ✅ Risk assessment and scoring
- ✅ Pattern detection simulation
- ✅ Professional reporting format
- ✅ Compliance flag generation

### AI-Powered Features
- 🤖 **Mock Mode**: Realistic simulated analysis
- 🧠 **Julep AI**: Real AI pattern recognition
- 🔧 **Custom**: Your own AI implementation

### Risk Detection Capabilities
- 🔍 Mixer detection (Tornado Cash, etc.)
- 🚫 Sanctioned address identification
- ⚠️ High-risk exchange flagging
- 🔗 Suspicious pattern recognition
- 📈 Risk scoring (0-100)

## 🛠️ Troubleshooting

### Common Issues

1. **"Mock service only" in results**
   - This is normal for development mode
   - To use real AI: configure Julep API key and set `USE_MOCK_AI_SERVICE=false`

2. **"Transaction not found"**
   - Verify the transaction hash is correct and properly formatted
   - Check if the network parameter matches the transaction's network
   - Ensure blockchain API keys are valid and have quota

3. **"AI service unavailable"**
   - Check your internet connection
   - Verify AI service configuration
   - Check the health endpoint: `/api/health`

4. **"No blockchain APIs configured"**
   - Add at least one blockchain API key (Etherscan recommended)
   - Restart the development server after adding keys

### Debug Mode
Add `DEBUG=true` to your `.env.local` for verbose logging.

### Health Endpoint
The `/api/health` endpoint provides detailed status:
```json
{
  "status": "healthy",
  "services": {
    "ai": { "status": "up", "serviceType": "mock" },
    "blockchain": { "status": "up" }
  },
  "configuration": {
    "usingMockAI": true,
    "hasJulepKey": false,
    "hasBlockchainKeys": {...}
  }
}
```

## 🔒 Security Notes

- Never commit API keys to version control
- Use environment variables for all sensitive data
- Consider rate limiting for production deployments
- Implement proper error handling and logging
- Mock service is safe for development (no external calls)

## 🚀 Production Deployment

For production deployment:

1. **AI Service**: Configure Julep AI (`USE_MOCK_AI_SERVICE=false`)
2. **Environment**: Set `NODE_ENV=production`
3. **Rate Limiting**: Configure proper rate limiting
4. **Monitoring**: Set up logging and monitoring
5. **Security**: Use secure API key management
6. **Caching**: Consider caching for blockchain data

## 📞 Support

If you encounter issues:

1. Check the console logs for detailed error messages
2. Visit `/api/health` to check service status
3. Verify environment configuration
4. Review this setup guide for missing steps

### Configuration Checklist

- [ ] Node.js 18+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] Environment file created (`.env.local`)
- [ ] AI service configured (Mock/Julep/Custom)
- [ ] At least one blockchain API key configured
- [ ] Application starts without errors (`npm run dev`)
- [ ] Health check passes (`/api/health`)

## 🎯 Next Steps

Once setup is complete, you can:

1. **Development**: Use mock service for rapid development
2. **Testing**: Test with real transaction hashes
3. **Production**: Configure Julep AI for real analysis
4. **Customization**: Integrate your own AI service
5. **Extension**: Add support for additional networks
6. **Integration**: Build custom reporting features

## 🔄 Switching Between AI Services

You can easily switch between AI services by updating your `.env.local`:

```bash
# For Mock Service (Development)
USE_MOCK_AI_SERVICE=true

# For Julep AI (Production)
USE_MOCK_AI_SERVICE=false
JULEP_API_KEY=your_key_here

# For Custom Service
USE_MOCK_AI_SERVICE=false
CUSTOM_AI_HOST=your_host
CUSTOM_AI_PORT=your_port
```

Restart the development server after making changes.

---

**Built with ❤️ using Next.js, TypeScript, and modern AI technologies**