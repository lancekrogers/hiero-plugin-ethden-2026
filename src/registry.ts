import * as path from 'path';
import * as fs from 'fs';

export interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
  language: string;
  tags: string[];
}

// Templates are in src/templates/ relative to the package root.
// At runtime after tsc, __dirname is dist/ so go up one level.
const PACKAGE_ROOT = path.resolve(__dirname, '..');
const TEMPLATE_DIR = path.join(PACKAGE_ROOT, 'src', 'templates');

const TEMPLATES: TemplateMetadata[] = [
  {
    id: 'hedera-smart-contract',
    name: 'Hedera Smart Contract',
    description: 'Solidity + Hardhat project pre-configured for Hedera testnet',
    language: 'TypeScript/Solidity',
    tags: ['solidity', 'hardhat', 'smart-contract', 'evm'],
  },
  {
    id: 'hedera-dapp',
    name: 'Hedera dApp',
    description: 'React + Vite dApp with HashConnect wallet integration',
    language: 'TypeScript/React',
    tags: ['react', 'vite', 'hashconnect', 'dapp', 'frontend'],
  },
  {
    id: 'hedera-agent',
    name: 'Hedera Agent',
    description: 'Go agent with HCS and HTS integration via Hedera SDK',
    language: 'Go',
    tags: ['go', 'agent', 'hcs', 'hts', 'consensus', 'token'],
  },
];

export function listTemplates(): TemplateMetadata[] {
  return TEMPLATES;
}

export function getTemplate(id: string): TemplateMetadata | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

export function templateDir(id: string): string {
  return path.join(TEMPLATE_DIR, id);
}

export function templateExists(id: string): boolean {
  const dir = templateDir(id);
  return fs.existsSync(dir);
}

export interface TemplateVars {
  projectName: string;
  projectNamePascal: string;
  description: string;
  author: string;
  year: string;
}

export function renderTemplate(content: string, vars: TemplateVars): string {
  return content
    .replace(/\{\{projectName\}\}/g, vars.projectName)
    .replace(/\{\{projectNamePascal\}\}/g, vars.projectNamePascal)
    .replace(/\{\{description\}\}/g, vars.description)
    .replace(/\{\{author\}\}/g, vars.author)
    .replace(/\{\{year\}\}/g, vars.year);
}

export function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

export function buildVariables(
  projectName: string,
  overrides?: Partial<TemplateVars>
): TemplateVars {
  return {
    projectName,
    projectNamePascal: toPascalCase(projectName),
    description: 'A Hedera project created with hiero camp',
    author: 'Developer',
    year: new Date().getFullYear().toString(),
    ...overrides,
  };
}

export function copyTemplate(
  templateId: string,
  targetDir: string,
  vars: TemplateVars
): void {
  const srcDir = templateDir(templateId);
  if (!fs.existsSync(srcDir)) {
    throw new Error(`Template '${templateId}' not found at ${srcDir}`);
  }
  fs.mkdirSync(targetDir, { recursive: true });
  copyDirRecursive(srcDir, targetDir, vars);
}

function copyDirRecursive(src: string, dest: string, vars: TemplateVars): void {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'template.json') continue;

    const destName = renderTemplate(entry.name, vars);
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, destName);

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDirRecursive(srcPath, destPath, vars);
    } else {
      const content = fs.readFileSync(srcPath, 'utf-8');
      fs.writeFileSync(destPath, renderTemplate(content, vars), 'utf-8');
    }
  }
}
