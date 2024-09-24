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
  document.getElementById("devicesList").style.display = "table";
}
//Remove devices table if no devices are present
document.addEventListener("DOMContentLoaded", () => {
  const tds = document.getElementById("devicesList").getElementsByTagName("td");
  if (tds.length === 0) {
    document.getElementById("devicesList").style.display = "none";
  }
});
