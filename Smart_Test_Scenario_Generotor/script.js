let allScenarios = [];

document.getElementById("testForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const feature = document.getElementById("featureName").value.trim();
  const fields = document.getElementById("inputFields").value.trim().split(",");
  const type = document.getElementById("testType").value;

  const scenarios = generateScenarios(feature, fields, type);
  allScenarios.push({
    feature,
    testType: type,
    scenarios
  });

  displayScenarios();
  document.getElementById("testForm").reset();
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

function displayScenarios() {
  const list = document.getElementById("scenarioList");
  list.innerHTML = "";

  allScenarios.forEach((group) => {
    const groupTitle = document.createElement("li");
    groupTitle.innerHTML = `<strong>Feature: ${group.feature} | Type: ${group.testType}</strong>`;
    list.appendChild(groupTitle);

    group.scenarios.forEach((scenario) => {
      const li = document.createElement("li");
      li.textContent = scenario;
      list.appendChild(li);
    });
  });
}

// Copy All Scenarios
document.getElementById("copyBtn").addEventListener("click", () => {
  if (allScenarios.length === 0) {
    alert("No scenarios to copy!");
    return;
  }

  let textToCopy = "";
  allScenarios.forEach((group) => {
    textToCopy += `Feature: ${group.feature} | Type: ${group.testType}\n`;
    group.scenarios.forEach((s, i) => {
      textToCopy += `${i + 1}. ${s}\n`;
    });
    textToCopy += `\n`;
  });

  navigator.clipboard.writeText(textToCopy).then(() => {
    alert("All test scenarios copied to clipboard!");
  });
});

// Download All as PDF
document.getElementById("pdfBtn").addEventListener("click", () => {
  if (allScenarios.length === 0) {
    alert("No scenarios to export!");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 10;

  // Set font: Times New Roman (jsPDF only supports "times" as closest match)
  doc.setFont("times", "bold");
  doc.setFontSize(14);

  const title = "All Generated Test Scenarios";
  const pageWidth = doc.internal.pageSize.getWidth();
  const textWidth = doc.getTextWidth(title);
  const x = (pageWidth - textWidth) / 2;

  doc.text(title, x, y);
  y += 10;

  doc.setFont("times", "normal");
  doc.setFontSize(12);

  allScenarios.forEach((group) => {
    if (y > 270) {
      doc.addPage();
      y = 10;
    }

    doc.setFont("times", "bold");
    doc.text(`Feature: ${group.feature} | Type: ${group.testType}`, 10, y);
    y += 8;

    doc.setFont("times", "normal");

    group.scenarios.forEach((scenario) => {
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
      doc.text(`- ${scenario}`, 12, y);
      y += 7;
    });

    y += 5;
  });

  doc.save("All_Test_Scenarios.pdf");
});
