function saveData() {
  const vehicleNo = document.getElementById("vehicleNo").value;
  const vehicleType = document.getElementById("vehicleType").value;
  const insuranceDate = document.getElementById("insuranceDate").value;
  const pucDate = document.getElementById("pucDate").value;

  if (vehicleNo === "" || vehicleType === "") {
    alert("Please fill vehicle details");
    return;
  }

  alert(
    "Saved!\n\n" +
    "Vehicle: " + vehicleNo +
    "\nType: " + vehicleType +
    "\nInsurance Expiry: " + insuranceDate +
    "\nPUC Expiry: " + pucDate
  );
}
