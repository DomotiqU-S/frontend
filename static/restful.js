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

let networkDevices = [];

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

  // Remove the other fields

  const wifiFields = document.getElementById("wifiConnectionFields");
  const wifiFields2 = document.getElementById("wifiConnectionFields2");
  const threadFields = document.getElementById("threadConnectionFields");
  const button = document.getElementById("addFormSubmitButton");
  button.disabled = true;

  if(wifiFields.childElementCount > 1) wifiFields.removeChild(wifiFields.lastChild);
  if(wifiFields2.childElementCount > 1) wifiFields2.removeChild(wifiFields2.lastChild);
  if(threadFields.childElementCount > 1) threadFields.removeChild(threadFields.lastChild);

  if(!wifiFields.classList.contains("hidden")) wifiFields.classList.add("hidden");
  if(!wifiFields2.classList.contains("hidden")) wifiFields2.classList.add("hidden");
  if(!threadFields.classList.contains("hidden")) threadFields.classList.add("hidden");

  post_searchDevice({
    id: data["id"],
    password: data["password"],
    connectionType: data["connectionType"],
    wifi_ssid: data["wifi_ssid"],
    wifi_pwd: data["wifi_pwd"],
    thread_tlvs: data["thread_tlvs"],
  })

  // If device has been found
  openModal("addDeviceModal");

  document.getElementById("formModalId").value = data["id"];
}

function setConnectionType() {
  const button = document.getElementById("addFormSubmitButton");
  button.disabled = false;



  const form = document.getElementById("addDeviceForm");
  const formData = new FormData(form);
  let data = {};
  for (let item of formData) {
    data[item[0]] = item[1];
  }

  const wifiFields = document.getElementById("wifiConnectionFields");
  const wifiFields2 = document.getElementById("wifiConnectionFields2");
  const threadFields = document.getElementById("threadConnectionFields");

  if(data["connectionType"] === "wifi") {
    threadFields.classList.add("hidden");

    if(threadFields.childElementCount > 1) {
      threadFields.removeChild(threadFields.lastChild);
    }

    let temp = document.createElement("input");
    temp.name = "wifi_ssid";
    temp.type = "text";
    temp.classList.add("control");
    temp.required = true;
    wifiFields.appendChild(temp);

    temp = document.createElement("input");
    temp.name = "wifi_pwd";
    temp.type = "text";
    temp.classList.add("control");
    temp.required = true;
    wifiFields2.appendChild(temp);

    wifiFields.classList.remove("hidden");
    wifiFields2.classList.remove("hidden");
  }
  else if (data["connectionType"] === "thread") {
    wifiFields.classList.add("hidden");
    wifiFields2.classList.add("hidden");

    if(wifiFields.childElementCount > 1) {
      wifiFields.removeChild(wifiFields.lastChild);
    }

    if(wifiFields2.childElementCount > 1) {
      wifiFields2.removeChild(wifiFields2.lastChild);
    }

    let temp = document.createElement("input");
    temp.name = "thread_tlvs";
    temp.type = "text";
    temp.classList.add("control");
    temp.required = true;
    threadFields.appendChild(temp);

    threadFields.classList.remove("hidden");
  }
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

function setDeviceType() {

  const temp = document.getElementById("addDeviceAddButton");
  temp.disabled = false;
  
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
  
  post_addDevice({
    id: data["id"],
    name: data["name"],
    type: data["type"],
  });

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
    oldValue: selectedDeviceData["name"],
    newValue: data["deviceNameField"]
  })

  mockModifyData("name", data["deviceNameField"]);
  toggleEditDevice();
}

function deleteDevice() {
  // Backend request
  post_removeDevice({
    id: selectedDeviceData["id"]
  })

  mockDeleteDevice(selectedDeviceData["id"]);
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

function subscribeDevice() {
  post_subscribeDevice({
    id: selectedDeviceData["id"],
    type: selectedDeviceData["type"],
  });
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
  networkDevices.forEach((value, index) => {
    const card = createDeviceCard(value);
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
  const deviceName = document.createElement("h4");
  deviceName.innerHTML = type;

  const statusIcon = document.createElement("div");
  statusIcon.classList.add("statusIcon");

  if(status === deviceStatus.on) {
    statusIcon.classList.add("on")
  } else if (status === deviceStatus.off) {
    statusIcon.classList.add("off")
  }

  header.appendChild(deviceName);
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
  const title = document.getElementById("controlPageTitle");
  const statusIcon = document.getElementById("controlPageStatus");

  switch(type) {
    case deviceType.light:
      title.innerHTML = "Ampoule";
      break;

    case deviceType.dimmer:
      title.innerHTML = "Gradateur";
      break;

    case deviceType.sensor:
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

function mockDeleteDevice(id) {
  let index = -1;

  for (let i = 0; i < networkDevices.length; i++) {

    if(networkDevices[i]["id"] === id) {
      index = i;
      break;
    }
  }

  if (index >= 0) {
    networkDevices.splice(index, 1);
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
function get_devices() {
  // Request : start spinner -> fetch data -> wait for response
  // Response : 
  fetch("/network/devices", {
    method: "GET",
    headers: {
      "Content-Type": "text/plain",
    },
  })
  .then((response) => {
    console.log("get_devices : ");
    console.log(response);

    const reader = response.body.getReader();
    const textDecoder = new TextDecoder("utf-8");
    let result = '';

    async function read() {
      const { done, value } = await reader.read();
      if (done) {
        return result;
      }
      result += textDecoder.decode(value, { stream: true });;
      return read();
    }
    return read();
  })
  .then((response) => {
    let lines = response.split("\n");
    let result = [];

    lines.forEach((value, index) => {
      try {
        result.push(JSON.parse(value));
      } catch (e) {

      }
    });

    return result;
  })
  .then((response) => {
    networkDevices = response;
    loadDeviceList();
  })
  .catch((err) => {
    console.error(err);
  });
}

function post_searchDevice(data) {
  console.log(data);
  fetch("/network/search-device", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  .then((res) => res.json())
  .then((response) => {
    console.log(response);
  })
  .catch((err) => {
    console.error(err);
  });


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

function post_addDevice(data) {
  fetch("/network/add-device", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  .then((res) => res.json())
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.error(err);
  });
}

function post_removeDevice(data) {
  fetch("/network/remove-device", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  .then((res) => res.json())
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.error(err);
  });
}

function post_modifyDeviceInfo(data) {
  fetch("/network/modify-device-info", {
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
    //get_devices();
  })
  .catch((err) => {
    console.error(err);
    //alert("Error modifying device info");
  });
}

function post_modifyDeviceParam(data) {
  fetch("/network/modify-device-param", {
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
    //get_devices();
  })
  .catch((err) => {
    console.error(err);
    //alert("Error modifying device param");
  });
}

function post_subscribeDevice(data) {
  fetch("/network/subscribe-device", {
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
    //get_devices();
  })
  .catch((err) => {
    console.error(err);
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

  //get_devices()
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