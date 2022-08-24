const inquirer = require('inquirer');


require('colors');


const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Qué desea hacer?',
        choices: [
            {
                value: 1,
                name:`${'1.'.blue} Buscar ciudad`
            },
            {
                value: 2,
                name:`${'2.'.blue} Historial`
            },
            {
                value: 0,
                name:`${'0.'.blue} Salir`
            },
        ]
    }
]


const inquirerMenu = async() => {

    console.clear();
    console.log('========================'.green)
    console.log(' Seleccione una opción '.white)
    console.log('========================\n'.green)

    const { opcion } = await inquirer.prompt(preguntas);
    return opcion
};

const pausa = async() => {

    console.log('\n')
    await inquirer.prompt([
        {
            type: 'input',
            message:`Presione ${'ENTER'.green} para continuar`,
            name: 'pausa'
        }
    ]) 
};

const leerInput = async( mensaje) => {

    const quiestion = [
        {
            type: 'input',
            name: 'desc',
            message: mensaje,
            validate( value ) {
                if( value.length === 0 ) {
                    return 'Por favor ingrese un valor'
                }
                return true
            }
        }
    ]
    const { desc } = await inquirer.prompt(quiestion);
    return desc
}

const listarLugares = async( lugares = [] ) => {

        const choices = lugares.map( (lugar, index) => {

            const idx = `${index + 1}.`.green

            return {
                value: lugar.id,
                name: `${idx} ${lugar.nombre}`
            }
        });

    
        choices.unshift({
            value: '0',
            name: '0.'.green + ' Cancelar'
        })
        const preguntas = [
            {
                type: 'list',
                name: 'id',
                message: 'Seleccione el lugar:',
                choices: choices
            }
        ]


        const { id } = await inquirer.prompt(preguntas);
        return id
}

const mostrarLisadoChecklist = async( tareas = [] ) => {

    const choices = tareas.map( (tarea, index) => {

        const idx = `${index + 1}.`.green

        return {
            value: tarea.id,
            name: `${idx} ${tarea.desc}`,
            checked: ( tarea.completadoEn ) ? true : false
        }
    });

    const preguntas = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Selecciones',
            choices: choices
        }
    ]


    const { ids } = await inquirer.prompt(preguntas);
    return ids
}

const confirmar = async (msj) => {

    const question = [
        {
            type:'confirm',
            name: 'ok',
            message: msj
        }
    ]

    const { ok } = await inquirer.prompt(question);
    return ok;
}


module.exports = {

    inquirerMenu,
    pausa,
    leerInput,
    listarLugares,
    confirmar,
    mostrarLisadoChecklist
}