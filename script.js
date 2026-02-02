function saveData() {
  const vehicleNo = document.getElementById("vehicleNo").value;
  const vehicleType = document.getElementById("vehicleType").value;
  const insuranceDate = document.getElementById("insuranceDate").value;
  const pucDate = document.getElementById("pucDate").value;

  if (vehicleNo === "" || vehicleType === "") {
    alert("Vehicle details fill karo");
    return;
  }

  const data = {
    vehicleNo,
    vehicleType,
    insuranceDate,
    pucDate
  };

  localStorage.setItem("paperChackData", JSON.stringify(data));
  alert("Data saved successfully ✅");
  showData();
  checkExpiry();
}

function showData() {
  const saved = localStorage.getItem("paperChackData");
  if (!saved) return;

  const data = JSON.parse(saved);
  document.getElementById("savedData").innerText =
    "Vehicle: " + data.vehicleNo +
    "\nType: " + data.vehicleType +
    "\nInsurance Expiry: " + data.insuranceDate +
    "\nPUC Expiry: " + data.pucDate;
}

function checkExpiry() {
  const saved = localStorage.getItem("paperChackData");
  if (!saved) return;

  const data = JSON.parse(saved);
  const today = new Date();

  checkSingleExpiry("Insurance", data.insuranceDate, today);
  checkSingleExpiry("PUC", data.pucDate, today);
}

function checkSingleExpiry(name, expiryDate, today) {
  if (!expiryDate) return;

  const expDate = new Date(expiryDate);
  const diffTime = expDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    alert("❌ " + name + " EXPIRED ho chuka hai!");
  } else if (diffDays <= 7) {
    alert("⚠️ " + name + " sirf " + diffDays + " din me expire ho jayega!");
  } else if (diffDays <= 30) {
    alert("ℹ️ " + name + " 30 din ke andar expire hone wala hai");
  }
}

showData();
checkExpiry();
