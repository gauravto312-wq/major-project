import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('BizSahayak Frontend Resilience & Format Logic', () => {
  it('safeAuthParse: handles invalid JSON in localStorage gracefully without throwing', () => {
    const parseSafeUser = (raw) => {
      try {
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    };

    assert.strictEqual(parseSafeUser(null), null);
    assert.strictEqual(parseSafeUser(''), null);
    assert.strictEqual(parseSafeUser('undefined'), null);
    assert.strictEqual(parseSafeUser('{invalid json'), null);
    
    const valid = parseSafeUser('{"id":1,"fullName":"Admin"}');
    assert.strictEqual(valid.id, 1);
    assert.strictEqual(valid.fullName, 'Admin');
  });

  it('formatCurrency: correctly formats Indian Rupee amounts in Crores and Lakhs', () => {
    const formatCurrency = (amount) => {
      if (!amount) return 'Refer Tender Doc';
      if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
      if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} Lakh`;
      return `₹${amount.toLocaleString()}`;
    };

    assert.strictEqual(formatCurrency(null), 'Refer Tender Doc');
    assert.strictEqual(formatCurrency(0), 'Refer Tender Doc');
    assert.strictEqual(formatCurrency(50000000), '₹5.00 Cr');
    assert.strictEqual(formatCurrency(2500000), '₹25.00 Lakh');
    assert.strictEqual(formatCurrency(50000), '₹50,000');
  });

  it('statusBadge: maps government lifecycle statuses to proper labels', () => {
    const normalizeStatus = (status) => {
      return status ? status.replace(/_/g, ' ') : 'DRAFT';
    };

    assert.strictEqual(normalizeStatus('UNDER_REVIEW'), 'UNDER REVIEW');
    assert.strictEqual(normalizeStatus('PUBLISHED'), 'PUBLISHED');
    assert.strictEqual(normalizeStatus('NEEDS_CORRECTION'), 'NEEDS CORRECTION');
    assert.strictEqual(normalizeStatus(null), 'DRAFT');
  });

  it('fileUploadValidation: rejects files over 10MB', () => {
    const MAX_SIZE_BYTES = 10 * 1024 * 1024;
    const isValidSize = (size) => size <= MAX_SIZE_BYTES;

    assert.strictEqual(isValidSize(5 * 1024 * 1024), true);
    assert.strictEqual(isValidSize(10 * 1024 * 1024), true);
    assert.strictEqual(isValidSize(11 * 1024 * 1024), false);
  });
});
