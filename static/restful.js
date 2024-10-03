const deviceType = {
  light: "Ampoule",
  dimmer: "Gradateur",
  sensor: "Capteur d'environnement"
};

const deviceStatus = {
  on: "On",
  off: "Off",
  unavailable: "Unavailable"
}

const mockData = [
  {
    id: "aaaaa",
    type: deviceType.light,
    status: deviceStatus.on,
    name: "Light 1",
    intensity: "75",
    temperature: "3000"
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
    mouvement: "yes"
  }
]

function initSetup() {
  // Load devices types
  const select = document.getElementById("deviceTypeSelection");

  for (var d in deviceType) {
    const opt = document.createElement('option');
    opt.value = deviceType[d];
    opt.innerHTML = deviceType[d];
    select.appendChild(opt);
  }

  // Load devices in device list
  mockData.forEach((i) => {
    addDeviceInTable(i);
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
  console.log(deviceData);



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

function changeValue(e) {
  console.log("checked");
}

function setLightData(data) {
  const name = document.getElementById("lightName");
  name.innerHTML = data.name;

  setDevicePageStatus("lightStatus", data.status)

  const temp = document.getElementById("lightPower");
  temp.value = false;

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
  range.dispatchEvent(new Event('input'));
}

function setDevicePageStatus(id, value) {
  const status = document.getElementById(id);

  switch(value) {
    case deviceStatus.on:
      status.classList.add("on");
      break;
    case deviceStatus.off:
      status.classList.add("off");
      break;
    default:
      status.classList.add("unavailable");
  }
}

