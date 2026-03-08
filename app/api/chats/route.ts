import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
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

    // 获取用户的所有对话
    const { data: chats, error: chatsError } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (chatsError) {
      console.error('Error fetching chats:', chatsError);
      return NextResponse.json(
        { error: 'Failed to fetch chats' },
        { status: 500 }
      );
    }

    // 为每个对话获取最后一条消息
    const chatsWithLastMessage = await Promise.all(
      chats.map(async (chat) => {
        const { data: lastMessage } = await supabase
          .from('messages')
          .select('content, created_at')
          .eq('chat_id', chat.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        const { count: messageCount } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('chat_id', chat.id);

        return {
          id: chat.id,
          title: chat.title,
          lastMessage: lastMessage?.content || 'No messages yet',
          timestamp: new Date(chat.created_at),
          messageCount: messageCount || 0,
        };
      })
    );

    return NextResponse.json({
      chats: chatsWithLastMessage
    });

  } catch (error) {
    console.error('Error fetching chats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 创建新对话
export async function POST(request: NextRequest) {
  try {
    const { title } = await request.json();

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

    const { data: newChat, error: chatError } = await supabase
      .from('chats')
      .insert({
        user_id: user.id,
        title: title || '新对话'
      })
      .select('*')
      .single();

    if (chatError) {
      console.error('Error creating chat:', chatError);
      return NextResponse.json(
        { error: 'Failed to create chat' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      chat: {
        id: newChat.id,
        title: newChat.title,
        lastMessage: 'Start a conversation...',
        timestamp: new Date(newChat.created_at),
        messageCount: 0,
      }
    });

  } catch (error) {
    console.error('Error creating chat:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 删除对话
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get('id');

    if (!chatId) {
      return NextResponse.json(
        { error: 'Chat ID is required' },
        { status: 400 }
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

    // 验证用户拥有这个对话
    const { data: chat, error: chatError } = await supabase
      .from('chats')
      .select('*')
      .eq('id', chatId)
      .eq('user_id', user.id)
      .single();

    if (chatError || !chat) {
      return NextResponse.json(
        { error: 'Chat not found or access denied' },
        { status: 404 }
      );
    }

    // 删除对话（级联删除消息）
    const { error: deleteError } = await supabase
      .from('chats')
      .delete()
      .eq('id', chatId);

    if (deleteError) {
      console.error('Error deleting chat:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete chat' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Chat deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting chat:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
