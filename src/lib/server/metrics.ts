import { metrics } from '@opentelemetry/api';

const meter = metrics.getMeter('esc-app');

// User metrics
export const activeUsers = meter.createUpDownCounter('active_users', {
    description: 'Number of active users in the application'
});

export const userRegistrations = meter.createCounter('user_registrations', {
    description: 'Total number of user registrations'
});

// Group metrics
export const activeGroups = meter.createUpDownCounter('active_groups', {
    description: 'Number of active groups'
});

export const groupCreations = meter.createCounter('group_creations', {
    description: 'Total number of groups created'
});

export const groupJoins = meter.createCounter('group_joins', {
    description: 'Total number of group joins'
});

// Voting metrics
export const votesSubmitted = meter.createCounter('votes_submitted', {
    description: 'Total number of votes submitted'
});

export const averageVoteTime = meter.createHistogram('average_vote_time', {
    description: 'Average time taken to submit votes',
    unit: 'ms'
});

// API metrics
export const apiLatency = meter.createHistogram('api_latency', {
    description: 'API endpoint latency',
    unit: 'ms'
});

export const apiErrors = meter.createCounter('api_errors', {
    description: 'Total number of API errors'
});

// Database metrics
export const dbQueryLatency = meter.createHistogram('db_query_latency', {
    description: 'Database query latency',
    unit: 'ms'
});

export const dbErrors = meter.createCounter('db_errors', {
    description: 'Total number of database errors'
});

// Authentication metrics
export const authAttempts = meter.createCounter('auth_attempts', {
    description: 'Total number of authentication attempts'
});

export const authFailures = meter.createCounter('auth_failures', {
    description: 'Total number of failed authentication attempts'
});

// Session metrics
export const activeSessions = meter.createUpDownCounter('active_sessions', {
    description: 'Number of active sessions'
});

export const sessionDuration = meter.createHistogram('session_duration', {
    description: 'Duration of user sessions',
    unit: 'ms'
}); 