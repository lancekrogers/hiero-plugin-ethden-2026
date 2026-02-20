import { CommandHandlerArgs } from '../types';

const mockExecCamp = jest.fn();
jest.mock('../camp', () => ({
  execCamp: (...args: any[]) => mockExecCamp(...args),
  CampNotFoundError: class CampNotFoundError extends Error {
    constructor() {
      super('camp not found');
      this.name = 'CampNotFoundError';
    }
  },
}));

jest.mock('../registry', () => ({
  getTemplate: jest.fn((id: string) => {
    const templates: Record<string, any> = {
      'hedera-smart-contract': { id: 'hedera-smart-contract', name: 'Hedera Smart Contract' },
      'hedera-dapp': { id: 'hedera-dapp', name: 'Hedera dApp' },
      'hedera-agent': { id: 'hedera-agent', name: 'Hedera Agent' },
    };
    return templates[id] ?? undefined;
  }),
  listTemplates: jest.fn(() => [
    { id: 'hedera-smart-contract' },
    { id: 'hedera-dapp' },
    { id: 'hedera-agent' },
  ]),
  templateExists: jest.fn(() => false),
  buildVariables: jest.fn((name: string) => ({
    projectName: name,
    projectNamePascal: 'MyApp',
    description: 'A Hedera project',
    author: 'Developer',
    year: '2026',
  })),
  copyTemplate: jest.fn(),
}));

import { initHandler } from '../commands/init';
import { statusHandler } from '../commands/status';
import { navigateHandler } from '../commands/navigate';

function makeMockArgs(overrides: Record<string, unknown> = {}): CommandHandlerArgs {
  return {
    args: overrides,
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

describe('initHandler', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns failure when name is missing', async () => {
    const result = await initHandler(makeMockArgs());
    expect(result.status).toBe('failure');
    expect(result.errorMessage).toContain('Project name is required');
  });

  it('calls camp init with name on success', async () => {
    // camp init
    mockExecCamp.mockResolvedValueOnce({ exitCode: 0, stdout: 'ok', stderr: '' });
    // camp config set
    mockExecCamp.mockResolvedValueOnce({ exitCode: 0, stdout: '', stderr: '' });

    const result = await initHandler(makeMockArgs({ name: 'my-app' }));
    expect(result.status).toBe('success');
    expect(mockExecCamp).toHaveBeenCalledWith(['init', 'my-app']);

    const output = JSON.parse(result.outputJson!);
    expect(output.workspace).toBe('my-app');
    expect(output.network).toBe('hedera-testnet');
  });

  it('passes template flag to camp init', async () => {
    mockExecCamp.mockResolvedValueOnce({ exitCode: 0, stdout: 'ok', stderr: '' });
    mockExecCamp.mockResolvedValueOnce({ exitCode: 0, stdout: '', stderr: '' });

    await initHandler(makeMockArgs({ name: 'my-app', template: 'hedera-dapp' }));
    expect(mockExecCamp).toHaveBeenCalledWith(['init', 'my-app', '--template', 'hedera-dapp']);
  });

  it('returns failure on unknown template', async () => {
    const result = await initHandler(makeMockArgs({ name: 'my-app', template: 'custom-tmpl' }));
    expect(result.status).toBe('failure');
    expect(result.errorMessage).toContain('Unknown template');
  });

  it('returns failure on camp init error', async () => {
    mockExecCamp.mockResolvedValueOnce({ exitCode: 1, stdout: '', stderr: 'init failed' });

    const result = await initHandler(makeMockArgs({ name: 'my-app' }));
    expect(result.status).toBe('failure');
    expect(result.errorMessage).toContain('init failed');
  });
});

describe('statusHandler', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns project list and status on success', async () => {
    // Promise.all: [project list, status]
    mockExecCamp.mockResolvedValueOnce({
      exitCode: 0,
      stdout: 'project-a\nproject-b\n',
      stderr: '',
    });
    mockExecCamp.mockResolvedValueOnce({
      exitCode: 0,
      stdout: 'workspace: my-workspace',
      stderr: '',
    });

    const result = await statusHandler(makeMockArgs());
    expect(result.status).toBe('success');

    const output = JSON.parse(result.outputJson!);
    expect(output.projects).toEqual(['project-a', 'project-b']);
    expect(output.projectCount).toBe(2);
  });

  it('returns failure when not in a workspace', async () => {
    mockExecCamp.mockResolvedValueOnce({ exitCode: 1, stdout: '', stderr: '' });
    mockExecCamp.mockResolvedValueOnce({
      exitCode: 1,
      stdout: '',
      stderr: 'not a camp workspace',
    });

    const result = await statusHandler(makeMockArgs());
    expect(result.status).toBe('failure');
    expect(result.errorMessage).toContain('No camp workspace');
  });

  it('includes raw output when verbose', async () => {
    mockExecCamp.mockResolvedValueOnce({ exitCode: 0, stdout: 'proj-a\n', stderr: '' });
    mockExecCamp.mockResolvedValueOnce({ exitCode: 0, stdout: 'status info', stderr: '' });

    const result = await statusHandler(makeMockArgs({ verbose: true }));
    const output = JSON.parse(result.outputJson!);
    expect(output.rawStatus).toBeDefined();
    expect(output.rawProjectList).toBeDefined();
  });
});

describe('navigateHandler', () => {
  beforeEach(() => jest.clearAllMocks());

  it('uses native camp navigate when available', async () => {
    mockExecCamp.mockResolvedValueOnce({
      exitCode: 0,
      stdout: '/path/to/project\n',
      stderr: '',
    });

    const result = await navigateHandler(makeMockArgs());
    expect(result.status).toBe('success');

    const output = JSON.parse(result.outputJson!);
    expect(output.path).toBe('/path/to/project');
    expect(output.source).toBe('camp-native');
  });

  it('falls back to fuzzy finder when navigate not supported', async () => {
    mockExecCamp.mockRejectedValueOnce(new Error('unknown command'));
    mockExecCamp.mockResolvedValueOnce({
      exitCode: 0,
      stdout: 'project-alpha\nproject-beta\n',
      stderr: '',
    });

    const result = await navigateHandler(makeMockArgs({ target: 'alpha' }));
    expect(result.status).toBe('success');

    const output = JSON.parse(result.outputJson!);
    expect(output.source).toBe('fuzzy-fallback');
    expect(output.matches).toContain('project-alpha');
  });

  it('returns all projects when no query', async () => {
    mockExecCamp.mockRejectedValueOnce(new Error('unknown command'));
    mockExecCamp.mockResolvedValueOnce({
      exitCode: 0,
      stdout: 'proj-a\nproj-b\nproj-c\n',
      stderr: '',
    });

    const result = await navigateHandler(makeMockArgs());
    const output = JSON.parse(result.outputJson!);
    expect(output.matches).toHaveLength(3);
  });

  it('returns failure when no matching projects', async () => {
    mockExecCamp.mockRejectedValueOnce(new Error('unknown command'));
    mockExecCamp.mockResolvedValueOnce({
      exitCode: 0,
      stdout: 'project-alpha\nproject-beta\n',
      stderr: '',
    });

    const result = await navigateHandler(makeMockArgs({ target: 'zzz' }));
    expect(result.status).toBe('failure');
    expect(result.errorMessage).toContain('No projects matching');
  });

  it('returns failure when no projects exist', async () => {
    mockExecCamp.mockRejectedValueOnce(new Error('unknown command'));
    mockExecCamp.mockResolvedValueOnce({ exitCode: 0, stdout: '\n', stderr: '' });

    const result = await navigateHandler(makeMockArgs());
    expect(result.status).toBe('failure');
    expect(result.errorMessage).toContain('No projects found');
  });
});
