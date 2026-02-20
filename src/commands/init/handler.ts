import { CommandHandlerArgs, CommandExecutionResult } from '../../types';

export async function initHandler(
  args: CommandHandlerArgs
): Promise<CommandExecutionResult> {
  // Stub -- implemented in 02_camp_commands sequence
  return {
    status: 'success',
    outputJson: JSON.stringify({
      message: 'camp init: not yet implemented',
    }),
  };
}
