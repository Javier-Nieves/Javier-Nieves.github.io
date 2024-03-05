"use strict";
let goingAway;
document.addEventListener("DOMContentLoaded", function () {
  // DOM selector
  const CVbtn = document.querySelector(".CV-btn");
  const backBtn = document.querySelector(".back-arrow");
  const cards = document.querySelectorAll(".project-card");
  const diplomas = document.querySelectorAll(".cv-diploma");

  //! handlers
  // views:
  CVbtn.addEventListener("click", () => showView("CV"));
  backBtn.addEventListener("click", () => showView("main"));

  // back button function
  window.addEventListener("popstate", function () {
    loadCorrectView();
  });

  // expanding project cards:
  let isThrottled;
  cards.forEach((card) => {
    // darken all cards except of the hovered:
    addHoverEffect(card);

    card.addEventListener("click", function () {
      if (!isThrottled) {
        showProject(this);
        // double click on a project card is forbidden
        isThrottled = true;
        setTimeout(function () {
          isThrottled = false;
        }, 700);
      }
    });
  });

  // show diplomas in a dialog window
  diplomas.forEach((img) => {
    img.addEventListener("click", () => {
      const school = img.dataset.diploma;
      showDiploma(school);
    });
  });

  // parallax scrolling in CV view
  window.addEventListener("scroll", handleScroll);
});

// todo - other view?
function loadCorrectView() {
  let url = window.location.href;
  if (url.slice(-1) === "/") {
    showView("main");
  }
}

function showView(name) {
  let show, hide;

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
  const cardIsExpanded = animateCard(projectCard);

  const upperText = [
    projectCard.querySelector(".projectDesc__small-text"),
    projectCard.querySelector(".projectDesc__big-text"),
    projectCard.querySelector(".projectDesc__medium-text"),
  ];
  const content = projectCard.querySelector(".ExpandedCardContent");
  const links = projectCard.querySelectorAll("a");
  const marker = projectCard.querySelector(".project-card__content").dataset
    .name;

  if (cardIsExpanded) {
    // stop scrolling when project card is expanded
    document.querySelector("body").style.overflow = "hidden";
    // change upper text style
    upperText.forEach((line) => line.classList.add(marker));
    // Project details appearance
    setTimeout(() => {
      content.classList.add("visible");
    }, 500);
    // if link is clicked - load spinner and deactivate all project cards
    links.forEach((link) => {
      link.addEventListener("click", () => {
        projectCard.querySelector(".projectDesc-container").style.display =
          "none";
        projectCard.querySelector(".spinner").style.display = "flex";
        goingAway = true;
      });
    });
  } else {
    // enable scrolling once again
    document.querySelector("body").style.overflow = "scroll";
    upperText.forEach((line) => line.classList.remove(marker));
    content.classList.remove("visible");
    // instant details hiding instead of 500ms transition:
    content.style.display = "none";
    setTimeout(() => {
      content.style.display = "flex";
    }, 400);

    // Cloning the element and replacing it will remove event listeners:
    if (goingAway) {
      const cards = document.querySelectorAll(".project-card");
      cards.forEach((card) => {
        const newCard = card.cloneNode(true);
        card.parentNode.replaceChild(newCard, card);
      });
    }
  }
  // window.history.pushState("_", "_", `/${adition}`);
}

function animateCard(projectCard) {
  projectCard.classList.toggle("expanded");
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
  return projectCard.className.includes("expanded");
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
    // darken all cards
    projects.forEach((project) => {
      project.classList.add("darkened");
      project.querySelector(".projectDesc-container").classList.add("fade");
      const ribbon = project.querySelector(".dev-ribbon");
      ribbon && ribbon.classList.add("dark-ribbon");
    });
    // lighten hovered card
    card.classList.remove("darkened");
    card.querySelector(".projectDesc-container").classList.remove("fade");
    const ribbon = card.querySelector(".dev-ribbon");
    ribbon && ribbon.classList.remove("dark-ribbon");
  });

  card.addEventListener("mouseleave", () => {
    const ribbons = document.querySelectorAll(".dev-ribbon");
    ribbons.forEach((ribbon) => ribbon.classList.remove("dark-ribbon"));
    projects.forEach((project) => {
      project.classList.remove("darkened");
      project.querySelector(".projectDesc-container").classList.remove("fade");
    });
  });
}
