export const storage = ({ store }) => {
  const key = store.$id + "pinia";
  // 页面销毁 保存数据
  window.addEventListener("beforeunload", () => {
    localStorage.setItem(key, JSON.stringify(store.$state));
  });
  //页面加载 读取数据
  if (localStorage.getItem(key)) {
    store.$state = JSON.parse(localStorage.getItem(key));
  }

  console.log("%c storage", "color:blue", store.$state);
};
