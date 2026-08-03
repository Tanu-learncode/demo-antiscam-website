import test from 'node:test';
import assert from 'node:assert/strict';
import { detectInputType } from './detectType';

test('detects URL input', () => {
  assert.equal(detectInputType('https://example.com/phishing'), 'URL');
});

test('detects email input', () => {
  assert.equal(detectInputType('support@bank-secure.com'), 'EMAIL');
});

test('detects phone input', () => {
  assert.equal(detectInputType('+84 912 345 678'), 'PHONE');
});

test('falls back to text for general content', () => {
  assert.equal(detectInputType('Please verify the payment details'), 'TEXT');
});
