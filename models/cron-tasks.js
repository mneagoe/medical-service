const schedule = require('node-schedule');
const fichas = require('./fichas');
const emails = require('./emails');
const moment = require('moment');

let cronTasks = {};

/*
  EJEMPLO: ('0,30 9-20 * * 1-5')
  0,30: se ejecuta en el minuto 0 y el minuto 30.
  9-20: se ejecuta entre las 9hs y las 20hs.
  1-5: se ejecuta de lunes a viernes.
*/
// Se ejecuta cada 30 segundos.
const cronTest = '*/30 * * * * *'; 
// Se ejecuta en el minuto 0 de la hora 9, de lunes a viernes.
const cron = '0 9 * * 1-5';

cronTasks.reporteNovedades = schedule.scheduleJob(cron, function(fireDate) {
	// me traigo las fichas de ficha_covid19
	fichas.getAllFichasCovid19(data => {
		if (!data.success || !data.fichas.length) {
			console.log(`${data.message}`);
			return;
		}

		let fichasCovid = data.fichas;

		// me traigo las fichas de shadow_ficha_covid19
		fichas.getAllShadowFichasCovid19(data => {
			if (!data.success) {
				console.log(`${data.message}`);
				return;
			}

			let shadowFichas = data.fichas;
			// Si shadowFichas es un array vacio entonces cargo la tabla shadow_ficha_covid19
			// por primera vez con las fichas de covid19.
			if (!shadowFichas.length) {
				fichas.cargarTablaShadowFichasCovid19(fichasCovid);
				return;
			}

			let reporte = [];

			shadowFichas.map(shadow => {
				let ficha = fichasCovid.filter(ficha => ficha.dni === shadow.dni).reduce((a, b) => b, {});
				// Es necesario parsear las fechas para que tengan el mismo formato, de lo
				// contrario, siempre van a dar que son diferentes por mas que no lo sean.
				const fichaFechaRetorno = moment(ficha.fecha_de_retorno).format('DD/MM/YYYY');
				const shadowFechaRetorno = moment(shadow.fecha_de_retorno).format('DD/MM/YYYY');

				const newFactor = shadow.factor_de_riesgo !== ficha.factor_de_riesgo ? ficha.factor_de_riesgo : false;
				const newCuarentena = shadow.cuarentena_por_viaje !== ficha.cuarentena_por_viaje ? ficha.cuarentena_por_viaje : false;
				const newFecha = shadowFechaRetorno !== fichaFechaRetorno ? fichaFechaRetorno : false;
				const newGrupo = shadow.grupo_covid !== ficha.grupo_covid ? ficha.grupo_covid : false;

				if (newFactor || newCuarentena || newFecha || newGrupo) {
					let obj = {
						dni: ficha.dni,
						nombre: ficha.nombre,
						apellido: ficha.apellido,
						telefono: ficha.telefono,
					}

					if (newFactor) {
						obj.newFactor = newFactor;
						obj.oldFactor = shadow.factor_de_riesgo;
					}

					if (newCuarentena) {
						obj.newCuarentena = newCuarentena;
						obj.oldCuarentena = shadow.cuarentena_por_viaje;
					}

					if (newFecha) {
						obj.newFecha = newFecha;
						obj.oldFecha = shadowFechaRetorno;						
					}

					if (newGrupo) {
						obj.newGrupo = newGrupo;
						obj.oldGrupo = shadow.grupo_covid;
					}
					
					reporte.push(obj);
				}
			})
			// El mail se envia solamente si hay algo que reportar.
			if (reporte.length) {
				emails.sendReporteNovedadesFichasCovid(reporte, function(result) {
					console.log(result);
					// Vuelvo a cargar la tabla shadow_ficha_covid19 para que quede actualizada.
					fichas.cargarTablaShadowFichasCovid19(fichasCovid);
				});
				
			} else {
				// Vuelvo a cargar la tabla shadow_ficha_covid19, porque, si bien no hubieron
				// actualizaciones, sí puedieron haberse cargado fichas nuevas.
				fichas.cargarTablaShadowFichasCovid19(fichasCovid);
			}

		}); // getAllShadowFichasCovid19

	}); // getAllFichasCovid19
});


module.exports = cronTasks;