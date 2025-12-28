import { getSessionId } from "./cookies";

// API base URL - adjust this to match your backend
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

type FetchOptions = {
  endpoint: string;
  data?: Record<string, unknown>;
  headers?: Record<string, string>;
  method?: "GET" | "POST" | "PUT" | "DELETE";
};

/**
 * Get the session ID from cookies to include in requests
 */
function getAuthHeaders(): Record<string, string> {
  const sessionId = getSessionId();
  const headers: Record<string, string> = {};
  if (sessionId) {
    headers["X-Session-ID"] = sessionId;
  }
  return headers;
}

async function apiRequest<T>({
  endpoint,
  data,
  headers,
  method = "POST",
}: FetchOptions): Promise<T> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
    ...headers,
  };

  const fetchOptions: RequestInit = {
    method,
    headers: defaultHeaders,
  };

  if (data && (method === "POST" || method === "PUT")) {
    fetchOptions.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ detail: `HTTP error! Status: ${response.status}` }));
      throw new Error(
        errorData.detail || `HTTP error! Status: ${response.status}`
      );
    }

    // Handle 204 No Content (no body)
    if (response.status === 204) {
      return null as T;
    }

    return response.json() as Promise<T>;
  } catch (error) {
    console.error("Error in API request:", error);
    throw error;
  }
}

async function postRequest<T>({
  endpoint,
  data,
  headers,
}: FetchOptions): Promise<T> {
  return apiRequest<T>({ endpoint, data, headers, method: "POST" });
}

async function getRequest<T>({
  endpoint,
  headers,
}: Omit<FetchOptions, "data">): Promise<T> {
  return apiRequest<T>({ endpoint, headers, method: "GET" });
}

export { postRequest, getRequest, API_BASE_URL };
