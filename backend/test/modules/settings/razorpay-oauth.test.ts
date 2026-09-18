import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IntegrationService } from '../../../src/modules/settings/integration.service.js';
import type { IntegrationRepository } from '../../../src/modules/settings/integration.repository.js';
import { ValidationError } from '../../../src/shared/errors/index.js';
import crypto from 'crypto';
import { config } from '../../../src/config/index.js';

describe('Razorpay 1-Click OAuth Integration', () => {
  let service: IntegrationService;
  let mockRepo: Partial<IntegrationRepository>;
  let storedIntegrations: Record<string, any> = {};

  beforeEach(() => {
    storedIntegrations = {};
    mockRepo = {
      getIntegration: vi.fn(async (tenantId: string, provider: string) => {
        return storedIntegrations[`${tenantId}:${provider}`] || null;
      }),
      upsertIntegration: vi.fn(async (data: any) => {
        storedIntegrations[`${data.tenantId}:${data.provider}`] = {
          ...data,
          lastValidatedAt: data.lastValidatedAt || new Date(),
          lastValidationResult: data.lastValidationResult || 'valid',
        };
      }),
      deleteIntegration: vi.fn(async (tenantId: string, provider: string) => {
        delete storedIntegrations[`${tenantId}:${provider}`];
      }),
    };

    service = new IntegrationService(mockRepo as IntegrationRepository);
  });

  it('should generate an HMAC signed state token and authorization response', () => {
    const tenantId = 'tenant-test-123';
    const userId = 'user-test-456';

    const result = service.getRazorpayOAuthAuthorizeUrl(tenantId, userId);
    expect(result).toBeDefined();
    expect(result.state).toBeDefined();
    expect(result.mode).toMatch(/live|simulate/);

    // Verify the state token can be decoded and verified
    const [stateString, signature] = result.state.split('.');
    expect(stateString).toBeDefined();
    expect(signature).toBeDefined();

    const expectedHmac = crypto.createHmac('sha256', config.JWT_SECRET).update(stateString).digest('base64url');
    expect(signature).toBe(expectedHmac);

    const decoded = JSON.parse(Buffer.from(stateString, 'base64url').toString('utf8'));
    expect(decoded.tenantId).toBe(tenantId);
    expect(decoded.userId).toBe(userId);
  });

  it('should reject tampered OAuth state tokens', async () => {
    const tenantId = 'tenant-test-123';
    const tamperedState = 'invalid-state.bad-sig';

    await expect(
      service.handleRazorpayOAuthCallback(tenantId, {
        code: 'mock_code',
        state: tamperedState,
      })
    ).rejects.toThrow(ValidationError);
  });

  it('should reject OAuth state tokens for a different tenant', async () => {
    const tenantId = 'tenant-test-123';
    const otherTenantId = 'tenant-other-999';
    const authUrlData = service.getRazorpayOAuthAuthorizeUrl(otherTenantId, 'user-1');

    await expect(
      service.handleRazorpayOAuthCallback(tenantId, {
        code: 'mock_code',
        state: authUrlData.state,
      })
    ).rejects.toThrow('OAuth state tenant mismatch');
  });

  it('should successfully handle 1-click sandbox simulated connection', async () => {
    const tenantId = 'tenant-test-123';
    const authUrlData = service.getRazorpayOAuthAuthorizeUrl(tenantId, 'user-1');

    const result = await service.handleRazorpayOAuthCallback(tenantId, {
      code: 'mock_code',
      state: authUrlData.state,
      simulate: true,
    });

    expect(result.success).toBe(true);
    expect(result.accountId).toBeDefined();
    expect(mockRepo.upsertIntegration).toHaveBeenCalled();

    // Verify integration status reflects OAuth connection
    const status = await service.getIntegrationStatusRazorpay(tenantId);
    expect(status.isConfigured).toBe(true);
    expect(status.isOAuth).toBe(true);
    expect(status.lastValidationResult).toBe('valid');
    expect(status.accountId).toBe(result.accountId);

    // Test connection on sandbox should succeed
    const testRes = await service.testRazorpayIntegration(tenantId);
    expect(testRes.success).toBe(true);
    expect(testRes.message).toContain('Sandbox connection verified');
  });
});
