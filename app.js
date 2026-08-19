// Tab switching
let activeTab = 'tab1';

document.querySelectorAll('.tabs .tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tabs .tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeTab = tab.dataset.tab;
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(activeTab).classList.add('active');
  });
});

// Show/hide search field for ConditionalReplace in Tab 1
document.getElementById('tab1TypeName').addEventListener('change', function() {
  const isReplace = this.value === 'ManipulateValueConditionalReplace';
  document.getElementById('tab1SearchGroup').classList.toggle('hidden', !isReplace);
});

function generateJSON() {
  if (activeTab === 'tab1') generateTab1();
  else if (activeTab === 'tab2') generateTab2();
  else if (activeTab === 'tab3') generateTab3();
}

function generateTab1() {
  const typeName = document.getElementById('tab1TypeName').value;
  const valuesText = document.getElementById('tab1Values').value.trim();
  const compareValuesText = document.getElementById('tab1CompareValues').value.trim();
  const rank = document.getElementById('tab1Rank').value;
  const field = document.getElementById('tab1Field').value;
  const compareField = document.getElementById('tab1CompareField').value;
  const sourceId = document.getElementById('tab1SourceId').value;
  const fuzzyMatch = document.getElementById('tab1FuzzyMatch').value === 'true';
  const isReplace = typeName === 'ManipulateValueConditionalReplace';
  const searchText = isReplace ? document.getElementById('tab1Search').value.trim() : '';

  if (!valuesText) { alert('Please paste values.'); return; }
  if (!compareValuesText) { alert('Please paste compareValues.'); return; }
  if (!rank || !field || !compareField || !sourceId) { alert('Please fill in all common parameters.'); return; }

  const values = valuesText.split('\n').filter(l => l.trim());
  const compareValues = compareValuesText.split('\n').filter(l => l.trim());

  if (values.length !== compareValues.length) {
    alert(`Row count mismatch: ${values.length} values vs ${compareValues.length} compareValues.`);
    return;
  }

  let searchValues = [];
  if (isReplace) {
    if (!searchText) { alert('Please paste search values for ConditionalReplace.'); return; }
    searchValues = searchText.split('\n').filter(l => l.trim());
    if (searchValues.length !== values.length) {
      alert(`Row count mismatch: ${values.length} values vs ${searchValues.length} search values.`);
      return;
    }
  }

  const results = [];
  for (let i = 0; i < values.length; i++) {
    let value = values[i].trim();
    let compareValue = compareValues[i].trim();
    if (field === 'company') value = 'urn:li:company:' + value;
    if (compareField === 'company') compareValue = 'urn:li:company:' + compareValue;

    const params = {
      compareValue: compareValue,
      field: field,
      compareField: compareField,
      value: value,
      fuzzyMatch: fuzzyMatch
    };
    if (isReplace) {
      params.search = searchValues[i].trim();
    }

    results.push({
      typeName: typeName,
      active: true,
      rank: parseInt(rank, 10),
      dynamic: true,
      simulatorOnly: false,
      parameters: params,
      sourceId: parseInt(sourceId, 10)
    });
  }
  document.getElementById('jsonOutput').textContent = JSON.stringify(results, null, 2);
}

function generateTab2() {
  const searchText = document.getElementById('tab2Search').value.trim();
  const valuesText = document.getElementById('tab2Values').value.trim();
  const rank = document.getElementById('tab2Rank').value;
  const field = document.getElementById('tab2Field').value;
  const sourceId = document.getElementById('tab2SourceId').value;

  if (!searchText) { alert('Please paste search values.'); return; }
  if (!valuesText) { alert('Please paste values.'); return; }
  if (!rank || !field || !sourceId) { alert('Please fill in all common parameters.'); return; }

  const searches = searchText.split('\n').filter(l => l.trim());
  const values = valuesText.split('\n').filter(l => l.trim());

  if (searches.length !== values.length) {
    alert(`Row count mismatch: ${searches.length} search vs ${values.length} values.`);
    return;
  }

  const results = [];
  for (let i = 0; i < values.length; i++) {
    let value = values[i].trim();
    if (field === 'company') value = 'urn:li:company:' + value;

    results.push({
      typeName: "ManipulateValueReplace",
      active: true,
      rank: parseInt(rank, 10),
      dynamic: true,
      simulatorOnly: false,
      parameters: {
        search: searches[i].trim(),
        field: field,
        value: value,
        fuzzyMatch: false
      },
      sourceId: parseInt(sourceId, 10)
    });
  }
  document.getElementById('jsonOutput').textContent = JSON.stringify(results, null, 2);
}

function generateTab3() {
  const valuesText = document.getElementById('tab3Values').value.trim();
  const rank = document.getElementById('tab3Rank').value;
  const field = document.getElementById('tab3Field').value;
  const sourceId = document.getElementById('tab3SourceId').value;

  if (!valuesText) { alert('Please paste values.'); return; }
  if (!rank || !field || !sourceId) { alert('Please fill in all common parameters.'); return; }

  const values = valuesText.split('\n').filter(l => l.trim());
  const results = [];

  for (const line of values) {
    let value = line.trim();
    if (field === 'company') value = 'urn:li:company:' + value;

    results.push({
      typeName: "ManipulateValueReplaceEmpty",
      active: true,
      rank: parseInt(rank, 10),
      dynamic: true,
      simulatorOnly: false,
      parameters: {
        field: field,
        value: value
      },
      sourceId: parseInt(sourceId, 10)
    });
  }
  document.getElementById('jsonOutput').textContent = JSON.stringify(results, null, 2);
}

function copyOutput() {
  const text = document.getElementById('jsonOutput').textContent;
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
  document.querySelectorAll('textarea').forEach(t => t.value = '');
  document.querySelectorAll('input[type="number"]').forEach(i => i.value = '');
  document.querySelectorAll('select').forEach(s => { if (s.id !== 'tab1TypeName') s.selectedIndex = 0; });
  document.getElementById('jsonOutput').textContent = 'Your generated JSON will appear here...';
}
