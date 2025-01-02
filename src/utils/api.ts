type FetchOptions = {
    endpoint: string;
    data?: Record<string, unknown>;
    headers?: Record<string, string>;
};

async function postRequest<T>({ endpoint, data, headers }: FetchOptions): Promise<T> {
    const defaultHeaders = {
        'Content-Type': 'application/json',
        ...headers,
    };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: defaultHeaders,
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json() as Promise<T>;
    } catch (error) {
        console.error('Error in POST request:', error);
        throw error;
    }
}


export { postRequest }