import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as fs from 'fs';
import * as path from 'path';

function findGh(dir) {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      const found = findGh(full);
      if (found) return found;
    } else if (entry === 'gh') {
      return full;
    }
  }
  return null;
}

async function run() {
  try {
    const version = core.getInput('version');
    const url = `https://github.com/cli/cli/releases/download/v${version}/gh_${version}_linux_amd64.tar.gz`;
    
    const tarball = await tc.downloadTool(url);
    const extracted = await tc.extractTar(tarball);
    
    const ghPath = findGh(extracted);
    if (!ghPath) throw new Error('gh binary not found');
    
    const binDir = path.dirname(ghPath);
    fs.copyFileSync(ghPath, path.join(binDir, 'my-cli'));

    core.addPath(binDir);
  } catch (error) {
    core.setFailed(error.message);
  }
}
run();