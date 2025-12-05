// scripts/watch-blueprints.mjs
import { execa } from 'execa';

const CHECK_INTERVAL_MS = 60 * 1000; // Check every 60 seconds

async function checkForNewBlueprint() {
  console.log(`[Watcher] Checking for new blueprints... (${new Date().toLocaleTimeString()})`);
  try {
    const { stdout: issueJson } = await execa('gh', [
      'issue', 'list', '--state', 'open', '--limit', '1', '--json', 'number'
    ]);

    if (issueJson && issueJson.trim() !== '[]') {
      const [issue] = JSON.parse(issueJson);
      console.log(`[Watcher] Found new blueprint #${issue.number}! Activating agent...`);
      
      // Run the apply-blueprint script
      const { stdout, stderr } = await execa('npm', ['run', 'apply-blueprint']);
      
      console.log('[Watcher] Agent finished execution.');
      console.log(stdout);
      if (stderr) {
        console.error(stderr);
      }
    } else {
      console.log('[Watcher] No open blueprints found.');
    }
  } catch (error) {
    console.error('[Watcher] An error occurred:', error);
  }
}

console.log('--- The Watcher Protocol Activated ---');
console.log('Will check for new GitHub Issues every 60 seconds.');
console.log('------------------------------------');

// Check immediately on start, then set an interval
checkForNewBlueprint();
setInterval(checkForNewBlueprint, CHECK_INTERVAL_MS);