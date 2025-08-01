# TraceIQ - Backend Setup Guide

## 🚀 Getting Started

This guide will help you set up the TraceIQ backend with juliaOS agent integration for blockchain transaction analysis.

## 📋 Prerequisites

- Node.js 18+ installed
- API keys for blockchain data providers
- JuliaOS configuration and access

## 🔧 Environment Configuration

1. Copy the `.env.local` file and update with your API keys:

```bash
# JuliaOS Configuration
JULIAOS_HOST=localhost
JULIAOS_PORT=8052
JULIAOS_TIMEOUT=30000

# Blockchain API Keys
ETHERSCAN_API_KEY=your_etherscan_api_key_here
ALCHEMY_API_KEY=your_alchemy_api_key_here
INFURA_PROJECT_ID=your_infura_project_id_here

# OKLink API (for blockchain analysis)
OKLINK_API_KEY=your_oklink_api_key_here

# Application Settings
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🔑 API Key Setup

### 1. JuliaOS (Required)
- Visit [https://docs.juliaos.com/](https://docs.juliaos.com/) for installation
- Set up your JuliaOS instance following the installation guide
- Configure connection details in your `.env.local`

### 2. Blockchain Data Providers (Choose at least one)

#### Etherscan
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

### 3. OKLink (Optional - for enhanced risk analysis)
- Visit [https://www.oklink.com](https://www.oklink.com)
- Create an account and apply for API access
- Add to `OKLINK_API_KEY`

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

### Health Check
Visit [http://localhost:3000/api/health](http://localhost:3000/api/health) to check if all services are running properly.

### Production Transaction Analysis
1. Find a real transaction hash from:
   - [Etherscan](https://etherscan.io) for Ethereum
   - [Blockchain.info](https://blockchain.info) for Bitcoin
   - [BscScan](https://bscscan.com) for BSC
2. Enter the hash in the transaction input
3. The system will fetch real data and perform AI analysis

## 🏗️ Architecture Overview

```
Frontend (Next.js) → API Routes → Services
                                    ├── BlockchainService (fetch tx data)
                                    ├── JuliaAgentService (AI analysis)
                                    └── AnalysisService (orchestration)
```

### Key Components

1. **BlockchainService**: Fetches transaction data from various blockchain networks
2. **JuliaAgentService**: Uses JuliaOS agents for transaction analysis
3. **AnalysisService**: Orchestrates the analysis pipeline
4. **API Routes**: RESTful endpoints for frontend communication

## 🔍 Supported Networks

- **Ethereum**: Full support with Etherscan/Alchemy/Infura
- **Bitcoin**: Basic support with public APIs
- **BSC (Binance Smart Chain)**: Full support with BscScan
- **More networks**: Can be added by extending BlockchainService

## 📊 Features

### Core Analysis
- ✅ Transaction data fetching
- ✅ AI-powered risk assessment
- ✅ Path tracing and visualization
- ✅ Compliance flag generation
- ✅ Professional reporting

### Risk Detection
- 🔍 Mixer detection (Tornado Cash, etc.)
- 🚫 Sanctioned address identification
- ⚠️ High-risk exchange flagging
- 🔗 Suspicious pattern recognition
- 📈 Risk scoring (0-100)

### Output Formats
- 📊 Interactive web dashboard
- 📄 PDF reports
- 📋 JSON data export
- 🔗 API responses

## 🛠️ Troubleshooting

### Common Issues

1. **"JuliaOS connection failed"**
- Make sure your JuliaOS instance is running
- Verify `JULIAOS_HOST` and `JULIAOS_PORT` in `.env.local`
   - Restart the development server after adding the key

2. **"Transaction not found"**
   - Verify the transaction hash is correct
   - Check if the network parameter matches the transaction's network
   - Ensure your blockchain API keys are valid

3. **"Analysis service unavailable"**
   - Check your internet connection
   - Verify JuliaOS configuration is correct
   - Check the health endpoint for service status

### Debug Mode
Add `DEBUG=true` to your `.env.local` for verbose logging.

## 🔒 Security Notes

- Never commit API keys to version control
- Use environment variables for all sensitive data
- Consider rate limiting for production deployments
- Implement proper error handling and logging

## 🚀 Production Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Configure proper rate limiting
3. Set up monitoring and logging
4. Use secure API key management
5. Consider caching for blockchain data

## 📞 Support

If you encounter issues:

1. Check the console logs for detailed error messages
2. Verify all API keys are correctly configured
3. Test the health endpoint
4. Review the setup guide for missing steps

## 🎯 Next Steps

Once setup is complete, you can:

1. Analyze real blockchain transactions
2. Customize risk assessment rules
3. Integrate with compliance workflows
4. Extend support for additional networks
5. Build custom reporting features

---

**Made with ❤️ by Julia OS**