import { initHandler } from '../commands/init';
import { statusHandler } from '../commands/status';
import { navigateHandler } from '../commands/navigate';
import { CommandHandlerArgs } from '../types';

function makeMockArgs(): CommandHandlerArgs {
  return {
    args: {},
    api: {} as any,
    state: {} as any,
    config: {} as any,
    logger: {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    },
  };
}

describe('command handlers (stubs)', () => {
  describe('initHandler', () => {
    it('returns success status', async () => {
      const result = await initHandler(makeMockArgs());
      expect(result.status).toBe('success');
    });

    it('returns valid JSON output', async () => {
      const result = await initHandler(makeMockArgs());
      expect(result.outputJson).toBeDefined();
      expect(() => JSON.parse(result.outputJson!)).not.toThrow();
    });
  });

  describe('statusHandler', () => {
    it('returns success status', async () => {
      const result = await statusHandler(makeMockArgs());
      expect(result.status).toBe('success');
    });

    it('returns valid JSON output', async () => {
      const result = await statusHandler(makeMockArgs());
      expect(result.outputJson).toBeDefined();
      expect(() => JSON.parse(result.outputJson!)).not.toThrow();
    });
  });

  describe('navigateHandler', () => {
    it('returns success status', async () => {
      const result = await navigateHandler(makeMockArgs());
      expect(result.status).toBe('success');
    });

    it('returns valid JSON output', async () => {
      const result = await navigateHandler(makeMockArgs());
      expect(result.outputJson).toBeDefined();
      expect(() => JSON.parse(result.outputJson!)).not.toThrow();
    });
  });
});
