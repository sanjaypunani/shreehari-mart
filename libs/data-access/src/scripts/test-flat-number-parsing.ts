// Test script to validate flat number parsing logic
// Run with: tsx libs/data-access/src/scripts/test-flat-number-parsing.ts

interface FlatNumberResult {
  buildingName: string;
  standardizedFlatNumber: string;
}

function extractBuildingAndStandardizeFlatNumber(
  flatNumber: string
): FlatNumberResult {
  // Remove extra spaces and normalize
  const cleaned = flatNumber.trim().replace(/\s+/g, ' ');

  // Pattern 1: A-101, B-205, C-301 (with dash)
  let match = cleaned.match(/^([A-Za-z]+)[-](\d+)$/);
  if (match) {
    const building = match[1].toUpperCase();
    const number = match[2];
    return {
      buildingName: building,
      standardizedFlatNumber: `${building}${number}`,
    };
  }

  // Pattern 2: A101, B205, C301 (no separator)
  match = cleaned.match(/^([A-Za-z]+)(\d+)$/);
  if (match) {
    const building = match[1].toUpperCase();
    const number = match[2];
    return {
      buildingName: building,
      standardizedFlatNumber: `${building}${number}`,
    };
  }

  // Pattern 3: A 101, B 205, C 301 (with space)
  match = cleaned.match(/^([A-Za-z]+)\s+(\d+)$/);
  if (match) {
    const building = match[1].toUpperCase();
    const number = match[2];
    return {
      buildingName: building,
      standardizedFlatNumber: `${building}${number}`,
    };
  }

  // Pattern 4: Block A 101, Building B 205, etc.
  match = cleaned.match(/(?:block|building)\s*([A-Za-z]+)[-\s]*(\d+)/i);
  if (match) {
    const building = match[1].toUpperCase();
    const number = match[2];
    return {
      buildingName: building,
      standardizedFlatNumber: `${building}${number}`,
    };
  }

  // Pattern 5: 101A, 205B (number first)
  match = cleaned.match(/^(\d+)([A-Za-z]+)$/);
  if (match) {
    const number = match[1];
    const building = match[2].toUpperCase();
    return {
      buildingName: building,
      standardizedFlatNumber: `${building}${number}`,
    };
  }

  // Pattern 6: Just numbers (101, 205) - assign to building A
  match = cleaned.match(/^(\d+)$/);
  if (match) {
    const number = match[1];
    return {
      buildingName: 'A',
      standardizedFlatNumber: `A${number}`,
    };
  }

  // If no pattern matches, try to extract any letters and numbers
  const letters = cleaned.match(/[A-Za-z]+/);
  const numbers = cleaned.match(/\d+/);

  if (letters && numbers) {
    const building = letters[0].toUpperCase();
    const number = numbers[0];
    return {
      buildingName: building,
      standardizedFlatNumber: `${building}${number}`,
    };
  }

  // Default fallback - use original flat number with building A
  console.warn(
    `⚠️  Could not parse flat number: "${flatNumber}", using default building A`
  );
  return {
    buildingName: 'A',
    standardizedFlatNumber: cleaned || 'A001',
  };
}

// Test cases
const testCases = [
  'A-101',
  'A101',
  'A 101',
  'B-205',
  'B205',
  'B 205',
  'Block A 101',
  'Building B-205',
  'BLOCK C 301',
  'building d-401',
  '101A',
  '205B',
  '301',
  '205',
  'Apt A-101',
  'a-101',
  'b205',
  'C  301',
  'Block  A  101',
  'Flat 101',
  'Unit B-205',
  'Wing A 301',
  '1A',
  '2B',
  '301C',
  'Invalid Text',
  '   A-101   ',
  'A-101-B',
  'Tower A 101',
];

console.log('🧪 Testing Flat Number Parsing Logic');
console.log('=====================================\n');

testCases.forEach((testCase, index) => {
  const result = extractBuildingAndStandardizeFlatNumber(testCase);
  console.log(`${(index + 1).toString().padStart(2, '0')}. "${testCase}"`);
  console.log(`    Building: ${result.buildingName}`);
  console.log(`    Standardized: ${result.standardizedFlatNumber}`);
  console.log('');
});

console.log('✅ Testing completed!');
console.log(
  '\nNote: Review the results above and adjust the parsing logic if needed.'
);
console.log(
  'The migration script uses the same logic for extracting building names and standardizing flat numbers.'
);
