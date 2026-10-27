// Navigation Actvie Page
const navLinks = document.querySelectorAll("header nav a");
const logoLink = document.querySelector(".logo");
const sections = document.querySelectorAll("section");
const menuIcon = document.querySelector("#menu-icon");
const navbar = document.querySelector("header nav");

menuIcon.addEventListener("click", () => {
  menuIcon.classList.toggle("fa-xmark");
  navbar.classList.toggle("actvie");
});

const activePage = () => {
  const header = document.querySelector("header");
  const barsBox = document.querySelector(".bars-box");

  header.classList.remove("active");
  setTimeout(() => {
    header.classList.add("active");
  }, 1100);

  navLinks.forEach((link) => {
    link.classList.remove("active");
  });

  barsBox.classList.remove("active");
  setTimeout(() => {
    barsBox.classList.add("active");
  }, 1100);

  sections.forEach((section) => {
    section.classList.remove("active");
  });

  menuIcon.classList.remove("fa-xmark");
  navbar.classList.remove("actvie");
};

navLinks.forEach((link, idx) => {
  link.addEventListener("click", () => {
    if (!link.classList.contains("active")) {
      activePage();

      link.classList.add("active");

      setTimeout(() => {
        sections[idx].classList.add("active");
      }, 1100);
    }
  });
});

logoLink.addEventListener("click", () => {
  if (!navLinks[0].classList.contains("active")) {
    activePage();

    navLinks[0].classList.add("active");

    setTimeout(() => {
      sections[0].classList.add("active");
    }, 1100);
  }
});

// Resume Active
const resumeBtns = document.querySelectorAll(".resume-btn");

resumeBtns.forEach((btn, idx) => {
  btn.addEventListener("click", () => {
    const resumeDetail = document.querySelectorAll(".resume-detail");

    resumeBtns.forEach((btn) => {
      btn.classList.remove("active");
    });
    btn.classList.add("active");

    resumeDetail.forEach((detail) => {
      detail.classList.remove("active");
    });
    resumeDetail[idx].classList.add("active");
  });
});

// Carousel
const arrowRight = document.querySelector(
  ".portfolio-box .navigation .arrow-right",
);
const arrowLeft = document.querySelector(
  ".portfolio-box .navigation .arrow-left",
);

let index = 0;
const totalSlides = document.querySelectorAll(
  ".portfolio-carousel .img-item",
).length;

const activePortfolio = () => {
  const imgSlide = document.querySelector(".portfolio-carousel .img-slide");
  const portfolioDetails = document.querySelectorAll(".portfolio-detail");

  imgSlide.style.transform = `translateX(-${index * 100}%)`;

  portfolioDetails.forEach((detail) => detail.classList.remove("active"));
  portfolioDetails[index].classList.add("active");

  arrowLeft.classList.toggle("disabled", index === 0);
  arrowRight.classList.toggle("disabled", index === totalSlides - 1);
};

arrowRight.addEventListener("click", () => {
  if (index < totalSlides - 1) {
    index++;
    activePortfolio();
  }
});

arrowLeft.addEventListener("click", () => {
  if (index > 0) {
    index--;
    activePortfolio();
  }
});

// Initialize
activePortfolio();

// Contact
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("contactSubmit");

  const API_URL = "https://larasoftbd.xyz/api/v1/contact";

  let toastTimer;
  let removeTimer;

  // Toast Notification Function
  function showToast(message, type = "success") {
    // Remove existing toast timers
    clearTimeout(toastTimer);
    clearTimeout(removeTimer);

    // Remove previous toast
    document
      .querySelectorAll(".contact-toast")
      .forEach((toast) => toast.remove());

    const toast = document.createElement("div");

    toast.className = `contact-toast ${type}`;
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.textContent = message;

    document.body.appendChild(toast);

    // Hide toast after 4 seconds
    toastTimer = setTimeout(function () {
      toast.classList.add("hide");

      removeTimer = setTimeout(function () {
        toast.remove();
      }, 300);
    }, 4000);
  }

  // Contact Form Submission
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Validate form
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Get form data
    const formData = new FormData(form);

    const payload = {
      name: formData.get("name").trim(),
      email: formData.get("email").trim(),
      subject: formData.get("subject").trim(),
      message: formData.get("message").trim(),
    };

    // Prevent duplicate submissions
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    try {
      const response = await fetch(API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        body: JSON.stringify(payload),
      });

      // Parse API response
      const result = await response.json().catch(() => ({}));

      // Handle failed response
      if (!response.ok) {
        let errorMessage =
          result.message || "Failed to send your message. Please try again.";

        // Laravel validation errors
        if (response.status === 422 && result.errors) {
          errorMessage = Object.values(result.errors).flat().join(" ");
        }

        throw new Error(errorMessage);
      }

      // Success Toast
      showToast(
        result.message || "Your message has been submitted successfully.",
        "success",
      );

      // Reset form after success
      form.reset();
    } catch (error) {
      // Error Toast
      const errorMessage =
        error instanceof TypeError
          ? "Unable to connect to the server. Please try again."
          : error.message;

      showToast(errorMessage, "error");

      console.error("Contact form error:", error);
    } finally {
      // Restore submit button
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    }
  });
});
