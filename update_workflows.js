const fs = require('fs');
const path = require('path');

const scifiPath = path.join(__dirname, 'scifi_hindi_source.json');
const listPath = path.join(__dirname, 'workflows_list_v2.json');
const list1Path = path.join(__dirname, 'workflows_list.json');

console.log('Starting update script...');

try {
    console.log('Reading Sci-Fi workflow from:', scifiPath);
    if (!fs.existsSync(scifiPath)) {
        throw new Error('Sci-Fi source file not found at: ' + scifiPath);
    }
    const scifiRaw = fs.readFileSync(scifiPath, 'utf8');
    console.log('Sci-Fi raw length:', scifiRaw.length);
    const scifiContent = JSON.parse(scifiRaw);

    console.log('Reading workflows list from:', listPath);
    if (!fs.existsSync(listPath)) {
        throw new Error('Workflows list file not found at: ' + listPath);
    }
    const listRaw = fs.readFileSync(listPath, 'utf8');
    console.log('List raw length:', listRaw.length);
    const listContent = JSON.parse(listRaw);

    // Prepare Sci-Fi workflow object
    const workflowData = Array.isArray(scifiContent) ? scifiContent[0] : scifiContent;

    const scifiWorkflow = {
        ...workflowData,
        id: 'scifi_hindi_v1',
        name: 'Sci-Fi & Future Worlds – Hindi',
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        isArchived: false,
        active: false
    };

    // Add to list if not already there (by ID)
    const existingIndex = listContent.findIndex(w => w.id === scifiWorkflow.id);
    if (existingIndex > -1) {
        console.log('Updating existing workflow in list.');
        listContent[existingIndex] = scifiWorkflow;
    } else {
        console.log('Adding new workflow to list.');
        listContent.push(scifiWorkflow);
    }

    const output = JSON.stringify(listContent);
    console.log('Writing to listPath:', listPath);
    fs.writeFileSync(listPath, output);

    console.log('Writing to list1Path:', list1Path);
    fs.writeFileSync(list1Path, output);

    console.log('Successfully updated workflows.');
} catch (err) {
    console.error('FAILED with error:', err.message);
    if (err.stack) console.error(err.stack);
    process.exit(1);
}
