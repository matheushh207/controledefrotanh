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

const formKm = document.getElementById("formKm");
const formAbast = document.getElementById("formAbastecimento");
const tabKm = document.getElementById("tabKm");
const tabAbast = document.getElementById("tabAbastecimento");

// Toast
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

// Abas
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

// Auto veículo/placa
function vincularMotorista(selectId, veiculoId, placaId) {
  document.getElementById(selectId).addEventListener("change", function () {
    const d = motoristas[this.value];
    document.getElementById(veiculoId).value = d ? d.veiculo : "";
    document.getElementById(placaId).value = d ? d.placa : "";
  });
}

vincularMotorista("motoristaKm", "veiculoKm", "placaKm");
vincularMotorista("motoristaAbast", "veiculoAbast", "placaAbast");

// Envio
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
