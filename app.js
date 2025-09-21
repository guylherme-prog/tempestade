// --- elementos DOM ---
const horaBox = document.getElementById('hora-box');
const bairro1Value = document.getElementById('bairro1-value');
const bairro2Value = document.getElementById('bairro2-value');
const bairro1Status = document.getElementById('bairro1-status');
const bairro2Status = document.getElementById('bairro2-status');
const weatherIcon = document.getElementById('weather-icon');
const weatherTemp = document.getElementById('weather-temp');
const weatherDesc = document.getElementById('weather-desc');
const weatherDatetime = document.getElementById('weather-datetime');

let bairro1Pot = [], bairro2Pot = [], labels = [];

console.log("✅ Script carregado com sucesso!");

// --- Relógio ---
function updateHora(){
  const now = new Date();
  horaBox.textContent = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
}
setInterval(updateHora, 1000);
updateHora();

// --- Gráfico ---
console.log("📊 Iniciando gráfico...");
const ctxChart = document.getElementById('potChart').getContext('2d');
const potChart = new Chart(ctxChart, {
  type: 'line',
  data: {
    labels: labels,
    datasets: [
      { label: 'José Bonifácio', data: bairro1Pot, borderColor: '#f1c40f', backgroundColor: 'rgba(241,196,15,0.2)' },
      { label: 'Aldeota', data: bairro2Pot, borderColor: '#66fcf1', backgroundColor: 'rgba(102,252,241,0.2)' }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: { y: { min: 0, max: 120 } }
  }
});
console.log("✅ Gráfico criado");

// --- Fundo de estrelas ---
const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');

let stars = []; // ✅ declarado antes

function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  stars = [];
  for(let i=0;i<100;i++){
    stars.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      r: Math.random()*1.5,
      s: Math.random()*0.5+0.1
    });
  }
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function animateStars(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  stars.forEach(s=>{
    s.y += s.s;
    if(s.y > canvas.height){ s.y = 0; s.x = Math.random()*canvas.width; }
    ctx.fillStyle = '#fff';
    ctx.fillRect(s.x, s.y, s.r, s.r);
  });
  requestAnimationFrame(animateStars);
}
animateStars();

// --- Relâmpagos aleatórios ---
function lightningFlash(){
  const l = document.querySelector('.lightning');
  l.style.opacity = Math.random() > 0.95 ? 1 : 0;
  setTimeout(lightningFlash, 200 + Math.random()*1000);
}
lightningFlash();

// --- Simulação de descargas (dados) ---
function updateData(){
  const val1 = Math.floor(Math.random()*100);
  const val2 = Math.floor(Math.random()*100);
  console.log(`⚡ Novos valores -> José Bonifácio: ${val1} kA | Aldeota: ${val2} kA`);

  bairro1Pot.push(val1);
  bairro2Pot.push(val2);
  labels.push(new Date().toLocaleTimeString());

  if(labels.length > 10){ labels.shift(); bairro1Pot.shift(); bairro2Pot.shift(); }

  bairro1Value.textContent = `${val1} kA`;
  bairro2Value.textContent = `${val2} kA`;
  bairro1Status.textContent = `Incidência: ${val1 > 70 ? 'Alta' : 'Baixa'}`;
  bairro2Status.textContent = `Incidência: ${val2 > 70 ? 'Alta' : 'Baixa'}`;
  potChart.update();
}

setInterval(updateData, 3000);
updateData(); // primeira chamada imediata

// --- Weather Fortaleza ---
async function loadWeather(){
  const apiKey = '6e808b909e55286ca5ec51680df7e054';
  const cidade = 'Fortaleza,BR';
  console.log("🌦️ Buscando clima de Fortaleza...");
  try{
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&units=metric&lang=pt`);
    const data = await res.json();
    console.log("✅ Clima carregado:", data);

    const agora = new Date();
    const dias = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
    const dia = dias[agora.getDay()];
    const dataFormatada = `${agora.getDate()}/${agora.getMonth()+1}/${agora.getFullYear()}`;
    const horaFormatada = `${agora.getHours().toString().padStart(2,'0')}:${agora.getMinutes().toString().padStart(2,'0')}`;

    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherIcon.alt = data.weather[0].description;
    weatherTemp.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDesc.textContent = data.weather[0].description;
    weatherDatetime.textContent = `${dia}, ${dataFormatada} ${horaFormatada}`;
  }catch(e){
    console.error("❌ Erro ao carregar clima:", e);
    weatherDesc.textContent = 'Erro ao carregar previsão';
  }
}
loadWeather();
setInterval(loadWeather, 600000);