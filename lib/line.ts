const LINE_API_BASE = "https://api.line.me/v2/bot";

interface LinePushRequest {
  to: string;
  messages: LineMessage[];
}

interface LineMessage {
  type: "text";
  text: string;
}

interface LineApiError {
  message: string;
  details?: unknown;
}

/**
 * Send a push message to a LINE group chat.
 * Uses the LINE_CHANNEL_ACCESS_TOKEN and LINE_GROUP_ID environment variables.
 *
 * @throws If the environment variables are missing or the API request fails.
 */
export async function sendLineMessage(message: string): Promise<void> {
  const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const groupId = process.env.LINE_GROUP_ID;

  if (!channelAccessToken) {
    throw new Error("LINE_CHANNEL_ACCESS_TOKEN environment variable is not set.");
  }

  if (!groupId) {
    throw new Error("LINE_GROUP_ID environment variable is not set.");
  }

  const body: LinePushRequest = {
    to: groupId,
    messages: [
      {
        type: "text",
        text: message,
      },
    ],
  };

  const response = await fetch(`${LINE_API_BASE}/message/push`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${channelAccessToken}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let errorDetail: string;
    try {
      const errorBody: LineApiError = await response.json();
      errorDetail = errorBody.message ?? response.statusText;
    } catch {
      errorDetail = response.statusText;
    }
    throw new Error(
      `LINE API error (${response.status}): ${errorDetail}`
    );
  }
}
