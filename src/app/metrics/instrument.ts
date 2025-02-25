import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
  dsn: 'https://fec3928b9ec6f23f75802d445b3ab635@sentry.softylines.com/19',
  integrations: [nodeProfilingIntegration()],
  environment: process.env.NODE_ENV,
  attachStacktrace: true,
  beforeSendTransaction(event) {
    const status = event.contexts?.trace?.data?.['http.status_code'];
    const unwanted_status = [404];
    if (status && unwanted_status.includes(status)) {
      return null;
    } else {
      return event;
    }
  },
  ignoreErrors: [
    'unauthenticated',
    // 'permission_denied',
    // 'not_found',
    // 'invalid_argument',
    'Unable to compile TypeScript',
  ],
  ignoreTransactions: ['Create Nest App'],
  release: '1.0.0',
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});
