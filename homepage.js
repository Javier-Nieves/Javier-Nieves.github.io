"use strict";
let goingAway;
document.addEventListener("DOMContentLoaded", function () {
  // back button function
  window.addEventListener("popstate", function () {
    loadCorrectView();
  });

  document.querySelector(".CV-btn").onclick = () => {
    showView("CV");
  };

  const backBtn = document.querySelector(".back-arrow");
  backBtn.addEventListener("click", () => {
    showView("main");
  });

  const cards = document.querySelectorAll(".project-card");
  let isThrottled;
  cards.forEach((card) => {
    addHoverEffect(card);
    card.addEventListener("click", function () {
      if (!isThrottled) {
        showProject(this);
        // double click is forbidden
        isThrottled = true;
        setTimeout(function () {
          isThrottled = false;
        }, 700);
      }
    });
  });

  const imgs = document.querySelectorAll(".cv-diploma");
  imgs.forEach((img) => {
    img.addEventListener("click", () => {
      const which = img.dataset.diploma;
      showDiploma(which);
    });
  });

  window.addEventListener("scroll", handleScroll);
});

function loadCorrectView() {
  let url = window.location.href;
  if (url.slice(-1) === "/") {
    showView("main");
  }
}

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
  show === "main" && window.history.pushState("_", "_", "/");
}

function showProject(projectCard) {
  // project card is expanded?
  const isActive = animateCard(projectCard);
  const line1 = projectCard.querySelector(".small-text");
  const line2 = projectCard.querySelector(".big-text");
  const line4 = projectCard.querySelector(".medium-text");
  const content = projectCard.querySelector(".CardContent");
  const linkContainer = projectCard.querySelector(".linkContainer");
  const marker = projectCard.querySelector(".flex-column").dataset.name;
  const links = projectCard.querySelectorAll("a");
  let adition;
  switch (marker) {
    case "Wave Bookclub":
      adition = "books";
      break;
    case "Stock Sprout":
      adition = "stocks";
      break;
    case "Trilingua":
      adition = "trilingua";
      break;
    case "See the World":
      adition = "world";
      break;
  }
  if (isActive) {
    document.querySelector("body").style.overflow = "hidden";
    line1.classList.add("text1", `${adition}`);
    line2.classList.add("projectTitle", `${adition}`);
    line4.classList.add("text4", `${adition}`);
    setTimeout(() => {
      content.style.display = "flex";
      linkContainer.style.height = content.clientHeight === 0 ? "100%" : "0px";
      content.style.height = content.clientHeight === 0 ? "50vh" : "0px";
      content.classList.add("visible");
    }, 500);

    links.forEach((link) => {
      link.addEventListener("click", () => {
        projectCard.querySelector(".projectText").style.display = "none";
        projectCard.querySelector(".spinner").style.display = "flex";
        goingAway = true;
      });
    });
  } else {
    document.querySelector("body").style.overflow = "scroll";
    line1.classList.remove("text1", `${adition}`);
    line2.classList.remove("projectTitle", `${adition}`);
    line4.classList.remove("text4", `${adition}`);
    linkContainer.style.height = content.clientHeight === 0 ? "50vh" : "0px";
    content.style.height = content.clientHeight === 0 ? "50vh" : "0px";
    content.classList.remove("visible");
    content.style.display = "none";
    if (goingAway) {
      // Cloning the element and replacing it will remove event listener
      const cards = document.querySelectorAll(".project-card");
      cards.forEach((card) => {
        const newCard = card.cloneNode(true);
        card.parentNode.replaceChild(newCard, card);
      });
    }
  }
  // window.history.pushState("unused", "unused", `/${adition}`);
}

function animateCard(projectCard) {
  projectCard.classList.toggle("active");
  projectCard.classList.add("selected");
  // move card:
  const rect = projectCard.getBoundingClientRect();
  const distanceToTop = rect.top + window.scrollY;
  projectCard.style.marginTop = `${-distanceToTop}px`;
  // change every other project card visibility
  const elements = document.querySelectorAll(".project-card:not(.selected)");
  elements.forEach((element) => {
    element.classList.toggle("go");
  });
  projectCard.classList.remove("selected");
  return projectCard.className.includes("active");
}

function appearAnimation(showing) {
  if (showing) {
    let timer = 600;
    for (let i = 1; i <= 5; i++) {
      const blocks = document.querySelectorAll(`.appear${i}`);
      blocks.forEach((block) => {
        setTimeout(() => {
          block.classList.add("visible-cv");
        }, timer);
        timer += 300;
      });
    }
  } else {
    const cvBlocks = document.querySelectorAll(".visible-cv");
    cvBlocks.forEach((block) => {
      block.classList.remove("visible-cv");
    });
  }
}

function handleScroll() {
  const backGro = document.querySelector(".CV-background");
  const leftColumn = document.querySelector(".cv-left-part");
  const scrollTop = window.scrollY || document.documentElement.scrollTop;

  // this coeffitients affect scrolling of two columns and their position on the page
  const scrollBack = 0.47;
  const scrollLeft = 0.7;
  const tranValueBack = `translateY(${scrollTop * scrollBack}px)`;
  const tranValueLeft = `translateY(${scrollTop * scrollLeft}px)`;
  backGro.style.transform = tranValueBack;
  leftColumn.style.transform = tranValueLeft;
}

function showDiploma(which) {
  const dialog = document.querySelector("#diplomaModal");
  dialog.showModal();
  const img = document.querySelector(".modal-img");
  img.src = `img/${which}`;
  dialog.addEventListener("click", () => {
    dialog.close();
  });
}

function addHoverEffect(card) {
  // to darken rest of the project cards when one is hovered
  const projects = document.querySelectorAll(".project-card");
  card.addEventListener("mouseenter", () => {
    projects.forEach((project) => {
      project.classList.add("darkened");
      project.querySelector(".projectText").classList.add("fade");
    });
    card.classList.remove("darkened");
    card.querySelector(".projectText").classList.remove("fade");
  });
  card.addEventListener("mouseleave", () => {
    projects.forEach((project) => {
      project.classList.remove("darkened");
      project.querySelector(".projectText").classList.remove("fade");
    });
  });
}
