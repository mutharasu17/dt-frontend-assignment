// tiny in-memory "data store"
const featureData = [
  { id: 1, title: "Real‑time analytics", note: "See key numbers on one simple screen.", tag: "Analytics" },
  { id: 2, title: "Team workspaces", note: "Keep product, marketing and sales on the same page.", tag: "Collaboration" },
  { id: 3, title: "Playbook automation", note: "Trigger small actions when users cross a threshold.", tag: "Automation" },
  { id: 4, title: "Custom dashboards", note: "Build views that match how your team actually works.", tag: "Analytics" },
  { id: 5, title: "Smart notifications", note: "Get alerts that matter, skip the noise.", tag: "Productivity" },
  { id: 6, title: "API access", note: "Connect DataFlow to your existing tools and workflows.", tag: "Integration" }
];

const planData = [
  { id: 1, name: "Starter", priceMonthly: 19, priceYearly: 15, users: "Up to 3 users", popular: false },
  { id: 2, name: "Growth", priceMonthly: 39, priceYearly: 32, users: "Up to 10 users", popular: true },
  { id: 3, name: "Scale", priceMonthly: 79, priceYearly: 65, users: "Unlimited users", popular: false }
];

// feels more natural than "isYearly"
let useYearly = false;

// small helper so markup isn’t repeated everywhere
function make(tag, className) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  return el;
}

function paintFeatures(list) {
  const wrap = document.getElementById("feature-list");
  if (!wrap) return;

  // clear once in case we re-render later
  wrap.innerHTML = "";

  for (const item of list) {
    const card = make("div", "feature-card");

    const tag = make("span", "feature-tag");
    tag.textContent = item.tag;

    const title = make("h3", "feature-title");
    title.textContent = item.title;

    const note = make("p", "feature-note");
    note.textContent = item.note;

    card.appendChild(tag);
    card.appendChild(title);
    card.appendChild(note);
    wrap.appendChild(card);
  }
}

function paintPlans(list) {
  const wrap = document.getElementById("plan-list");
  if (!wrap) return;

  wrap.innerHTML = "";

  list.forEach(plan => {
    const card = make("div", "plan-card");

    if (plan.popular) {
      card.classList.add("popular");
      const flag = make("div", "popular-badge");
      flag.textContent = "Most popular";
      card.appendChild(flag);
    }

    const nameEl = make("h3", "plan-name");
    nameEl.textContent = plan.name;

    const priceEl = make("div", "plan-price");
    const current = useYearly ? plan.priceYearly : plan.priceMonthly;
    priceEl.innerHTML = `$${current}<span>/mo</span>`;

    const usersEl = make("p", "plan-users");
    usersEl.textContent = plan.users;

    const btn = make("button", "plan-btn");
    btn.type = "button";
    btn.textContent = "Get started";

    card.appendChild(nameEl);
    card.appendChild(priceEl);
    card.appendChild(usersEl);
    card.appendChild(btn);

    wrap.appendChild(card);
  });
}

// basic monthly/yearly toggle
function wireBillingToggle() {
  const toggle = document.getElementById("billing-switch");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    useYearly = !useYearly;
    // using a slightly different class name than the CSS draft
    toggle.classList.toggle("is-on");
    paintPlans(planData);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  paintFeatures(featureData);
  paintPlans(planData);
  wireBillingToggle();
});
