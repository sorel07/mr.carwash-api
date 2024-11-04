const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());

const dataPath = path.join(__dirname, "db", "data.json");

// Función para leer los datos
const readData = () => {
  try {
    const data = fs.readFileSync(dataPath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error leyendo data.json:", err);
    return {};
  }
};

// Función para escribir datos
const writeData = (data) => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error escribiendo data.json:", err);
  }
};

// Obtener todos los clientes
app.get("/api/clientes", (req, res) => {
  const data = readData();
  res.json(data.Clientes);
});

// Obtener un cliente por Cedula
app.get("/api/clientes/:cedula", (req, res) => {
  const data = readData();
  const cedula = parseInt(req.params.cedula);
  const cliente = data.Clientes.find((c) => c.Cedula === cedula);
  if (cliente) {
    res.json(cliente);
  } else {
    res.status(404).json({ message: "Cliente no encontrado" });
  }
});

// Crear un nuevo cliente
app.post("/api/clientes", (req, res) => {
  const data = readData();
  const nuevoCliente = req.body;

  // Verificar si el cliente ya existe
  const exists = data.Clientes.some((c) => c.Cedula === nuevoCliente.Cedula);
  if (exists) {
    return res.status(400).json({ message: "Cliente ya existe" });
  }

  data.Clientes.push(nuevoCliente);
  writeData(data);
  res.status(201).json(nuevoCliente);
});

// Actualizar un cliente por Cedula
app.put("/api/clientes/:cedula", (req, res) => {
  const data = readData();
  const cedula = parseInt(req.params.cedula);
  const index = data.Clientes.findIndex((c) => c.Cedula === cedula);

  if (index !== -1) {
    data.Clientes[index] = { ...data.Clientes[index], ...req.body };
    writeData(data);
    res.json(data.Clientes[index]);
  } else {
    res.status(404).json({ message: "Cliente no encontrado" });
  }
});

// Eliminar un cliente por Cedula
app.delete("/api/clientes/:cedula", (req, res) => {
  const data = readData();
  const cedula = parseInt(req.params.cedula);
  const index = data.Clientes.findIndex((c) => c.Cedula === cedula);

  if (index !== -1) {
    const eliminado = data.Clientes.splice(index, 1);
    writeData(data);
    res.json(eliminado[0]);
  } else {
    res.status(404).json({ message: "Cliente no encontrado" });
  }
});

// Obtener todos los vehiculos
app.get("/api/vehiculos", (req, res) => {
  const data = readData();
  res.json(data.Vehiculo);
});

// Obtener un vehiculo por Placa
app.get("/api/vehiculos/:placa", (req, res) => {
  const data = readData();
  const placa = parseInt(req.params.placa);
  const vehiculo = data.Vehiculo.find((v) => v.Placa === placa);
  if (vehiculo) {
    res.json(vehiculo);
  } else {
    res.status(404).json({ message: "Vehiculo no encontrado" });
  }
});

// Crear un nuevo vehiculo
app.post("/api/vehiculos", (req, res) => {
  const data = readData();
  const nuevoVehiculo = req.body;

  // Verificar si el vehiculo ya existe
  const exists = data.Vehiculo.some((v) => v.Placa === nuevoVehiculo.Placa);
  if (exists) {
    return res.status(400).json({ message: "Vehiculo ya existe" });
  }

  data.Vehiculo.push(nuevoVehiculo);
  writeData(data);
  res.status(201).json(nuevoVehiculo);
});

// Actualizar un vehiculo por Placa
app.put("/api/vehiculos/:placa", (req, res) => {
  const data = readData();
  const placa = parseInt(req.params.placa);
  const index = data.Vehiculo.findIndex((v) => v.Placa === placa);

  if (index !== -1) {
    data.Vehiculo[index] = { ...data.Vehiculo[index], ...req.body };
    writeData(data);
    res.json(data.Vehiculo[index]);
  } else {
    res.status(404).json({ message: "Vehiculo no encontrado" });
  }
});

// Eliminar un vehiculo por Placa
app.delete("/api/vehiculos/:placa", (req, res) => {
  const data = readData();
  const placa = parseInt(req.params.placa);
  const index = data.Vehiculo.findIndex((v) => v.Placa === placa);

  if (index !== -1) {
    const eliminado = data.Vehiculo.splice(index, 1);
    writeData(data);
    res.json(eliminado[0]);
  } else {
    res.status(404).json({ message: "Vehiculo no encontrado" });
  }
});

// Obtener todas las tarifas de parking
app.get("/api/tarifas-parking", (req, res) => {
  const data = readData();
  res.json(data.Tarifas_Parking);
});

// Obtener una tarifa por ID
app.get("/api/tarifas-parking/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const tarifa = data.Tarifas_Parking.find((t) => t.id === id);
  if (tarifa) {
    res.json(tarifa);
  } else {
    res.status(404).json({ message: "Tarifa no encontrada" });
  }
});

// Crear una nueva tarifa de parking
app.post("/api/tarifas-parking", (req, res) => {
  const data = readData();
  const nuevaTarifa = req.body;

  // Generar un nuevo ID
  const nuevoId =
    data.Tarifas_Parking.length > 0
      ? Math.max(...data.Tarifas_Parking.map((t) => t.id)) + 1
      : 1;
  nuevaTarifa.id = nuevoId;

  data.Tarifas_Parking.push(nuevaTarifa);
  writeData(data);
  res.status(201).json(nuevaTarifa);
});

// Actualizar una tarifa por ID
app.put("/api/tarifas-parking/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const index = data.Tarifas_Parking.findIndex((t) => t.id === id);

  if (index !== -1) {
    data.Tarifas_Parking[index] = {
      ...data.Tarifas_Parking[index],
      ...req.body
    };
    writeData(data);
    res.json(data.Tarifas_Parking[index]);
  } else {
    res.status(404).json({ message: "Tarifa no encontrada" });
  }
});

// Eliminar una tarifa por ID
app.delete("/api/tarifas-parking/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const index = data.Tarifas_Parking.findIndex((t) => t.id === id);

  if (index !== -1) {
    const eliminado = data.Tarifas_Parking.splice(index, 1);
    writeData(data);
    res.json(eliminado[0]);
  } else {
    res.status(404).json({ message: "Tarifa no encontrada" });
  }
});

// Obtener todos los servicios de Car Wash
app.get("/api/car-wash", (req, res) => {
  const data = readData();
  res.json(data.Car_Wash);
});

// Obtener un servicio de Car Wash por ID
app.get("/api/car-wash/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const servicio = data.Car_Wash.find((cw) => cw.id === id);
  if (servicio) {
    res.json(servicio);
  } else {
    res.status(404).json({ message: "Servicio no encontrado" });
  }
});

// Crear un nuevo servicio de Car Wash
app.post("/api/car-wash", (req, res) => {
  const data = readData();
  const nuevoServicio = req.body;

  // Generar un nuevo ID
  const nuevoId =
    data.Car_Wash.length > 0
      ? Math.max(...data.Car_Wash.map((cw) => cw.id)) + 1
      : 1;
  nuevoServicio.id = nuevoId;

  data.Car_Wash.push(nuevoServicio);
  writeData(data);
  res.status(201).json(nuevoServicio);
});

// Actualizar un servicio de Car Wash por ID
app.put("/api/car-wash/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const index = data.Car_Wash.findIndex((cw) => cw.id === id);

  if (index !== -1) {
    data.Car_Wash[index] = { ...data.Car_Wash[index], ...req.body };
    writeData(data);
    res.json(data.Car_Wash[index]);
  } else {
    res.status(404).json({ message: "Servicio no encontrado" });
  }
});

// Eliminar un servicio de Car Wash por ID
app.delete("/api/car-wash/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const index = data.Car_Wash.findIndex((cw) => cw.id === id);

  if (index !== -1) {
    const eliminado = data.Car_Wash.splice(index, 1);
    writeData(data);
    res.json(eliminado[0]);
  } else {
    res.status(404).json({ message: "Servicio no encontrado" });
  }
});

app.get("/", (req, res) => {
  res.send("API de Mr CarWash & Parking");
});

app.listen(3000, () => {
  console.log("Server on port 3000");
});
