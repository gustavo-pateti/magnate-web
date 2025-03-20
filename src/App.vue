<script setup lang="ts">
import { ref } from 'vue';
import { useWebSocket } from './composables/useWebSocket';

const message = ref('');
const receivedMessages = ref<string[]>([]);

const { send, isConnected } = useWebSocket({
  url: 'ws://localhost:3000',
  onMessage: async (message) => {
    receivedMessages.value.push(message as string);
  },
});

const sendMessage = () => {
  if (isConnected.value) {
    send(message.value);
    message.value = '';
  } else {
    console.error('WebSocket connection is not established');
  }
};
</script>

<template>
  <div>
    <input v-model="message" type="text" placeholder="Type a message" />
    <button @click="sendMessage">Send</button>
    <div>Received Messages:</div>
    <ul>
      <li v-for="msg in receivedMessages" :key="msg">{{ msg }}</li>
    </ul>
  </div>
</template>
