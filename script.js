/* 🔒 APP LOCK */
if (!localStorage.getItem("paperChackPIN")) localStorage.setItem("paperChackPIN","0000");
window.onload = () => document.getElementById("lockScreen").style.display="flex";
function unlockApp(){
  if(pinInput.value===localStorage.getItem("paperChackPIN")){
    lockScreen.style.display="none";
  } else alert("Wrong PIN");
}
function changePin(){
  if(oldPin.value!==localStorage.getItem("paperChackPIN")) return alert("Wrong old PIN");
  if(newPin.value.length!==4 || newPin.value!==confirmPin.value) return alert("Invalid PIN");
  localStorage.setItem("paperChackPIN",newPin.value); alert("PIN Changed");
}

/* 🌐 LANGUAGE */
let lang=localStorage.getItem("paperChackLang")||"en";
const L={
  en:{title:"Paper Chack",tag:"All your vehicle papers. Safe. Smart. Simple."},
  hi:{title:"पेपर चेक",tag:"आपके वाहन के सभी कागज़ सुरक्षित और आसान"}
};
function applyLang(){
  appTitle.innerText=L[lang].title;
  appTagline.innerText=L[lang].tag;
}
function toggleLanguage(){
  lang=lang==="en"?"hi":"en"; localStorage.setItem("paperChackLang",lang); applyLang();
}
applyLang();

/* 👤 PROFILE */
function saveProfile(){
  const p={name:userName.value,mobile:userMobile.value,city:userCity.value};
  localStorage.setItem("paperChackProfile",JSON.stringify(p)); showProfile();
}
function editProfile(){ showProfile(true); }
function showProfile(edit=false){
  const p=JSON.parse(localStorage.getItem("paperChackProfile")||"{}");
  if(!edit){
    profileInfo.innerHTML=`<b>${p.name||""}</b><br>${p.mobile||""}<br>${p.city||""}`;
  }
}
profilePhoto.onchange=e=>{
  const r=new FileReader(); r.onload=()=>{profilePreview.src=r.result;profilePreview.style.display="block";};
  r.readAsDataURL(e.target.files[0]);
};

/* 🚗 VEHICLES */
function saveVehicle(){
  const v={id:Date.now(),vehicleNo:vehicleNo.value,vehicleType:vehicleType.value,
    insuranceDate:insuranceDate.value,pucDate:pucDate.value,
    serviceDate:serviceDate.value,emergencyContact:emergencyContact.value};
  let list=JSON.parse(localStorage.getItem("paperChackVehicles")||"[]");
  list.push(v); localStorage.setItem("paperChackVehicles",JSON.stringify(list)); showVehicles();
}
function showVehicles(){
  const list=JSON.parse(localStorage.getItem("paperChackVehicles")||"[]");
  vehicleList.innerHTML=list.length?list.map((v,i)=>`
    <div class="vehicle-box">
      <b>${v.vehicleNo}</b> (${v.vehicleType})<br>
      Insurance: ${v.insuranceDate||"N/A"}<br>
      PUC: ${v.pucDate||"N/A"}<br>
      Service: ${serviceStatus(v.serviceDate)}<br>
      <button onclick="deleteVehicle(${i})">🗑 Delete</button>
    </div>`).join(""):"No vehicles added";
}
function deleteVehicle(i){
  let list=JSON.parse(localStorage.getItem("paperChackVehicles")||"[]");
  list.splice(i,1); localStorage.setItem("paperChackVehicles",JSON.stringify(list)); showVehicles();
}
function serviceStatus(d){
  if(!d) return "N/A";
  const diff=(new Date()-new Date(d))/86400000;
  return diff>90?"🔴 OVERDUE":diff>75?"🟡 DUE SOON":"🟢 OK";
}

/* ⏰ REMINDER */
function saveReminder(){
  localStorage.setItem("paperChackReminderDays",reminderDays.value);
  alert("Reminder saved");
}

/* ☁️ BACKUP */
function backupData(){
  const b={vehicles:localStorage.getItem("paperChackVehicles"),profile:localStorage.getItem("paperChackProfile")};
  localStorage.setItem("paperChackBackup",JSON.stringify(b)); alert("Backup done");
}
function restoreData(){
  const b=JSON.parse(localStorage.getItem("paperChackBackup")||"null");
  if(!b) return alert("No backup");
  localStorage.setItem("paperChackVehicles",b.vehicles);
  localStorage.setItem("paperChackProfile",b.profile);
  showVehicles(); showProfile();
}

/* 📄 PDF */
function exportPDF(){
  const {jsPDF}=window.jspdf; const doc=new jsPDF();
  const list=JSON.parse(localStorage.getItem("paperChackVehicles")||"[]");
  let y=10; doc.text("Paper Chack - Vehicles",10,y); y+=10;
  list.forEach((v,i)=>{ doc.text(`${i+1}. ${v.vehicleNo} (${v.vehicleType})`,10,y); y+=8; });
  doc.save("PaperChack.pdf");
}

/* 🚨 EMERGENCY */
function openEmergencyMode(){
  const list=JSON.parse(localStorage.getItem("paperChackVehicles")||"[]");
  alert(list.map(v=>`${v.vehicleNo}\n${v.emergencyContact||""}`).join("\n\n"));
}

showVehicles(); showProfile();
