const deviceType = {
  light: "Ampoule",
  dimmer: "Gradateur",
  sensor: "Capteur d'environnement",
};

const deviceStatus = {
  on: "On",
  off: "Off",
  unavailable: "Unavailable",
};

const mockData = [
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

function initSetup() {
  // Load devices types
  const select = document.getElementById("deviceTypeSelection");

  for (var d in deviceType) {
    const opt = document.createElement("option");
    opt.value = deviceType[d];
    opt.innerHTML = deviceType[d];
    select.appendChild(opt);
  }

  // Load devices in device list
  mockData.forEach((i) => {
    addDeviceInTable(i);
    addAvailableDevice(i);
  });

  // setup range
  setupRangeValue("lightIntensity");
  setupRangeValue("lightTemperature");
  setupRangeValue("dimmerIntensity");
}

initSetup();

function cancelAdd() {
  const modal = document.getElementById("deviceModal");
  modal.style.display = "none";
}

function addDevice() {
  const form = document.getElementById("addDevice");
  const formData = new FormData(form);
  let data = {};
  for (let item of formData) {
    data[item[0]] = item[1];
  }
  form.reset();
  const modal = document.getElementById("deviceModal");
  modal.style.display = "flex";
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
  //     const modal = document.getElementById("deviceModal");
  //     modal.style.display = "flex";
  //     document.getElementById("formModalId").value = data["id"];
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     alert("Error adding device");
  //   });
}

function createDevice() {
  const modal = document.getElementById("deviceModal");
  const form = modal.getElementsByTagName("form")[0];
  const formData = new FormData(form);
  let data = {};
  for (let item of formData) {
    data[item[0]] = item[1];
  }
  data["id"] = document.getElementById("formModalId").value;
  data["status"] = "Actif";
  modal.style.display = "none";
  form.reset();
  addDeviceInTable(data);
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
  const {id, name, type, status} = deviceData;

  // Create the card
  const card = document.createElement("button");
  card.classList.add("deviceCard")

  // Device status
  if(status === deviceStatus.unavailable) {
    card.setAttribute("disabled", true);
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
  nameField.innerHTML = "Name : " + name;
  dataContainer.appendChild(nameField);

  card.appendChild(dataContainer);
  
  card.onclick = () => {
    const childrens = table.children;
    for (let i = 0; i < childrens.length; i++) {
      childrens[i].classList.remove("selected");
    }

    card.classList.add("selected");
    showDevicePage(deviceData);
  };

  // Add to table
  const table = document.getElementById("devicesContainer");
  table.appendChild(card);
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
  console.log(deviceData);
  const lightPage = document.getElementById("lightControlPage");
  const dimmerPage = document.getElementById("dimmerControlPage");
  const sensorPage = document.getElementById("sensorControlPage");
  if (deviceData["type"] === deviceType.light) {
    lightPage.style.display = "block";
    dimmerPage.style.display = "none";
    sensorPage.style.display = "none";
    setLightData(deviceData);
  } else if (deviceData["type"] === deviceType.dimmer) {
    lightPage.style.display = "none";
    dimmerPage.style.display = "block";
    sensorPage.style.display = "none";
    setDimmerData(deviceData);
  } else if (deviceData["type"] === deviceType.sensor) {
    lightPage.style.display = "none";
    dimmerPage.style.display = "none";
    sensorPage.style.display = "block";
    setSensorData(deviceData);
  }
}

//Remove devices table if no devices are present
document.addEventListener("DOMContentLoaded", () => {
  // fetch("/get-devices", {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // })
  //   .then((res) => res.json())
  //   .then((result) => {
  //     console.log(result);
  //     addDeviceInTable(result);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     alert("Error adding device");
  //   });
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
}

function setDimmerData(data) {
  const name = document.getElementById("dimmerName");
  name.innerHTML = data.name;

  setDevicePageStatus("dimmerStatus", data.status);

  setRangeValue("dimmerIntensity", data.intensity);
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
    case deviceStatus.off:
      status.classList.add("available");
      break;
    default:
      status.classList.remove("available");
  }
}

