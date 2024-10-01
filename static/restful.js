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

function showDevicePage(deviceData) {
  console.log(deviceData);
  const lightPage = document.getElementById("lightControlPage");
  const dimmerPage = document.getElementById("dimmerControlPage");
  const sensorPage = document.getElementById("sensorControlPage");
  if (deviceData["type"] === "Ampoule") {
    lightPage.style.display = "block";
    dimmerPage.style.display = "none";
    sensorPage.style.display = "none";
    setLightData(deviceData);
  } else if (deviceData["type"] === "Gradateur") {
    lightPage.style.display = "none";
    dimmerPage.style.display = "block";
    sensorPage.style.display = "none";
    setDimmerData(deviceData);
  } else if (deviceData["type"] === "Capteur d'environnement") {
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

  const status = document.getElementById("lightStatus");
  if (data.status === "Inactif") {
    status.classList.add("off");
  }
  if (data.status === "Non disponible") {
    status.classList.add("unavailable");
  }

  const intensity = document.getElementById("lightIntensity");
  intensity.value = data.intensity;

  const temperature = document.getElementById("lightTemperature");
  temperature.value = data.temperature;
  const power = document.getElementById("lightPower");
}

function setDimmerData(data) {
  const name = document.getElementById("dimmerName");
  name.innerHTML = "test dimmer name";

  const status = document.getElementById("dimmerStatus");
  if (data.status === "Inactif") {
    status.classList.add("off");
  }
  if (data.status === "Non disponible") {
    status.classList.add("unavailable");
  }

  const intensity = document.getElementById("dimmerIntensity");
  intensity.value = "75";
}

function setSensorData(data) {
  const name = document.getElementById("sensorName");
  name.innerHTML = "test sensor name";

  const status = document.getElementById("sensorStatus");
  if (data.status === "Inactif") {
    status.classList.add("off");
  }
  if (data.status === "Non disponible") {
    status.classList.add("unavailable");
  }

  const temperature = document.getElementById("sensorTemperature");
  temperature.innerHTML = "3000";
  const humidity = document.getElementById("sensorHumidity");
  humidity.innerHTML = "50";
  const Luminosity = document.getElementById("sensorLuminosity");
  Luminosity.innerHTML = "50";
  const mouvement = document.getElementById("sensorMouvement");
  mouvement.innerHTML = "Détecté";
}

function updateRangeValue(id) {
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
updateRangeValue("lightIntensity");
updateRangeValue("lightTemperature");
updateRangeValue("dimmerIntensity");
