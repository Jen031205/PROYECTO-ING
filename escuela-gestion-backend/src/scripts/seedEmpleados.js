const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const { faker } = require("@faker-js/faker/locale/es_MX");
const Empleado = require("../models/Empleado");
const sequelize = require("../config/db");

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión con base de datos establecida.");

    const totalProfesores = 300;
    const totalRH = 5;
    const empleados = [];
    const jsonData = [];
    const correosUsados = new Set();

    function generarCorreoUnico(nombre) {
      let correo;
      do {
        const base = faker.internet
          .email({
            firstName: nombre.split(" ")[0],
            lastName: nombre.split(" ")[1] || "",
          })
          .toLowerCase()
          .replace(/[^a-z0-9@.]/g, ""); 
        correo = base.includes("@") ? base : `${base}@correo.com`;
      } while (correosUsados.has(correo));
      correosUsados.add(correo);
      return correo;
    }

    async function crearEmpleado(nombre, rol, departamento) {
      const correo = generarCorreoUnico(nombre);
      const password = faker.internet.password({ length: 10, memorable: true });
      const hash = await bcrypt.hash(password, 10);

      const empleado = await Empleado.create({
        nombre,
        correo,
        password: hash,
        rol,
        departamento,
      });

      jsonData.push({ nombre, correo, password, rol });
      empleados.push(empleado);
    }

    // * Profesores
    for (let i = 0; i < totalProfesores; i++) {
      const nombre = faker.person.fullName();
      await crearEmpleado(nombre, "profesor", faker.commerce.department());
    }

    // * Recursos Humanos
    for (let i = 0; i < totalRH; i++) {
      const nombre = faker.person.fullName();
      await crearEmpleado(nombre, "rh", "Recursos Humanos");
    }

    // * Guardar JSON
    const outputPath = path.join(__dirname, "empleados.json");
    fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2));
    console.log(
      `Se insertaron ${empleados.length} empleados (${totalProfesores} profesores + ${totalRH} RH)`
    );
    console.log(`Archivo generado: ${outputPath}`);

    process.exit(0);
  } catch (error) {
    console.error("Error al ejecutar el script:", error);
    process.exit(1);
  }
})();
