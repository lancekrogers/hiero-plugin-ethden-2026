import { CommandHandlerArgs, CommandExecutionResult } from '../../types';
import { execCamp, CampNotFoundError } from '../../camp';

function fuzzyMatch(query: string, target: string): boolean {
  const lq = query.toLowerCase();
  const lt = target.toLowerCase();
  let qi = 0;
  for (let ti = 0; ti < lt.length && qi < lq.length; ti++) {
    if (lt[ti] === lq[qi]) qi++;
  }
  return qi === lq.length;
}

async function tryCampNavigate(
  query?: string
): Promise<{ exitCode: number; stdout: string; stderr: string } | null> {
  const campArgs = ['navigate'];
  if (query) campArgs.push(query);

  try {
    return await execCamp(campArgs);
  } catch (error) {
    if (error instanceof CampNotFoundError) throw error;
    return null;
  }
}

export async function navigateHandler(
  args: CommandHandlerArgs
): Promise<CommandExecutionResult> {
  const target = args.args['target'] as string | undefined;

  // Try native camp navigate first
  const nativeResult = await tryCampNavigate(target);
  if (nativeResult !== null) {
    if (nativeResult.exitCode === 0) {
      return {
        status: 'success',
        outputJson: JSON.stringify({
          path: nativeResult.stdout.trim(),
          source: 'camp-native',
        }),
      };
    }
    return {
      status: 'failure',
      errorMessage: nativeResult.stderr,
    };
  }

  // Fallback: use project list with fuzzy filtering
  let projectResult;
  try {
    projectResult = await execCamp(['project', 'list']);
  } catch (error) {
    if (error instanceof CampNotFoundError) throw error;
    return {
      status: 'failure',
      errorMessage: 'Failed to list projects. Make sure you are in a camp workspace.',
    };
  }

  if (projectResult.exitCode !== 0) {
    return {
      status: 'failure',
      errorMessage: 'Failed to list projects. Run "hcli camp init" first.',
    };
  }

  const projects = projectResult.stdout
    .trim()
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (projects.length === 0) {
    return {
      status: 'failure',
      errorMessage: 'No projects found in workspace. Run "hcli camp init <name>" to create one.',
    };
  }

  const filtered = target ? projects.filter((p) => fuzzyMatch(target, p)) : projects;

  if (filtered.length === 0) {
    return {
      status: 'failure',
      errorMessage: `No projects matching '${target}'. Available: ${projects.join(', ')}`,
    };
  }

  return {
    status: 'success',
    outputJson: JSON.stringify({
      matches: filtered,
      selected: filtered[0],
      source: 'fuzzy-fallback',
      query: target ?? null,
    }),
  };
}
