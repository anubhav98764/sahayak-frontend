const API_BASE_URL = 'https://sahayak-x3dr.onrender.com';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const error = new Error(
      typeof data === 'object' && data?.error
        ? data.error
        : `Request failed with status ${response.status}`
    );
    error.response = { data };
    throw error;
  }

  return { data, status: response.status };
}

const api = {
  get: path => request(path),
  post: (path, body) => request(path, {
    method: 'POST',
    body: JSON.stringify(body),
  }),
};

export default api;
