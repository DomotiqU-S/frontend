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
  for (const value of Object.values(deviceData)) {
    const cell = newRow.insertCell();
    cell.innerHTML = value;
  }
  newRow.onclick = () => showDevicePage(deviceData);
  document.getElementById("devicesList").style.display = "block";
}

function showDevicePage(deviceData) {
  alert("showing device page");
  // document.getElementById(deviceData["id"]).style.display = "block";
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


function setLightData() {
  const name = page.getElementById("lightName");
  name.innerHTML = "test light name";

  const status = document.getElementById("lightStatus")
  status.style = "background: red;"

  const intensity = document.getElementById("lightIntensity");

  const temperature = document.getElementById("lightTemperature");
}

function setDimmerData() {
  const name = document.getElementById("dimmerName");
  name.innerHTML = "test dimmer name";

  const status = document.getElementById("dimmerStatus")
  status.style = "background: red;"

  const intensity = document.getElementById("dimmerIntensity");
}

function setSensorData() {
  const name = document.getElementById("sensorName");
  name.innerHTML = "test sensor name";

  const status = document.getElementById("sensorStatus")
  status.style = "background: red;"

  const temperature = document.getElementById("sensorTemperature");
  const humidity = document.getElementById("sensorHumidity");
  const Luminosity = document.getElementById("sensorLuminosity");
  const mouvement = document.getElementById("sensorMouvement");
}

setLightData();
setDimmerData();
setSensorData();