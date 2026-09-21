import { CoreApiMessages } from "../constants/uiText";

export class ApiValidationError extends Error {
    public messages: string[];

    constructor(messages: string[]) {
        super(CoreApiMessages.ValidationFailed);
        this.messages = messages;
        this.name = "ApiValidationError";
    }
}

// If no generic is provided, it defaults to void (great for PUT/DELETE)
async function apiFetch<T = void>(endpoint: string, options?: RequestInit): Promise<T> {
    let response: Response;

    try {
        response = await fetch(endpoint, options);
    } catch (error) {
        throw new Error(CoreApiMessages.NetworkError, { cause: error });
    }

    const contentType = response.headers.get('content-type');
    const isContentJson = contentType && (
        contentType.includes('application/json') ||
        contentType.includes('application/problem+json')
    );

    if (!response.ok) {
        if (response.status === 404) throw new Error(CoreApiMessages.NotFound);
        if (response.status === 429) throw new Error(CoreApiMessages.TooManyRequests);
        if (response.status >= 500 && !isContentJson) throw new Error(CoreApiMessages.ServiceUnavailable);

        // If the error response isn't JSON, stop here and throw the generic status
        if (!isContentJson) throw new Error(`HTTP error! status: ${response.status}`);

        try {
            const errorData = (await response.json()) as { errors?: Record<string, string[]> };
            if (errorData?.errors) {
                const allMessages = Object.values(errorData.errors).flat();
                throw new ApiValidationError(allMessages);
            }
        } catch (e) {
            // Only rethrow our custom validation error; swallow standard parsing errors to hit the fallback
            if (e instanceof ApiValidationError) throw e;
        }

        // Fallback for any unhandled JSON responses
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Safely handle DELETE/PUT responses that have no body
    if (response.status === 204) {
        return undefined as T;
    }

    // Protect successful fetches from unexpected HTML payloads
    if (!isContentJson) {
        throw new Error(CoreApiMessages.UnexpectedFormat);
    }

    return response.json() as T;
}

export const apiGet = async<T>(endpoint: string): Promise<T> => {
    return await apiFetch<T>(endpoint);
};

export const apiPost = async <T, U = unknown>(endpoint: string, body: U): Promise<T> => {
    return await apiFetch<T>(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
};

export const apiPut = async <U = unknown>(endpoint: string, body: U): Promise<void> => {
    return await apiFetch(endpoint, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
};

export const apiDelete = async (endpoint: string): Promise<void> => {
    return await apiFetch(endpoint, {
        method: 'DELETE',
    });
};