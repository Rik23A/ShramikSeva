const fs = require('fs');
const path = require('path');

const LOCALE_DIR = path.join(__dirname, 'app', '[locale]');

// Mapping of page paths to their translation namespaces
const PAGE_TRANSLATIONS = {
    'auth/login/page.tsx': { namespace: 'Auth.login', commonUsed: true },
    'auth/register/page.tsx': { namespace: 'Auth.register', commonUsed: true },
    'jobs/page.tsx': { namespace: 'Jobs', commonUsed: true },
    'jobs/create/page.tsx': { namespace: 'Jobs.create', commonUsed: true },
    'jobs/[id]/page.tsx': { namespace: 'Jobs.details', commonUsed: true },
    'jobs/[id]/edit/page.tsx': { namespace: 'Jobs.edit', commonUsed: true },
    'dashboard/worker/page.tsx': { namespace: 'Dashboard.worker', commonUsed: true },
    'dashboard/worker/assigned-jobs/[id]/page.tsx': { namespace: 'Dashboard.worker', commonUsed: true },
    'dashboard/worker/hiring-requests/page.tsx': { namespace: 'Dashboard.worker', commonUsed: true },
    'dashboard/worker/work-logs/page.tsx': { namespace: 'Dashboard.worker', commonUsed: true },
    'dashboard/employer/page.tsx': { namespace: 'Dashboard.employer', commonUsed: true },
    'dashboard/employer/jobs/page.tsx': { namespace: 'Dashboard.employer', commonUsed: true },
    'dashboard/employer/jobs/[jobId]/applicants/page.tsx': { namespace: 'Dashboard.employer', commonUsed: true },
    'dashboard/employer/hire-talent/page.tsx': { namespace: 'Dashboard.employer', commonUsed: true },
    'dashboard/employer/hired-jobs/page.tsx': { namespace: 'Dashboard.employer', commonUsed: true },
    'dashboard/employer/hired-jobs/[id]/page.tsx': { namespace: 'Dashboard.employer', commonUsed: true },
    'dashboard/employer/analytics/page.tsx': { namespace: 'Dashboard.employer', commonUsed: true },
    'dashboard/employer/applicants/page.tsx': { namespace: 'Dashboard.employer', commonUsed: true },
    'profile/page.tsx': { namespace: 'Profile', commonUsed: true },
    'profile/[id]/page.tsx': { namespace: 'Profile', commonUsed: true },
    'messages/page.tsx': { namespace: 'Messages', commonUsed: true },
    'messages/[id]/page.tsx': { namespace: 'Messages', commonUsed: true },
    'subscriptions/page.tsx': { namespace: 'Subscriptions', commonUsed: true },
    'admin/dashboard/page.tsx': { namespace: 'Admin.dashboard', commonUsed: true },
    'admin/users/page.tsx': { namespace: 'Admin.users', commonUsed: true },
    'admin/users/[id]/page.tsx': { namespace: 'Admin.users', commonUsed: true },
    'admin/jobs/page.tsx': { namespace: 'Admin.jobs', commonUsed: true },
    'admin/payments/page.tsx': { namespace: 'Admin.payments', commonUsed: true },
    'admin/subscriptions/page.tsx': { namespace: 'Admin.subscriptions', commonUsed: true },
    'admin/subscriptions/[id]/edit/page.tsx': { namespace: 'Admin.subscriptions', commonUsed: true },
    'admin/disputes/page.tsx': { namespace: 'Admin.disputes', commonUsed: true },
    'admin/documents/page.tsx': { namespace: 'Admin.documents', commonUsed: true },
    'admin/ratings/page.tsx': { namespace: 'Admin.ratings', commonUsed: true },
    'admin/worklogs/page.tsx': { namespace: 'Admin.worklogs', commonUsed: true },
    'admin/worklogs/[workerId]/page.tsx': { namespace: 'Admin.worklogs', commonUsed: true },
};

function addTranslationImport(content, namespace, useCommon) {
    // Check if already has useTranslations import
    if (content.includes("from 'next-intl'") || content.includes('from "next-intl"')) {
        console.log('  ✓ Already has next-intl import');
        return content;
    }

    // Find the last import statement
    const lines = content.split('\n');
    let lastImportIndex = -1;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith('import ') && !lines[i].includes('type')) {
            lastImportIndex = i;
        }
    }

    if (lastImportIndex === -1) {
        console.log('  ⚠ No import statements found');
        return content;
    }

    // Add the import after the last import
    lines.splice(lastImportIndex + 1, 0, "import { useTranslations } from 'next-intl'");

    return lines.join('\n');
}

function addTranslationHooks(content, namespace, useCommon) {
    // Find the function component declaration
    const functionMatch = content.match(/(function|const)\s+(\w+Content|\w+Page)\s*\(/);

    if (!functionMatch) {
        console.log('  ⚠ Could not find function component');
        return content;
    }

    const lines = content.split('\n');
    let insertIndex = -1;

    // Find the line after the function declaration
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(functionMatch[0])) {
            // Find the opening brace
            for (let j = i; j < Math.min(i + 5, lines.length); j++) {
                if (lines[j].includes('{')) {
                    insertIndex = j + 1;
                    break;
                }
            }
            break;
        }
    }

    if (insertIndex === -1) {
        console.log('  ⚠ Could not find insertion point');
        return content;
    }

    // Check if hooks already exist
    const nextFewLines = lines.slice(insertIndex, insertIndex + 5).join('\n');
    if (nextFewLines.includes('useTranslations')) {
        console.log('  ✓ Already has translation hooks');
        return content;
    }

    // Add the hooks
    const hooks = [];
    hooks.push(`  const t = useTranslations('${namespace}')`);
    if (useCommon) {
        hooks.push(`  const tCommon = useTranslations('Common')`);
    }

    lines.splice(insertIndex, 0, ...hooks);

    return lines.join('\n');
}

function processFile(filePath, namespace, useCommon) {
    const fullPath = path.join(LOCALE_DIR, filePath);

    if (!fs.existsSync(fullPath)) {
        console.log(`✗ File not found: ${filePath}`);
        return false;
    }

    console.log(`\nProcessing: ${filePath}`);

    try {
        let content = fs.readFileSync(fullPath, 'utf8');

        // Add import
        content = addTranslationImport(content, namespace, useCommon);

        // Add hooks
        content = addTranslationHooks(content, namespace, useCommon);

        // Write back
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✓ Updated: ${filePath}`);
        return true;
    } catch (error) {
        console.error(`✗ Error processing ${filePath}:`, error.message);
        return false;
    }
}

// Main execution
console.log('Starting translation integration...\n');
console.log('='.repeat(50));

let processed = 0;
let skipped = 0;

Object.entries(PAGE_TRANSLATIONS).forEach(([filePath, config]) => {
    const result = processFile(filePath, config.namespace, config.commonUsed);
    if (result) {
        processed++;
    } else {
        skipped++;
    }
});

console.log('\n' + '='.repeat(50));
console.log(`\nSummary:`);
console.log(`  Processed: ${processed}`);
console.log(`  Skipped: ${skipped}`);
console.log(`  Total: ${Object.keys(PAGE_TRANSLATIONS).length}`);
console.log('\n✓ Translation integration complete!');
console.log('\nNote: This script only adds imports and hooks.');
console.log('You still need to replace hardcoded strings with t() calls.');
