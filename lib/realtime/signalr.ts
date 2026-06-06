import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import { store } from "@/lib/redux/store";

export type SignalRStatus = HubConnectionState;

let connection: HubConnection | null = null;
let startPromise: Promise<void> | null = null;
let stopPromise: Promise<void> | null = null;

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/";
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

export function getHubConnection(): HubConnection {
  if (typeof window === "undefined") throw new Error("SignalR chỉ chạy trên browser");
  if (connection) return connection;

  connection = new HubConnectionBuilder()
    .withUrl(getHubUrl(), { accessTokenFactory: () => getAccessToken() || "" })
    .withAutomaticReconnect()
    .configureLogging(
      process.env.NODE_ENV === "development" ? LogLevel.Information : LogLevel.Warning
    )
    .build();

  connection.onreconnecting((err) => console.info("[SignalR] reconnecting...", err));
  connection.onreconnected((id) => console.info("[SignalR] reconnected:", id));
  connection.onclose((err) => console.info("[SignalR] closed", err));

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
  stopPromise = connection.stop().finally(() => {
    connection = null;
    stopPromise = null;
  });
  await stopPromise;
}
