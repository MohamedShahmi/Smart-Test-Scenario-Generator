let allScenarios = [];

document.getElementById("testForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const feature = document.getElementById("featureName").value.trim();
  const fields = document.getElementById("inputFields").value.trim().split(",").map(f => f.trim());
  const types = Array.from(document.querySelectorAll('input[name="testType"]:checked')).map(cb => cb.value);

  if (types.length === 0) {
    alert("Please select at least one test type.");
    return;
  }

  const generated = [];

  types.forEach(type => {
    const scenarios = generateScenarios(feature, fields, type);
    generated.push({
      feature,
      testType: type,
      scenarios
    });
  });

  allScenarios.push(...generated);
  displayScenarios();
  document.getElementById("testForm").reset();
});

function generateScenarios(feature, fields, type) {
  const scenarios = [];

  if (type === "positive") {
    const fieldString = fields.join(" and ");
    scenarios.push(`User enters valid ${fieldString} in ${feature} – expect success.`);
  } else {
    fields.forEach(field => {
      switch (type) {
        case "negative":
          scenarios.push(`Leave ${field} empty in ${feature} – expect validation error.`);
          scenarios.push(`Enter invalid ${field} in ${feature} – expect error.`);
          break;
        case "boundary":
          scenarios.push(`Enter maximum allowed characters in ${field} – check if accepted.`);
          scenarios.push(`Enter minimum (or 0) characters in ${field} – expect failure.`);
          break;
        case "ui":
          scenarios.push(`Check alignment and label of ${field} in ${feature}.`);
          scenarios.push(`Verify responsiveness of ${field} field in ${feature} on mobile.`);
          break;
        case "navigation":
          scenarios.push(`Click ${field} in ${feature} – should navigate to correct page.`);
          scenarios.push(`Verify back button returns to previous page from ${feature}.`);
          break;
      }
    });
  }

  return scenarios;
}

function displayScenarios() {
  const selectedFilter = document.getElementById("filterType").value;
  const list = document.getElementById("scenarioList");
  list.innerHTML = "";

  allScenarios.forEach((group) => {
    if (selectedFilter === "all" || group.testType === selectedFilter) {
      const wrapper = document.createElement("div");
      wrapper.className = "scenario-box";

      const groupTitle = document.createElement("strong");
      groupTitle.textContent = `Feature: ${group.feature} | Type: ${group.testType}`;
      wrapper.appendChild(groupTitle);

      const ul = document.createElement("ul");
      group.scenarios.forEach((scenario) => {
        const li = document.createElement("li");
        li.textContent = scenario;
        ul.appendChild(li);
      });

      wrapper.appendChild(ul);
      list.appendChild(wrapper);
    }
  });
}

// Copy All
document.getElementById("copyBtn").addEventListener("click", () => {
  if (allScenarios.length === 0) {
    alert("No scenarios to copy!");
    return;
  }

  const selectedFilter = document.getElementById("filterType").value;
  let textToCopy = "";

  allScenarios.forEach((group) => {
    if (selectedFilter === "all" || group.testType === selectedFilter) {
      textToCopy += `Feature: ${group.feature} | Type: ${group.testType}\n`;
      group.scenarios.forEach((s, i) => {
        textToCopy += `${i + 1}. ${s}\n`;
      });
      textToCopy += `\n`;
    }
  });

  if (textToCopy === "") {
    alert("No scenarios to copy under current filter.");
    return;
  }

  navigator.clipboard.writeText(textToCopy).then(() => {
    alert("Filtered test scenarios copied to clipboard!");
  });
});

// Download as PDF
document.getElementById("pdfBtn").addEventListener("click", () => {
  if (allScenarios.length === 0) {
    alert("No scenarios to export!");
    return;
  }

  const selectedFilter = document.getElementById("filterType").value;
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 10;

  doc.setFont("times", "bold");
  doc.setFontSize(14);
  const title = "Generated Test Scenarios";
  const pageWidth = doc.internal.pageSize.getWidth();
  const textWidth = doc.getTextWidth(title);
  const x = (pageWidth - textWidth) / 2;
  doc.text(title, x, y);
  y += 10;

  doc.setFont("times", "normal");
  doc.setFontSize(12);

  allScenarios.forEach((group) => {
    if (selectedFilter !== "all" && group.testType !== selectedFilter) return;

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

  doc.save("Filtered_Test_Scenarios.pdf");
});
