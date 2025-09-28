const baseUrl: string = `${window.location.protocol}//${window.location.host}/api`;

export default class ApiHttpClient {
  rawRequest(
    method: string,
    path: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<Response> {
    const url = `${baseUrl}/${path}`;
    const config: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    };
    return fetch(url, config);
  }

  restRequest<T>(
    method: string,
    path: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.rawRequest(method, path, data, headers)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((json) => json as T);
  }
}
