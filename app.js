const API_URL = "你的 Web App /exec URL";
const oilList = document.getElementById("oil-list");
const blendList = document.getElementById("blend-list");
const blendTotal = document.getElementById("blend-total");
let oils = [];

async function fetchData() {
  try {
    const res = await fetch(API_URL);
    const text = await res.text();
    console.log("API回應：", text);
    alert("API回應：" + text); // 直接顯示回應，幫助你看問題
    const result = JSON.parse(text);
    if (result.status === "success") {
      oils = result.data.map(row => ({
        name: row["中文名稱"],
        en: row["英文名稱"],
        detail: row
      }));
      renderList(oils);
    } else {
      alert("讀取失敗：" + result.message);
    }
  } catch (err) {
    alert("讀取資料時發生錯誤：" + err.message);
  }
}
