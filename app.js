const API_URL = "https://script.google.com/macros/s/AKfycbxP2Aa07vDYvdr3z9OF1HHtn6U-OoyoweHzcP6OGmxPtERUgOhYYVNAaf4AmIHeLImt/exec";
const oilList = document.getElementById("oil-list");
const blendList = document.getElementById("blend-list");
const blendTotal = document.getElementById("blend-total");
let oils = [];

async function fetchData() {
  try {
    const res = await fetch(API_URL);
    const text = await res.text();
    console.log("API原始回應：", text); // 讓你看到 Apps Script 真正輸出
    const result = JSON.parse(text);
    if (result.status === "success") {
      oils = result.data.map(row => ({
        name: row["中文名稱"],
        en: row["英文名稱"],
        detail: row
      }));
      renderList(oils);
    } else {
      alert("API回傳錯誤：" + result.message);
    }
  } catch (err) {
    console.error("讀取錯誤：", err);
    alert("讀取資料時發生錯誤：" + err.message);
  }
}
