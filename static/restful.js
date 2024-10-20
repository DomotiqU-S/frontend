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

let availableDevices = [
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
    status: deviceStatus.on,
    name: "Dimmer 2",

    intensity: "75",
  },
  {
    id: "ccccc",
    type: deviceType.sensor,
    status: deviceStatus.off,
    name: "Sensor 1",
    temperature: "75",
    humidity: "40",
    luminosity: "100",
    mouvement: "yes",
  },
];

const modals = ["addDeviceModal", "lightModal", "dimmerModal", "sensorModal"];

function initSetup() {
  // Load devices types
  const select = document.getElementById("deviceTypeSelection");

  for (var d in deviceType) {
    const opt = document.createElement("option");
    opt.value = deviceType[d];
    opt.innerHTML = deviceType[d];
    select.appendChild(opt);
  }

  showAvailableDevices();

  

  // setup range
  setupRangeValue("lightIntensity");
  setupRangeValue("lightTemperature");
  setupRangeValue("dimmerIntensity");
}

function showAvailableDevices() {
  // Add to table
  const table = document.getElementById("devicesContainer");

  // Clear childrens
  while (table.firstChild) {
    table.firstChild.remove()
  }

  // Load devices in device list
  availableDevices.forEach((i) => {
    const card = createAvailableDeviceCard(i);
    table.appendChild(card);
  });
}

function createAvailableDeviceCard(deviceData) {
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
    showDevicePage(deviceData);
  };

  return card;
}

function openModal(modalId) {
  // Voir si c'est un modal
  if(!modals.includes(modalId)) {
    return;
  }

  // 
  modals.forEach((id) => {
    const modal = document.getElementById(id);
    if(!modal) {
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
}

function addDevice() {
  const form = document.getElementById("addDeviceForm");
  const formData = new FormData(form);
  let data = {};
  for (let item of formData) {
    data[item[0]] = item[1];
  }
  form.reset();
  openModal("addDeviceModal");

  document.getElementById("formModalId").value = data["id"];

  // fetch("/add-device", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(data),
  // })
  //   .then((res) => res.json())
  //   .then((result) => {
  //     console.log(result);
  //     form.reset();
  //     const modal = document.getElementById("addDeviceModal");
  //     modal.style.display = "flex";
  //     document.getElementById("formModalId").value = data["id"];
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     alert("Error adding device");
  //   });
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
  
  

  addAvailableDevice(data);
  showAvailableDevices();

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

function addAvailableDevice(deviceData) {
  availableDevices.push(deviceData);
}

function deleteAvailableDevice(deviceId) {
  let index = -1;

  for (let i = 0; i < availableDevices.length; i++) {
    if(availableDevices[i].id === deviceId) {
      index = i;
    }
  }

  if (index > -1) {
    availableDevices.splice(index, 1);
  }
}











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



function showDevicePage(deviceData) {
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
    addAvailableDevice(result);
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

function setLightData(data) {
  const name = document.getElementById("lightName");
  name.innerHTML = data.name;

  setDevicePageStatus("lightStatus", data.status);
  const form = document.getElementById("lightForm");
  new FormData(form).set("id", data.id);
  const temp = document.getElementById("lightPower");
  temp.checked = data.status === deviceStatus.on;

  setRangeValue("lightIntensity", data.intensity);
  setRangeValue("lightTemperature", data.temperature);

  document.getElementById("deleteLight").onclick = () => {
    deleteAvailableDevice(data["id"]);
    showAvailableDevices();
    closeModal("lightModal");
  };
}

function setDimmerData(data) {
  const name = document.getElementById("dimmerName");
  name.innerHTML = data.name;

  setDevicePageStatus("dimmerStatus", data.status);

  setRangeValue("dimmerIntensity", data.intensity);

  document.getElementById("deleteDimmer").onclick = () => {
    deleteAvailableDevice(data["id"]);
    showAvailableDevices();
    closeModal("dimmerModal");
  };
}

function setSensorData(data) {
  const name = document.getElementById("sensorName");
  name.innerHTML = data.name;

  setDevicePageStatus("sensorStatus", data.status);

  const temperature = document.getElementById("sensorTemperature");
  temperature.innerHTML = "3000";
  const humidity = document.getElementById("sensorHumidity");
  humidity.innerHTML = "50";
  const Luminosity = document.getElementById("sensorLuminosity");
  Luminosity.innerHTML = "50";
  const mouvement = document.getElementById("sensorMouvement");
  mouvement.innerHTML = "Détecté";

  document.getElementById("deleteSensor").onclick = () => {
    deleteAvailableDevice(data["id"]);
    showAvailableDevices();
    closeModal("sensorModal");
  };
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

function setDevicePageStatus(id, value) {
  const status = document.getElementById(id);
  switch (value) {
    case deviceStatus.on:
      status.classList.add("on");
      break;
    case deviceStatus.off:
      status.classList.add("off");
      break;
    default:
      status.classList.remove("available");
  }
}

initSetup();