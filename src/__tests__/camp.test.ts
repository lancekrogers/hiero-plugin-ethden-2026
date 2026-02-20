const mockExecFile = jest.fn();
const mockExistsSync = jest.fn();

jest.mock('child_process', () => ({
  execFile: (...args: any[]) => mockExecFile(...args),
}));

jest.mock('fs', () => ({
  existsSync: (...args: any[]) => mockExistsSync(...args),
}));

import {
  findCampBinary,
  execCamp,
  getCampVersion,
  ensureCampAvailable,
  CampNotFoundError,
} from '../camp';

function setupExecSuccess(stdout: string, stderr = '') {
  mockExecFile.mockImplementationOnce(
    (_cmd: string, _args: string[], _opts: any, cb: Function) => {
      cb(null, stdout, stderr);
    }
  );
}

function setupExecError(error: any) {
  mockExecFile.mockImplementationOnce(
    (_cmd: string, _args: string[], _opts: any, cb: Function) => {
      cb(error, error.stdout ?? '', error.stderr ?? '');
    }
  );
}

describe('CampNotFoundError', () => {
  it('has the correct name', () => {
    const error = new CampNotFoundError();
    expect(error.name).toBe('CampNotFoundError');
  });

  it('includes installation instructions', () => {
    const error = new CampNotFoundError();
    expect(error.message).toContain('camp');
    expect(error.message).toContain('PATH');
  });

  it('is an instance of Error', () => {
    const error = new CampNotFoundError();
    expect(error).toBeInstanceOf(Error);
  });
});

describe('findCampBinary', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns the camp path when found', async () => {
    setupExecSuccess('/usr/local/bin/camp\n');
    mockExistsSync.mockReturnValue(true);

    const result = await findCampBinary();
    expect(result).toBe('/usr/local/bin/camp');
  });

  it('returns null when camp is not on PATH', async () => {
    setupExecError(new Error('not found'));

    const result = await findCampBinary();
    expect(result).toBeNull();
  });

  it('returns null when path does not exist on disk', async () => {
    setupExecSuccess('/usr/local/bin/camp\n');
    mockExistsSync.mockReturnValue(false);

    const result = await findCampBinary();
    expect(result).toBeNull();
  });
});

describe('execCamp', () => {
  beforeEach(() => jest.clearAllMocks());

  it('throws CampNotFoundError when camp is not found', async () => {
    setupExecError(new Error('not found'));

    await expect(execCamp(['init'])).rejects.toThrow(CampNotFoundError);
  });

  it('returns stdout and stderr on success', async () => {
    // findCampBinary which call
    setupExecSuccess('/usr/local/bin/camp\n');
    mockExistsSync.mockReturnValue(true);
    // actual camp execution
    setupExecSuccess('init complete', '');

    const result = await execCamp(['init']);
    expect(result.stdout).toBe('init complete');
    expect(result.stderr).toBe('');
    expect(result.exitCode).toBe(0);
  });

  it('handles non-zero exit codes', async () => {
    setupExecSuccess('/usr/local/bin/camp\n');
    mockExistsSync.mockReturnValue(true);

    const err: any = new Error('command failed');
    err.stdout = '';
    err.stderr = 'error occurred';
    err.code = 1;
    err.killed = false;
    setupExecError(err);

    const result = await execCamp(['bad-command']);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('error occurred');
  });

  it('handles timeout (killed process)', async () => {
    setupExecSuccess('/usr/local/bin/camp\n');
    mockExistsSync.mockReturnValue(true);

    const err: any = new Error('killed');
    err.stdout = '';
    err.stderr = '';
    err.code = null;
    err.killed = true;
    setupExecError(err);

    const result = await execCamp(['slow-cmd'], { timeout: 5000 });
    expect(result.exitCode).toBe(124);
    expect(result.stderr).toContain('timed out');
  });
});

describe('ensureCampAvailable', () => {
  beforeEach(() => jest.clearAllMocks());

  it('throws CampNotFoundError when camp is missing', async () => {
    setupExecError(new Error('not found'));

    await expect(ensureCampAvailable()).rejects.toThrow(CampNotFoundError);
  });

  it('does not throw when camp exists', async () => {
    setupExecSuccess('/usr/local/bin/camp\n');
    mockExistsSync.mockReturnValue(true);

    await expect(ensureCampAvailable()).resolves.toBeUndefined();
  });
});
