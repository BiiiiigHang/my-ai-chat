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

        // 调用 DeepSeek API 使用流式响应
        const deepseekResponse = await fetch('https://api.deepseek.com/chat/completions', {
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
            stream: true,
            max_tokens: 1000,
            temperature: 0.7,
          }),
        });

        if (!deepseekResponse.ok) {
          const errorText = await deepseekResponse.text();
          console.error('DeepSeek API error:', deepseekResponse.status, errorText);
          return NextResponse.json(
            { error: `API request failed: ${deepseekResponse.status}` },
            { status: deepseekResponse.status }
          );
        }

        // 创建流式响应
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          async start(controller) {
            let fullResponse = '';
            
            try {
              const reader = deepseekResponse.body?.getReader();
              if (!reader) {
                throw new Error('No response body');
              }

              while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                // 解码数据块
                const chunk = new TextDecoder().decode(value);
                const lines = chunk.split('\n').filter(line => line.trim() !== '');
                
                for (const line of lines) {
                  if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    
                    if (data === '[DONE]') {
                      // 流结束，保存完整响应到数据库
                      try {
                        const { error: aiMessageError } = await supabase
                          .from('messages')
                          .insert({
                            chat_id: chatId,
                            role: 'assistant',
                            content: fullResponse
                          });

                        if (aiMessageError) {
                          console.error('Error saving AI message:', aiMessageError);
                          // 继续发送完成信号，即使保存失败
                        }
                      } catch (saveError) {
                        console.error('Error saving AI response:', saveError);
                      }
                      
                      // 发送完成信号
                      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'complete', chatId })}\n\n`));
                      continue;
                    }

                    try {
                      const parsed = JSON.parse(data);
                      if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta) {
                        const content = parsed.choices[0].delta.content;
                        if (content) {
                          fullResponse += content;
                          // 发送内容块
                          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'chunk', content })}\n\n`));
                        }
                      }
                    } catch (parseError) {
                      console.error('Error parsing SSE data:', parseError, data);
                    }
                  }
                }
              }
              
              // 发送最终完成信号
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'complete', chatId })}\n\n`));
              controller.close();
            } catch (error) {
              console.error('Error in stream processing:', error);
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', error: 'Stream processing failed' })}\n\n`));
              controller.close();
            }
          },
        });

        return new Response(stream, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        });

  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
