import { CoreApiMessages } from "../core/constants/uiText";

export class ApiValidationError extends Error {
    public messages: string[];

    constructor(messages: string[]) {
        super(CoreApiMessages.ValidationFailed);
        this.messages = messages;
        this.name = "ApiValidationError";
    }
}

export async function apiFetch(endpoint: string, options?: RequestInit): Promise<Response> {
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
    }

    return response;
}