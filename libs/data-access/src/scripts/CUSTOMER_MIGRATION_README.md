# Customer Data Migration - MongoDB to PostgreSQL

This script migrates customer data from your MongoDB database to the PostgreSQL database used by the Shreehari Mart application.

## Overview

The migration script handles the following:

1. **Data Mapping**: Maps MongoDB customer schema to PostgreSQL entities
2. **Societies & Buildings**: Automatically creates societies and buildings based on customer data
3. **Email Generation**: Generates unique email addresses for customers
4. **Wallet Creation**: Creates wallet records with existing balances
5. **Data Validation**: Validates and cleans mobile numbers
6. **Error Handling**: Comprehensive error tracking and reporting
7. **Duplicate Prevention**: Prevents migration of existing customers

## MongoDB Schema (Source)

```typescript
{
  _id: ObjectId;
  countryCode: string;
  mobileNumber: string;
  flatNumber: string;
  societyName: string;
  customerName: string;
  address: string;
  walletBalance: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## PostgreSQL Schema (Target)

The script creates data in the following PostgreSQL tables:

- `customers` - Main customer information
- `societies` - Housing societies
- `buildings` - Buildings within societies
- `wallets` - Customer wallet balances

## Prerequisites

1. **Environment Variables**: Ensure PostgreSQL connection variables are set:

   ```bash
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_NAME=shreehari_mart
   ```

2. **Dependencies**: Install MongoDB driver:

   ```bash
   npm install
   ```

3. **Database Setup**: Ensure PostgreSQL database is running and schema is created

## Usage

### Step 1: Dry Run (Recommended)

First, run a dry run to preview the migration without making changes:

```bash
npm run migrate:customers:dry-run
```

This will:

- Connect to both databases
- Show sample data preview
- Identify potential issues (duplicates, data problems)
- Display migration statistics
- **NOT modify any data**

### Step 2: Execute Migration

After reviewing the dry run results, execute the actual migration:

```bash
npm run migrate:customers:execute
```

This will:

- Migrate all customer data
- Create societies and buildings as needed
- Generate wallets for each customer
- Provide detailed progress reporting
- Handle errors gracefully

## Data Transformations

### Society Matching

- **Case-Insensitive**: Matches existing societies regardless of case (e.g., "Green Valley" matches "green valley")
- Uses `societyName` from MongoDB
- Uses `address` field for society address
- Creates unique societies (no duplicates)

### Building Extraction & Flat Number Standardization

The script intelligently extracts building names from various flat number formats and standardizes them:

**Supported Input Formats:**

- `A-101` → Building: `A`, Standardized: `A101`
- `A101` → Building: `A`, Standardized: `A101`
- `A 101` → Building: `A`, Standardized: `A101`
- `Block A 101` → Building: `A`, Standardized: `A101`
- `Building B-205` → Building: `B`, Standardized: `B205`
- `101A` → Building: `A`, Standardized: `A101`
- `205` → Building: `A` (default), Standardized: `A205`

**Benefits:**

- Consistent flat number format in database (`A101`, `B205`, etc.)
- Accurate building extraction from various naming conventions
- Fallback to Building `A` for numbers-only flats

### Email Generation

Generates unique emails in format:

```
{customer.name}.{mobile.number}@customer.shreedharismart.com
```

Example: `john.doe.9876543210@customer.shreedharismart.com`

### Mobile Number Validation

- Removes non-digit characters
- Handles Indian mobile numbers (10 digits)
- Removes country code if present (91xxxxxxxxxx → xxxxxxxxxx)

## Migration Features

### Batch Processing

- Processes customers in batches of 100 to avoid memory issues
- Suitable for large datasets

### Caching

- Caches societies and buildings to avoid duplicate database queries
- Improves performance significantly

### Error Handling

- Continues migration even if individual customers fail
- Logs all errors with detailed information
- Provides success rate statistics

### Duplicate Prevention

- Checks for existing customers by mobile number
- Skips customers that already exist in PostgreSQL

## Output Example

```
🔌 Connecting to MongoDB...
✅ MongoDB connected successfully
🔌 Connecting to PostgreSQL...
✅ PostgreSQL connected successfully
📊 Found 1250 customers to migrate
🔄 Processing batch 1 (100 customers)...
📍 Created new society: Green Valley Apartments
🏢 Created new building: A in Green Valley Apartments
✅ Migrated customer: John Doe (9876543210)
...

📈 MIGRATION STATISTICS
========================
Total customers found: 1250
Successfully migrated: 1245
Societies created: 15
Buildings created: 42
Wallets created: 1245
Errors encountered: 5
✅ Success rate: 99.60%
```

## Error Scenarios

Common errors and solutions:

1. **Duplicate Mobile Numbers**: Script skips existing customers
2. **Invalid Mobile Numbers**: Attempts to clean and validate
3. **Missing Required Fields**: Logged as errors with customer details
4. **Database Connection Issues**: Clear error messages with troubleshooting steps

## Post-Migration Verification

After migration, verify the results:

```bash
# Check customer count
npm run db:verify

# Or manually check in PostgreSQL
SELECT COUNT(*) FROM customers;
SELECT COUNT(*) FROM societies;
SELECT COUNT(*) FROM buildings;
SELECT COUNT(*) FROM wallets;
```

## Important Notes

1. **Backup**: Always backup your PostgreSQL database before running migration
2. **Testing**: Test on a smaller dataset first if possible
3. **Environment**: Ensure both databases are accessible from the same network
4. **Credentials**: Keep MongoDB credentials secure and don't commit them to version control

## Troubleshooting

### Connection Issues

- Verify MongoDB URI and credentials
- Ensure PostgreSQL is running and accessible
- Check firewall settings

### Data Issues

- Review dry run output for data quality issues
- Check for special characters in customer names
- Verify mobile number formats

### Performance

- Monitor memory usage during large migrations
- Consider running during off-peak hours
- Use smaller batch sizes if needed

## Support

For issues or questions regarding the migration script, review the error logs and ensure all prerequisites are met. The script provides detailed logging to help identify and resolve issues.
