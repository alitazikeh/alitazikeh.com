document.addEventListener("DOMContentLoaded", function () {
  var data = window.SITE_DATA || {};
  var body = document.body;
  var basePath = body.dataset.base || "";
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  function resolvePath(path) {
    if (!path) {
      return "";
    }

    if (/^https?:\/\//.test(path) || path.startsWith("mailto:") || path.startsWith("#")) {
      return path;
    }

    return basePath + path;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getProjectsByCategory(category) {
    return (data.projects || []).filter(function (project) {
      return project.category === category;
    });
  }

  var portfolioSections = [
    {
      key: "ux-ui-design",
      category: "UX/UI Design",
      type: "projects",
      gridId: "ux-grid",
      actionId: "ux-actions",
      pageHref: "ux-ui-design/",
      pageTitle: "UX/UI Design",
      pageDescription: "Case studies focused on process, systems, and user-centered thinking."
    },
    {
      key: "web-development",
      category: "Web Development",
      type: "projects",
      gridId: "web-grid",
      actionId: "web-actions",
      pageHref: "web-development/",
      pageTitle: "Web Development",
      pageDescription: "Responsive front-end work translated from structured design direction."
    },
    {
      key: "photography",
      category: "Photography",
      type: "photography",
      gridId: "photo-preview-grid",
      actionId: "photo-actions",
      pageHref: "photography/",
      pageTitle: "Photography",
      pageDescription: "Editorial image work presented as a curated collection with full-size viewing."
    },
    {
      key: "videography",
      category: "Videography",
      type: "projects",
      gridId: "video-grid",
      actionId: "video-actions",
      pageHref: "videography/",
      pageTitle: "Videography",
      pageDescription: "Short-form film and audio-driven work shaped by pacing, sound, and story."
    }
  ];

  function getPortfolioSection(sectionKey) {
    return portfolioSections.find(function (section) {
      return section.key === sectionKey;
    });
  }

  function createTagMarkup(tags) {
    return (tags || [])
      .map(function (tag) {
        return '<span class="tag-pill">' + escapeHtml(tag) + "</span>";
      })
      .join("");
  }

  function createProjectCard(project, options) {
    var settings = options || {};
    var cardClickable = settings.cardClickable !== false;
    var linkLabel = project.ctaLabel || (project.type === "case-study" ? "Explore Case Study" : "Open Project");
    var destination = project.type === "case-study" ? resolvePath(project.detailPage) : project.externalUrl;
    var target = project.type === "case-study" ? "" : ' target="_blank" rel="noreferrer"';
    var tools = project.meta && project.meta.tools ? project.meta.tools.join(" • ") : "";
    var footerAction = cardClickable
      ? '<span class="button button-secondary" aria-hidden="true">' +
        escapeHtml(linkLabel) +
        '<i data-lucide="arrow-up-right"></i></span>'
      : '<a class="button button-secondary interactive-hover" href="' + escapeHtml(resolvePath(destination)) + '"' + target + ">" +
        escapeHtml(linkLabel) +
        '<i data-lucide="arrow-up-right"></i></a>';

    if (cardClickable) {
      return (
        '<a class="portfolio-card reveal interactive-hover" href="' + escapeHtml(resolvePath(destination)) + '"' + target + ">" +
        '<div class="portfolio-media">' +
        '<img src="' + escapeHtml(resolvePath(project.coverImage)) + '" alt="' + escapeHtml(project.coverAlt) + '">' +
        "</div>" +
        '<div class="portfolio-card-body">' +
        '<div class="portfolio-chip-row">' + createTagMarkup(project.tags) + "</div>" +
        '<h3 class="portfolio-card-title">' + escapeHtml(project.title) + "</h3>" +
        '<p class="portfolio-card-copy">' + escapeHtml(project.summary) + "</p>" +
        '<div class="portfolio-meta">' +
        '<span><i data-lucide="briefcase"></i>' + escapeHtml(project.meta.role) + "</span>" +
        '<span><i data-lucide="sparkles"></i>' + escapeHtml(tools) + "</span>" +
        "</div>" +
        '<div class="portfolio-card-footer">' +
        footerAction +
        "</div>" +
        "</div>" +
        "</a>"
      );
    }

    return (
      '<article class="portfolio-card portfolio-card-static reveal">' +
      '<div class="portfolio-media">' +
      '<img src="' + escapeHtml(resolvePath(project.coverImage)) + '" alt="' + escapeHtml(project.coverAlt) + '">' +
      "</div>" +
      '<div class="portfolio-card-body">' +
      '<div class="portfolio-chip-row">' + createTagMarkup(project.tags) + "</div>" +
      '<h3 class="portfolio-card-title">' + escapeHtml(project.title) + "</h3>" +
      '<p class="portfolio-card-copy">' + escapeHtml(project.summary) + "</p>" +
      '<div class="portfolio-meta">' +
      '<span><i data-lucide="briefcase"></i>' + escapeHtml(project.meta.role) + "</span>" +
      '<span><i data-lucide="sparkles"></i>' + escapeHtml(tools) + "</span>" +
      "</div>" +
      '<div class="portfolio-card-footer">' +
      footerAction +
      "</div>" +
      "</div>" +
      "</article>"
    );
  }

  function createPortfolioAction(section, totalCount) {
    if (!section) {
      return "";
    }

    if (section.key === "photography") {
      return (
        '<a class="button button-secondary interactive-hover" href="' + escapeHtml(resolvePath(section.pageHref)) + '" target="_blank" rel="noreferrer">' +
        "Visit the Albums" +
        '<i data-lucide="arrow-up-right"></i>' +
        "</a>"
      );
    }

    if (totalCount <= 3) {
      return "";
    }

    return (
      '<a class="button button-secondary interactive-hover" href="' + escapeHtml(resolvePath(section.pageHref)) + '" target="_blank" rel="noreferrer">' +
      "See More" +
      '<i data-lucide="arrow-up-right"></i>' +
      "</a>"
    );
  }

  function createIconImageMarkup(item, className) {
    return '<img class="' + className + '" src="' + escapeHtml(resolvePath(item.iconUrl)) + '" alt="' + escapeHtml(item.name) + ' icon">';
  }

  function getFileNameWithoutExtension(path) {
    var segments = String(path || "").split("/");
    var fileName = segments[segments.length - 1] || "";
    return fileName.replace(/\.[^.]+$/, "");
  }

  function formatPhotoName(path) {
    var rawName = getFileNameWithoutExtension(path)
      .replace(/[_-]+/g, " ")
      .replace(/[()]/g, "")
      .trim();

    return rawName || "Untitled";
  }

  function getPhotographyItems() {
    return (data.photography || []).map(function (photo, index) {
      return Object.assign({ sequence: index + 1 }, photo);
    });
  }

  function getPhotographyAlbums() {
    var groups = {};
    var albums = [];

    getPhotographyItems().forEach(function (photo) {
      if (!groups[photo.collection]) {
        groups[photo.collection] = {
          name: photo.collection,
          coverImage: photo.src,
          coverAlt: photo.alt,
          items: []
        };
        albums.push(groups[photo.collection]);
      }

      groups[photo.collection].items.push(photo);
    });

    return albums;
  }

  function renderSkills() {
    var skillGrid = document.getElementById("skills-grid");
    var floatingIcons = document.getElementById("hero-floating-icons");
    var iconMarquee = document.getElementById("icon-marquee");
    var footerSocialRows = document.querySelectorAll("[data-footer-socials]");

    if (skillGrid) {
      skillGrid.innerHTML = (data.skillGroups || [])
        .map(function (group, index) {
          return (
            '<article class="skill-card reveal" style="--skill-accent:' + escapeHtml(group.accent) + ";--skill-delay:" + index + '">' +
            '<div class="skill-icon-row">' +
            (group.items || [])
              .map(function (item) {
                return (
                  '<span class="skill-chip' + (item.iconUrl ? '' : ' skill-chip-text') + '" title="' + escapeHtml(item.name) + '" aria-label="' + escapeHtml(item.name) + '">' +
                  (item.iconUrl ? createIconImageMarkup(item, "skill-icon") : escapeHtml(item.name)) +
                  "</span>"
                );
              })
              .join("") +
            "</div>" +
            '<h3 class="skill-title">' + escapeHtml(group.name) + "</h3>" +
            '<p class="skill-note">' + escapeHtml(group.note) + "</p>" +
            "</article>"
          );
        })
        .join("");
    }

    if (floatingIcons) {
      floatingIcons.innerHTML = (data.heroSkills || [])
        .slice(0, 7)
        .map(function (skill, index) {
          return (
            '<div class="floating-skill skill-pos-' + (index + 1) + '" style="--skill-accent:' + escapeHtml(skill.accent) +
            '" aria-label="' + escapeHtml(skill.name) + '" title="' + escapeHtml(skill.name) + '">' +
            createIconImageMarkup(skill, "floating-skill-icon") +
            '<span>' + escapeHtml(skill.name) + "</span>" +
            "</div>"
          );
        })
        .join("");
    }

    if (iconMarquee) {
      var marqueeItems = data.iconMarquee || [];
      var marqueeMarkup = marqueeItems
        .map(function (item) {
          return (
            '<span class="logo-marquee-item" title="' + escapeHtml(item.name) + '" aria-label="' + escapeHtml(item.name) + '">' +
            createIconImageMarkup(item, "logo-marquee-icon") +
            "</span>"
          );
        })
        .join("");

      iconMarquee.innerHTML =
        '<div class="logo-marquee-track">' + marqueeMarkup + "</div>" +
        '<div class="logo-marquee-track" aria-hidden="true">' + marqueeMarkup + "</div>";
    }

    if (footerSocialRows.length) {
      Array.prototype.forEach.call(footerSocialRows, function (row) {
        row.innerHTML = (data.heroSocials || [])
          .map(function (social) {
            return (
              '<a class="footer-social-link interactive-hover" href="' + escapeHtml(resolvePath(social.href)) + '" target="_blank" rel="noreferrer" aria-label="' + escapeHtml(social.name) +
              '" title="' + escapeHtml(social.name) + '">' +
              createIconImageMarkup(social, "footer-social-icon") +
              "</a>"
            );
          })
          .join("");
      });
    }
  }

  function renderProjectOverview() {
    portfolioSections
      .filter(function (section) {
        return section.type === "projects";
      })
      .forEach(function (section) {
        var items = getProjectsByCategory(section.category);
        var container = document.getElementById(section.gridId);
        var actionWrap = document.getElementById(section.actionId);

        if (!container) {
          return;
        }

        container.innerHTML = items
          .slice(0, 3)
          .map(function (project) {
            return createProjectCard(project, { cardClickable: false });
          })
          .join("");

        if (actionWrap) {
          actionWrap.innerHTML = createPortfolioAction(section, items.length);
        }
      });

    var photoPreview = document.getElementById("photo-preview-grid");
    var photoActions = document.getElementById("photo-actions");
    if (photoPreview) {
      photoPreview.innerHTML = getPhotographyAlbums()
        .slice(0, 3)
        .map(function (album) {
          return (
            '<button class="photo-preview-card reveal interactive-hover" type="button" data-photo-src="' + escapeHtml(album.coverImage) + '" data-lightbox-caption="' + escapeHtml(album.name) + '">' +
            '<img src="' + escapeHtml(resolvePath(album.coverImage)) + '" alt="' + escapeHtml(album.coverAlt) + '">' +
            '<span class="photo-preview-label">' + escapeHtml(album.name) + "</span>" +
            "</button>"
          );
        })
        .join("");
    }

    if (photoActions) {
      photoActions.innerHTML = createPortfolioAction(getPortfolioSection("photography"), getPhotographyAlbums().length);
    }
  }

  function renderCategoryPage() {
    if (body.dataset.page !== "portfolio-category") {
      return;
    }

    var section = getPortfolioSection(body.dataset.sectionKey || "");
    if (!section) {
      return;
    }

    document.title = section.pageTitle + " | Ali Tazikeh";

    var title = document.getElementById("category-page-title");
    var copy = document.getElementById("category-page-copy");
    var projectGrid = document.getElementById("category-project-grid");

    if (title) {
      title.textContent = section.pageTitle;
    }

    if (copy) {
      copy.textContent = section.pageDescription;
    }

    if (section.type === "projects" && projectGrid) {
      projectGrid.innerHTML = getProjectsByCategory(section.category)
        .map(function (project) {
            return createProjectCard(project, { cardClickable: false });
          })
        .join("");
    }
  }

  var photoState = {
    filter: "All",
    sort: "curated"
  };

  function getFilteredPhotos() {
    var photos = getPhotographyItems();

    if (photoState.filter !== "All") {
      photos = photos.filter(function (photo) {
        return photo.collection === photoState.filter;
      });
    }

    photos.sort(function (a, b) {
      if (photoState.sort === "reverse") {
        return b.sequence - a.sequence;
      }

      return a.sequence - b.sequence;
    });

    return photos;
  }

  function renderPhotographyFilters() {
    var filterWrap = document.getElementById("photo-filters");
    var sortSelect = document.getElementById("photo-sort");
    if (!filterWrap || !sortSelect) {
      return;
    }

    var collections = ["All"].concat(
      Array.from(
        new Set(
          getPhotographyItems().map(function (photo) {
            return photo.collection;
          })
        )
      )
    );

    filterWrap.innerHTML = collections
      .map(function (collection) {
        var activeClass = collection === photoState.filter ? " is-active" : "";
        return (
          '<button class="filter-chip interactive-hover' + activeClass + '" type="button" data-filter="' + escapeHtml(collection) + '">' +
          escapeHtml(collection) +
          "</button>"
        );
      })
      .join("");

    sortSelect.value = photoState.sort;
  }

  function renderPhotographyGrid() {
    var grid = document.getElementById("photography-grid");
    if (!grid) {
      return;
    }

    var filteredPhotos = getFilteredPhotos();

    grid.innerHTML = filteredPhotos
      .map(function (photo) {
        return (
          '<button class="photo-card interactive-hover" type="button" data-photo-src="' + escapeHtml(photo.src) + '" data-lightbox-caption="' + escapeHtml(formatPhotoName(photo.src)) + '">' +
          '<img src="' + escapeHtml(resolvePath(photo.src)) + '" alt="' + escapeHtml(photo.alt) + '">' +
          '<span class="photo-card-meta">' +
          '<strong>' + escapeHtml(formatPhotoName(photo.src)) + "</strong>" +
          "</span>" +
          "</button>"
        );
      })
      .join("");
  }

  function createLightbox() {
    var lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.id = "lightbox";
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.innerHTML =
      '<div class="lightbox-backdrop" data-close-lightbox="true"></div>' +
      '<div class="lightbox-dialog" role="dialog" aria-modal="true" aria-label="Image preview" tabindex="-1">' +
      '<button class="lightbox-close interactive-hover" type="button" aria-label="Close preview" data-close-lightbox="true"><i data-lucide="x"></i></button>' +
      '<img class="lightbox-image" src="" alt="">' +
      '<div class="lightbox-caption"></div>' +
      "</div>";
    document.body.appendChild(lightbox);
    refreshIcons();
    return lightbox;
  }

  var lightbox = null;

  function openLightbox(lightboxData) {
    if (!lightbox) {
      lightbox = createLightbox();
    }

    lightbox.querySelector(".lightbox-image").src = resolvePath(lightboxData.src);
    lightbox.querySelector(".lightbox-image").alt = lightboxData.alt || "";
    lightbox.querySelector(".lightbox-caption").textContent = lightboxData.caption || "";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    lightbox.querySelector(".lightbox-dialog").focus();
  }

  function closeLightbox() {
    if (!lightbox) {
      return;
    }

    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
  }

  function renderProjectPage() {
    if (body.dataset.page !== "project") {
      return;
    }

    var project = (data.projects || []).find(function (item) {
      return item.id === body.dataset.projectId;
    });

    if (!project) {
      return;
    }

    document.title = project.title + " | Ali Tazikeh";

    var heroShell = document.getElementById("project-shell");
    var storyShell = document.getElementById("project-story");
    if (!heroShell || !storyShell) {
      return;
    }

    heroShell.innerHTML =
      '<div class="project-hero-copy reveal">' +
      '<span class="section-label">Case Study</span>' +
      '<h1 class="project-title">' + escapeHtml(project.title) + "</h1>" +
      '<p class="project-summary">' + escapeHtml(project.summary) + "</p>" +
      (project.liveUrl
        ? '<div class="hero-actions"><a class="button button-primary interactive-hover" href="' + escapeHtml(project.liveUrl) + '" target="_blank" rel="noreferrer">' +
          escapeHtml(project.liveLabel || "Visit Live Site") +
          '<i data-lucide="arrow-up-right"></i></a></div>'
        : "") +
      '<div class="project-tag-row">' + createTagMarkup(project.tags) + "</div>" +
      '<div class="project-meta-grid">' +
      '<div class="project-meta-card"><span>Role</span><strong>' + escapeHtml(project.meta.role) + "</strong></div>" +
      '<div class="project-meta-card"><span>Tools</span><strong>' + escapeHtml(project.meta.tools.join(", ")) + "</strong></div>" +
      '<div class="project-meta-card"><span>Deliverables</span><strong>' + escapeHtml(project.meta.deliverables) + "</strong></div>" +
      '<div class="project-meta-card"><span>Outcome</span><strong>' + escapeHtml(project.meta.outcome) + "</strong></div>" +
      "</div>" +
      "</div>" +
      '<div class="project-hero-media reveal">' +
      '<button class="project-image-button interactive-hover" type="button" data-lightbox-src="' + escapeHtml(project.coverImage) + '" data-lightbox-alt="' + escapeHtml(project.coverAlt) + '" data-lightbox-caption="' + escapeHtml(project.title) + '">' +
      '<img src="' + escapeHtml(resolvePath(project.coverImage)) + '" alt="' + escapeHtml(project.coverAlt) + '">' +
      "</button>" +
      "</div>";

    storyShell.innerHTML =
      '<section class="project-highlight-band reveal">' +
      (project.highlights || [])
        .map(function (highlight) {
          return '<article class="highlight-card"><i data-lucide="sparkles"></i><p>' + escapeHtml(highlight) + "</p></article>";
        })
        .join("") +
      "</section>" +
      (project.storyBlocks || [])
        .map(function (block) {
          if (block.type === "text") {
            return (
              '<section class="story-block story-text reveal">' +
              '<span class="section-label">' + escapeHtml(block.eyebrow) + "</span>" +
              '<div class="story-copy">' +
              '<h2>' + escapeHtml(block.title) + "</h2>" +
              (block.paragraphs || [])
                .map(function (paragraph) {
                  return "<p>" + escapeHtml(paragraph) + "</p>";
                })
                .join("") +
              "</div>" +
              "</section>"
            );
          }

          if (block.type === "list") {
            return (
              '<section class="story-block story-list reveal">' +
              '<span class="section-label">' + escapeHtml(block.eyebrow) + "</span>" +
              '<div class="story-copy">' +
              '<h2>' + escapeHtml(block.title) + "</h2>" +
              '<p>' + escapeHtml(block.intro || "") + "</p>" +
              '<ul class="story-list-items">' +
              (block.items || [])
                .map(function (item) {
                  return '<li><i data-lucide="arrow-up-right"></i><span>' + escapeHtml(item) + "</span></li>";
                })
                .join("") +
              "</ul>" +
              "</div>" +
              "</section>"
            );
          }

          if (block.type === "gallery") {
            return (
              '<section class="story-block story-gallery reveal">' +
              '<span class="section-label">' + escapeHtml(block.eyebrow) + "</span>" +
              '<div class="story-copy"><h2>' + escapeHtml(block.title) + "</h2></div>" +
              '<div class="gallery-layout gallery-' + escapeHtml(block.layout || "grid") + '">' +
              (block.images || [])
                .map(function (image) {
                  return (
                    '<figure class="gallery-card">' +
                    '<button class="gallery-card-button interactive-hover" type="button" data-lightbox-src="' + escapeHtml(image.src) + '" data-lightbox-alt="' + escapeHtml(image.alt) + '" data-lightbox-caption="' + escapeHtml(image.caption || block.title) + '">' +
                    '<img src="' + escapeHtml(resolvePath(image.src)) + '" alt="' + escapeHtml(image.alt) + '">' +
                    "</button>" +
                    '<figcaption>' +
                    '<strong>' + escapeHtml(image.caption || "") + "</strong>" +
                    "</figcaption>" +
                    "</figure>"
                  );
                })
                .join("") +
              "</div>" +
              "</section>"
            );
          }

          return "";
        })
        .join("");
  }

  function initPhotoInteractions() {
    document.addEventListener("click", function (event) {
      var projectLink = event.target.closest("a[href]");
      var filterButton = event.target.closest("[data-filter]");
      var photoButton = event.target.closest("[data-photo-src]");
      var genericLightboxButton = event.target.closest("[data-lightbox-src]");
      var lightboxClose = event.target.closest("[data-close-lightbox]");

      if (projectLink) {
        try {
          var projectUrl = new URL(projectLink.href, window.location.href);
          if (projectUrl.origin === window.location.origin && /\/projects\//.test(projectUrl.pathname) && body.dataset.page !== "project") {
            window.sessionStorage.setItem("portfolioReturnState", JSON.stringify({
              href: window.location.href,
              scrollY: window.scrollY
            }));
          }
        } catch (error) {
          // Ignore malformed links and keep their default browser behavior.
        }
      }

      if (filterButton) {
        photoState.filter = filterButton.dataset.filter;
        renderPhotographyFilters();
        renderPhotographyGrid();
        refreshIcons();
        return;
      }

      if (photoButton) {
        var photo = getPhotographyItems().find(function (item) {
          return item.src === photoButton.dataset.photoSrc;
        });

        if (photo) {
          openLightbox({
            src: photo.src,
            alt: photo.alt,
            caption: formatPhotoName(photo.src)
          });
        }
        return;
      }

      if (genericLightboxButton) {
        openLightbox({
          src: genericLightboxButton.dataset.lightboxSrc,
          alt: genericLightboxButton.dataset.lightboxAlt,
          caption: genericLightboxButton.dataset.lightboxCaption
        });
        return;
      }

      if (lightboxClose) {
        closeLightbox();
      }
    });

    var sortSelect = document.getElementById("photo-sort");
    if (sortSelect) {
      sortSelect.addEventListener("change", function (event) {
        photoState.sort = event.target.value;
        renderPhotographyGrid();
        refreshIcons();
      });
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeLightbox();
      }
    });
  }

  function initCursorGlow() {
    if (!finePointer || reducedMotion) {
      body.classList.add("no-cursor-glow");
      return;
    }

    var cursorGlow = document.getElementById("cursor-glow");
    var cursorCore = document.getElementById("cursor-core");
    if (!cursorGlow || !cursorCore) {
      return;
    }

    var position = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    var target = { x: position.x, y: position.y };

    function animateCursor() {
      position.x += (target.x - position.x) * 0.32;
      position.y += (target.y - position.y) * 0.32;
      cursorGlow.style.transform = "translate3d(" + position.x + "px, " + position.y + "px, 0)";
      cursorCore.style.transform = "translate3d(" + position.x + "px, " + position.y + "px, 0)";
      window.requestAnimationFrame(animateCursor);
    }

    document.addEventListener("mousemove", function (event) {
      target.x = event.clientX;
      target.y = event.clientY;
      body.classList.add("cursor-visible");
    });

    animateCursor();
  }

  function initNavState() {
    var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
    if (!navLinks.length) {
      return;
    }

    function setActiveNav(targetId) {
      navLinks.forEach(function (link) {
        var href = link.getAttribute("href") || "";
        link.classList.toggle("is-active", href.endsWith("#" + targetId));
      });
    }

    if (body.dataset.page !== "home") {
      setActiveNav("portfolio");
      return;
    }

    var sections = ["about", "skills", "portfolio", "contact"]
      .map(function (id) {
        return document.getElementById(id);
      })
      .filter(Boolean);

    if (!sections.length) {
      return;
    }

    function updateActiveSection() {
      var marker = window.scrollY + window.innerHeight * 0.4;
      var activeId = null;

      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 24) {
        setActiveNav(sections[sections.length - 1].id);
        return;
      }

      if (marker < sections[0].offsetTop) {
        setActiveNav("");
        return;
      }

      sections.forEach(function (section) {
        if (section.offsetTop <= marker) {
          activeId = section.id;
        }
      });

      setActiveNav(activeId);
    }

    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    updateActiveSection();
  }

  function initProjectReturnLink() {
    var restoreState = null;
    try {
      restoreState = JSON.parse(window.sessionStorage.getItem("portfolioRestoreState") || "null");
    } catch (error) {
      window.sessionStorage.removeItem("portfolioRestoreState");
    }

    if (body.dataset.page !== "project") {
      if (restoreState && restoreState.href) {
        try {
          var restoreUrl = new URL(restoreState.href, window.location.href);
          if (restoreUrl.origin === window.location.origin && restoreUrl.pathname === window.location.pathname && restoreUrl.search === window.location.search) {
            window.sessionStorage.removeItem("portfolioRestoreState");
            window.requestAnimationFrame(function () {
              window.requestAnimationFrame(function () {
                window.scrollTo({ top: Number(restoreState.scrollY) || 0, behavior: "auto" });
              });
            });
          }
        } catch (error) {
          window.sessionStorage.removeItem("portfolioRestoreState");
        }
      }
      return;
    }

    var topBackLink = document.querySelector(".project-breadcrumb");
    var backCard = document.querySelector(".project-cta-card");

    if (topBackLink) {
      topBackLink.classList.add("project-back-link");
      topBackLink.innerHTML = '<i data-lucide="arrow-left"></i><span>Back</span>';
    }

    if (backCard) {
      backCard.classList.add("is-back-only");
      backCard.innerHTML = '<a class="button button-primary interactive-hover project-back-link" href="../../#portfolio"><i data-lucide="arrow-left"></i><span>Back</span></a>';
    }

    var backLinks = Array.prototype.slice.call(document.querySelectorAll(".project-back-link"));
    var returnState = null;
    try {
      returnState = JSON.parse(window.sessionStorage.getItem("portfolioReturnState") || "null");
    } catch (error) {
      window.sessionStorage.removeItem("portfolioReturnState");
    }

    var fallbackHref = (topBackLink && topBackLink.getAttribute("href")) || "../../#portfolio";
    var returnHref = (returnState && returnState.href) || document.referrer || fallbackHref;
    if (!returnHref || !backLinks.length) {
      return;
    }

    try {
      var parsedUrl = new URL(returnHref, window.location.href);
      if (parsedUrl.origin === window.location.origin) {
        backLinks.forEach(function (link) {
          link.href = parsedUrl.href;
          link.addEventListener("click", function (event) {
            event.preventDefault();
            if (returnState && returnState.href) {
              window.sessionStorage.setItem("portfolioRestoreState", JSON.stringify(returnState));
              window.location.assign(parsedUrl.href);
              return;
            }
            if (document.referrer && window.history.length > 1) {
              window.history.back();
              return;
            }
            window.location.assign(parsedUrl.href);
          });
        });
      }
    } catch (error) {
      // Keep the fallback href from markup when the stored URL is invalid.
    }
  }

  function initPortraitTilt() {
    if (!finePointer || reducedMotion) {
      return;
    }

    var stage = document.getElementById("portrait-stage");
    var portraitCard = document.getElementById("portrait-card");

    if (!stage || !portraitCard) {
      return;
    }

    stage.addEventListener("mousemove", function (event) {
      var bounds = stage.getBoundingClientRect();
      var centerX = bounds.left + bounds.width / 2;
      var centerY = bounds.top + bounds.height / 2;
      var rotateY = ((event.clientX - centerX) / bounds.width) * 14;
      var rotateX = ((centerY - event.clientY) / bounds.height) * 14;

      portraitCard.style.transform =
        "rotateX(" + rotateX.toFixed(2) + "deg) rotateY(" + rotateY.toFixed(2) + "deg) translateY(-8px)";
    });

    stage.addEventListener("mouseleave", function () {
      portraitCard.style.transform = "";
    });
  }

  function initRevealAnimations() {
    var revealItems = document.querySelectorAll(".reveal");
    if (!revealItems.length) {
      return;
    }

    if (window.gsap && window.ScrollTrigger && !reducedMotion) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      window.gsap.utils.toArray(".reveal").forEach(function (item, index) {
        window.gsap.fromTo(
          item,
          { autoAlpha: 0, y: 32 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            delay: Math.min(index * 0.02, 0.2),
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 88%"
            }
          }
        );
      });

      var parallaxTarget = document.querySelector(".hero-visual-glow");
      if (parallaxTarget) {
        window.gsap.to(parallaxTarget, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero-section",
            scrub: true
          }
        });
      }

      return;
    }

    var observer = new IntersectionObserver(
      function (entries, revealObserver) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  }

  function initContactForm() {
    var form = document.getElementById("contact-form");
    var status = document.getElementById("form-status");
    var submitButton = document.getElementById("submit-button");
    if (!form || !status || !submitButton) {
      return;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        status.textContent = "Please complete the required fields before sending your message.";
        status.className = "form-status is-error";
        return;
      }

      if (!data.formspreeEndpoint || data.formspreeEndpoint.indexOf("your-form-id") !== -1) {
        status.innerHTML =
          'Add your real Formspree endpoint in <code>js/data.js</code> to activate live form delivery. You can still email <a href="mailto:' +
          escapeHtml(data.contactEmail) +
          '">' +
          escapeHtml(data.contactEmail) +
          "</a> directly.";
        status.className = "form-status is-error";
        return;
      }

      var formData = new FormData(form);
      submitButton.disabled = true;
      submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span> Sending';
      status.textContent = "Sending your message...";
      status.className = "form-status";

      fetch(data.formspreeEndpoint, {
        method: "POST",
        headers: {
          Accept: "application/json"
        },
        body: formData
      })
        .then(function (response) {
          if (!response.ok) {
            throw new Error("Submission failed");
          }

          form.reset();
          form.classList.remove("was-validated");
          status.textContent = "Message sent successfully. I will follow up by email.";
          status.className = "form-status is-success";
        })
        .catch(function () {
          status.innerHTML =
            'Something went wrong while sending the form. Please try again or email <a href="mailto:' +
            escapeHtml(data.contactEmail) +
            '">' +
            escapeHtml(data.contactEmail) +
            "</a> directly.";
          status.className = "form-status is-error";
        })
        .finally(function () {
          submitButton.disabled = false;
          submitButton.innerHTML = 'Send Message <i data-lucide="arrow-up-right"></i>';
          refreshIcons();
        });
    });
  }

  function refreshIcons() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  renderSkills();
  renderProjectOverview();
  renderCategoryPage();
  renderPhotographyFilters();
  renderPhotographyGrid();
  renderProjectPage();
  initNavState();
  initProjectReturnLink();
  initPhotoInteractions();
  initCursorGlow();
  initPortraitTilt();
  initRevealAnimations();
  initContactForm();
  refreshIcons();

  var year = document.getElementById("current-year");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
});
