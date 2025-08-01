# 🚀 Trace IQ - JuliaOS Setup Guide

This guide will help you set up the Trace IQ blockchain analysis platform with JuliaOS integration for AI-powered transaction analysis.

## 📋 Prerequisites

- Node.js 18+ installed
- Git installed
- Basic understanding of blockchain concepts
- JuliaOS API key (optional for production)

## 🛠️ Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd trace-iq
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

## 🔧 JuliaOS Configuration

### Option 1: Mock JuliaOS Service (Recommended for Development)

For development and testing, use the mock service:

```env
# Mock JuliaOS Service (Default)
USE_MOCK_AI_SERVICE=true
```

This option:
- ✅ No external API keys required
- ✅ Provides realistic simulated results
- ✅ Perfect for development and testing
- ✅ Simulates JuliaOS agent behavior

### Option 2: JuliaOS AI Platform (Recommended for Production)

For production use with real JuliaOS AI:

```env
# JuliaOS AI Platform
JULIAOS_API_KEY=your_juliaos_api_key_here
JULIAOS_BASE_URL=https://api.juliaos.ai
JULIAOS_AGENT_ID=blockchain-analyst
USE_MOCK_AI_SERVICE=false
```

To get a JuliaOS API key:
1. Visit [JuliaOS AI Platform](https://juliaos.ai/)
2. Sign up for an account
3. Navigate to API Keys section
4. Generate a new API key
5. Copy the key to your `.env.local` file

### Option 3: Custom JuliaOS Service

For custom JuliaOS deployments:

```env
# Custom JuliaOS Service
CUSTOM_AI_HOST=localhost
CUSTOM_AI_PORT=8052
CUSTOM_AI_TIMEOUT=30000
USE_MOCK_AI_SERVICE=false
```

## 🔗 Blockchain API Configuration

### Required APIs (Choose at least one)

#### Etherscan (Ethereum)
1. Visit [Etherscan API](https://etherscan.io/apis)
2. Create an account and get your API key
3. Add to `.env.local`:
```env
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

#### Alchemy (Ethereum)
1. Visit [Alchemy](https://alchemy.com)
2. Create an account and get your API key
3. Add to `.env.local`:
```env
ALCHEMY_API_KEY=your_alchemy_api_key_here
```

#### Infura (Ethereum)
1. Visit [Infura](https://infura.io)
2. Create an account and get your project ID
3. Add to `.env.local`:
```env
INFURA_PROJECT_ID=your_infura_project_id_here
```

#### BSCScan (BSC Network)
1. Visit [BSCScan](https://bscscan.com/apis)
2. Create an account and get your API key
3. Add to `.env.local`:
```env
BSCSCAN_API_KEY=your_bscscan_api_key_here
```

### Optional APIs

#### OKLink (Enhanced Risk Analysis)
1. Visit [OKLink](https://www.oklink.com)
2. Create an account and get your API key
3. Add to `.env.local`:
```env
OKLINK_API_KEY=your_oklink_api_key_here
```

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## 🧪 Testing Your Setup

### 1. Health Check

Visit `http://localhost:3000/api/health` to verify all services are running:

```json
{
  "status": "healthy",
  "services": {
    "blockchain": { "status": "up" },
    "ai": { 
      "status": "up", 
      "serviceType": "juliaos" 
    }
  },
  "configuration": {
    "hasJuliaOSKey": true,
    "usingMockAI": false
  }
}
```

### 2. Test Transaction Analysis

1. Go to the main page
2. Enter a test transaction hash:
   - Ethereum: `0x5c504ed432cb51138bcf09aa5e8a410dd4a1e204ef84bfed1be16dfba1b22060`
   - Bitcoin: `0e3e2357e806b6cdb1f70b54c3a3a17b6714ee1f0e68bebb44a74b1efd512098`
3. Click "Analyze Transaction"
4. Verify JuliaOS analysis results

### 3. Test JuliaOS Swarm

```bash
curl -X POST http://localhost:3000/api/swarm \
  -H "Content-Type: application/json" \
  -d '{
    "agents": ["blockchain-analyst", "risk-scorer", "compliance-checker"]
  }'
```

### 4. Test JuliaOS Onchain Query

```bash
curl -X POST http://localhost:3000/api/onchain \
  -H "Content-Type: application/json" \
  -d '{
    "contractAddress": "0xA0b86a33E6441b8c4C8C1C1B8c4C8C1C1B8c4C8C",
    "method": "balanceOf",
    "params": ["0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"]
  }'
```

## 🔍 Troubleshooting

### Common Issues

#### 1. JuliaOS Service Not Responding

**Symptoms:**
- Health check shows AI service as "down"
- Analysis returns fallback data

**Solutions:**
- Verify `JULIAOS_API_KEY` is correct
- Check `JULIAOS_BASE_URL` is accessible
- Ensure `USE_MOCK_AI_SERVICE=true` for development

#### 2. Blockchain APIs Not Working

**Symptoms:**
- Health check shows blockchain service as "down"
- Transaction analysis fails

**Solutions:**
- Verify API keys are correct
- Check API rate limits
- Ensure at least one blockchain API is configured

#### 3. Environment Variables Not Loading

**Symptoms:**
- Configuration shows "none-configured"
- Services not working as expected

**Solutions:**
- Ensure `.env.local` file exists in root directory
- Restart the development server after changes
- Check for typos in environment variable names

### Debug Mode

Enable debug logging:

```env
DEBUG=true
NODE_ENV=development
```

### Logs

Check console logs for detailed error information:

```bash
npm run dev 2>&1 | tee logs.txt
```

## 🔒 Security Considerations

### API Key Management

1. **Never commit API keys to version control**
2. **Use environment variables for all sensitive data**
3. **Rotate API keys regularly**
4. **Use different keys for development and production**

### Production Deployment

1. **Set `NODE_ENV=production`**
2. **Use real JuliaOS API keys**
3. **Configure rate limiting**
4. **Set up monitoring and alerting**
5. **Use HTTPS in production**

## 📊 Performance Optimization

### JuliaOS Configuration

```env
# Optimize JuliaOS performance
JULIAOS_TIMEOUT=30000
JULIAOS_MAX_RETRIES=3
JULIAOS_CACHE_TTL=3600
```

### Blockchain API Optimization

```env
# Use multiple providers for redundancy
ETHERSCAN_API_KEY=key1
ALCHEMY_API_KEY=key2
INFURA_PROJECT_ID=project1
```

## 🔄 JuliaOS Migration Notes

### From Julep to JuliaOS

This project has been completely migrated from Julep to JuliaOS:

**Environment Variables Changed:**
- `JULEP_API_KEY` → `JULIAOS_API_KEY`
- `JULEP_BASE_URL` → `JULIAOS_BASE_URL`

**New Features Added:**
- JuliaOS swarm orchestration (`/api/swarm`)
- JuliaOS onchain queries (`/api/onchain`)
- Enhanced agent capabilities

**Service Updates:**
- `JuliaAgentService` → `JuliaOSAgentService`
- Updated health monitoring
- Enhanced error handling

## 📚 Additional Resources

### JuliaOS Documentation
- [JuliaOS Agent Framework](https://docs.juliaos.ai/agents)
- [JuliaOS Swarm Orchestration](https://docs.juliaos.ai/swarms)
- [JuliaOS Onchain Integration](https://docs.juliaos.ai/blockchain)

### Blockchain APIs
- [Etherscan API Docs](https://docs.etherscan.io/)
- [Alchemy API Docs](https://docs.alchemy.com/)
- [Infura API Docs](https://docs.infura.io/)

### Support
- **JuliaOS Issues**: [GitHub Issues](https://github.com/juliaos/juliaos/issues)
- **Discord Community**: [JuliaOS Discord](https://discord.gg/juliaos)
- **Technical Support**: Tag `@Euraxluo` in Discord

## 🎯 Next Steps

1. **Test with real transactions** from supported networks
2. **Configure production JuliaOS API keys**
3. **Set up monitoring and alerting**
4. **Deploy to production environment**
5. **Contribute to the project** via GitHub

---

**Happy analyzing with JuliaOS! 🚀**