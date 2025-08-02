import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Chat API is working' });
}

export async function POST(request: NextRequest) {
  console.log('Chat API route called');
  try {
    const { message, files } = await request.json();
    console.log('Received message:', message);
    console.log('Received files:', files);

    // Check if API key is configured
    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      console.error('CLAUDE_API_KEY environment variable not set');
      return NextResponse.json(
        { error: 'Claude API key not configured. Please add CLAUDE_API_KEY to your environment variables.' },
        { status: 500 }
      );
    }

    // Prepare the message for Claude
    let content = message;
    if (files && files.length > 0) {
      const fileNames = files.map((file: any) => file.name).join(', ');
      content = `[User uploaded files: ${fileNames}]\n\n${message}`;
    }

    // Call Claude API
    console.log('Calling Claude API with content:', content);
    console.log('API Key present:', !!apiKey);
    console.log('API Key length:', apiKey.length);
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: content
          }
        ]
      })
    });
    
    console.log('Claude API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Claude API error:', response.status, errorData);
      return NextResponse.json(
        { 
          error: 'Failed to get response from Claude',
          details: errorData,
          status: response.status
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const assistantMessage = data.content[0].text;

    return NextResponse.json({ message: assistantMessage });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}