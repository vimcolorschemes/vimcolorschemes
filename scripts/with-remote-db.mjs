import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

// Usage: node scripts/with-remote-db.mjs <command...>
// Merges .dev.vars into the environment (shell wins), aborts unless
// DATABASE_URL is remote, then runs the command. Build and worker runtime
// must read the same database; a file: URL here means they would not.
const [, , ...command] = process.argv;

if (command.length === 0) {
  console.error('usage: node scripts/with-remote-db.mjs <command...>');
  process.exit(1);
}

if (existsSync('.dev.vars')) {
  for (const line of readFileSync('.dev.vars', 'utf8').split('\n')) {
    const match = line
      .replace(/^\s*export\s+/, '')
      .match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) {
      continue;
    }
    let value = match[2].trim();
    if (
      value.length >= 2 &&
      ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'")))
    ) {
      value = value.slice(1, -1);
    }
    process.env[match[1]] ??= value;
  }
}

const url = process.env.DATABASE_URL ?? '';
if (!url || url.startsWith('file:')) {
  console.error(
    'DATABASE_URL must be a remote Turso URL for Cloudflare commands.',
  );
  console.error('Set it in .dev.vars or the shell environment.');
  process.exit(1);
}

const result = spawnSync(command[0], command.slice(1), { stdio: 'inherit' });
process.exit(result.status ?? 1);
