require('dotenv').config()

const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");



const main = async () => {

  const busquedas = new Busquedas();
  let opt;

  do {
    opt = await inquirerMenu();
    
    switch (opt) {
      case 1:
          // Mostrar mensaje
          const termino = await leerInput('Ciudad:');

          // Buscar los lugares
          const lugares = await busquedas.ciudad( termino );

          // Seleccionar el lugar
          const idSeleccionado = await listarLugares(lugares);
          if( idSeleccionado === '0') continue;

          
          const lugarSel = lugares.find( lugar => lugar.id === idSeleccionado )
          
          //Guardar el DB
          busquedas.agregaHistorial( lugarSel.nombre );

          // Datos del clima
          const clima = await busquedas.climaLugar(lugarSel.lat,lugarSel.lng )
      
          // Mostar resultados

          console.log('\nInformacion de la ciudad\n'.green)
          console.log('Ciudad:', lugarSel.nombre.green );
          console.log('Lat:', lugarSel.lat)
          console.log('Lng:', lugarSel.lng )
          console.log('Condición:', clima.desc.green)
          console.log('Temperatura:', clima.main.temp );
          console.log('Minima:', clima.main.temp_min );
          console.log('Máxima', clima.main.temp_max );

        break;
    
        case 2:
            busquedas.historialCapitalizado.forEach( (lugar, i) => {
              const idx = `${ i+1}.`.green;
              console.log( `${idx}.${lugar}`)
            })


        break;
    }

    if (opt !== 0) await pausa();
  } while (opt !== 0);
};

main();
