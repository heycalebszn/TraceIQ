import { NextRequest, NextResponse } from 'next/server';
import { JuliaOSAgentService } from '@/lib/services/juliaos-agent';

const juliaOSService = new JuliaOSAgentService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request
    if (!body.contractAddress || !body.method) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Contract address and method are required',
          message: 'Please provide a contract address and method for onchain query'
        },
        { status: 400 }
      );
    }

    console.log('Executing JuliaOS onchain query:', {
      contractAddress: body.contractAddress,
      method: body.method,
      params: body.params || []
    });

    // Execute onchain query using JuliaOS
    const result = await juliaOSService.queryOnchainData(
      body.contractAddress,
      body.method,
      body.params || []
    );

    return NextResponse.json({
      success: true,
      data: result,
      message: 'JuliaOS onchain query executed successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('JuliaOS Onchain API Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'JuliaOS onchain query failed',
        message: error instanceof Error ? error.message : 'An unexpected error occurred while executing the onchain query'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contractAddress = searchParams.get('contractAddress');
    const method = searchParams.get('method');
    const params = searchParams.get('params');

    if (!contractAddress || !method) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Contract address and method are required',
          message: 'Please provide contract address and method as query parameters'
        },
        { status: 400 }
      );
    }

    // Parse params if provided
    let parsedParams: any[] = [];
    if (params) {
      try {
        parsedParams = JSON.parse(params);
      } catch (e) {
        console.warn('Failed to parse params, using empty array');
      }
    }

    console.log('Executing JuliaOS onchain query via GET:', {
      contractAddress,
      method,
      params: parsedParams
    });

    // Execute onchain query using JuliaOS
    const result = await juliaOSService.queryOnchainData(
      contractAddress,
      method,
      parsedParams
    );

    return NextResponse.json({
      success: true,
      data: result,
      message: 'JuliaOS onchain query executed successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('JuliaOS Onchain GET API Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'JuliaOS onchain query failed',
        message: error instanceof Error ? error.message : 'An unexpected error occurred while executing the onchain query'
      },
      { status: 500 }
    );
  }
}