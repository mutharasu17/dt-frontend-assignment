// tiny helper
const qs = (sel, ctx = document) => ctx.querySelector(sel);

const jbOverlay = qs("#journeyBoard");
const jbOpenBtn = qs("#jbOpenBtn");
const jbCloseBtn = qs("#jbCloseBtn");

// toggle function for Journey Board
function toggleJourneyBoard(show) {
  if (!jbOverlay) return;

  const shouldOpen =
    typeof show === "boolean" ? show : !jbOverlay.classList.contains("is-open");

  if (shouldOpen) {
    jbOverlay.classList.add("is-open");
  } else {
    jbOverlay.classList.remove("is-open");
  }
}

// wire up the buttons
if (jbOpenBtn) {
  jbOpenBtn.addEventListener("click", () => {
    toggleJourneyBoard(true);
  });
}

if (jbCloseBtn) {
  jbCloseBtn.addEventListener("click", () => {
    toggleJourneyBoard(false);
  });
}

// close when clicking the dimmed area but not the panel
if (jbOverlay) {
  jbOverlay.addEventListener("click", (e) => {
    if (e.target === jbOverlay) toggleJourneyBoard(false);
  });
}

// quick accordion setup
const accordHeads = document.querySelectorAll(".accord-head");

accordHeads.forEach((head) => {
  head.addEventListener("click", () => {
    const body = head.nextElementSibling;
    if (!body) return;

    const isOpen = body.style.display !== "none";

    // close all others 
    document.querySelectorAll(".accord-body").forEach((b) => {
      b.style.display = "none";
    });

    if (!isOpen) {
      body.style.display = "block";
    } else {
      body.style.display = "none";
    }
  });

  //  open for first load
  const body = head.nextElementSibling;
  if (body) body.style.display = "block";
});
