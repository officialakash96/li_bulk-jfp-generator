function generateJSON() {
  const valuesText = document.getElementById('valuesInput').value.trim();
  const compareValuesText = document.getElementById('compareValueInput').value.trim();
  const rank = document.getElementById('rank').value;
  const field = document.getElementById('field').value;
  const compareField = document.getElementById('compareField').value;
  const sourceId = document.getElementById('sourceId').value;
  const fuzzyMatch = document.getElementById('fuzzyMatch').value === 'true';

  if (!valuesText) {
    alert('Please paste values (one per line) in the Values input area.');
    return;
  }
  if (!compareValuesText) {
    alert('Please paste compareValues (one per line) in the Compare Values input area.');
    return;
  }
  if (!rank || !field || !compareField || !sourceId) {
    alert('Please fill in all common parameters (rank, field, compareField, sourceId).');
    return;
  }

  const values = valuesText.split('\n').filter(line => line.trim() !== '');
  const compareValues = compareValuesText.split('\n').filter(line => line.trim() !== '');

  if (values.length !== compareValues.length) {
    alert(`Row count mismatch: ${values.length} values vs ${compareValues.length} compareValues. They must be equal.`);
    return;
  }

  const results = [];

  for (let i = 0; i < values.length; i++) {
    results.push({
      typeName: "ManipulateValueConditionalOverwrite",
      active: true,
      rank: parseInt(rank, 10),
      dynamic: true,
      simulatorOnly: false,
      parameters: {
        compareValue: compareValues[i].trim(),
        field: field,
        compareField: compareField,
        value: values[i].trim(),
        fuzzyMatch: fuzzyMatch
      },
      sourceId: parseInt(sourceId, 10)
    });
  }

  const output = JSON.stringify(results, null, 2);
  document.getElementById('jsonOutput').textContent = output;
}

function copyOutput() {
  const outputEl = document.getElementById('jsonOutput');
  const text = outputEl.textContent;
  if (text === 'Your generated JSON will appear here...') {
    alert('Nothing to copy. Generate JSON first.');
    return;
  }
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copyBtn');
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = 'Copy to Clipboard'; }, 2000);
  });
}

function clearAll() {
  document.getElementById('valuesInput').value = '';
  document.getElementById('compareValueInput').value = '';
  document.getElementById('rank').value = '';
  document.getElementById('field').value = '';
  document.getElementById('compareField').value = '';
  document.getElementById('sourceId').value = '';
  document.getElementById('fuzzyMatch').value = 'false';
  document.getElementById('jsonOutput').textContent = 'Your generated JSON will appear here...';
}
