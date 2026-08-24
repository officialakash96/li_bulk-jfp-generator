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

// Tab switching for Other JFP Operations page
let activeOtherTab = 'replaceEmptyTab';

document.querySelectorAll('.tabs .tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tabs .tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeOtherTab = tab.dataset.tab;
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(activeOtherTab).classList.add('active');
  });
});

function generateOtherJSON() {
  if (activeOtherTab === 'replaceEmptyTab') generateReplaceEmpty();
  else if (activeOtherTab === 'ignoreEmptyTab') generateIgnoreEmpty('IgnoreEmpty', 'ignoreEmpty');
  else if (activeOtherTab === 'ignoreNotEmptyTab') generateIgnoreEmpty('IgnoreNotEmpty', 'ignoreNotEmpty');
}

function generateReplaceEmpty() {
  const valueText = document.getElementById('replaceEmptyValue').value.trim();
  const rank = document.getElementById('replaceEmptyRank').value;
  const field = document.getElementById('replaceEmptyField').value;
  const sourceId = document.getElementById('replaceEmptySourceId').value;

  if (!valueText) { alert('Please enter a value.'); return; }
  if (!rank || !field || !sourceId) { alert('Please fill in all common parameters.'); return; }

  let value = valueText;
  if (field === 'company') value = 'urn:li:company:' + value;
  if (field === 'workplaceTypes') value = mapWorkplaceType(value);
  if (field === 'jobType') value = mapJobType(value);

  const result = {
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
  };
  document.getElementById('jsonOutput').textContent = JSON.stringify(result, null, 2);
  scrollToOutput();
}

function generateIgnoreEmpty(typeName, prefix) {
  const field = document.getElementById(prefix + 'Field').value;
  const rank = document.getElementById(prefix + 'Rank').value;
  const sourceId = document.getElementById(prefix + 'SourceId').value;
  const rankAbove = document.getElementById(prefix + 'RankAbove').value;

  if (!field) { alert('Please select a field.'); return; }
  if (!rank || !sourceId) { alert('Please fill in rank and sourceId.'); return; }

  const params = { field: field };
  if (rankAbove) params.rankAbove = rankAbove;

  const result = {
    typeName: typeName,
    active: true,
    rank: parseInt(rank, 10),
    dynamic: true,
    simulatorOnly: false,
    parameters: params,
    sourceId: parseInt(sourceId, 10)
  };
  document.getElementById('jsonOutput').textContent = JSON.stringify(result, null, 2);
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
  document.querySelectorAll('input[type="text"], input[type="number"]').forEach(i => i.value = '');
  document.querySelectorAll('select').forEach(s => s.selectedIndex = 0);
  document.getElementById('jsonOutput').textContent = 'Your generated JSON will appear here...';
}
