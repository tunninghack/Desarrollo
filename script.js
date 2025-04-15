
const form = document.getElementById('formulario');

let datos = JSON.parse(localStorage.getItem('respuestas')) || [];

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(form);
  const nuevaEntrada = {
    nombre: formData.get('nombre'),
    cargo: formData.get('cargo'),
    actividad: formData.get('actividad'),
    edad: parseInt(formData.get('edad'))
  };

  datos.push(nuevaEntrada);
  localStorage.setItem('respuestas', JSON.stringify(datos));
  form.reset();
  renderGraficas();
});

function contarPorCampo(campo) {
  return datos.reduce((acc, item) => {
    acc[item[campo]] = (acc[item[campo]] || 0) + 1;
    return acc;
  }, {});
}

function contarEdadesPorRango() {
  const rangos = {
    "18-25": 0,
    "26-35": 0,
    "36-45": 0,
    "46-60": 0,
    "60+": 0
  };
  datos.forEach(({ edad }) => {
    if (edad <= 25) rangos["18-25"]++;
    else if (edad <= 35) rangos["26-35"]++;
    else if (edad <= 45) rangos["36-45"]++;
    else if (edad <= 60) rangos["46-60"]++;
    else rangos["60+"]++;
  });
  return rangos;
}

function renderGraficas() {
  const ctxCargo = document.getElementById('graficoCargo').getContext('2d');
  const ctxActividad = document.getElementById('graficoActividad').getContext('2d');
  const ctxEdad = document.getElementById('graficoEdad').getContext('2d');

  const cargoData = contarPorCampo('cargo');
  const actividadData = contarPorCampo('actividad');
  const edadData = contarEdadesPorRango();

  if (window.cargoChart) window.cargoChart.destroy();
  if (window.actividadChart) window.actividadChart.destroy();
  if (window.edadChart) window.edadChart.destroy();

  window.cargoChart = new Chart(ctxCargo, {
    type: 'bar',
    data: {
      labels: Object.keys(cargoData),
      datasets: [{
        label: 'Cargos',
        data: Object.values(cargoData),
        backgroundColor: '#60a5fa'
      }]
    }
  });

  window.actividadChart = new Chart(ctxActividad, {
    type: 'bar',
    data: {
      labels: Object.keys(actividadData),
      datasets: [{
        label: 'Tipos de Actividad',
        data: Object.values(actividadData),
        backgroundColor: '#34d399'
      }]
    }
  });

  window.edadChart = new Chart(ctxEdad, {
    type: 'bar',
    data: {
      labels: Object.keys(edadData),
      datasets: [{
        label: 'Edad (por rangos)',
        data: Object.values(edadData),
        backgroundColor: '#fbbf24'
      }]
    }
  });
}

renderGraficas();
