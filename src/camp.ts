import { execFile as cpExecFile } from 'child_process';
import { existsSync } from 'fs';

function execFileAsync(
  command: string,
  args: string[],
  options?: Record<string, unknown>
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    cpExecFile(command, args, options as any, (error, stdout, stderr) => {
      if (error) {
        reject(Object.assign(error, { stdout, stderr }));
      } else {
        resolve({ stdout: stdout?.toString() ?? '', stderr: stderr?.toString() ?? '' });
      }
    });
  });
}

export interface CampResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export interface CampExecOptions {
  cwd?: string;
  timeout?: number;
  env?: Record<string, string>;
}

export class CampNotFoundError extends Error {
  constructor() {
    super(
      [
        "The 'camp' binary was not found on your system PATH.",
        '',
        'Camp is a workspace management CLI required by this plugin.',
        '',
        'To install camp:',
        '  1. Visit: https://github.com/lancekrogers/camp/releases',
        '  2. Download the binary for your platform',
        '  3. Place it in a directory on your PATH (e.g., /usr/local/bin/)',
        '  4. Verify installation: camp --version',
        '',
        'If camp is installed but not on PATH, add its directory to your PATH:',
        '  export PATH="$PATH:/path/to/camp/directory"',
      ].join('\n')
    );
    this.name = 'CampNotFoundError';
  }
}

const DEFAULT_TIMEOUT = 30_000;

export async function findCampBinary(): Promise<string | null> {
  try {
    const command = process.platform === 'win32' ? 'where' : 'which';
    const { stdout } = await execFileAsync(command, ['camp']);
    const campPath = stdout.trim().split('\n')[0];
    if (campPath && existsSync(campPath)) {
      return campPath;
    }
    return null;
  } catch {
    return null;
  }
}

export async function execCamp(
  args: string[],
  options: CampExecOptions = {}
): Promise<CampResult> {
  const campPath = await findCampBinary();
  if (!campPath) {
    throw new CampNotFoundError();
  }

  const { cwd, timeout = DEFAULT_TIMEOUT, env } = options;

  try {
    const { stdout, stderr } = await execFileAsync(campPath, args, {
      cwd,
      timeout,
      env: env ? { ...process.env, ...env } : undefined,
      maxBuffer: 10 * 1024 * 1024,
    });

    return {
      stdout,
      stderr,
      exitCode: 0,
    };
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'killed' in error) {
      const execError = error as {
        stdout?: string;
        stderr?: string;
        code?: number;
        killed?: boolean;
      };

      if (execError.killed) {
        return {
          stdout: execError.stdout?.toString() ?? '',
          stderr: `Camp command timed out after ${timeout}ms`,
          exitCode: 124,
        };
      }

      return {
        stdout: execError.stdout?.toString() ?? '',
        stderr: execError.stderr?.toString() ?? '',
        exitCode: execError.code ?? 1,
      };
    }

    throw error;
  }
}

export async function getCampVersion(): Promise<string | null> {
  try {
    const result = await execCamp(['--version']);
    if (result.exitCode === 0) {
      return result.stdout.trim();
    }
    return null;
  } catch {
    return null;
  }
}

export async function ensureCampAvailable(): Promise<void> {
  const campPath = await findCampBinary();
  if (!campPath) {
    throw new CampNotFoundError();
  }
}
