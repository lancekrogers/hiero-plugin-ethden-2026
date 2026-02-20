import { CommandHandlerArgs, CommandExecutionResult } from '../../types';

export async function statusHandler(
  args: CommandHandlerArgs
): Promise<CommandExecutionResult> {
  // Stub -- implemented in 02_camp_commands sequence
  return {
    status: 'success',
    outputJson: JSON.stringify({
      message: 'camp status: not yet implemented',
    }),
  };
}
