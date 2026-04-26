type Role = "user" | "assistant";

interface Message {
  role: Role;
  content: string;
}

const MAX_MESSAGES = 20;
const store = new Map<string, Message[]>();

export function getHistory(userId: string): Message[] {
  return store.get(userId) ?? [];
}

export function appendMessage(
  userId: string,
  role: Role,
  content: string
): void {
  const history = getHistory(userId);
  history.push({ role, content });
  if (history.length > MAX_MESSAGES) {
    history.splice(0, history.length - MAX_MESSAGES);
  }
  store.set(userId, history);
}

export function clearHistory(userId: string): void {
  store.delete(userId);
}
