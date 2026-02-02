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
  checkExpiryAll();
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
    const div = document.createElement("div");
    div.style.border = "1px solid #ccc";
    div.style.padding = "10px";
    div.style.marginTop = "10px";

    div.innerHTML = `
      <strong>${v.vehicleNo}</strong> (${v.vehicleType})<br>
      Insurance: ${v.insuranceDate || "N/A"}<br>
      PUC: ${v.pucDate || "N/A"}
    `;

    listDiv.appendChild(div);
  });
}

function checkExpiryAll() {
  const vehicles = JSON.parse(localStorage.getItem("paperChackVehicles")) || [];
  const today = new Date();

  vehicles.forEach(v => {
    checkSingleExpiry(v.vehicleNo + " Insurance", v.insuranceDate, today);
    checkSingleExpiry(v.vehicleNo + " PUC", v.pucDate, today);
  });
}

function checkSingleExpiry(name, expiryDate, today) {
  if (!expiryDate) return;

  const expDate = new Date(expiryDate);
  const diffTime = expDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    alert("❌ " + name + " EXPIRED!");
  } else if (diffDays <= 7) {
    alert("⚠️ " + name + " sirf " + diffDays + " din me expire!");
  } else if (diffDays <= 30) {
    alert("ℹ️ " + name + " 30 din ke andar expire hone wala hai");
  }
}

showVehicles();
checkExpiryAll();
