const DEFAULT_TIMEOUT = 15000;

class ApiError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = "ApiError";
    this.status = options.status || 500;
    this.statusText = options.statusText || "Unknown Error";
    this.url = options.url || "";
    this.data = options.data || null;
  }
}

function getBackendBaseUrl() {
  const baseUrl =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || process.env.BACKEND_API_URL;

  if (!baseUrl) {
    throw new Error("BACKEND_API_URL is not defined in environment variables.");
  }

  return baseUrl.replace(/\/+$/, "");
}

function isAbsoluteUrl(url) {
  return /^https?:\/\//i.test(url);
}

function isInternalApiRoute(url) {
  return typeof url === "string" && url.startsWith("/api/");
}

function buildUrl(endpoint) {
  if (!endpoint) {
    throw new Error("API endpoint is required.");
  }

  if (isAbsoluteUrl(endpoint)) {
    return endpoint;
  }

  // Important: internal Next.js API routes should stay relative
  if (isInternalApiRoute(endpoint)) {
    return endpoint;
  }

  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${getBackendBaseUrl()}${cleanEndpoint}`;
}

function mergeHeaders(customHeaders = {}, hasBody = false) {
  const headers = {
    Accept: "application/json",
    ...customHeaders,
  };

  if (hasBody && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

function createTimeoutSignal(timeout = DEFAULT_TIMEOUT) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  return {
    signal: controller.signal,
    clear: () => clearTimeout(timeoutId),
  };
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      throw new ApiError("Invalid JSON response from server.", {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
    }
  }

  try {
    const text = await response.text();
    return text || null;
  } catch {
    return null;
  }
}

function validateResponse(response, data) {
  if (response.ok) {
    return data;
  }

  const message =
    data?.message ||
    data?.error ||
    data?.errors?.[0]?.message ||
    `Request failed with status ${response.status}`;

  throw new ApiError(message, {
    status: response.status,
    statusText: response.statusText,
    url: response.url,
    data,
  });
}

async function request(endpoint, options = {}) {
  const {
    method = "GET",
    headers = {},
    body,
    timeout = DEFAULT_TIMEOUT,
    cache = "no-store",
    next,
    ...restOptions
  } = options;

  const url = buildUrl(endpoint);
  const hasBody = body !== undefined && body !== null;
  const timeoutController = createTimeoutSignal(timeout);

  try {
    const response = await fetch(url, {
      method,
      headers: mergeHeaders(headers, hasBody),
      body: hasBody
        ? typeof body === "string"
          ? body
          : JSON.stringify(body)
        : undefined,
      signal: timeoutController.signal,
      cache,
      next,
      ...restOptions,
    });

    const data = await parseResponse(response);
    return validateResponse(response, data);
  } catch (error) {
    if (error.name === "AbortError") {
      throw new ApiError(`Request timeout after ${timeout}ms`, {
        status: 408,
        statusText: "Request Timeout",
        url,
      });
    }

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(error.message || "Something went wrong while calling API.", {
      status: 500,
      statusText: "Internal Client Error",
      url,
    });
  } finally {
    timeoutController.clear();
  }
}

export async function apiGet(endpoint, options = {}) {
  return request(endpoint, {
    ...options,
    method: "GET",
  });
}

export async function apiPost(endpoint, body = {}, options = {}) {
  return request(endpoint, {
    ...options,
    method: "POST",
    body,
  });
}

export { request, ApiError };