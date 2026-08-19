// Tab switching syncs with dropdown
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('ignoreTypeName').value = tab.dataset.type;
    toggleEmptyMode(tab.dataset.type);
  });
});

document.getElementById('ignoreTypeName').addEventListener('change', function() {
  document.querySelectorAll('.tab').forEach(t => {
    t.classList.toggle('active', t.dataset.type === this.value);
  });
  toggleEmptyMode(this.value);
});

function toggleEmptyMode(typeName) {
  const isEmpty = typeName === 'IgnoreEmpty' || typeName === 'IgnoreNotEmpty';
  document.getElementById('valuesGroup').classList.toggle('hidden', isEmpty);
  document.getElementById('ignoreCaseGroup').classList.toggle('hidden', isEmpty);
  document.getElementById('rankAboveGroup').classList.toggle('hidden', !isEmpty);
}

function generateIgnoreJSON() {
  const typeName = document.getElementById('ignoreTypeName').value;
  const field = document.getElementById('ignoreField').value;
  const rank = document.getElementById('ignoreRank').value;
  const sourceId = document.getElementById('ignoreSourceId').value;
  const isEmpty = typeName === 'IgnoreEmpty' || typeName === 'IgnoreNotEmpty';

  if (!field) {
    alert('Please select a field.');
    return;
  }
  if (!rank || !sourceId) {
    alert('Please fill in rank and sourceId.');
    return;
  }

  if (isEmpty) {
    const rankAbove = document.getElementById('rankAbove').value;
    const params = { field: field };
    if (rankAbove) {
      params.rankAbove = rankAbove;
    }

    const results = [{
      typeName: typeName,
      active: true,
      rank: parseInt(rank, 10),
      dynamic: true,
      simulatorOnly: false,
      parameters: params,
      sourceId: parseInt(sourceId, 10)
    }];

    document.getElementById('ignoreJsonOutput').textContent = JSON.stringify(results, null, 2);
    document.getElementById('ignoreJsonOutput').scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  const valuesText = document.getElementById('ignoreValuesInput').value.trim();
  const ignoreCase = document.getElementById('ignoreCase').value === 'true';

  if (!valuesText) {
    alert('Please paste values (one per line) in the Values input area.');
    return;
  }

  const lines = valuesText.split('\n').filter(line => line.trim() !== '');
  const results = [];

  for (const line of lines) {
    let value = line.trim();
    if (field === 'company') {
      value = 'urn:li:company:' + value;
    }

    results.push({
      typeName: typeName,
      active: true,
      rank: parseInt(rank, 10),
      dynamic: true,
      simulatorOnly: false,
      parameters: {
        field: field,
        value: value,
        ignoreCase: ignoreCase
      },
      sourceId: parseInt(sourceId, 10)
    });
  }

  document.getElementById('ignoreJsonOutput').textContent = JSON.stringify(results, null, 2);
  document.getElementById('ignoreJsonOutput').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function copyIgnoreOutput() {
  const text = document.getElementById('ignoreJsonOutput').textContent;
  if (text === 'Your generated JSON will appear here...') {
    alert('Nothing to copy. Generate JSON first.');
    return;
  }
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copyIgnoreBtn');
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = 'Copy to Clipboard'; }, 2000);
  });
}

function clearIgnoreAll() {
  document.getElementById('ignoreValuesInput').value = '';
  document.getElementById('ignoreField').value = '';
  document.getElementById('ignoreRank').value = '';
  document.getElementById('ignoreSourceId').value = '';
  document.getElementById('ignoreCase').value = 'false';
  document.getElementById('rankAbove').value = '';
  document.getElementById('ignoreTypeName').value = 'IgnoreContains';
  document.querySelectorAll('.tab').forEach(t => {
    t.classList.toggle('active', t.dataset.type === 'IgnoreContains');
  });
  toggleEmptyMode('IgnoreContains');
  document.getElementById('ignoreJsonOutput').textContent = 'Your generated JSON will appear here...';
}
