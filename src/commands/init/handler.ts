import { CommandHandlerArgs, CommandExecutionResult } from '../../types';
import { execCamp } from '../../camp';
import { getTemplate, listTemplates, buildVariables, copyTemplate, templateExists } from '../../registry';

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

  // Validate template if specified
  if (template) {
    const tmpl = getTemplate(template);
    if (!tmpl) {
      const available = listTemplates().map((t) => t.id).join(', ');
      return {
        status: 'failure',
        errorMessage: `Unknown template '${template}'. Available templates: ${available}`,
      };
    }
    if (!templateExists(template)) {
      args.logger.warn(`Template '${template}' metadata exists but files are missing.`);
    }
  }

  // Invoke camp init
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

  // Apply Hedera template if specified and template files exist
  let appliedTemplate: string | null = null;
  if (template && templateExists(template)) {
    try {
      const vars = buildVariables(name);
      copyTemplate(template, name, vars);
      appliedTemplate = template;
    } catch (err) {
      args.logger.warn(`Template application failed: ${err}. Workspace created without template.`);
    }
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
      template: appliedTemplate ?? template ?? 'default',
      network: 'hedera-testnet',
      message: `Workspace '${name}' initialized. Default network: Hedera Testnet.`,
      nextSteps: [`cd ${name}`, 'hcli camp status'],
    }),
  };
}
