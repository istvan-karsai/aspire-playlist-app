/* eslint-disable react-refresh/only-export-components */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";
import type React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// Create a fresh QueryClient for each test to prevent cache pollution between tests
const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

// Wrap the children in all necessary global providers
const TestWrapper = ({ children }: { children: React.ReactNode}) => {
    const queryClient = createTestQueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                {children}
            </MemoryRouter>
        </QueryClientProvider>
    );
};

// Create the custom render function for standard components
const customRender = (
    ui: ReactElement, 
    options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: TestWrapper, ...options });

interface RouterRenderOptions {
    routePath: string;
    initialUrl: string;
}

// Specialized render function for testing components that depend on URL parameters
export const renderWithRouteParams = (
    ui: ReactElement,
    { routePath, initialUrl }: RouterRenderOptions,
    options?: Omit<RenderOptions, 'wrapper'>
) => {
    const queryClient = createTestQueryClient();

    return render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter initialEntries={[initialUrl]}>
                <Routes>
                    <Route path={routePath} element={ui} />
                </Routes>
            </MemoryRouter>
        </QueryClientProvider>,
        options
    );
};

// Re-export everything from the standard testing library
export * from '@testing-library/react';

// Override the standard render method with our custom one
export { customRender as render };