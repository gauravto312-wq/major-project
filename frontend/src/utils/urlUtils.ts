import { Scheme, Tender } from '../types';

/**
 * Ensures that external government URLs start with http:// or https://.
 * Prevents React Router from interpreting external domains as relative routes.
 * Safely rejects dangerous URI schemes (javascript:, data:, file:).
 */
export function normalizeExternalUrl(url?: string | null): string {
  if (!url || !url.trim()) return '';
  const trimmed = url.trim();
  const lower = trimmed.toLowerCase();
  if (lower.startsWith('javascript:') || lower.startsWith('data:') || lower.startsWith('file:')) {
    return '';
  }
  if (lower.startsWith('http://') || lower.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/**
 * Resolves the Official Government Information/Source Website URL for a scheme.
 */
export function getSchemeSourceUrl(scheme: Scheme): string {
  if (scheme.officialSourceUrl && scheme.officialSourceUrl.trim()) {
    return normalizeExternalUrl(scheme.officialSourceUrl);
  }
  return '';
}

/**
 * Resolves the Direct Application Page URL for a scheme ONLY.
 * Does NOT fall back to source URL automatically so the UI can accurately distinguish between information site and application page.
 */
export function getSchemeApplyUrl(scheme: Scheme): string {
  if (scheme.officialApplicationUrl && scheme.officialApplicationUrl.trim()) {
    return normalizeExternalUrl(scheme.officialApplicationUrl);
  }
  return '';
}

/**
 * Resolves the primary official tender or source URL for a tender.
 */
export function getTenderApplyUrl(tender: Tender): string {
  if (tender.officialTenderUrl && tender.officialTenderUrl.trim()) {
    return normalizeExternalUrl(tender.officialTenderUrl);
  }
  if (tender.officialSourceUrl && tender.officialSourceUrl.trim()) {
    return normalizeExternalUrl(tender.officialSourceUrl);
  }
  return '';
}

/**
 * Safely opens an external URL in a new browser tab with security headers.
 */
export function openExternalUrl(url: string): void {
  const normalized = normalizeExternalUrl(url);
  if (normalized) {
    window.open(normalized, '_blank', 'noopener,noreferrer');
  }
}
