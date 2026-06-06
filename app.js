const ASSET = "assets/";

const stores = [
  {
    id: "main-foodcourt",
    name: "본관 푸드코트",
    category: "main",
    wait: 9,
    image: "cutlet.jpg",
    location: "본관 푸드코트",
    description: "일반 식사와 휴게소 대표 간식을 이용할 수 있는 본관 식음 공간",
    menus: [
      { name: "돈가스", price: 9500, image: "cutlet.jpg", wait: 9 },
      { name: "만두", price: 5000, image: "dumpling.jpg", wait: 6 },
      { name: "어묵", price: 4000, image: "seafood.jpg", wait: 5 }
    ]
  },
  {
    id: "ramen",
    name: "라면로봇",
    category: "robot24",
    wait: 4,
    image: "ramen-basic.jpg",
    location: "24시간 로봇 푸드코트",
    description: "셰프 표준 레시피와 조리 이력 관리가 적용된 라면 메뉴",
    menus: [
      { name: "기본 라면", price: 4500, image: "ramen-basic.jpg", wait: 4 },
      { name: "계란라면", price: 5000, image: "ramen-egg.jpg", wait: 5 },
      { name: "떡라면", price: 5000, image: "ramen-ricecake.jpg", wait: 5 },
      { name: "떡·계란라면", price: 5500, image: "ramen-ricecake-egg.jpg", wait: 6 }
    ]
  },
  {
    id: "korean",
    name: "한식로봇",
    category: "robot24",
    wait: 8,
    image: "kimchi-stew.jpg",
    location: "24시간 로봇 푸드코트",
    description: "HACCP 기반 온도·시간 기준으로 조리되는 기본·지역 특화 한식",
    menus: [
      { name: "김치찌개", price: 8500, image: "kimchi-stew.jpg", wait: 8 },
      { name: "차돌된장찌개", price: 9500, image: "chadol-doenjang.jpg", wait: 9 },
      { name: "설렁탕", price: 9000, image: "seolleongtang.jpg", wait: 7 },
      { name: "해물순두부", price: 9500, image: "seafood-sundubu.jpg", wait: 8 },
      { name: "괴산 올갱이해장국", price: 9500, image: "olgaengi-soup.jpg", wait: 9 },
      { name: "괴산 민물매운탕", price: 12000, image: "freshwater-spicy-stew.jpg", wait: 11 },
      { name: "단양 버섯마늘전골", price: 11000, image: "mushroom-garlic-hotpot.jpg", wait: 10 },
      { name: "보은 속리산 산채된장찌개", price: 10000, image: "sanchae-doenjang.jpg", wait: 9 }
    ]
  },
  {
    id: "coffee",
    name: "커피/아이스크림",
    category: "coffee",
    wait: 3,
    image: "coffee-icecream.jpg",
    location: "커피/아이스크림 로봇존",
    description: "식사 전후 또는 심야에도 이용 가능한 로봇 제조 음료와 후식",
    menus: [
      { name: "아메리카노", price: 3500, image: "coffee-icecream.jpg", wait: 2 },
      { name: "카페라떼", price: 4200, image: "coffee-icecream.jpg", wait: 3 },
      { name: "소프트 아이스크림", price: 4000, image: "coffee-icecream.jpg", wait: 3 }
    ]
  }
];

function getFastMenus() {
  return stores
    .flatMap(store => store.menus.map(menu => ({
      ...menu,
      storeId: store.id,
      storeName: store.name,
      location: store.location
    })))
    .filter(menu => menu.wait <= 5)
    .sort((a, b) => a.wait - b.wait);
}

const orders = [
  { number: "A-108", store: "라면로봇", menu: "기본 라면", state: "ready", label: "수령 가능", detail: "24시간 로봇 푸드코트 픽업대 1" },
  { number: "B-214", store: "한식로봇", menu: "김치찌개", state: "cooking", label: "조리 중 · 약 4분", detail: "CCP 가열 단계 진행 중" },
  { number: "C-052", store: "커피/아이스크림", menu: "아메리카노", state: "cooking", label: "제조 중 · 약 1분", detail: "커피/아이스크림 로봇존" },
  { number: "A-109", store: "한식로봇", menu: "해물순두부", state: "delayed", label: "지연 · 관리자 확인", detail: "대체 메뉴 안내 가능" }
];

const app = document.querySelector("#app");
const toast = document.querySelector("#toast");
const storeDialog = document.querySelector("#storeDialog");
const storeDialogContent = document.querySelector("#storeDialogContent");
const languageDialog = document.querySelector("#languageDialog");
let currentRoute = "home";
let currentFilter = "all";
let demoTick = 0;

function levelFor(wait) {
  if (wait < 5) return { key: "smooth", label: "원활", color: "green" };
  if (wait < 10) return { key: "normal", label: "보통", color: "blue" };
  if (wait < 20) return { key: "busy", label: "혼잡", color: "orange" };
  return { key: "very-busy", label: "매우 혼잡", color: "red" };
}

function formatPrice(value) {
  return `${value.toLocaleString("ko-KR")}원`;
}

function storeCard(store) {
  const level = levelFor(store.wait);
  return `
    <article class="store-card">
      <button class="store-button" data-store="${store.id}">
        <div class="store-top">
          <img class="store-photo" src="${ASSET}${store.image}" alt="${store.name}">
          <div class="store-summary level-${level.key}">
            <div class="store-name">
              <strong>${store.name}</strong>
              ${store.category !== "main" ? '<span class="robot-badge">ROBOT</span>' : ""}
            </div>
            <div class="wait-row">
              <span class="wait-state">${level.label}<br>${store.location}</span>
              <span class="wait-time">${store.wait}<small>분</small></span>
            </div>
          </div>
        </div>
        <div class="menu-preview">
          ${store.menus.map(menu => `
            <span class="menu-preview-item">
              <img src="${ASSET}${menu.image}" alt="">
              <span>${menu.name}</span>
            </span>
          `).join("")}
        </div>
      </button>
    </article>
  `;
}

function renderHome() {
  const average = Math.round(stores.reduce((sum, store) => sum + store.wait, 0) / stores.length);
  const fastMenus = getFastMenus();
  app.innerHTML = `
    <section class="hero">
      <span class="eyebrow">H-ROS 실시간 운영정보</span>
      <h1>빠른 메뉴를 찾고<br>어디서든 바로 주문하세요</h1>
      <p>본관 푸드코트, 24시간 로봇 푸드코트, 커피/아이스크림 메뉴의 대기시간을 한 화면에서 확인할 수 있습니다.</p>
      <span class="live-chip"><i class="live-dot"></i><span id="updatedAt">방금 업데이트</span></span>
    </section>

    <section class="quick-grid" aria-label="빠른 서비스">
      <button class="quick-button" data-route="stores"><span class="quick-symbol">⌛</span><strong>대기시간</strong><small>가장 빠른 메뉴</small></button>
      <button class="quick-button" data-route="order"><span class="quick-symbol">▦</span><strong>모바일 주문</strong><small>QR 주문·결제</small></button>
      <button class="quick-button" data-route="status"><span class="quick-symbol">✓</span><strong>주문 현황</strong><small>제조·픽업 안내</small></button>
      <button class="quick-button" data-route="facilities"><span class="quick-symbol">⌖</span><strong>시설 안내</strong><small>본관·별관·특별관</small></button>
    </section>

    <div class="status-strip">
      <div class="status-metric"><small>전체 평균 대기</small><strong>${average}분</strong></div>
      <div class="status-metric"><small>가장 빠른 메뉴</small><strong>${fastMenus[0].name}</strong></div>
      <div class="status-metric"><small>운영 구역</small><strong>3개 구역</strong></div>
    </div>

    <section class="section">
      <div class="section-heading">
        <div><h2>빠른 주문 가능 메뉴</h2><p>H-ROS가 현재 대기열과 메뉴별 제조시간을 분석했습니다.</p></div>
        <button class="text-button" data-route="stores">전체 보기 →</button>
      </div>
      <div class="fast-menu-grid">
        ${fastMenus.slice(0, 6).map(menu => `
          <button class="fast-menu-card" data-store="${menu.storeId}">
            <img src="${ASSET}${menu.image}" alt="${menu.name}">
            <span class="fast-menu-copy">
              <small>${menu.storeName}</small>
              <strong>${menu.name}</strong>
              <span>${formatPrice(menu.price)}</span>
            </span>
            <b>${menu.wait}분</b>
          </button>
        `).join("")}
      </div>
    </section>

    <section class="section">
      <div class="section-heading">
        <div><h2>구역별 메뉴</h2><p>이용하려는 공간을 선택하면 운영 메뉴를 확인할 수 있습니다.</p></div>
      </div>
      <div class="store-grid">${stores.map(storeCard).join("")}</div>
    </section>
  `;
}

function renderStores() {
  const filtered = currentFilter === "all" ? stores : stores.filter(store => store.category === currentFilter);
  app.innerHTML = `
    <header class="page-heading">
      <div><span class="eyebrow">LIVE WAITING</span><h1>메뉴·예상 대기시간</h1><p>주문량과 평균 제조시간을 기준으로 계산됩니다.</p></div>
      <button class="icon-button" id="refreshButton" aria-label="새로고침" title="새로고침">↻</button>
    </header>
    <div class="filter-row">
      ${[
        ["all", "전체"],
        ["main", "본관 푸드코트"],
        ["robot24", "24시간 로봇 푸드코트"],
        ["coffee", "커피/아이스크림"]
      ].map(([key, label]) => `<button class="filter-button ${currentFilter === key ? "active" : ""}" data-filter="${key}">${label}</button>`).join("")}
    </div>
    <div class="store-grid">${filtered.map(storeCard).join("")}</div>
  `;
}

function generateQr() {
  const seed = "OCHANG-HROS-ORDER";
  let bits = [];
  for (let y = 0; y < 13; y++) {
    for (let x = 0; x < 13; x++) {
      const finder = (
        (x < 4 && y < 4) ||
        (x > 8 && y < 4) ||
        (x < 4 && y > 8)
      );
      const innerFinder = (
        (x === 1 || x === 2) && (y === 1 || y === 2) ||
        (x === 10 || x === 11) && (y === 1 || y === 2) ||
        (x === 1 || x === 2) && (y === 10 || y === 11)
      );
      const random = (seed.charCodeAt((x + y * 3) % seed.length) + x * 7 + y * 11) % 3 !== 0;
      bits.push(`<i class="qr-cell ${(finder ? !innerFinder : random) ? "on" : ""}"></i>`);
    }
  }
  return bits.join("");
}

function renderOrder() {
  app.innerHTML = `
    <header class="page-heading">
      <div><span class="eyebrow">MOBILE ORDER</span><h1>QR로 바로 주문</h1><p>현재 위치에서 메뉴를 고르고 모바일로 결제하세요.</p></div>
    </header>
    <section class="qr-layout">
      <div class="qr-panel">
        <h2>오창휴게소 모바일 주문</h2>
        <p>카메라로 QR을 촬영하면 운영 중인 로봇 메뉴와 예상 대기시간이 표시됩니다.</p>
        <div class="qr-code" aria-label="데모 QR 코드">${generateQr()}</div>
        <button class="primary-button" id="demoOrderButton">이 화면에서 데모 주문하기</button>
      </div>
      <aside class="info-panel">
        <h3>주문 순서</h3>
        <ol class="step-list">
          <li><b>1</b><span>QR 촬영 후 주문 페이지 접속</span></li>
          <li><b>2</b><span>메뉴와 예상 대기시간 확인</span></li>
          <li><b>3</b><span>모바일 주문·결제</span></li>
          <li><b>4</b><span>완료 알림 확인 후 픽업</span></li>
        </ol>
        <button class="secondary-button" data-route="stores">메뉴 먼저 보기</button>
      </aside>
    </section>
  `;
}

function renderStatus() {
  app.innerHTML = `
    <header class="page-heading">
      <div><span class="eyebrow">ORDER STATUS</span><h1>주문·픽업 현황</h1><p>공용 화면에는 주문번호와 픽업 위치만 표시됩니다.</p></div>
      <button class="icon-button" id="refreshButton" aria-label="새로고침" title="새로고침">↻</button>
    </header>
    <section class="order-list">
      ${orders.map(order => `
        <article class="order-item">
          <span class="order-number">${order.number}</span>
          <div><h3>${order.menu}</h3><p>${order.store} · ${order.detail}</p></div>
          <span class="order-state ${order.state}">${order.label}</span>
        </article>
      `).join("")}
    </section>
  `;
}

function renderFacilities() {
  app.innerHTML = `
    <header class="page-heading">
      <div><span class="eyebrow">FACILITY MAP</span><h1>시설 안내</h1><p>현재 위치에서 각 건물의 방향을 확인하세요.</p></div>
    </header>
    <section class="facility-map">
      <div class="map-road"></div>
      <button class="map-building map-main" data-facility="본관"><span>본관<small>화장실 · 편의점 · 일반 푸드코트</small></span></button>
      <button class="map-building map-annex" data-facility="별관"><span>별관<small>로봇 전용 푸드코트 · QR 주문</small></span></button>
      <button class="map-building map-exhibition" data-facility="특별관"><span>특별관<small>비행기 모형 전시관 · 체험공간</small></span></button>
      <span class="you-are-here">현위치</span>
    </section>
  `;
}

function render() {
  document.querySelectorAll(".nav-item").forEach(button => {
    button.classList.toggle("active", button.dataset.route === currentRoute);
  });
  if (currentRoute === "home") renderHome();
  if (currentRoute === "stores") renderStores();
  if (currentRoute === "order") renderOrder();
  if (currentRoute === "status") renderStatus();
  if (currentRoute === "facilities") renderFacilities();
  app.focus({ preventScroll: true });
}

function routeTo(route) {
  currentRoute = route;
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openStore(id) {
  const store = stores.find(item => item.id === id);
  const level = levelFor(store.wait);
  storeDialogContent.innerHTML = `
    <div class="dialog-panel">
      <div class="dialog-heading">
        <div><small>${store.location}</small><h2>${store.name}</h2></div>
        <button class="dialog-close" id="closeStoreDialog" aria-label="닫기">×</button>
      </div>
      <div class="dialog-store-hero">
        <img src="${ASSET}${store.image}" alt="${store.name}">
        <div>
          <span class="order-state ${store.wait >= 10 ? "cooking" : "ready"}">${level.label} · 약 ${store.wait}분</span>
          <p>${store.description}</p>
          <p><strong>픽업 위치</strong><br>${store.location}</p>
        </div>
      </div>
      <div class="dialog-menu-grid">
        ${store.menus.map(menu => `
          <div class="dialog-menu-item">
            <img src="${ASSET}${menu.image}" alt="">
            <span><strong>${menu.name}</strong><small>${formatPrice(menu.price)}</small></span>
          </div>
        `).join("")}
      </div>
      <button class="primary-button" id="storeOrderButton">QR 주문으로 이동</button>
    </div>
  `;
  storeDialog.showModal();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function refreshDemoData() {
  demoTick += 1;
  stores.forEach((store, index) => {
    const delta = ((demoTick + index) % 3) - 1;
    store.wait = Math.max(1, Math.min(24, store.wait + delta));
  });
  render();
  showToast("H-ROS 최신 운영정보로 갱신했습니다.");
}

document.addEventListener("click", event => {
  const routeButton = event.target.closest("[data-route]");
  if (routeButton) routeTo(routeButton.dataset.route);

  const storeButton = event.target.closest("[data-store]");
  if (storeButton) openStore(storeButton.dataset.store);

  const filterButton = event.target.closest("[data-filter]");
  if (filterButton) {
    currentFilter = filterButton.dataset.filter;
    renderStores();
  }

  if (event.target.closest("#refreshButton")) refreshDemoData();
  if (event.target.closest("#demoOrderButton")) showToast("데모 주문번호 A-110이 발급되었습니다.");
  if (event.target.closest("#closeStoreDialog")) storeDialog.close();
  if (event.target.closest("#storeOrderButton")) {
    storeDialog.close();
    routeTo("order");
  }

  const facility = event.target.closest("[data-facility]");
  if (facility) showToast(`${facility.dataset.facility} 방향 안내를 시작합니다.`);
});

document.querySelector("#languageButton").addEventListener("click", () => languageDialog.showModal());
document.querySelector("#accessibilityButton").addEventListener("click", () => {
  document.body.classList.toggle("large-text");
  showToast(document.body.classList.contains("large-text") ? "큰 글씨 모드를 켰습니다." : "기본 글씨로 돌아왔습니다.");
});

document.querySelectorAll("[data-language]").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelector("#languageButton").textContent = button.dataset.language.toUpperCase();
    showToast(`${button.textContent} 안내 모드를 선택했습니다.`);
  });
});

setInterval(() => {
  if (currentRoute === "home") {
    const updated = document.querySelector("#updatedAt");
    if (updated) updated.textContent = "30초 이내 업데이트";
  }
}, 30000);

render();
