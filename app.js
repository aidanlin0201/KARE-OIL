const API_URL = "https://script.google.com/macros/s/AKfycbxGp2LS9yndsCkFmcpnw1nRaSNsDR38eR7rAyWjnCzcP6zVpjifx6NygDOtzE6W7_Eb/exec";
const oilList = document.getElementById("oil-list");
let oils = [];

async function fetchData() {
  try {
    const res = await fetch(API_URL);
    const text = await res.text();
    const result = JSON.parse(text);

    if (result.status === "success") {
      oils = result.data.map(row => ({
        name: row["中文名稱"] || "未命名",
        en: row["英文名稱"] || "",
        detail: row
      }));
      renderList(oils);
    } else {
      oilList.innerHTML = `<p style="color:red;">載入失敗：${result.message}</p>`;
    }
  } catch (err) {
    oilList.innerHTML = `<p style="color:red;">讀取資料時發生錯誤：${err.message}</p>`;
  }
}

// 渲染清單
function renderList(data) {
  if (!data.length) {
    oilList.innerHTML = "<p>沒有資料</p>";
    return;
  }
  oilList.innerHTML = data.map(oil => `
    <div class="oil-item">
      <h3>${oil.name}</h3>
      <p>${oil.en}</p>
    </div>
  `).join("");
}

fetchData();
