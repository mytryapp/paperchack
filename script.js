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
  showData();
  alert("Data saved successfully ✅");
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

showData();
