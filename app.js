const WORKPLACE_TYPE_MAP = {
  'on-site': 'urn:li:workplaceType:1',
  'remote': 'urn:li:workplaceType:2',
  'hybrid': 'urn:li:workplaceType:3'
};

const JOB_TYPE_MAP = {
  'full time': 'FULL_TIME',
  'full-time': 'FULL_TIME',
  'part time': 'PART_TIME',
  'part-time': 'PART_TIME',
  'temporary': 'TEMPORARY',
  'volunteer': 'VOLUNTEER',
  'contract': 'CONTRACT',
  'internship': 'INTERNSHIP',
  'other': 'OTHER'
};

function mapWorkplaceType(val) {
  return WORKPLACE_TYPE_MAP[val.toLowerCase()] || val;
}

function mapJobType(val) {
  return JOB_TYPE_MAP[val.toLowerCase()] || val;
}

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
if (document.getElementById('tab1TypeName')) {
  document.getElementById('tab1TypeName').addEventListener('change', function() {
    const isReplace = this.value === 'ManipulateValueConditionalReplace';
    document.getElementById('tab1SearchGroup').classList.toggle('hidden', !isReplace);
  });
}

function generateJSON() {
  if (activeTab === 'tab1') generateTab1();
  else if (activeTab === 'tab2') generateTab2();
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
    if (field === 'workplaceTypes') value = mapWorkplaceType(value);
    if (field === 'jobType') value = mapJobType(value);
    if (compareField === 'company') compareValue = 'urn:li:company:' + compareValue;
    if (compareField === 'workplaceTypes') compareValue = mapWorkplaceType(compareValue);
    if (compareField === 'jobType') compareValue = mapJobType(compareValue);

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
  scrollToOutput();
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
    let search = searches[i].trim();
    if (field === 'company') {
      value = 'urn:li:company:' + value;
      search = 'urn:li:company:' + search;
    }
    if (field === 'workplaceTypes') {
      value = mapWorkplaceType(value);
      search = mapWorkplaceType(search);
    }
    if (field === 'jobType') {
      value = mapJobType(value);
      search = mapJobType(search);
    }

    results.push({
      typeName: "ManipulateValueReplace",
      active: true,
      rank: parseInt(rank, 10),
      dynamic: true,
      simulatorOnly: false,
      parameters: {
        search: search,
        field: field,
        value: value,
        fuzzyMatch: false
      },
      sourceId: parseInt(sourceId, 10)
    });
  }
  document.getElementById('jsonOutput').textContent = JSON.stringify(results, null, 2);
  scrollToOutput();
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

function scrollToOutput() {
  document.getElementById('jsonOutput').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function clearAll() {
  document.querySelectorAll('textarea').forEach(t => t.value = '');
  document.querySelectorAll('input[type="number"]').forEach(i => i.value = '');
  document.querySelectorAll('select').forEach(s => { if (s.id !== 'tab1TypeName') s.selectedIndex = 0; });
  document.getElementById('jsonOutput').textContent = 'Your generated JSON will appear here...';
}
