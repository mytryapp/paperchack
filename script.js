function saveData() {
  const vehicleNo = document.getElementById("vehicleNo").value;
  const vehicleType = document.getElementById("vehicleType").value;
  const insuranceDate = document.getElementById("insuranceDate").value;
  const pucDate = document.getElementById("pucDate").value;

  if (vehicleNo === "" || vehicleType === "") {
    alert("Vehicle details fill karo");
    return;
  }

  const newVehicle = {
    id: Date.now(),
    vehicleNo,
    vehicleType,
    insuranceDate,
    pucDate
  };

  let vehicles = JSON.parse(localStorage.getItem("paperChackVehicles")) || [];
  vehicles.push(newVehicle);
  localStorage.setItem("paperChackVehicles", JSON.stringify(vehicles));

  clearForm();
  showVehicles();
}

function clearForm() {
  document.getElementById("vehicleNo").value = "";
  document.getElementById("vehicleType").value = "";
  document.getElementById("insuranceDate").value = "";
  document.getElementById("pucDate").value = "";
}

function showVehicles() {
  const listDiv = document.getElementById("vehicleList");
  const vehicles = JSON.parse(localStorage.getItem("paperChackVehicles")) || [];

  if (vehicles.length === 0) {
    listDiv.innerText = "No vehicles added";
    return;
  }

  listDiv.innerHTML = "";

  vehicles.forEach(v => {
    const health = getHealthStatus(v);

    const div = document.createElement("div");
    div.style.border = "1px solid #ccc";
    div.style.padding = "10px";
    div.style.marginTop = "10px";

    div.innerHTML = `
      <strong>${v.vehicleNo}</strong> (${v.vehicleType})<br>
      Insurance: ${v.insuranceDate || "N/A"}<br>
      PUC: ${v.pucDate || "N/A"}<br>
      <strong>Status:</strong> ${health}
    `;

    listDiv.appendChild(div);
  });
}

function getHealthStatus(vehicle) {
  const today = new Date();

  const insuranceStatus = checkStatus(vehicle.insuranceDate, today);
  const pucStatus = checkStatus(vehicle.pucDate, today);

  if (insuranceStatus === "expired" || pucStatus === "expired") {
    return "🔴 EXPIRED";
  }

  if (insuranceStatus === "soon" || pucStatus === "soon") {
    return "🟡 EXPIRING SOON";
  }

  return "🟢 ALL GOOD";
}

function checkStatus(expiryDate, today) {
  if (!expiryDate) return "ok";

  const exp = new Date(expiryDate);
  const diffDays = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "expired";
  if (diffDays <= 30) return "soon";
  return "ok";
}

showVehicles();
