const assert = require('assert');

// Mock Mongoose Model
const mockApiKeys = [
    {
        webhookUrl: 'http://example.com/webhook',
        revoked: false
    },
    {
        webhookUrl: 'http://other.com/webhook',
        revoked: false
    }
];

const mockApiKeyModel = {
    find: async (query) => {
        console.log('ApiKey.find called with:', query);
        return mockApiKeys;
    }
};

// Mock Fetch
const mockFetchCalls = [];
global.fetch = async (url, options) => {
    console.log(`Fetch called to ${url}`);
    mockFetchCalls.push({ url, options });
    return { ok: true };
};

// Intercept require
const Module = require('module');
const originalRequire = Module.prototype.require;
Module.prototype.require = function (path) {
    if (path.includes('models/ApiKey')) {
        return mockApiKeyModel;
    }
    return originalRequire.apply(this, arguments);
};

// Import Service
const { broadcast } = require('./src/services/webhookService');

async function testBroadcast() {
    console.log('--- Starting Webhook Broadcast Test ---');

    const eventData = { slotId: '123', status: 'LOCKED' };
    await broadcast('TEST_EVENT', eventData);

    // Assertions
    assert.strictEqual(mockFetchCalls.length, 2, 'Should call fetch twice');

    const firstCall = mockFetchCalls[0];
    assert.strictEqual(firstCall.url, 'http://example.com/webhook');
    assert.strictEqual(firstCall.options.method, 'POST');

    const body = JSON.parse(firstCall.options.body);
    assert.strictEqual(body.event, 'TEST_EVENT');
    assert.deepStrictEqual(body.data, eventData);
    assert.ok(body.timestamp, 'Timestamp should exist');

    console.log('--- Test Passed: Webhooks Logic is Correct ---');
}

testBroadcast().catch(err => {
    console.error('Test Failed:', err);
    process.exit(1);
});
