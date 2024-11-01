const deviceType = {
  light: "Ampoule",
  dimmer: "Gradateur",
  sensor: "Capteur d'environnement",
};

const deviceStatus = {
  on: "On",
  off: "Off",
  unavailable: "Indisponible",
};

const modals = ["addDeviceModal", "controlDeviceModal"];

const controlPages = ["lightControl", "dimmerControl", "sensorControl"];

const mockDevices = [
  {
    id: "aaaaa",
    type: deviceType.light,
    status: deviceStatus.on,
    name: "Light 1",
    intensity: "75",
    temperature: "3000",
  },
  {
    id: "bbbbb",
    type: deviceType.dimmer,
    status: deviceStatus.unavailable,
    name: "Dimmer 1",

    intensity: "75",
  },
  {
    id: "dddd",
    type: deviceType.dimmer,
    status: deviceStatus.off,
    name: "Dimmer 2",

    intensity: "75",
  },
  {
    id: "ccccc",
    type: deviceType.sensor,
    status: deviceStatus.on,
    name: "Sensor 1",
    temperature: "75",
    humidity: "40",
    luminosity: "100",
    mouvement: "Détecté",
  },
];


const deviceScanMock = [
  {
    id: "light_aaaa",
    type: deviceType.light,
  },
  {
    id: "light_bbbb",
    type: deviceType.light,
  },
  {
    id: "light_cccc",
    type: deviceType.light,
  },
  {
    id: "dimmer_aaaa",
    type: deviceType.dimmer,
  },
  {
    id: "dimmer_bbbb",
    type: deviceType.dimmer,
  },
  {
    id: "dimmer_cccc",
    type: deviceType.dimmer,
  },
  {
    id: "sensor_aaaa",
    type: deviceType.sensor,
  },
  {
    id: "sensor_bbbb",
    type: deviceType.sensor,
  },
  {
    id: "sensor_cccc",
    type: deviceType.sensor,
  },
  
]

let networkDevices = mockDevices;

// ---------- States ----------
var selectedDeviceData = null;
var isEditDevice = false;



// ---------- Ajout d'appareil ----------

function searchForDevice() {
  
  const form = document.getElementById("addDeviceForm");
  const formData = new FormData(form);
  let data = {};
  for (let item of formData) {
    data[item[0]] = item[1];
  }
  form.reset();
  openModal("addDeviceModal");

  document.getElementById("formModalId").value = data["id"];

  /*
  fetch("/add-device", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  .then((res) => res.json())
  .then((result) => {
    console.log(result);
    form.reset();
    const modal = document.getElementById("addDeviceModal");
    modal.style.display = "flex";
    document.getElementById("formModalId").value = data["id"];
  })
  .catch((err) => {
    console.log(err);
    alert("Error adding device");
  });
  */
}

function scanForDevices() {
  // Fetch

  // Fill table
  const table = document.getElementById("scanDevicesListBody");
  table.innerHTML = "";

  deviceScanMock.forEach((data) => {
    const newRow = table.insertRow();
    const id = newRow.insertCell();
    id.innerHTML = data["id"];
    const type = newRow.insertCell();
    type.innerHTML = data["type"];

    newRow.onclick = () => {
      const children = table.children;
      for (let i = 0; i < children.length; i++) {
        children[i].style.backgroundColor = "white";
      }
      newRow.style.backgroundColor = "lightblue";

      //showDevicePage(deviceData);
    };
  })
}

function createDevice() {
  const modal = document.getElementById("addDeviceModal");
  const form = modal.getElementsByTagName("form")[0];

  const formData = new FormData(form);
  let data = {};
  for (let item of formData) {
    data[item[0]] = item[1];
  }
  data["id"] = document.getElementById("formModalId").value;
  data["status"] = deviceStatus.on;
  


  addDevice(data);
  loadDeviceList();

  form.reset();
  closeModal("addDeviceModal");

  // fetch("/create-device", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(data),
  // })
  //   .then((res) => res.json())
  //   .then((result) => {
  //     console.log(result);
  //     alert("Device created successfully");
  //     form.reset();
  //     addDeviceInTable(data);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     alert("Error adding device");
  //   });
}


// ---------- Modal ----------
function openModal(modalId) {
  // Voir si c'est un modal
  if(!modals.includes(modalId)) {
    console.error("Not a known modal : " + modalId);
    return;
  }

  // 
  modals.forEach((id) => {
    const modal = document.getElementById(id);
    if(!modal) {
      console.error("Missing : " + id);
      return;
    }

    if(id === modalId) {
      modal.classList.add("open");
    } else {
      modal.classList.remove("open");
    }
  });
}

function closeModal(modalId) {
  if(!modals.includes(modalId)) {
    return;
  }

  const modal = document.getElementById(modalId);

  if(modal && modal.classList.contains("modal")) {
    modal.classList.remove("open");
  }

  selectedDeviceData = null;
}


// ---------- Device management ----------
function addDevice(deviceData) {
  networkDevices.push(deviceData);
}

function toggleEditDevice() {
  console.log(selectedDeviceData);

  // Switch mode
  isEditDevice = !isEditDevice;

  const form = document.getElementById("controlPageForm");
  const nameField = document.getElementById("deviceNameField");

  if(isEditDevice) {
    form.classList.remove("readonly");
    nameField.readOnly = false;
  } else {
    nameField.value = selectedDeviceData["name"];
    form.classList.add("readonly");
    nameField.readOnly = true;
  }
}

function saveDevice() {
  // Edit le device data

  const form = document.getElementById("controlPageForm");

  const formData = new FormData(form);
  console.log(formData);


  let data = {};
  for (let item of formData) {
    data[item[0]] = item[1];
  }

  // Backend request
  post_modifyDeviceInfo({
    id: selectedDeviceData["id"],
    key: "name",
    value: data["deviceNameField"]
  })

  mockModifyData("name", data["deviceNameField"]);
  toggleEditDevice();
}

function deleteDevice() {
  let index = -1;

  for (let i = 0; i < networkDevices.length; i++) {
    if(networkDevices[i]["id"] === selectedDeviceData["id"]) {
      index = i;
      break;
    }
  }

  if (index >= 0) {
    networkDevices.splice(index, 1);
  }

  loadDeviceList();
  closeModal("controlDeviceModal");
}

function setDeviceStatus(value) {
  if(value !== true && value !== false) {
    console.error("Wrong value format for status");
    return;
  }

  // Envoyer au backend 
  post_modifyDeviceParam({
    id: selectedDeviceData["id"],
    key: "status",
    value: value ? deviceStatus.on : deviceStatus.off
  });

  mockModifyData("status", value ? deviceStatus.on : deviceStatus.off);
  showDeviceControl();
}

function setDeviceTemperature(value) {
  if(value < 2700 || value > 6500) {
    console.error("Wrong value format for temperature");
    return;
  }

  // Envoyer au backend 
  post_modifyDeviceParam({
    id: selectedDeviceData["id"],
    key: "temperature",
    value: value
  });

  mockModifyData("temperature", value);
  showDeviceControl();
}

function setDeviceIntensity(value) {
  if(value < 0 || value > 100) {
    console.error("Wrong value format for intensity");
    return;
  }

  // Envoyer au backend 
  post_modifyDeviceParam({
    id: selectedDeviceData["id"],
    key: "intensity",
    value: value
  });

  mockModifyData("intensity", value);
  showDeviceControl();
}


// ---------- Device list ----------
function loadDeviceList() {
  // Add to table
  const table = document.getElementById("devicesContainer");

  // Clear childrens
  while (table.firstChild) {
    table.firstChild.remove()
  }

  // Load devices in device list
  networkDevices.forEach((i) => {
    const card = createDeviceCard(i);
    table.appendChild(card);
  });
}

function createDeviceCard(deviceData) {
  const {id, name, type, status} = deviceData;

  // Create the card
  const card = document.createElement("button");
  card.classList.add("deviceCard")

  // Device status
  if(status === deviceStatus.unavailable) {
    card.classList.add("unavailable");
  }

  // Set icon header
  const header = document.createElement("div");
  header.classList.add("deviceCardHeader");
  const deviceIcon = getDeviceIcon(type);

  const statusIcon = document.createElement("div");
  statusIcon.innerHTML = "power_settings_circle";
  statusIcon.classList.add("material-symbols-outlined");
  statusIcon.classList.add("icon");

  if(status === deviceStatus.on) {
    statusIcon.classList.add("on")
  } else if (status === deviceStatus.off) {
    statusIcon.classList.add("off")
  }

  header.appendChild(deviceIcon);
  header.appendChild(statusIcon);

  card.appendChild(header);

  const dataContainer = document.createElement("div");
  dataContainer.classList.add("deviceCardData");

  // Device Id
  const idField = document.createElement("div");
  idField.innerHTML = "Id : " + id;
  dataContainer.appendChild(idField);

  // Device Name
  const nameField = document.createElement("div");
  nameField.innerHTML = "Nom : " + name;
  dataContainer.appendChild(nameField);

  card.appendChild(dataContainer);
  
  card.onclick = () => {
    selectedDeviceData = deviceData;
    showDeviceControl();
  };

  return card;
}

function showDeviceControl() {
  const {id, name, type, status} = selectedDeviceData;

  // Open good modal
  openModal("controlDeviceModal");
  
  // Load info in modal
  const icon = document.getElementById("controlPageIcon");
  const title = document.getElementById("controlPageTitle");
  const statusIcon = document.getElementById("controlPageStatus");

  switch(type) {
    case deviceType.light:
      icon.innerHTML = "lightbulb";
      title.innerHTML = "Ampoule";
      break;

    case deviceType.dimmer:
      icon.innerHTML = "switch";
      title.innerHTML = "Gradateur";
      break;

    case deviceType.sensor:
      icon.innerHTML = "sensors";
      title.innerHTML = "Capteur d'environnement";
      break;
  }

  if(status === deviceStatus.on) {
    statusIcon.classList.add("on");
    statusIcon.classList.remove("off");
  } else if (status === deviceStatus.off) {
    statusIcon.classList.add("off");
    statusIcon.classList.remove("on");
  } else {
    statusIcon.classList.remove("on");
    statusIcon.classList.remove("off");
  }

  // Show device info for type
  const nameField = document.getElementById("deviceNameField");
  nameField.value = name;


  controlPages.forEach((id) => {
    const control = document.getElementById(id);
    if(!control) {
      console.error("Missing : " + control);
      return;
    }

    if(id === "lightControl" && type === deviceType.light) {
      setLightData();
      control.classList.remove("hidden");
    } else if(id === "dimmerControl" && type === deviceType.dimmer) {
      setDimmerData();
      control.classList.remove("hidden");
    } else if(id === "sensorControl" && type === deviceType.sensor) {
      setSensorData();
      control.classList.remove("hidden");
    } else {
      control.classList.add("hidden");
    }
  });
}

// ---------- TOOLS ----------
function getDeviceIcon(type) {
  const icon = document.createElement("div");
  icon.classList.add("material-symbols-outlined");
  icon.classList.add("icon");

  switch(type) {
    case deviceType.light:
      icon.innerHTML = "lightbulb";
      break;
    case deviceType.dimmer:
      icon.innerHTML = "switch";
      break;
    default:
      icon.innerHTML = "sensors"
      break;
  }

  return icon;
}

function setLightData() {
  const {id, status, intensity, temperature} = selectedDeviceData;


  const form = document.getElementById("lightControl");
  new FormData(form).set("id", id);

  const temp = document.getElementById("lightPower");
  temp.checked = status === deviceStatus.on;

  setRangeValue("lightIntensity", intensity);
  setRangeValue("lightTemperature", temperature);
}

function setDimmerData() {
  const {id, status, intensity} = selectedDeviceData;

  const form = document.getElementById("dimmerControl");
  new FormData(form).set("id", id);

  const temp = document.getElementById("dimmerPower");
  temp.checked = status === deviceStatus.on;

  setRangeValue("dimmerIntensity", intensity);
}

function setSensorData() {
  const {temperature, humidity, luminosity, mouvement} = selectedDeviceData;

  document.getElementById("sensorTemperature").innerHTML = temperature;
  document.getElementById("sensorHumidity").innerHTML = humidity;
  document.getElementById("sensorLuminosity").innerHTML = luminosity;
  document.getElementById("sensorMouvement").innerHTML = mouvement;
}

function setupRangeValue(id) {
  const range = document.getElementById(id);
  const value = document.getElementById(`${id}Value`);
  if (!range || !value) return;

  if (id.includes("Temperature")) {
    value.innerHTML = range.value + "K";
  } else if (id.includes("Intensity")) {
    value.innerHTML = range.value + "%";
  } else {
    value.innerHTML = range.value;
  }

  range.addEventListener("input", () => {
    if (range.name.includes("temp")) {
      value.innerHTML = range.value + "K";
    } else if (range.name.includes("inten")) {
      value.innerHTML = range.value + "%";
    } else {
      value.innerHTML = range.value;
    }
  });
}

function setRangeValue(id, value) {
  const range = document.getElementById(id);
  range.value = value;
  range.dispatchEvent(new Event("input"));
}

function mockModifyData(key, value) {
  // Temporary mock result
  for (let i = 0; i < networkDevices.length; i++) {
    if(networkDevices[i]["id"] === selectedDeviceData["id"]) {
      networkDevices[i][key] = value;
      selectedDeviceData = networkDevices[i];
      break;
    }
  }

  loadDeviceList();
}

//Remove devices table if no devices are present
document.addEventListener("DOMContentLoaded", () => {
  /*
  fetch("/get-devices", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((res) => res.json())
  .then((result) => {
    console.log(result);
    addDeviceInTable(result);
    addDevice(result);
  })
  .catch((err) => {
    console.log(err);
    alert("Error adding device");
  });
  */
  const tds = document.getElementById("devicesList").getElementsByTagName("td");
  if (tds.length === 0) {
    document.getElementById("devicesList").style.display = "none";
  }
});

// ---------- FETCH ----------
function get_networkDevices() {
  // Request : start spinner -> fetch data -> wait for response
  // Response : 
  fetch("/network/devices", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((res) => res.json())
  .then((response) => {
    console.log(response);
    networkDevices = response;
    loadDeviceList();
  })
  .catch((err) => {
    console.log(err);
  });
}

function post_modifyDeviceInfo(data) {
  fetch("/modify-device-info", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  .then((res) => res.json())
  .then((result) => {
    console.log(result);
    //alert("Device info modified successfully");
    //get_networkDevices();
  })
  .catch((err) => {
    console.log(err);
    //alert("Error modifying device info");
  });
}

function post_modifyDeviceParam(data) {
  fetch("/modify-device-param", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  .then((res) => res.json())
  .then((result) => {
    console.log(result);
    //alert("Device param modified successfully");
    //get_networkDevices();
  })
  .catch((err) => {
    console.log(err);
    //alert("Error modifying device param");
  });
}


// ---------- INIT ----------
function initSetup() {
  // Load devices types
  const select = document.getElementById("deviceTypeSelection");

  for (var d in deviceType) {
    const opt = document.createElement("option");
    opt.value = deviceType[d];
    opt.innerHTML = deviceType[d];
    select.appendChild(opt);
  }

  // setup range
  setupRangeValue("lightIntensity");
  setupRangeValue("lightTemperature");
  setupRangeValue("dimmerIntensity");

  loadDeviceList();

  // Start thread network

  get_networkDevices()
}

initSetup();


// ---------- OLD ----------
function addDeviceInTable(deviceData) {
  const table = document.getElementById("devicesListBody");
  const newRow = table.insertRow();
  const id = newRow.insertCell();
  id.innerHTML = deviceData["id"];
  const name = newRow.insertCell();
  name.innerHTML = deviceData["name"];
  const type = newRow.insertCell();
  type.innerHTML = deviceData["type"];
  const status = newRow.insertCell();
  status.innerHTML = deviceData["status"];

  newRow.onclick = () => {
    const children = table.children;
    for (let i = 0; i < children.length; i++) {
      children[i].style.backgroundColor = "white";
    }
    newRow.style.backgroundColor = "lightblue";
    showDevicePage(deviceData);
  };

  document.getElementById("devicesList").style.display = "block";
}
function showDevicePage(deviceData) {

  switch(deviceData["type"]) {
    case deviceType.light:
      setLightData(deviceData);
      break;
    case deviceType.dimmer:
      setDimmerData(deviceData);
      break;
    case deviceType.sensor:
      setSensorData(deviceData);
      break;
  }

  openModal("controlDeviceModal");

  /*
  switch(deviceData["type"]) {
    case deviceType.light:
      openModal("lightModal")
      setLightData(deviceData);
      break;
    case deviceType.dimmer:
      openModal("dimmerModal")
      setDimmerData(deviceData);
      break;
    case deviceType.sensor:
      openModal("sensorModal")
      setSensorData(deviceData);
      break;
  }
      */

  /*
  const lightModal = document.getElementById("lightModal");
  const dimmerModal = document.getElementById("dimmerModal");
  const sensorModal = document.getElementById("sensorModal");

  if (deviceData["type"] === deviceType.light) {
    lightModal.classList.add("open");
    dimmerModal.classList.remove("open");
    sensorModal.classList.remove("open");
    setLightData(deviceData);
  } else if (deviceData["type"] === deviceType.dimmer) {
    lightModal.classList.remove("open");
    dimmerModal.classList.add("open");
    sensorModal.classList.remove("open");
    setDimmerData(deviceData);
  } else if (deviceData["type"] === deviceType.sensor) {
    lightModal.classList.remove("open");
    dimmerModal.classList.remove("open");
    sensorModal.classList.add("open");
    setSensorData(deviceData);
  }
    */
}