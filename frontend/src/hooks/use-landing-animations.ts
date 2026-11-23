import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface UseLandingAnimationsOptions {
  enabled?: boolean;
}

export function useLandingAnimations({ enabled = true }: UseLandingAnimationsOptions = {}) {
  React.useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    // Small timeout to allow DOM layout & images/slides to settle
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    const ctx = gsap.context(() => {
      // Default easing for all entrance animations
      const easeDefault = "power3.out";

      // ========================================================
      // 1. HERO BANNER CAROUSEL
      // ========================================================
      const heroSection = document.querySelector('[data-animate-section="hero"]');
      if (heroSection) {
        const heroBanner = heroSection.querySelector('[data-animate="hero-banner"]');
        if (heroBanner) {
          gsap.fromTo(
            heroBanner,
            { opacity: 0, y: 40, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: easeDefault }
          );
        }
      }

      // ========================================================
      // 2. GAME PILIHAN HANYA UNTUK ANDA
      // Header from Left, Cards from Bottom (Staggered)
      // ========================================================
      const gamePilihanSection = document.querySelector('[data-animate-section="game-pilihan"]');
      if (gamePilihanSection) {
        const header = gamePilihanSection.querySelector('[data-animate="header"]');
        const cardsContainer = gamePilihanSection.querySelector('[data-animate="cards-track"]');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: gamePilihanSection,
            start: "top 85%",
            once: true,
          },
        });

        if (header) {
          tl.fromTo(
            header,
            { opacity: 0, x: -50 },
            { opacity: 1, x: 0, duration: 0.6, ease: easeDefault }
          );
        }

        if (cardsContainer) {
          const cards = cardsContainer.querySelectorAll('[data-product-card="true"]');
          if (cards && cards.length > 0) {
            tl.fromTo(
              cards,
              { opacity: 0, y: 35, scale: 0.95 },
              { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, ease: easeDefault },
              "-=0.3"
            );
          } else {
            tl.fromTo(
              cardsContainer,
              { opacity: 0, y: 35 },
              { opacity: 1, y: 0, duration: 0.6, ease: easeDefault },
              "-=0.3"
            );
          }
        }
      }

      // ========================================================
      // 3. DERETAN GAME TERPOPULER
      // Title from Left, Tabs from Right, 9 Cards Staggered from Bottom
      // ========================================================
      const popularSection = document.querySelector('[data-animate-section="popular-games"]');
      if (popularSection) {
        const title = popularSection.querySelector('[data-animate="title"]');
        const tabs = popularSection.querySelector('[data-animate="tabs"]');
        const cardsGrid = popularSection.querySelector('[data-animate="grid"]');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: popularSection,
            start: "top 85%",
            once: true,
          },
        });

        if (title) {
          tl.fromTo(
            title,
            { opacity: 0, x: -45 },
            { opacity: 1, x: 0, duration: 0.6, ease: easeDefault }
          );
        }

        if (tabs) {
          tl.fromTo(
            tabs,
            { opacity: 0, x: 45 },
            { opacity: 1, x: 0, duration: 0.6, ease: easeDefault },
            "-=0.4"
          );
        }

        if (cardsGrid) {
          const items = cardsGrid.children;
          tl.fromTo(
            items,
            { opacity: 0, y: 45 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: easeDefault },
            "-=0.3"
          );
        }
      }

      // ========================================================
      // 4. TAWARAN KHUSUS (Custom Section 1)
      // Header smooth, Product Cards 1 per 1 from Bottom (Staggered)
      // ========================================================
      const tawaranSection = document.querySelector('[data-animate-section="tawaran-khusus"]');
      if (tawaranSection) {
        const header = tawaranSection.querySelector('[data-animate="header"]');
        const cardsTrack = tawaranSection.querySelector('[data-animate="cards-track"]');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: tawaranSection,
            start: "top 85%",
            once: true,
          },
        });

        if (header) {
          tl.fromTo(
            header,
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.55, ease: easeDefault }
          );
        }

        if (cardsTrack) {
          const cards = cardsTrack.querySelectorAll('[data-product-card="true"]');
          if (cards && cards.length > 0) {
            tl.fromTo(
              cards,
              { opacity: 0, y: 40, scale: 0.94 },
              { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.12, ease: easeDefault },
              "-=0.25"
            );
          } else {
            tl.fromTo(
              cardsTrack,
              { opacity: 0, y: 35 },
              { opacity: 1, y: 0, duration: 0.6, ease: easeDefault },
              "-=0.25"
            );
          }
        }
      }

      // ========================================================
      // 5. RILISAN TERBARU (Custom Section 2)
      // Header from Left, Product Cards 1 per 1 from Bottom (Staggered)
      // ========================================================
      const rilisSection = document.querySelector('[data-animate-section="rilis-terbaru"]');
      if (rilisSection) {
        const header = rilisSection.querySelector('[data-animate="header"]');
        const cardsTrack = rilisSection.querySelector('[data-animate="cards-track"]');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rilisSection,
            start: "top 85%",
            once: true,
          },
        });

        if (header) {
          tl.fromTo(
            header,
            { opacity: 0, x: -35 },
            { opacity: 1, x: 0, duration: 0.55, ease: easeDefault }
          );
        }

        if (cardsTrack) {
          const cards = cardsTrack.querySelectorAll('[data-product-card="true"]');
          if (cards && cards.length > 0) {
            tl.fromTo(
              cards,
              { opacity: 0, y: 40, scale: 0.94 },
              { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.12, ease: easeDefault },
              "-=0.25"
            );
          } else {
            tl.fromTo(
              cardsTrack,
              { opacity: 0, y: 35 },
              { opacity: 1, y: 0, duration: 0.6, ease: easeDefault },
              "-=0.25"
            );
          }
        }
      }

      // Additional Custom Sections (if more than 2 dynamic sections exist)
      const additionalCustomSections = document.querySelectorAll(
        '[data-animate-section^="custom-sec-"]'
      );
      additionalCustomSections.forEach((sec) => {
        const header = sec.querySelector('[data-animate="header"]');
        const cardsTrack = sec.querySelector('[data-animate="cards-track"]');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sec,
            start: "top 85%",
            once: true,
          },
        });

        if (header) {
          tl.fromTo(
            header,
            { opacity: 0, x: -30 },
            { opacity: 1, x: 0, duration: 0.55, ease: easeDefault }
          );
        }

        if (cardsTrack) {
          const cards = cardsTrack.querySelectorAll('[data-product-card="true"]');
          if (cards && cards.length > 0) {
            tl.fromTo(
              cards,
              { opacity: 0, y: 40, scale: 0.94 },
              { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.12, ease: easeDefault },
              "-=0.25"
            );
          }
        }
      });

      // ========================================================
      // 6. MULAI MAIN DENGAN 4 LANGKAH
      // Heading from Left, Video Button from Right, 4 Step Cards Staggered Pop-In
      // ========================================================
      const stepsSection = document.querySelector('[data-animate-section="how-to-play"]');
      if (stepsSection) {
        const titleArea = stepsSection.querySelector('[data-animate="title-area"]');
        const buttonArea = stepsSection.querySelector('[data-animate="button-area"]');
        const outerCard = stepsSection.querySelector('[data-animate="outer-card"]');
        const stepItems = stepsSection.querySelectorAll('[data-animate="step-item"]');
        const svgTrack = stepsSection.querySelector('[data-animate="svg-track"]');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stepsSection,
            start: "top 80%",
            once: true,
          },
        });

        if (titleArea) {
          tl.fromTo(
            titleArea,
            { opacity: 0, x: -55 },
            { opacity: 1, x: 0, duration: 0.6, ease: easeDefault }
          );
        }

        if (buttonArea) {
          tl.fromTo(
            buttonArea,
            { opacity: 0, x: 55 },
            { opacity: 1, x: 0, duration: 0.6, ease: easeDefault },
            "-=0.4"
          );
        }

        if (outerCard) {
          tl.fromTo(
            outerCard,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: easeDefault },
            "-=0.2"
          );
        }

        if (svgTrack) {
          tl.fromTo(
            svgTrack,
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 0.5, ease: easeDefault },
            "-=0.4"
          );
        }

        if (stepItems && stepItems.length > 0) {
          tl.fromTo(
            stepItems,
            { opacity: 0, y: 35, scale: 0.96 },
            { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.1, ease: easeDefault },
            "-=0.3"
          );
        }
      }

      // ========================================================
      // 7. LEADERBOARD PREVIEW
      // Header from Top, Divider ScaleX, Monthly Column from Left, Weekly from Right
      // ========================================================
      const lbSection = document.querySelector('[data-animate-section="leaderboard"]');
      if (lbSection) {
        const header = lbSection.querySelector('[data-animate="header"]');
        const divider = lbSection.querySelector('[data-animate="divider"]');
        const monthlyCol = lbSection.querySelector('[data-animate="monthly-column"]');
        const weeklyCol = lbSection.querySelector('[data-animate="weekly-column"]');
        const rankItems = lbSection.querySelectorAll('[data-animate="rank-item"]');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: lbSection,
            start: "top 80%",
            once: true,
          },
        });

        if (header) {
          tl.fromTo(
            header,
            { opacity: 0, y: -35 },
            { opacity: 1, y: 0, duration: 0.6, ease: easeDefault }
          );
        }

        if (divider) {
          tl.fromTo(
            divider,
            { scaleX: 0, opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 0.6, ease: easeDefault },
            "-=0.3"
          );
        }

        if (monthlyCol) {
          tl.fromTo(
            monthlyCol,
            { opacity: 0, x: -50 },
            { opacity: 1, x: 0, duration: 0.65, ease: easeDefault },
            "-=0.2"
          );
        }

        if (weeklyCol) {
          tl.fromTo(
            weeklyCol,
            { opacity: 0, x: 50 },
            { opacity: 1, x: 0, duration: 0.65, ease: easeDefault },
            "-=0.5"
          );
        }

        if (rankItems && rankItems.length > 0) {
          tl.fromTo(
            rankItems,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.04, ease: easeDefault },
            "-=0.3"
          );
        }
      }

      // ========================================================
      // 8. TESTIMONIAL PELANGGAN
      // Header, Opinion Bar, Cards pop-in 1 per 1 from Bottom (Staggered)
      // ========================================================
      const testimonialSection = document.querySelector('[data-animate-section="testimonials"]');
      if (testimonialSection) {
        const header = testimonialSection.querySelector('[data-animate="header"]');
        const opinionBar = testimonialSection.querySelector('[data-animate="opinion-bar"]');
        const divider = testimonialSection.querySelector('[data-animate="divider"]');
        const carousel = testimonialSection.querySelector('[data-animate="carousel"]');
        const track = testimonialSection.querySelector<HTMLElement>(
          '[data-animate="testimonial-track"]'
        );

        // Ensure track is strictly paused before and during entrance animation
        if (track) {
          track.style.animationPlayState = "paused";
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: testimonialSection,
            start: "top 80%",
            once: true,
          },
          onComplete: () => {
            if (track) {
              // Pause slightly so user can view cards at rest, then resume auto swipe smoothly
              gsap.delayedCall(0.5, () => {
                track.style.animationPlayState = "running";
              });
            }
          },
        });

        if (header) {
          tl.fromTo(
            header,
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.55, ease: easeDefault }
          );
        }

        if (opinionBar) {
          tl.fromTo(
            opinionBar,
            { opacity: 0, scale: 0.94 },
            { opacity: 1, scale: 1, duration: 0.5, ease: easeDefault },
            "-=0.25"
          );
        }

        if (divider) {
          tl.fromTo(
            divider,
            { scaleX: 0, opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 0.6, ease: easeDefault },
            "-=0.2"
          );
        }

        if (carousel) {
          // Keep carousel container in place without horizontal slide
          tl.fromTo(
            carousel,
            { opacity: 0 },
            { opacity: 1, duration: 0.4, ease: easeDefault },
            "-=0.3"
          );

          const testimonialCards = testimonialSection.querySelectorAll(
            '[data-animate="testimonial-card"]'
          );
          if (testimonialCards && testimonialCards.length > 0) {
            const cardsArray = Array.from(testimonialCards);
            // Stagger the first 6 cards (visible on screen) 1 per 1 from bottom
            const initialCards = cardsArray.slice(0, 6);
            const remainingCards = cardsArray.slice(6);
            if (remainingCards.length > 0) {
              gsap.set(remainingCards, { opacity: 1 });
            }

            tl.fromTo(
              initialCards,
              { opacity: 0, y: 40, scale: 0.94 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.55,
                stagger: 0.12,
                ease: easeDefault,
                clearProps: "transform",
              },
              "-=0.25"
            );
          }
        }
      }

      // ========================================================
      // 9. FAQ (PERTANYAAN YANG SERING DITANYAKAN)
      // Left Column from Left, Accordion from Right (Staggered)
      // ========================================================
      const faqSection = document.querySelector('[data-animate-section="faq"]');
      if (faqSection) {
        const leftCol = faqSection.querySelector('[data-animate="left-column"]');
        const rightCol = faqSection.querySelector('[data-animate="right-column"]');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: faqSection,
            start: "top 80%",
            once: true,
          },
        });

        if (leftCol) {
          tl.fromTo(
            leftCol,
            { opacity: 0, x: -55 },
            { opacity: 1, x: 0, duration: 0.65, ease: easeDefault }
          );
        }

        if (rightCol) {
          const items = rightCol.querySelectorAll('[data-state]') || rightCol.children;
          if (items && items.length > 0) {
            tl.fromTo(
              items,
              { opacity: 0, x: 45 },
              { opacity: 1, x: 0, duration: 0.5, stagger: 0.09, ease: easeDefault },
              "-=0.35"
            );
          } else {
            tl.fromTo(
              rightCol,
              { opacity: 0, x: 45 },
              { opacity: 1, x: 0, duration: 0.6, ease: easeDefault },
              "-=0.35"
            );
          }
        }
      }

      // ========================================================
      // 10. BERITA GAMEZYGO
      // Header from Left, 4 Blog Cards with Alternating Diagonal Entrances
      // ========================================================
      const blogsSection = document.querySelector('[data-animate-section="blogs"]');
      if (blogsSection) {
        const header = blogsSection.querySelector('[data-animate="header"]');
        const blogGrid = blogsSection.querySelector('[data-animate="blog-grid"]');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: blogsSection,
            start: "top 80%",
            once: true,
          },
        });

        if (header) {
          tl.fromTo(
            header,
            { opacity: 0, x: -45 },
            { opacity: 1, x: 0, duration: 0.6, ease: easeDefault }
          );
        }

        if (blogGrid) {
          const cards = blogGrid.children;
          if (cards && cards.length >= 2) {
            // Left column cards from left, right column cards from right
            Array.from(cards).forEach((card, idx) => {
              const isEven = idx % 2 === 0;
              tl.fromTo(
                card,
                { opacity: 0, x: isEven ? -40 : 40, y: 30 },
                { opacity: 1, x: 0, y: 0, duration: 0.6, ease: easeDefault },
                "-=0.4"
              );
            });
          } else {
            tl.fromTo(
              blogGrid,
              { opacity: 0, y: 40 },
              { opacity: 1, y: 0, duration: 0.6, ease: easeDefault },
              "-=0.3"
            );
          }
        }
      }

      // ========================================================
      // 11. KOMUNITAS GAMEZYGO
      // Header from Top, Container Float-Up, 4 Cards Pop-In, Load More
      // ========================================================
      const communitySection = document.querySelector('[data-animate-section="community"]');
      if (communitySection) {
        const header = communitySection.querySelector('[data-animate="header"]');
        const divider = communitySection.querySelector('[data-animate="divider"]');
        const outerCard = communitySection.querySelector('[data-animate="outer-card"]');
        const innerHeader = communitySection.querySelector('[data-animate="inner-header"]');
        const communityCards = communitySection.querySelector('[data-animate="cards-grid"]');
        const loadMore = communitySection.querySelector('[data-animate="load-more"]');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: communitySection,
            start: "top 80%",
            once: true,
          },
        });

        if (header) {
          tl.fromTo(
            header,
            { opacity: 0, y: -30 },
            { opacity: 1, y: 0, duration: 0.6, ease: easeDefault }
          );
        }

        if (divider) {
          tl.fromTo(
            divider,
            { scaleX: 0, opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 0.6, ease: easeDefault },
            "-=0.3"
          );
        }

        if (outerCard) {
          tl.fromTo(
            outerCard,
            { opacity: 0, y: 45 },
            { opacity: 1, y: 0, duration: 0.65, ease: easeDefault },
            "-=0.2"
          );
        }

        if (innerHeader) {
          tl.fromTo(
            innerHeader,
            { opacity: 0, y: -15 },
            { opacity: 1, y: 0, duration: 0.45, ease: easeDefault },
            "-=0.3"
          );
        }

        if (communityCards) {
          const cards = communityCards.children;
          tl.fromTo(
            cards,
            { opacity: 0, y: 30, scale: 0.96 },
            { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: easeDefault },
            "-=0.2"
          );
        }

        if (loadMore) {
          tl.fromTo(
            loadMore,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.4, ease: easeDefault },
            "-=0.2"
          );
        }
      }
    });

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, [enabled]);
}
