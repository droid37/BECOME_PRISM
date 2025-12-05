// scripts/apply-blueprint.mjs

import { execa } from 'execa';
import fs from 'fs/promises';

console.log('🔵 Blueprint Agent: Activated. Searching for new blueprints...');

try {
  // 1. Fetch the latest open issue from GitHub
  const { stdout: issueJson } = await execa('gh', [
    'issue', 'list', '--state', 'open', '--limit', '1', '--json', 'number,body'
  ]);

  if (!issueJson || issueJson.trim() === '[]') {
    console.log('🟢 No new blueprints found. Standing by.');
    process.exit(0);
  }

  const [issue] = JSON.parse(issueJson);
  const { number, body } = issue;

  console.log(`🔵 Found Blueprint #${number}. Preparing to build...`);

  // 2. Parse the blueprint body
  const fileRegex = /--- START OF FILE (.*?) ---\n([\s\S]*?)\n--- END OF FILE ---/g;
  let match;
  const fileOperations = [];

  while ((match = fileRegex.exec(body)) !== null) {
    const filePath = match[1].trim();
    const fileContent = match[2];
    fileOperations.push({ path: filePath, content: fileContent });
  }

  if (fileOperations.length === 0) {
    console.log('🟡 Blueprint is empty or malformed. Closing issue and standing by.');
    await execa('gh', ['issue', 'close', number.toString(), '-c', 'Blueprint applied (empty).']);
    process.exit(0);
  }

  // 3. Apply changes to local files
  for (const op of fileOperations) {
    console.log(`- Writing to ${op.path}...`);
    await fs.writeFile(op.path, op.content, 'utf-8');
  }

  console.log('✅ Build complete according to blueprint.');

  // 4. Commit changes and close the issue
  console.log('🔵 Committing changes and closing blueprint issue...');
  await execa('git', ['add', '.']);
  await execa('git', ['commit', '-m', `feat: Apply blueprint from Issue #${number}`]);
  await execa('gh', ['issue', 'close', number.toString(), '-c', 'Blueprint applied successfully.']);
  await execa('git', ['push']); // Push the changes

  console.log(`🟢 Blueprint #${number} applied and closed. Agent standing by.`);

} catch (error) {
  console.error('🔴 An error occurred in the Blueprint Agent:', error);
  process.exit(1);
}

