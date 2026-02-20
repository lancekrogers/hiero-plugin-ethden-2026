import { PluginManifest } from './types';
import { initHandler } from './commands/init';
import { statusHandler } from './commands/status';
import { navigateHandler } from './commands/navigate';

export const campManifest: PluginManifest = {
  name: 'camp',
  version: '1.0.0',
  displayName: 'Camp Plugin',
  description: 'Hedera developer workspace management via camp binary',
  commands: [
    {
      name: 'init',
      summary: 'Initialize a camp workspace',
      description:
        'Initialize a new Hedera developer workspace with project templates and configuration',
      options: [
        {
          name: 'name',
          short: 'n',
          type: 'string',
          required: false,
          description: 'Workspace name',
        },
        {
          name: 'template',
          short: 't',
          type: 'string',
          required: false,
          description: 'Project template to use',
        },
      ],
      handler: initHandler,
      output: {
        schema: {},
      },
    },
    {
      name: 'status',
      summary: 'Show camp workspace status',
      description:
        'Display the current status of the camp workspace including projects, services, and configuration',
      options: [
        {
          name: 'verbose',
          short: 'v',
          type: 'boolean',
          required: false,
          description: 'Show detailed status information',
        },
      ],
      handler: statusHandler,
      output: {
        schema: {},
      },
    },
    {
      name: 'navigate',
      summary: 'Navigate the camp workspace',
      description:
        'Navigate within the camp workspace using fuzzy search to quickly switch between projects and directories',
      options: [
        {
          name: 'target',
          short: 'g',
          type: 'string',
          required: false,
          description: 'Navigation target (project name or path)',
        },
      ],
      handler: navigateHandler,
      output: {
        schema: {},
      },
    },
  ],
};

export default campManifest;
