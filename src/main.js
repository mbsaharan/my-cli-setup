import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as fs from 'fs';
import * as path from 'path';

async function run() {
  try {
    const version = core.getInput('version');
    const url = `https://github.com/cli/cli/releases/download/v${version}/gh_${version}_linux_amd64.tar.gz`;
    
    const tarball = await tc.downloadTool(url);
    const extracted = await tc.extractTar(tarball);
    
    const base = path.join(extracted, `gh_${version}_linux_amd64`);
    let ghPath = path.join(base, 'bin', 'gh');
    if (!fs.existsSync(ghPath)) ghPath = path.join(base, 'gh');
    
    const binDir = path.dirname(ghPath);
    fs.copyFileSync(ghPath, path.join(binDir, 'my-cli'));
    core.addPath(binDir);
  } catch (error) {
    core.setFailed(error.message);
  }
}
run();