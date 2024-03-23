/*

    Acciones:
      Cambiar tipo selección
      Selección (click)
      Actualizar ruta nodo
      Mover selección con keyDown
      printSeleccion (Casilla, Fila, Columna, enMovimiento)
        Depende de tipo selección
      checkPrintEsValido
      LimpiarSeleccion

      Árbol HTML:
                      body
              tablero         top-container
        linea linea linea     ...  ... 
      cas cas cas cas cas cas


*/

const anchoTablero = 8;
const altoTablero = 8;

const validSelectionModes = ["individual", "row", "column"];
let selectionMode;

window.onload = () => {
  // cambio modo de seleccion
  document
    .getElementById("modoCasilla")
    .addEventListener("change", () => changeSelectionMode("individual"));

  document
    .getElementById("modoFila")
    .addEventListener("change", () => changeSelectionMode("row"));

  document
    .getElementById("modoCol")
    .addEventListener("change", () => changeSelectionMode("column"));

  document.addEventListener("keydown", handleKeyDown); // mover con teclado

  const casillas = document.querySelectorAll(".casilla"); // click casilla
  casillas.forEach((casilla) => {
    casilla.addEventListener("click", casillaClick);
  });
};

let changeSelectionMode = (newMode) => {
  if (!validSelectionModes.includes(newMode))
    throw new Error(`Modo de sleección no válido: "${newMode}"`);

  selectionMode = newMode;
  clearSelection();
  updatePath("reset");
};

let clearSelection = () => {
  const tablero = document.getElementById("tablero");
  const casillas = tablero.getElementsByTagName("div");

  Array.from(casillas).forEach((casilla) => {
    casilla.classList.remove("casillaSel");
    casilla.classList.remove("casillaMovil");
  });
};

let casillaClick = (e) => {
  clearSelection();

  switch (selectionMode) {
    case "individual":
      printCasilla(e.target); // la casilla clickada
      break;

    case "row":
      printRow(e.target); // logica dentro de la funcion
      break;

    case "column":
      printColumn(e.target);
      break;

    case null:
    default:
      break;
  }
};

let checkPrintIsValid = (casilla, selectionMode) => {
  if (casilla === "reset") {
    document.getElementById("nodePath").textContent = "";
    return false;
  }
  if (!casilla) return false;
  if (!validSelectionModes.includes(selectionMode)) return false;
  if (!casilla.classList.contains("casilla")) return false;

  return true;
};

let printCasilla = (casilla) => {
  if (!checkPrintIsValid(casilla, selectionMode))
    throw Error("No se puede realizar la acción");

  casilla.classList.add("casillaSel");
  updatePath(casilla, selectionMode);
};

let printRow = (casilla) => {
  if (!checkPrintIsValid(casilla, selectionMode))
    throw Error("No se puede realizar la acción");

  let row = casilla.closest(".linea");
  let rowCasillas = row.getElementsByTagName("div"); // todas
  for (const casilla of rowCasillas) {
    casilla.classList.add("casillaSel");
  }
  updatePath(casilla, selectionMode);
};

let printColumn = (casilla) => {
  if (!checkPrintIsValid(casilla, selectionMode))
    throw Error("No se puede realizar la acción");

  const columnIndex = Array.from(casilla.parentElement.children).indexOf(
    casilla // del padre dame el indice que tiene esta casilla
  );

  document.querySelectorAll(".linea").forEach((row) => {
    const casillasInRow = row.children; // todas de esa fila
    const casillaInColumn = casillasInRow[columnIndex]; // la casilla con el mismo indice
    casillaInColumn.classList.add("casillaSel");
  });

  updatePath(casilla, selectionMode);
};

let updatePath = (casilla, selectionMode) => {
  // muestra lo seleccionado en base a indices
  if (!checkPrintIsValid(casilla, selectionMode))
    throw Error("No se puede realizar la acción");

  const nodePath = [];

  switch (selectionMode) {
    case "individual":
      const row = casilla.closest(".linea");
      const columnIndex = Array.from(row.children).indexOf(casilla);
      const rowIndex = Array.from(row.parentElement.children).indexOf(row);
      const casillaIndex = Array.from(
        document.querySelectorAll(".casilla")
      ).indexOf(casilla);
      nodePath.push(`COLUMNA ${columnIndex + 1}`);
      nodePath.push(`LINEA ${rowIndex + 1}`);
      nodePath.push(`CASILLA ${casillaIndex + 1}`);
      break;

    case "row":
      const rowForRows = casilla.closest(".linea");
      const rowIndexForRows = Array.from(
        rowForRows.parentElement.children
      ).indexOf(rowForRows);
      nodePath.push(`LINEA ${rowIndexForRows + 1}`);
      break;

    case "column":
      const rowForColumn = casilla.closest(".linea");
      const columnIndexForColumns = Array.from(rowForColumn.children).indexOf(
        casilla
      );
      nodePath.push(`COLUMNA ${columnIndexForColumns + 1}`);
      break;

    default:
      break;
  }

  document.getElementById("nodePath").textContent = nodePath.join(" - ");
};

let handleKeyDown = (event) => {
  if (selectionMode !== "individual") return; // solo funciona en modoCasilla

  let casillaSeleccionada = document.querySelector(".casilla.casillaSel");
  if (!casillaSeleccionada) {
    casillaSeleccionada = document.querySelector(".casilla.casillaMovil");
    if (!casillaSeleccionada) return; // no hay casilla seleccionada
  }

  let nuevaCasilla;
  const casillas = document.querySelectorAll(".casilla");
  const index = Array.from(casillas).indexOf(casillaSeleccionada);

  switch (
    event.key // logica para moverse por el tablero
  ) {
    case "ArrowUp":
      if (index - anchoTablero >= 0) {
        nuevaCasilla = casillas[index - anchoTablero];
      }
      break;
    case "ArrowDown":
      if (index + anchoTablero < casillas.length) {
        nuevaCasilla = casillas[index + anchoTablero];
      }
      break;
    case "ArrowLeft":
      if (index % anchoTablero !== 0) {
        nuevaCasilla = casillas[index - 1];
      }
      break;
    case "ArrowRight":
      if ((index + 1) % anchoTablero !== 0) {
        nuevaCasilla = casillas[index + 1];
      }
      break;
  }

  if (nuevaCasilla) {
    // actualiza los colores
    casillaSeleccionada.classList.remove("casillaSel");
    if (casillaSeleccionada.classList.contains("casillaMovil")) {
      casillaSeleccionada.classList.remove("casillaMovil");
    }
    nuevaCasilla.classList.add("casillaMovil");
    updatePath(nuevaCasilla, selectionMode); // y la ruta
  }
};
