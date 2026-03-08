import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { message, chatId: existingChatId } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    if (!apiKey) {
      console.error('DEEPSEEK_API_KEY is not configured');
      return NextResponse.json(
        { error: 'API key is not configured' },
        { status: 500 }
      );
    }

    // 创建 Supabase 客户端
    const supabase = await createClient();
    
    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Authentication error:', userError);
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    let chatId = existingChatId;
    
    // 如果没有提供 chatId，创建新的对话
    if (!chatId) {
      // 从消息中提取标题（前50个字符）
      const title = message.length > 50 ? message.substring(0, 47) + '...' : message;
      
      const { data: newChat, error: chatError } = await supabase
        .from('chats')
        .insert({
          user_id: user.id,
          title: title
        })
        .select('id')
        .single();
      
      if (chatError) {
        console.error('Error creating chat:', chatError);
        return NextResponse.json(
          { error: 'Failed to create chat' },
          { status: 500 }
        );
      }
      
      chatId = newChat.id;
    }

    // 保存用户消息到数据库
    const { error: userMessageError } = await supabase
      .from('messages')
      .insert({
        chat_id: chatId,
        role: 'user',
        content: message
      });

    if (userMessageError) {
      console.error('Error saving user message:', userMessageError);
      return NextResponse.json(
        { error: 'Failed to save user message' },
        { status: 500 }
      );
    }

    // 调用 DeepSeek API
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant. Provide clear, concise, and accurate responses. If you don\'t know something, admit it honestly.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        stream: false,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API error:', response.status, errorText);
      return NextResponse.json(
        { error: `API request failed: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid response format from DeepSeek:', data);
      return NextResponse.json(
        { error: 'Invalid response format from AI service' },
        { status: 500 }
      );
    }

    const aiResponse = data.choices[0].message.content;

    // 保存 AI 回复到数据库
    const { error: aiMessageError } = await supabase
      .from('messages')
      .insert({
        chat_id: chatId,
        role: 'assistant',
        content: aiResponse
      });

    if (aiMessageError) {
      console.error('Error saving AI message:', aiMessageError);
      return NextResponse.json(
        { error: 'Failed to save AI response' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      response: aiResponse,
      chatId: chatId
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
