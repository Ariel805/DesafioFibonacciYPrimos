function calcularAhorro() {

  var campomeses = document.getElementById("meses");
  var meses = parseInt(campomeses.value);

  var mensajeError = document.getElementById("mensajeError");

  mensajeError.classList.add("oculto");
  mensajeError.textContent = "";

  if (isNaN(meses) || meses < 1) {
    mensajeError.textContent = "⚠️ Por favor ingresa un número de meses válido (mínimo 1).";
    mensajeError.classList.remove("oculto");
    return;
  }

  if (meses > 50) {
    mensajeError.textContent = "⚠️ El máximo permitido es 50 meses para una mejor visualización.";
    mensajeError.classList.remove("oculto");
    return;
  }

  var a = 1;
  var b = 1;
  var c;

  var totalAcumulado = 0;
  var ultimoAhorro  = 0;
  var maximoMensual = 0;

  var listaMeses      = [];
  var listaAhorros    = [];
  var listaTotales    = [];

  for (var i = 1; i <= meses; i++) {

    var ahorroDeMes;

    if (i === 1) {
      ahorroDeMes = a;
    } else if (i === 2) {
      ahorroDeMes = b;
    } else {
      c = a + b;
      a = b;
      b = c;
      ahorroDeMes = c;
    }

    totalAcumulado = totalAcumulado + ahorroDeMes;

    listaMeses.push(i);
    listaAhorros.push(ahorroDeMes);
    listaTotales.push(totalAcumulado);

    if (ahorroDeMes > maximoMensual) {
      maximoMensual = ahorroDeMes;
    }

    ultimoAhorro = ahorroDeMes;
  }

  var seccionResultados = document.getElementById("resultadoSeccion");
  seccionResultados.classList.remove("oculto");

  mostrarResumen(meses, totalAcumulado, ultimoAhorro, listaMeses, listaAhorros);

  dibujarGrafico(listaMeses, listaAhorros, maximoMensual);

  construirTabla(listaMeses, listaAhorros, listaTotales, totalAcumulado);

  seccionResultados.scrollIntoView({ behavior: "smooth", block: "start" });
}

function mostrarResumen(meses, total, ultimoAhorro, listaMeses, listaAhorros) {

  var promedio = Math.round(total / meses);

  var htmlResumen = "";

  htmlResumen += '<div class="resumen-card">';
  htmlResumen += '  <span class="card-icono">📅</span>';
  htmlResumen += '  <span class="card-valor">' + meses + '</span>';
  htmlResumen += '  <span class="card-etiqueta">Meses de ahorro</span>';
  htmlResumen += '</div>';

  htmlResumen += '<div class="resumen-card">';
  htmlResumen += '  <span class="card-icono">💰</span>';
  htmlResumen += '  <span class="card-valor">Bs. ' + total.toLocaleString() + '</span>';
  htmlResumen += '  <span class="card-etiqueta">Total acumulado</span>';
  htmlResumen += '</div>';

  htmlResumen += '<div class="resumen-card">';
  htmlResumen += '  <span class="card-icono">📈</span>';
  htmlResumen += '  <span class="card-valor">Bs. ' + ultimoAhorro.toLocaleString() + '</span>';
  htmlResumen += '  <span class="card-etiqueta">Ahorro del último mes</span>';
  htmlResumen += '</div>';

  htmlResumen += '<div class="resumen-card">';
  htmlResumen += '  <span class="card-icono">📊</span>';
  htmlResumen += '  <span class="card-valor">Bs. ' + promedio.toLocaleString() + '</span>';
  htmlResumen += '  <span class="card-etiqueta">Promedio mensual</span>';
  htmlResumen += '</div>';

  document.getElementById("resumenCards").innerHTML = htmlResumen;
}

function dibujarGrafico(listaMeses, listaAhorros, maximo) {

  var htmlGrafico = "";
  var totalBarra  = listaMeses.length;

  var limiteBarras = totalBarra <= 24 ? totalBarra : 24;

  for (var i = 0; i < limiteBarras; i++) {

    var porcentaje = maximo > 0 ? Math.round((listaAhorros[i] / maximo) * 100) : 0;

    if (porcentaje < 3) porcentaje = 3;

    htmlGrafico += '<div class="barra-contenedor">';
    htmlGrafico += '  <div class="barra" style="height: ' + porcentaje + '%;" title="Mes ' + listaMeses[i] + ': Bs. ' + listaAhorros[i] + '"></div>';
    htmlGrafico += '  <span class="barra-etiqueta-mes">M' + listaMeses[i] + '</span>';
    htmlGrafico += '</div>';
  }

  if (totalBarra > limiteBarras) {
    htmlGrafico += '<div class="barra-contenedor" style="justify-content:center;color:#8a8a8f;font-size:12px;">...</div>';
  }

  document.getElementById("grafico").innerHTML = htmlGrafico;
}

function construirTabla(listaMeses, listaAhorros, listaTotales, totalFinal) {

  var htmlFilas = "";

  for (var i = 0; i < listaMeses.length; i++) {

    var porcentajeProgreso = totalFinal > 0
      ? Math.round((listaTotales[i] / totalFinal) * 100)
      : 0;

    htmlFilas += '<tr>';
    htmlFilas += '  <td><strong>Mes ' + listaMeses[i] + '</strong></td>';
    htmlFilas += '  <td>Bs. ' + listaAhorros[i].toLocaleString() + '</td>';
    htmlFilas += '  <td>Bs. ' + listaTotales[i].toLocaleString() + '</td>';
    htmlFilas += '  <td class="progreso-celda">';
    htmlFilas += '    <div class="barra-progreso">';
    htmlFilas += '      <div class="barra-progreso-fill" style="width: ' + porcentajeProgreso + '%;"></div>';
    htmlFilas += '    </div>';
    htmlFilas += '  </td>';
    htmlFilas += '</tr>';
  }

  htmlFilas += '<tr style="background: #e8f5ec;">';
  htmlFilas += '  <td colspan="2"><strong>💰 TOTAL AHORRADO</strong></td>';
  htmlFilas += '  <td><strong>Bs. ' + totalFinal.toLocaleString() + '</strong></td>';
  htmlFilas += '  <td></td>';
  htmlFilas += '</tr>';

  document.getElementById("cuerpoTabla").innerHTML = htmlFilas;
}

function limpiarResultados() {

  document.getElementById("meses").value = "";

  document.getElementById("resultadoSeccion").classList.add("oculto");

  document.getElementById("mensajeError").classList.add("oculto");
  document.getElementById("mensajeError").textContent = "";

  document.getElementById("resumenCards").innerHTML  = "";
  document.getElementById("grafico").innerHTML       = "";
  document.getElementById("cuerpoTabla").innerHTML   = "";

  document.getElementById("encabezado").scrollIntoView({ behavior: "smooth" });
}

document.getElementById("meses").addEventListener("keydown", function(evento) {
  if (evento.key === "Enter") {
    calcularAhorro();
  }
});
