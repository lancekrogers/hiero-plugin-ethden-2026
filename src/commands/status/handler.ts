import { CommandHandlerArgs, CommandExecutionResult } from '../../types';
import { execCamp, CampNotFoundError } from '../../camp';

export async function statusHandler(
  args: CommandHandlerArgs
): Promise<CommandExecutionResult> {
  const verbose = args.args['verbose'] as boolean | undefined;

  let projectListResult;
  let statusResult;

  try {
    [projectListResult, statusResult] = await Promise.all([
      execCamp(['project', 'list']),
      execCamp(['status']),
    ]);
  } catch (error) {
    if (error instanceof CampNotFoundError) {
      throw error;
    }
    return {
      status: 'failure',
      errorMessage:
        'Failed to get workspace status. Make sure you are in a camp workspace directory, or run "hcli camp init" first.',
    };
  }

  if (
    statusResult.exitCode !== 0 &&
    statusResult.stderr.includes('not a camp workspace')
  ) {
    return {
      status: 'failure',
      errorMessage:
        'No camp workspace found in current directory. Run "hcli camp init <name>" to create a workspace.',
    };
  }

  const projects =
    projectListResult.exitCode === 0 && projectListResult.stdout.trim()
      ? projectListResult.stdout
          .trim()
          .split('\n')
          .filter((l) => l.trim())
      : [];

  const output: Record<string, unknown> = {
    workspace:
      statusResult.exitCode === 0 ? statusResult.stdout.trim() : 'unknown',
    projects,
    projectCount: projects.length,
  };

  if (verbose) {
    output.rawStatus = statusResult.stdout;
    output.rawProjectList = projectListResult.stdout;
  }

  return {
    status: 'success',
    outputJson: JSON.stringify(output),
  };
}
