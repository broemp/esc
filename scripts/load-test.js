/**
 * k6 load test for the ESC voting app.
 *
 * Usage:
 *   k6 run scripts/load-test.js
 *   BASE_URL=https://yourhost k6 run scripts/load-test.js
 *   k6 run --vus 50 --duration 60s scripts/load-test.js
 *
 * Requires a running app and at minimum one act in the database.
 * Set SESSION_COOKIE to a valid auth session cookie to exercise
 * authenticated endpoints (voting, group ranking). Without it,
 * only public endpoints are tested.
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const SESSION_COOKIE = __ENV.SESSION_COOKIE || '';
// A real act UUID from your DB — set via env or leave blank to skip vote test
const TEST_ACT_ID = __ENV.TEST_ACT_ID || '';
// A real group UUID — optional, used for group ranking test
const TEST_GROUP_ID = __ENV.TEST_GROUP_ID || '';

export const options = {
  scenarios: {
    // Ramp up to 20 VUs over 30 s, hold for 1 min, ramp down
    main: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '30s', target: 50 },
        { duration: '1m', target: 200 },
        { duration: '1m', target: 500 },
        { duration: '30s', target: 1000 },
        { duration: '30s', target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<2000'],   // 95th percentile under 2 s
    http_req_failed: ['rate<0.05'],      // error rate under 5 %
    'page_load_home': ['p(95)<1500'],
  },
};

const pageLoadHome = new Trend('page_load_home', true);
const errorRate = new Rate('error_rate');

function headers(extraHeaders = {}) {
  const h = { 'Accept': 'application/json', ...extraHeaders };
  if (SESSION_COOKIE) {
    h['Cookie'] = SESSION_COOKIE;
  }
  return h;
}

// ---------- individual scenario functions ----------

function testHomePage() {
  const res = http.get(`${BASE_URL}/`, { headers: headers({ 'Accept': 'text/html' }) });
  const ok = check(res, {
    'home: status 200': (r) => r.status === 200,
  });
  pageLoadHome.add(res.timings.duration);
  errorRate.add(!ok);
}

function testCategoriesAPI() {
  const res = http.get(`${BASE_URL}/api/categories`, { headers: headers() });
  check(res, {
    'categories: status 200': (r) => r.status === 200,
    'categories: returns array': (r) => {
      try { return Array.isArray(JSON.parse(r.body)); } catch { return false; }
    },
  });
  errorRate.add(res.status !== 200);
}

function testStatsPage() {
  const res = http.get(`${BASE_URL}/stats`, { headers: headers({ 'Accept': 'text/html' }) });
  check(res, {
    'stats: status 200 or 302': (r) => r.status === 200 || r.status === 302,
  });
  errorRate.add(res.status >= 500);
}

function testVotePage() {
  const res = http.get(`${BASE_URL}/vote`, { headers: headers({ 'Accept': 'text/html' }) });
  check(res, {
    'vote page: not 5xx': (r) => r.status < 500,
  });
  errorRate.add(res.status >= 500);
}

function testSubmitVote() {
  if (!SESSION_COOKIE || !TEST_ACT_ID) return;

  const payload = JSON.stringify({ data: { points: 7.5, category: 'overall' } });
  const res = http.post(
    `${BASE_URL}/vote/${TEST_ACT_ID}`,
    payload,
    { headers: headers({ 'Content-Type': 'application/json' }) }
  );
  check(res, {
    'vote submit: not 5xx': (r) => r.status < 500,
  });
  errorRate.add(res.status >= 500);
}

function testGroupRanking() {
  if (!SESSION_COOKIE || !TEST_GROUP_ID) return;

  const res = http.get(
    `${BASE_URL}/group/${TEST_GROUP_ID}/overall`,
    { headers: headers() }
  );
  check(res, {
    'group ranking: not 5xx': (r) => r.status < 500,
  });
  errorRate.add(res.status >= 500);
}

// ---------- main VU loop ----------

export default function () {
  testHomePage();

  testCategoriesAPI();

  testStatsPage();

  testVotePage();

  testSubmitVote();

  testGroupRanking();
}
