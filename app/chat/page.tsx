"use client"

import React from 'react'
import dynamic from 'next/dynamic';
import ChatOnlineContext from '@/components/messaging/ChatOnlineContext';

const Messaging = dynamic(() => import('@/components/messaging'), {
  ssr: false,
});

const Chat = () => {
  return (
    <ChatOnlineContext.Provider value={[]}>
      <Messaging />
    </ChatOnlineContext.Provider>
  )
}

export default Chat