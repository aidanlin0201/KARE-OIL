
const API_URL = "https://script.google.com/macros/s/AKfycbyxcG9rNGPzwBwhoy30N5-9xkY_znc1MwVpO-AmSFYcB30Zu3rbusRtbnimkrZPN5F9/exec";
const oilList = document.getElementById("oil-list");
const blendList = document.getElementById("blend-list");
const blendTotal = document.getElementById("blend-total");
let oils = [];

// 讀取精油資料
async function fetchData() {
  try {
    const res = await fetch(API_URL);
    const result = await res.json();
    if (result.status === "success") {
      oils = result.data.map(row => ({
        name: row["中文名稱"],
        en: row["英文名稱"],
        detail: row
      }));
      renderList(oils);
    } else {
      alert("資料讀取失敗");
    }
  } catch (err) {
    console.error("讀取失敗", err);
    alert("讀取資料時發生錯誤");
  }
}

// 渲染列表
function renderList(data) {
  oilList.innerHTML = "";
  data.forEach((oil, i) => {
    const item = document.createElement("div");
    item.className = "item";
    item.innerHTML = `
      <input type="checkbox" class="blend-checkbox" data-name="${oil.name}">
      <span class="title" onclick="toggleDetail(${i})">${oil.name} (${oil.en})</span>
      <div class="detail" id="detail-${i}">
        ${Object.entries(oil.detail).map(([k,v]) => `<p><b>${k}：</b>${v}</p>`).join("")}
      </div>
    `;
    oilList.appendChild(item);
  });
  document.querySelectorAll(".blend-checkbox").forEach(cb => {
    cb.addEventListener("change", updateBlend);
  });
}

function toggleDetail(i) {
  const el = document.getElementById(`detail-${i}`);
  el.style.display = (el.style.display === "none" || !el.style.display) ? "block" : "none";
}

// 搜尋功能
document.getElementById("search").addEventListener("input", (e) => {
  const keywords = e.target.value.toLowerCase().split(",").map(k => k.trim()).filter(k => k);
  const filtered = oils.filter(oil =>
    keywords.some(k => oil.name.toLowerCase().includes(k) || oil.en.toLowerCase().includes(k))
  );
  renderList(filtered.length ? filtered : oils);
});

// 更新調配
function updateBlend() {
  const selected = document.querySelectorAll(".blend-checkbox:checked");
  blendList.innerHTML = "";
  selected.forEach(cb => {
    const row = document.createElement("div");
    row.innerHTML = `${cb.dataset.name}：<input type='number' value='0' min='0' class='blend-input' oninput='calcTotal()'> ml`;
    blendList.appendChild(row);
  });
  calcTotal();
}

// 計算總量
function calcTotal() {
  const inputs = document.getElementsByClassName("blend-input");
  let total = 0;
  for (let i = 0; i < inputs.length; i++) {
    total += parseFloat(inputs[i].value) || 0;
  }
  blendTotal.innerText = total.toFixed(2);
}

// 保存紀錄
document.getElementById("save-btn").addEventListener("click", async () => {
  const keywords = document.getElementById("search").value;
  const checkboxes = document.querySelectorAll(".blend-checkbox:checked");
  const inputs = document.getElementsByClassName("blend-input");
  const total = parseFloat(document.getElementById("blend-total").innerText) || 0;
  let selectedOils = [];
  for (let i = 0; i < checkboxes.length; i++) {
    selectedOils.push(`${checkboxes[i].dataset.name} ${inputs[i].value}ml`);
  }

  if (!keywords || selectedOils.length === 0) {
    alert("請輸入症狀並選擇精油");
    return;
  }

  const payload = { keywords, oils: selectedOils.join("，"), total };
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" }
    });
    const result = await res.json();
    if (result.status === "success") {
      alert("已保存到 Google Sheets");
    } else {
      alert("保存失敗");
    }
  } catch (err) {
    console.error("保存失敗", err);
    alert("保存時發生錯誤");
  }
});

fetchData();
