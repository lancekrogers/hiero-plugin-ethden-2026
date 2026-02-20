import { campManifest } from '../manifest';

describe('campManifest', () => {
  it('has the correct plugin name', () => {
    expect(campManifest.name).toBe('camp');
  });

  it('has a valid version', () => {
    expect(campManifest.version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('has a displayName', () => {
    expect(campManifest.displayName).toBeTruthy();
  });

  it('has a description', () => {
    expect(campManifest.description).toBeTruthy();
  });

  it('registers three commands', () => {
    expect(campManifest.commands).toHaveLength(3);
  });

  it('registers init command', () => {
    const init = campManifest.commands.find((c) => c.name === 'init');
    expect(init).toBeDefined();
    expect(init!.summary).toBeTruthy();
    expect(init!.description).toBeTruthy();
    expect(typeof init!.handler).toBe('function');
    expect(init!.output).toBeDefined();
  });

  it('registers status command', () => {
    const status = campManifest.commands.find((c) => c.name === 'status');
    expect(status).toBeDefined();
    expect(typeof status!.handler).toBe('function');
  });

  it('registers navigate command', () => {
    const nav = campManifest.commands.find((c) => c.name === 'navigate');
    expect(nav).toBeDefined();
    expect(typeof nav!.handler).toBe('function');
  });

  it('all commands have output specs', () => {
    for (const cmd of campManifest.commands) {
      expect(cmd.output).toBeDefined();
      expect(cmd.output.schema).toBeDefined();
    }
  });

  it('init command has name and template options', () => {
    const init = campManifest.commands.find((c) => c.name === 'init');
    expect(init!.options).toBeDefined();
    const names = init!.options!.map((o) => o.name);
    expect(names).toContain('name');
    expect(names).toContain('template');
  });

  it('status command has verbose option', () => {
    const status = campManifest.commands.find((c) => c.name === 'status');
    expect(status!.options).toBeDefined();
    const names = status!.options!.map((o) => o.name);
    expect(names).toContain('verbose');
  });

  it('navigate command has target option', () => {
    const nav = campManifest.commands.find((c) => c.name === 'navigate');
    expect(nav!.options).toBeDefined();
    const names = nav!.options!.map((o) => o.name);
    expect(names).toContain('target');
  });
});
