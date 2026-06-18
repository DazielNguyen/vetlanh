import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import { store } from "@/lib/redux/store";
import { env } from "@/lib/env";

export type SignalRStatus = HubConnectionState;

let connection: HubConnection | null = null;
let startPromise: Promise<void> | null = null;
let stopPromise: Promise<void> | null = null;

function getBaseUrl(): string {
  return env.apiUrl;
}

export function getHubUrl(): string {
  return new URL("/hubs/app", getBaseUrl()).toString();
}

function getAccessToken(): string | null {
  try {
    return store.getState().auth.token;
  } catch {
    return null;
  }
}

/**
 * Lazily resolves the bearer token on every negotiation/reconnect request.
 *
 * Returning `null` tells SignalR to omit the Authorization header entirely,
 * which produces a clear connection error instead of a server-side HTTP 401
 * caused by an empty or invalid Bearer value.
 */
function accessTokenFactory(): string | null {
  const token = getAccessToken();
  if (!token) {
    console.warn("[SignalR] accessTokenFactory: no token in store — connection will be rejected by server");
    return null;
  }
  return token;
}

export function getHubConnection(): HubConnection {
  if (typeof window === "undefined") throw new Error("SignalR chỉ chạy trên browser");
  if (connection) return connection;

  connection = new HubConnectionBuilder()
    .withUrl(getHubUrl(), { accessTokenFactory })
    .withAutomaticReconnect()
    .configureLogging(
      process.env.NODE_ENV === "development" ? LogLevel.Information : LogLevel.Warning
    )
    .build();

  connection.onreconnecting((err) => console.info("[SignalR] reconnecting...", err));
  connection.onreconnected((id) => console.info("[SignalR] reconnected:", id));
  connection.onclose((err) => err ? console.warn("[SignalR] closed with error", err) : console.info("[SignalR] closed gracefully"));

  return connection;
}

export async function startHubConnection(): Promise<HubConnection> {
  // If a stop is in progress (e.g. React Strict Mode cleanup), wait for it first
  // so we never call start() on a Disconnecting connection
  if (stopPromise) await stopPromise;

  const conn = getHubConnection();
  if (conn.state === HubConnectionState.Connected) return conn;
  if (conn.state === HubConnectionState.Reconnecting) return conn;

  if (conn.state === HubConnectionState.Connecting) {
    if (startPromise) await startPromise;
    return conn;
  }

  startPromise = conn
    .start()
    .then(() => {
      startPromise = null;
    })
    .catch((err) => {
      startPromise = null;
      throw err;
    });

  await startPromise;
  return conn;
}

export async function stopHubConnection(): Promise<void> {
  if (!connection) return;
  // Wait for any in-progress start before stopping — calling stop() during
  // negotiation causes "The connection was stopped during negotiation" error
  if (startPromise) await startPromise.catch(() => {});
  stopPromise = connection.stop().finally(() => {
    connection = null;
    stopPromise = null;
  });
  await stopPromise;
}
