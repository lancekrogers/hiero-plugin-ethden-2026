import { CommandHandlerArgs, CommandExecutionResult } from '../../types';
import { execCamp } from '../../camp';

const HEDERA_TEMPLATES = ['hedera-smart-contract', 'hedera-dapp', 'hedera-agent'];

export async function initHandler(
  args: CommandHandlerArgs
): Promise<CommandExecutionResult> {
  const name = args.args['name'] as string | undefined;
  const template = args.args['template'] as string | undefined;

  if (!name) {
    return {
      status: 'failure',
      errorMessage:
        'Project name is required.\n\nUsage:\n  hcli camp init --name <project-name> [--template <template>]\n\nExamples:\n  hcli camp init --name my-hedera-app\n  hcli camp init --name my-dapp --template hedera-dapp',
    };
  }

  if (template && !HEDERA_TEMPLATES.includes(template)) {
    args.logger.warn(
      `'${template}' is not a known Hedera template. Available: ${HEDERA_TEMPLATES.join(', ')}. Proceeding anyway.`
    );
  }

  const campArgs = ['init', name];
  if (template) {
    campArgs.push('--template', template);
  }

  const result = await execCamp(campArgs);

  if (result.exitCode !== 0) {
    return {
      status: 'failure',
      errorMessage: `Failed to initialize workspace: ${result.stderr}`,
    };
  }

  // Configure Hedera testnet defaults
  try {
    await execCamp(['config', 'set', 'network', 'hedera-testnet'], { cwd: name });
  } catch {
    args.logger.warn('Could not set default network config. Configure Hedera testnet manually.');
  }

  return {
    status: 'success',
    outputJson: JSON.stringify({
      workspace: name,
      template: template ?? 'default',
      network: 'hedera-testnet',
      message: `Workspace '${name}' initialized. Default network: Hedera Testnet.`,
      nextSteps: [`cd ${name}`, 'hcli camp status'],
    }),
  };
}
