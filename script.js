const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyHgXFNIyupkytdKEq6nWjXyhjWXxjgibOOuSt2GdkM6jYUWZWF-wE-s4VFBb5NUCJd/exec";

// ===============================
// MOTORISTAS + REGRAS
// ===============================
const motoristas = {
  VILSON: {
    veiculo: "FORD CARGO 815-E",
    placa: "IRT6089",
    diaria: 600
  },
  MARIO: {
    veiculo: "VW 8 160",
    placa: "IVA0J65",
    diaria: 500
  },
  JOEL: {
    veiculo: "RENAULT MASTER FUR L3H2",
    placa: "JAN2A79",
    diaria: 400
  },
  BLADEMIR: {
    veiculo: "M BEN 415",
    placa: "IVE5C19",
    diaria: 400
  },
  ALESSANDRO: {
    veiculo: "M BENZ 915-C",
    placa: "ITC2C48",
    diaria: 500
  },
  CLAUDIOMAR: {
    veiculo: "VW 9 170 DRC 4X2",
    placa: "IYS7E12",
    mensal: 12000
  }
};

const formKm = document.getElementById("formKm");
const formAbast = document.getElementById("formAbastecimento");
const tabKm = document.getElementById("tabKm");
const tabAbast = document.getElementById("tabAbastecimento");

// ===============================
// TOAST
// ===============================
const toast = document.createElement("div");
toast.innerText = "Salvo com sucesso";
Object.assign(toast.style, {
  position: "fixed",
  bottom: "30px",
  right: "30px",
  background: "#2e7d32",
  color: "#fff",
  padding: "14px 22px",
  borderRadius: "6px",
  opacity: "0",
  transition: "opacity 0.4s",
  zIndex: "9999"
});
document.body.appendChild(toast);

function mostrarToast() {
  toast.style.opacity = "1";
  setTimeout(() => (toast.style.opacity = "0"), 3000);
}

// ===============================
// ABAS
// ===============================
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

// ===============================
// DIAS ÚTEIS (SEG A SEX)
// ===============================
function calcularDiasUteis(ano, mes) {
  let diasUteis = 0;
  const data = new Date(ano, mes, 1);

  while (data.getMonth() === mes) {
    const diaSemana = data.getDay(); // 0=Dom, 6=Sáb
    if (diaSemana !== 0 && diaSemana !== 6) {
      diasUteis++;
    }
    data.setDate(data.getDate() + 1);
  }

  return diasUteis;
}

// ===============================
// AUTO VEÍCULO / PLACA / DIÁRIA
// ===============================
function vincularMotorista(selectId, veiculoId, placaId, diariaName, dataName) {
  const select = document.getElementById(selectId);
  const dataInput = document.querySelector(`[name="${dataName}"]`);
  const diariaInput = diariaName
    ? document.querySelector(`[name="${diariaName}"]`)
    : null;

  function atualizar() {
    const d = motoristas[select.value];

    document.getElementById(veiculoId).value = d ? d.veiculo : "";
    document.getElementById(placaId).value = d ? d.placa : "";

    if (!diariaInput || !d || !dataInput.value) return;

    let valorDiaria = d.diaria || 0;

    // Regra especial: Claudiomar
    if (d.mensal) {
      const data = new Date(dataInput.value);
      const diasUteis = calcularDiasUteis(
        data.getFullYear(),
        data.getMonth()
      );
      valorDiaria = d.mensal / diasUteis;
    }

    diariaInput.value = valorDiaria.toFixed(2).replace(".", ",");
  }

  select.addEventListener("change", atualizar);
  dataInput.addEventListener("change", atualizar);
}

// ===============================
// VINCULAÇÕES
// ===============================
vincularMotorista(
  "motoristaKm",
  "veiculoKm",
  "placaKm",
  "valorDiaria",
  "data"
);

vincularMotorista(
  "motoristaAbast",
  "veiculoAbast",
  "placaAbast",
  null,
  "data"
);

// ===============================
// ENVIO
// ===============================
async function enviar(form) {
  const formData = new FormData(form);
  await fetch(SCRIPT_URL, {
    method: "POST",
    body: formData,
    mode: "no-cors"
  });
  mostrarToast();
}

formKm.onsubmit = async (e) => {
  e.preventDefault();
  await enviar(formKm);
  formKm.reset();
};

formAbast.onsubmit = async (e) => {
  e.preventDefault();
  await enviar(formAbast);
  formAbast.reset();
};
