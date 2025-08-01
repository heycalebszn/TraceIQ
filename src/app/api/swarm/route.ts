import { NextRequest, NextResponse } from 'next/server';
import { JuliaOSAgentService } from '@/lib/services/juliaos-agent';

const juliaOSService = new JuliaOSAgentService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request
    if (!body.agents || !Array.isArray(body.agents) || body.agents.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Agent list is required',
          message: 'Please provide a list of agent IDs for swarm creation'
        },
        { status: 400 }
      );
    }

    console.log('Creating JuliaOS swarm with agents:', body.agents);

    // Create swarm using JuliaOS
    const result = await juliaOSService.createSwarm(body.agents);

    return NextResponse.json({
      success: true,
      data: result,
      message: 'JuliaOS swarm created successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('JuliaOS Swarm API Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'JuliaOS swarm creation failed',
        message: error instanceof Error ? error.message : 'An unexpected error occurred while creating the swarm'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const swarmId = searchParams.get('swarmId');

    if (!swarmId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Swarm ID is required',
          message: 'Please provide a swarm ID to get swarm status'
        },
        { status: 400 }
      );
    }

    // Get swarm status from JuliaOS
    const response = await fetch(`${process.env.JULIAOS_BASE_URL || 'https://api.juliaos.ai'}/v1/swarms/${swarmId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.JULIAOS_API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`JuliaOS swarm status check failed: ${response.statusText}`);
    }

    const swarmData = await response.json();

    return NextResponse.json({
      success: true,
      data: swarmData,
      message: 'JuliaOS swarm status retrieved successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('JuliaOS Swarm Status API Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'JuliaOS swarm status check failed',
        message: error instanceof Error ? error.message : 'An unexpected error occurred while checking swarm status'
      },
      { status: 500 }
    );
  }
}