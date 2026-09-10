// Deterministic race injection; open/stat/read still use the real filesystem.
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import { syncBuiltinESMExports } from 'node:module';
import { spawnSync } from 'node:child_process';
import './doctrine-publisher-fetch.mjs';

const target = process.env.PUBLISH_RACE_TARGET;
const mode = process.env.PUBLISH_RACE_MODE;
const phase = process.env.PUBLISH_RACE_PHASE;
const evidence = { installed: false, fifo: false, stats: 0, reads: 0, closes: 0 };
process.on('exit', () => fs.writeFileSync(process.env.PUBLISH_RACE_LOG, JSON.stringify(evidence)));
const realOpen = fsp.open;
let opens = 0;
fsp.open = async function (path, flags, ...rest) {
  const selected = String(path) === target && ++opens === (phase === 'locked' ? 2 : 1);
  if (selected) {
    if (mode === 'fifo' || mode === 'symlink') {
      fs.unlinkSync(target);
      if (mode === 'fifo') {
        const result = spawnSync('mkfifo', [target], { timeout: 1000 });
        if (result.error || result.status !== 0) throw new Error('mkfifo failed');
        evidence.fifo = fs.lstatSync(target).isFIFO();
      } else fs.symlinkSync(process.env.PUBLISH_RACE_LINK, target);
    } else if (mode === 'grow-before-open') fs.writeFileSync(target, Buffer.alloc(2_000_001, 65));
    evidence.installed = true;
    process.stderr.write(`RACE_INSTALLED:${mode}:${phase}\n`);
  }
  const handle = await realOpen.call(this, path, flags, ...rest);
  if (selected) {
    const stat = handle.stat.bind(handle), read = handle.read.bind(handle), close = handle.close.bind(handle);
    handle.stat = async (...args) => { evidence.stats++; return stat(...args); };
    handle.read = async (...args) => {
      if (evidence.reads++ === 0) {
        if (mode === 'grow-during-read') fs.appendFileSync(target, 'GROW');
        if (mode === 'truncate-during-read') fs.truncateSync(target, 0);
      }
      return read(...args);
    };
    handle.close = async (...args) => { evidence.closes++; return close(...args); };
  }
  return handle;
};
syncBuiltinESMExports();
