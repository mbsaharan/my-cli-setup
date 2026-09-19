import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';

async function run() {
  try {
    const version = core.getInput('version');
    
    // 1. Check cache first - for faster execution
    let toolPath = tc.find('my-cli', version);
    
    if (!toolPath) {
      // 2. Download for this OS
      const url = `https://example.com/my-cli/${version}/my-cli-linux.tar.gz`;
      const downloadPath = await tc.downloadTool(url);
      const extractedPath = await tc.extractTar(downloadPath);
      toolPath = await tc.cacheDir(extractedPath, 'my-cli', version);
    }

    // 3. Add to PATH so next steps can use it
    core.addPath(toolPath);
    
  } catch (error) {
    core.setFailed(error instanceof Error ? error.message : String(error));
  }
}

run();