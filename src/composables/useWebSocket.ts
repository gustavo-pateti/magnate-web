import { ref, onUnmounted } from 'vue';

interface WebSocketOptions {
  url: string;
  onMessage: (message: string | ArrayBuffer) => void;
  onError?: (error: Event) => void;
  onClose?: () => void;
}

export function useWebSocket(options: WebSocketOptions) {
  const ws = ref<WebSocket | null>(null);
  const isConnected = ref(false);

  const connect = () => {
    if (!ws.value) {
      ws.value = new WebSocket(options.url);
      ws.value.onopen = () => {
        isConnected.value = true;
        console.log('WebSocket connection established');
      };

      ws.value.onmessage = async (event) => {
        options.onMessage(event.data);
      };

      ws.value.onerror = (error) => {
        if (options.onError) {
          options.onError(error);
        }
      };

      ws.value.onclose = () => {
        isConnected.value = false;
        if (options.onClose) {
          options.onClose();
        }
        console.log('WebSocket connection closed');
      };
    }
  };

  const send = (message: string) => {
    if (ws.value) {
      ws.value.send(message);
    }
  };

  const close = () => {
    if (ws.value) {
      ws.value.close();
    }
  };

  onUnmounted(() => {
    close();
  });

  connect(); // Establish connection immediately

  return { send, close, isConnected };
}
