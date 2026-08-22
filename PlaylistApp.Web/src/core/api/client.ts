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

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error(CoreApiMessages.NotFound);
        }

        if (response.status === 429) {
            throw new Error(CoreApiMessages.TooManyRequests);
        }

        try {
            const errorData = await response.json();

            if (errorData.errors) {
                const allMessages = Object.values(errorData.errors).flat() as string[];
                throw new ApiValidationError(allMessages);
            }
        } catch (e) {
            if (e instanceof ApiValidationError) throw e;
            if (e instanceof Error && e.message !== 'Unexpected end of JSON input') throw e;
        }

        // Fallback for unhandled non-2xx responses
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Safely handle DELETE/PUT responses that have no body
    if (response.status === 204) {
        return undefined as T;
    }

    return response.json();
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