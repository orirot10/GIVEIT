// Simple test for price period translation utility
import { translatePricePeriod } from './pricePeriodTranslator';

// Test cases
const testCases = [
  { input: 'use', expectedEn: 'use', expectedHe: 'לשימוש' },
  { input: 'hour', expectedEn: 'hour', expectedHe: 'לשעה' },
  { input: 'day', expectedEn: 'day', expectedHe: 'ליום' },
  { input: 'week', expectedEn: 'week', expectedHe: 'לשבוע' },
  { input: 'month', expectedEn: 'month', expectedHe: 'לחודש' },
  { input: 'invalid', expectedEn: 'invalid', expectedHe: 'invalid' },
  { input: '', expectedEn: '', expectedHe: '' },
  { input: null, expectedEn: '', expectedHe: '' },
  { input: undefined, expectedEn: '', expectedHe: '' }
];

console.log('Testing price period translation utility...');

testCases.forEach(({ input, expectedEn, expectedHe }) => {
  const resultEn = translatePricePeriod(input, 'en');
  const resultHe = translatePricePeriod(input, 'he');
  
  const enPassed = resultEn === expectedEn;
  const hePassed = resultHe === expectedHe;
  
  console.log(`Input: "${input}"`);
  console.log(`  English: ${resultEn} (${enPassed ? 'PASS' : 'FAIL'})`);
  console.log(`  Hebrew: ${resultHe} (${hePassed ? 'PASS' : 'FAIL'})`);
  console.log('');
});

console.log('Price period translation test completed!'); 