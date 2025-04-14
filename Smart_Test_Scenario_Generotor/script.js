document.getElementById("testForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const feature = document.getElementById("featureName").value.trim();
    const fields = document.getElementById("inputFields").value.trim().split(",");
    const type = document.getElementById("testType").value;
  
    const scenarios = generateScenarios(feature, fields, type);
    displayScenarios(scenarios);
  });
  
  function generateScenarios(feature, fields, type) {
    const scenarios = [];
  
    fields.forEach(field => {
      const trimmedField = field.trim();
  
      switch (type) {
        case 'positive':
          scenarios.push(`Enter valid ${trimmedField} in ${feature} – expect success.`);
          break;
        case 'negative':
          scenarios.push(`Leave ${trimmedField} empty in ${feature} – expect validation error.`);
          scenarios.push(`Enter invalid ${trimmedField} in ${feature} – expect error.`);
          break;
        case 'boundary':
          scenarios.push(`Enter max characters in ${trimmedField} – check if accepted.`);
          scenarios.push(`Enter 0 characters in ${trimmedField} – expect failure.`);
          break;
        case 'ui':
          scenarios.push(`Check ${trimmedField} field alignment and label in ${feature}.`);
          scenarios.push(`Verify ${trimmedField} field responsiveness on mobile.`);
          break;
      }
    });
  
    return scenarios;
  }
  
  function displayScenarios(scenarios) {
    const list = document.getElementById("scenarioList");
    list.innerHTML = "";
  
    scenarios.forEach(scenario => {
      const li = document.createElement("li");
      li.textContent = scenario;
      list.appendChild(li);
    });
  }
  
  // Copy Button
  document.getElementById("copyBtn").addEventListener("click", () => {
    const listItems = document.querySelectorAll("#scenarioList li");
    const textToCopy = Array.from(listItems).map(li => li.textContent).join('\n');
  
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert("Test scenarios copied to clipboard!");
    });
  });
  