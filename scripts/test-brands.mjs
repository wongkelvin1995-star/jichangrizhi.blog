import { getAllBrands } from '../src/lib/brand-parser.ts';

try {
  const brands = getAllBrands();
  console.log('Total parsed brands:', brands.length);
  for (const b of brands) {
    console.log(`[Slot ${b.order}] ${b.brandName} (${b.id}) - FAQ: ${b.faqList.length}, Plans: ${b.plans.length}, HTML length: ${b.renderedHtml.length}`);
  }
} catch (err) {
  console.error('Error during brand loading:', err);
  process.exit(1);
}
