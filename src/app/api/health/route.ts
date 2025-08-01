import { NextResponse } from 'next/server';
import { AnalysisService } from '@/lib/services/analysis';

const analysisService = new AnalysisService();

export async function GET() {
  try {
    const health = await analysisService.healthCheck();
    const agentStatus = await analysisService.getAgentStatus();

    return NextResponse.json({
      status: health.overall ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        blockchain: {
          status: health.blockchain ? 'up' : 'down',
          description: 'Blockchain data fetching service',
          details: health.blockchain ? 'All blockchain APIs are accessible' : 'One or more blockchain APIs are unavailable'
        },
        ai: {
          status: health.ai ? 'up' : 'down',
          description: 'AI analysis service',
          details: health.ai ? 'AI service is responding correctly' : 'AI service is unavailable or misconfigured',
          serviceType: getAIServiceType()
        }
      },
      agent: agentStatus,
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      configuration: {
        usingMockAI: process.env.USE_MOCK_AI_SERVICE === 'true',
        hasJulepKey: !!process.env.JULEP_API_KEY,
        hasCustomAI: !!process.env.CUSTOM_AI_HOST,
        hasBlockchainKeys: {
          etherscan: !!process.env.ETHERSCAN_API_KEY,
          alchemy: !!process.env.ALCHEMY_API_KEY,
          infura: !!process.env.INFURA_PROJECT_ID,
          bscscan: !!process.env.BSCSCAN_API_KEY
        }
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      details: error instanceof Error ? error.message : 'Unknown error occurred',
      services: {
        blockchain: { status: 'unknown', description: 'Unable to check blockchain service status' },
        ai: { status: 'unknown', description: 'Unable to check AI service status' }
      },
      configuration: {
        environment: process.env.NODE_ENV || 'development',
        usingMockAI: process.env.USE_MOCK_AI_SERVICE === 'true'
      }
    }, { status: 500 });
  }
}

function getAIServiceType(): string {
  if (process.env.USE_MOCK_AI_SERVICE === 'true') {
    return 'mock';
  } else if (process.env.JULEP_API_KEY) {
    return 'julep';
  } else if (process.env.CUSTOM_AI_HOST) {
    return 'custom';
  } else {
    return 'none-configured';
  }
}