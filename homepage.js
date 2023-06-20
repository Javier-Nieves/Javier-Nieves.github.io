document.addEventListener("DOMContentLoaded", function () {
  document.querySelector(".CV-btn").onclick = () => {
    showView("CV");
  };

  const backBtn = document.querySelector(".back-arrow");
  backBtn.addEventListener("click", () => {
    showView("main");
  });

  const cards = document.querySelectorAll(".project-card");
  cards.forEach((card) => {
    card.addEventListener("click", function () {
      showProject(this);
    });
  });

  window.addEventListener("scroll", handleScroll);
});

function showView(name) {
  let show;
  let hide;
  if (name === "CV") {
    show = "CV";
    hide = "main";
  } else if (name === "main") {
    show = "main";
    hide = "CV";
  }
  const backImg = document.querySelector(`.${hide}-background`);
  const showView = document.querySelector(
    `${show === "main" ? "#main-container" : "#CV-view"}`
  );
  const hideView = document.querySelector(
    `${show === "main" ? "#CV-view" : "#main-container"}`
  );
  backImg.classList.add("go");
  hideView.classList.add("go");
  showView.classList.remove("go");
  setTimeout(() => {
    hideView.style.display = "none";
    showView.style.display = "block";
    backImg.classList.replace(`${hide}-background`, `${show}-background`);
    backImg.classList.remove("go");
  }, 500);
  appearAnimation(show === "CV");
}

function showProject(projectCard) {
  let isActive = animateCard(projectCard);
  const line2 = projectCard.querySelector("h2");
  const line1 = projectCard.querySelector(".small-text");
  const line4 = projectCard.querySelector(".medium-text");
  const content = projectCard.querySelector(".CardContent");
  const linkContainer = projectCard.querySelector(".linkContainer");
  const marker = projectCard.querySelector(".flex-column").dataset.name;
  let adition;
  switch (marker) {
    case "Wave Bookclub":
      adition = "books";
      break;
    case "Stock Sprout":
      adition = "stocks";
      break;
  }
  if (isActive) {
    line1.classList.add("text1", `${adition}`);
    line2.classList.add("projectTitle", `${adition}`);
    line4.classList.add("text4", `${adition}`);
    setTimeout(() => {
      content.style.display = "flex";
      linkContainer.style.height = content.clientHeight === 0 ? "55vh" : "0px";
      content.style.height = content.clientHeight === 0 ? "55vh" : "0px";
      content.classList.add("visible");
    }, 500);
  } else {
    line1.classList.remove("text1", `${adition}`);
    line2.classList.remove("projectTitle", `${adition}`);
    line4.classList.remove("text4", `${adition}`);
    linkContainer.style.height = content.clientHeight === 0 ? "55vh" : "0px";
    content.style.height = content.clientHeight === 0 ? "55vh" : "0px";
    content.classList.remove("visible");
    content.style.display = "none";
  }
}

function animateCard(projectCard) {
  projectCard.classList.toggle("active");
  projectCard.classList.add("selected");
  // move card up:
  const rect = projectCard.getBoundingClientRect();
  const distanceToTop = rect.top + window.pageYOffset;
  projectCard.style.marginTop = `${-distanceToTop}px`;
  // hide every other project card
  const elements = document.querySelectorAll(".project-card:not(.selected)");
  elements.forEach((element) => {
    element.classList.toggle("go");
  });
  projectCard.classList.remove("selected");
  return projectCard.className.includes("active");
}

function appearAnimation(showing) {
  if (showing) {
    const appear1 = document.querySelector(".appear1");
    const appear2 = document.querySelector(".appear2");
    const appear3 = document.querySelector(".appear3");
    const appear4 = document.querySelector(".appear4");
    const appear5 = document.querySelector(".appear5");
    setTimeout(() => {
      appear2.classList.add("visible-cv");
    }, 1000);
    setTimeout(() => {
      appear1.classList.add("visible-cv");
    }, 1500);
    setTimeout(() => {
      appear3.classList.add("visible-cv");
    }, 2000);
    setTimeout(() => {
      appear4.classList.add("visible-cv");
    }, 2300);
    setTimeout(() => {
      appear5.classList.add("visible-cv");
    }, 2600);
  } else {
    const cvBlocks = document.querySelectorAll(".visible-cv");
    cvBlocks.forEach((block) => {
      block.classList.remove("visible-cv");
    });
  }
}

function handleScroll() {
  console.log("handleobject");
  const backGro = document.querySelector(".CV-background");
  const leftColumn = document.querySelector(".cv-left-part");
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  const scrollBack = 0.53;
  const scrollLeft = 0.8;
  const tranValueBack = `translateY(${scrollTop * scrollBack}px)`;
  const tranValueLeft = `translateY(${scrollTop * scrollLeft}px)`;
  backGro.style.transform = tranValueBack;
  leftColumn.style.transform = tranValueLeft;
}
