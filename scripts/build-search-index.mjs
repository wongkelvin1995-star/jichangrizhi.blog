import { saveSearchIndexToPublic } from '../src/lib/search-indexer.ts';

try {
  saveSearchIndexToPublic();
} catch (e) {
  console.error('[Build Search Index] Failed:', e);
  process.exit(1);
}
