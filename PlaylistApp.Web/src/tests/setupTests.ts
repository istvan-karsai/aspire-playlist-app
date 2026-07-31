import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './mocks/server';

// Start the MSW server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset any runtime request handlers we may add during the tests
afterEach(() => server.resetHandlers());

// Shut down the MSW server after all tests are done
afterAll(() => server.close());