const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyHgXFNIyupkytdKEq6nWjXyhjWXxjgibOOuSt2GdkM6jYUWZWF-wE-s4VFBb5NUCJd/exec";

const motoristas = {
  VILSON: { veiculo: "FORD CARGO 815-E", placa: "IRT6089" },
  BLADEMIR: { veiculo: "M BEN 415", placa: "IVE5C19" },
  ALESSANDRO: { veiculo: "M BENZ 915-C", placa: "ITC2C48" },
  CLAUDIOMAR: { veiculo: "VW 9 170 DRC 4X2", placa: "IYS7E12" },
  MARIO: { veiculo: "VW 8 160", placa: "IVA0J65" },
  JOEL: { veiculo: "RENAULT MASTER FUR L3H2", placa: "JAN2A79" }
};

// ===== DIÁRIAS =====
const DIARIAS_FIXAS = {
  VILSON: 600,
  MARIO: 500,
  JOEL: 400,
  BLADEMIR: 400,
  ALESSANDRO: 500
};

const VALOR_MENSAL_CLAUDIOMAR = 12000;

const FERIADOS_FIXOS = [
  "01-01","21-04","01-05","07-09","12-10","02-11","15-11","25-12"
];

function isFeriado(date) {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return FERIADOS_FIXOS.includes(`${d}-${m}`);
}

function contarDiasUteis(ano, mes) {
  let dias = 0;
  const ultimoDia = new Date(ano, mes + 1, 0).getDate();

  for (let d = 1; d <= ultimoDia; d++) {
    const data = new Date(ano, mes, d);
    const diaSemana = data.getDay();
    if (diaSemana !== 0 && diaSemana !== 6 && !isFeriado(data)) {
      dias++;
    }
  }
  return dias;
}

// ===== DOM =====
document.addEventListener("DOMContentLoaded", () => {
  const formKm = document.getElementById("formKm");
  const formAbast = document.getElementById("formAbastecimento");

  const tabKm = document.getElementById("tabKm");
  const tabAbast = document.getElementById("tabAbastecimento");

  tabKm.onclick = () => {
    formKm.style.display = "block";
    formAbast.style.display = "none";
    tabKm.classList.add("active");
    tabAbast.classList.remove("active");
  };

  tabAbast.onclick = () => {
    formKm.style.display = "none";
    formAbast.style.display = "block";
    tabAbast.classList.add("active");
    tabKm.classList.remove("active");
  };

  function vincularMotorista(selectId, veiculoId, placaId) {
    document.getElementById(selectId).addEventListener("change", function () {
      const d = motoristas[this.value];
      document.getElementById(veiculoId).value = d ? d.veiculo : "";
      document.getElementById(placaId).value = d ? d.placa : "";
    });
  }

  vincularMotorista("motoristaKm", "veiculoKm", "placaKm");
  vincularMotorista("motoristaAbast", "veiculoAbast", "placaAbast");

  const motoristaKm = document.getElementById("motoristaKm");
  const dataKm = formKm.querySelector('[name="data"]');
  const campoDiaria = formKm.querySelector('[name="valorDiaria"]');

  function calcularDiaria() {
    if (!motoristaKm.value || !dataKm.value) {
      campoDiaria.value = "";
      return;
    }

    if (motoristaKm.value === "CLAUDIOMAR") {
      const data = new Date(dataKm.value + "T00:00:00");
      const diasUteis = contarDiasUteis(data.getFullYear(), data.getMonth());
      campoDiaria.value = (VALOR_MENSAL_CLAUDIOMAR / diasUteis)
        .toFixed(2).replace(".", ",");
    } else {
      campoDiaria.value = DIARIAS_FIXAS[motoristaKm.value]
        .toFixed(2).replace(".", ",");
    }
  }

  motoristaKm.addEventListener("change", calcularDiaria);
  dataKm.addEventListener("change", calcularDiaria);

  async function enviar(form) {
    await fetch(SCRIPT_URL, {
      method: "POST",
      body: new FormData(form),
      mode: "no-cors"
    });
    form.reset();
  }

  formKm.onsubmit = e => { e.preventDefault(); enviar(formKm); };
  formAbast.onsubmit = e => { e.preventDefault(); enviar(formAbast); };
});
