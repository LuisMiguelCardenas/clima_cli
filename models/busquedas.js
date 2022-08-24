const fs = require("fs");
const axios = require("axios");

class Busquedas {
  historial = [];
  dbPath = "./db/database.json";

  constructor() {
    // TODO: leer db si exite
    this.leerDB();
  }

  get historialCapitalizado() {
    return this.historial.map((lugar) => {
      let palabras = lugar.split(" ");
      // console.log(palabras)
      palabras = palabras.map(
        (palabra) => palabra[0].toUpperCase() + palabra.substring(1)
      );

      return palabras;
    });
  }
  get paramsMapbox() {
    return {
      access_token: process.env.MAPBOX_KEY,
      limit: 5,
      language: "es",
    };
  }

  get paramsWeather() {
    return {
      appid: process.env.OPENWEATHER_KEY,
      units: "metric",
      lang: "es",
    };
  }

  async ciudad(lugar = "") {
    // peticion http
    // console.log(lugar, 'ciudad')
    try {
      const intance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
        params: this.paramsMapbox,
      });

      const resp = await intance.get();

      // const resp = await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/bogota.json?proximity=ip&types=place%2Cpostcode%2Caddress&language=es&access_token=pk.eyJ1IjoibGNhcmRlbmFzbCIsImEiOiJjbDc2NDNncWEwOW9lM3FvN3hhdTJmYTN6In0.ujVBqkPlot94-1mqv24vZw&limit=5')
      return resp.data.features.map((lugar) => ({
        id: lugar.id,
        nombre: lugar.place_name,
        lng: lugar.center[0],
        lat: lugar.center[1],
      }));
    } catch (error) {
      return [];
    }
  }

  async climaLugar(lat = "", lon = "") {
    try {
      const instance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: { ...this.paramsWeather, lat, lon },
      });

      const { data } = await instance.get(); // get es el tipo de peticoon, puede ser put , delete etc
      return {
        main: data.main,
        desc: data.weather[0].description,
      };
    } catch (error) {
      console.log(error);
    }
  }

  agregaHistorial(lugar = "") {
    // Prevenir duplicados
    if (this.historial.includes(lugar.toLocaleLowerCase())) {
      return;
    }
    this.historial.unshift(lugar.toLocaleLowerCase());

    // Grabar en DB
    this.guardarDB();
  }

  guardarDB() {
    const payload = {
      historial: this.historial,
    };

    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  leerDB() {
    if (!fs.existsSync(this.dbPath)) {
      return null;
    }

    const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
    const data = JSON.parse(info);

    this.historial = data.historial;
  }
}

module.exports = Busquedas;
