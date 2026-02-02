function saveData() {
  const v = {
    id: Date.now(),
    vehicleNo: vehicleNo.value,
    vehicleType: vehicleType.value,
    insuranceDate: insuranceDate.value,
    pucDate: pucDate.value,
    serviceDate: serviceDate.value,
    emergencyContact: emergencyContact.value
  };

  if (!v.vehicleNo || !v.vehicleType) {
    alert("Vehicle number & type required");
    return;
  }

  const list = JSON.parse(localStorage.getItem("paperChackVehicles")) || [];
  list.push(v);
  localStorage.setItem("paperChackVehicles", JSON.stringify(list));

  document.querySelectorAll("input,select").forEach(e => e.value = "");
  showVehicles();
}

function showVehicles() {
  const listDiv = document.getElementById("vehicleList");
  const list = JSON.parse(localStorage.getItem("paperChackVehicles")) || [];

  if (list.length === 0) {
    listDiv.innerText = "No vehicles added";
    return;
  }

  listDiv.innerHTML = "";

  list.forEach(v => {
    const health = getHealth(v);
    const service = getService(v.serviceDate);

    listDiv.innerHTML += `
      <div class="vehicle-box">
        <strong>${v.vehicleNo}</strong> (${v.vehicleType})<br>
        Insurance: ${v.insuranceDate || "N/A"}<br>
        PUC: ${v.pucDate || "N/A"}<br>
        Service: ${service}<br>
        Status: ${health}
      </div>
    `;
  });
}

function getHealth(v) {
  const i = checkDate(v.insuranceDate);
  const p = checkDate(v.pucDate);

  if (i === "red" || p === "red") return `<span class="status-red">🔴 EXPIRED</span>`;
  if (i === "yellow" || p === "yellow") return `<span class="status-yellow">🟡 EXPIRING</span>`;
  return `<span class="status-green">🟢 ALL GOOD</span>`;
}

function checkDate(d) {
  if (!d) return "green";
  const diff = (new Date(d) - new Date()) / 86400000;
  if (diff < 0) return "red";
  if (diff <= 30) return "yellow";
  return "green";
}

function getService(d) {
  if (!d) return "N/A";
  const diff = (new Date() - new Date(d)) / 86400000;
  if (diff > 90) return "🔴 OVERDUE";
  if (diff > 75) return "🟡 DUE SOON";
  return "🟢 OK";
}

function openEmergencyMode() {
  const list = JSON.parse(localStorage.getItem("paperChackVehicles")) || [];
  if (!list.length) return alert("No data");

  let msg = "🚨 EMERGENCY MODE 🚨\n\n";
  list.forEach(v => {
    msg += `
Vehicle: ${v.vehicleNo}
Insurance: ${v.insuranceDate || "N/A"}
PUC: ${v.pucDate || "N/A"}
Service: ${getService(v.serviceDate)}
Contact: ${v.emergencyContact || "N/A"}

------------------
`;
  });

  alert(msg);
}

showVehicles();
