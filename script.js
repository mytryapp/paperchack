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

/* 👤 USER PROFILE */
function saveProfile() {
  const profile = {
    name: userName.value,
    mobile: userMobile.value,
    city: userCity.value
  };

  if (!profile.name || !profile.mobile) {
    alert("Name & mobile required");
    return;
  }

  localStorage.setItem("paperChackProfile", JSON.stringify(profile));
  showProfile();
}

function showProfile() {
  const data = JSON.parse(localStorage.getItem("paperChackProfile"));
  if (!data) return;

  const vehicles = JSON.parse(localStorage.getItem("paperChackVehicles")) || [];

  document.getElementById("profileInfo").innerHTML = `
    <strong>${data.name}</strong><br>
    📞 ${data.mobile}<br>
    📍 ${data.city || "N/A"}<br>
    🚗 Vehicles Added: ${vehicles.length}
  `;

  userName.value = data.name;
  userMobile.value = data.mobile;
  userCity.value = data.city || "";
}

showProfile();
// 👤 PROFILE PHOTO
profilePhoto?.addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function () {
    localStorage.setItem("paperChackProfilePhoto", reader.result);
    showProfilePhoto();
  };
  reader.readAsDataURL(file);
});

function showProfilePhoto() {
  const img = localStorage.getItem("paperChackProfilePhoto");
  if (!img) return;

  const preview = document.getElementById("profilePreview");
  preview.src = img;
  preview.style.display = "block";
}

showProfilePhoto();

// 🔒 APP LOCK
function setPin(pin) {
  localStorage.setItem("paperChackPIN", pin);
}

function unlockApp() {
  const savedPin = localStorage.getItem("paperChackPIN");
  const entered = document.getElementById("pinInput").value;

  if (entered === savedPin) {
    document.getElementById("lockScreen").style.display = "none";
  } else {
    alert("Wrong PIN");
  }
}

// First time PIN set (default)
if (!localStorage.getItem("paperChackPIN")) {
  localStorage.setItem("paperChackPIN", "0000");
}

}

// Show lock screen
document.getElementById("lockScreen").style.display = "flex";

// ☁️ FIREBASE CONFIG (replace with your own later)
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_ID",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Future ready (no error even if not used now)
function editProfile() {
  const data = JSON.parse(localStorage.getItem("paperChackProfile"));
  if (!data) {
    alert("No profile found");
    return;
  }

  userName.value = data.name;
  userMobile.value = data.mobile;
  userCity.value = data.city || "";

  alert("Profile edit mode enabled ✏️\nDetails update karke Save Profile dabao");
}

function changePin() {
  const savedPin = localStorage.getItem("paperChackPIN");
  const oldPin = document.getElementById("oldPin").value;
  const newPin = document.getElementById("newPin").value;
  const confirmPin = document.getElementById("confirmPin").value;

  if (oldPin !== savedPin) {
    alert("Old PIN incorrect ❌");
    return;
  }

  if (newPin.length !== 4 || newPin !== confirmPin) {
    alert("New PIN invalid or not matching ❌");
    return;
  }

  localStorage.setItem("paperChackPIN", newPin);
  alert("PIN changed successfully 🔒✅");

  document.getElementById("oldPin").value = "";
  document.getElementById("newPin").value = "";
  document.getElementById("confirmPin").value = "";
}

