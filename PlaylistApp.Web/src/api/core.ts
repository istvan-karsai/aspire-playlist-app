import { ApiMessages } from "../constants/uiText";

export class ApiValidationError extends Error {
    public messages: string[];

    constructor(messages: string[]) {
        super(ApiMessages.ValidationFailed);
        this.messages = messages;
        this.name = "ApiValidationError";
    }
}

export async function apiFetch(endpoint: string, options?: RequestInit): Promise<Response> {
    let response: Response;

    try {
        response = await fetch(endpoint, options);
    } catch (error) {
        throw new Error(ApiMessages.NetworkError, { cause: error });
    }

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error(ApiMessages.NotFound);
        }

        if (response.status === 429) {
            throw new Error(ApiMessages.TooManyRequests);
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
    }

    return response;
}