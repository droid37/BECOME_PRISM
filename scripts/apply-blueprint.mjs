// scripts/apply-blueprint.mjs (PR Workflow Version)

import { execa } from 'execa';
import fs from 'fs/promises';

// NOTE: The Echo protocol is disabled in this simplified workflow.
// We will rely on GitHub's native notifications.

async function main() {
  console.log('🔵 Blueprint Agent (PR Mode): Activated. Searching for new blueprints...');
  try {
    const { stdout: issueJson } = await execa('gh', ['issue', 'list', '--state', 'open', '--limit', '1', '--json', 'number,body,title']);
    if (!issueJson || issueJson.trim() === '[]') {
      console.log('🟢 No new blueprints found. Standing by.');
      return;
    }
    const [issue] = JSON.parse(issueJson);
    const { number, title, body } = issue;
    console.log(`🔵 Found Blueprint #${number}. Preparing to build...`);

    const branchName = `blueprint/issue-${number}`;
    await execa('git', ['checkout', '-b', branchName]);

    const fileRegex = /--- START OF FILE (.*?) ---\n([\s\S]*?)\n--- END OF FILE ---/g;
    let match;
    let operationCount = 0;
    while ((match = fileRegex.exec(body)) !== null) {
      const filePath = match[1].trim();
      const fileContent = match[2];
      await fs.writeFile(filePath, fileContent, 'utf-8');
      console.log(`- Wrote file: ${filePath}`);
      operationCount++;
    }

    if (operationCount === 0) {
      console.log('🟡 Blueprint was empty. Closing issue.');
      await execa('gh', ['issue', 'close', number.toString(), '--comment', 'Blueprint was empty or malformed.']);
      await execa('git', ['checkout', 'main']);
      await execa('git', ['branch', '-D', branchName]);
      return;
    }

    console.log('✅ Build complete.');

    await execa('git', ['add', '.']);
    await execa('git', ['commit', '-m', `feat: Apply blueprint from Issue #${number}\n\nCloses #${number}`]);
    await execa('git', ['push', '-u', 'origin', branchName]);

    const { stdout: prURL } = await execa('gh', ['pr', 'create', '--title', title, '--body', `Auto-created PR for Issue #${number}.`, '--base', 'main', '--head', branchName]);
    
    console.log(`🟢 Pull Request created: ${prURL}`);
    await execa('gh', ['issue', 'comment', number.toString(), '--body', `**Pull Request created:** ${prURL.trim()}`]);
    
    await execa('git', ['checkout', 'main']);
  } catch (error) {
    console.error('🔴 Agent Error:', error);
    try { await execa('git', ['checkout', 'main']); } catch (e) {}
    process.exit(1);
  }
}

main();
