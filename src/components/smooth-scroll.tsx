'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let scroller: import('locomotive-scroll').default;

    import('locomotive-scroll').then((LocomotiveScrollModule) => {
      const LocomotiveScroll = LocomotiveScrollModule.default;
      const scrollEl = containerRef.current;
      if (!scrollEl) return;

      scroller = new LocomotiveScroll({
        el: scrollEl,
        smooth: true,
      });

      scroller.on('scroll', ScrollTrigger.update);

      ScrollTrigger.scrollerProxy(scrollEl, {
        scrollTop(value) {
          if (arguments.length) {
            scroller.scrollTo(value, { duration: 0, disableLerp: true });
          }
          return scroller.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },
        pinType: scrollEl.style.transform ? 'transform' : 'fixed',
      });

      const lsUpdate = () => {
        if (scroller) {
          scroller.update();
        }
      };

      ScrollTrigger.addEventListener('refresh', lsUpdate);
      ScrollTrigger.refresh();

      // --- COLOR CHANGER ---
      const scrollColorElems = document.querySelectorAll('[data-bgcolor]');
      scrollColorElems.forEach((colorSection, i) => {
        const prevBg = i === 0 ? '' : (scrollColorElems[i - 1] as HTMLElement).dataset.bgcolor;

        ScrollTrigger.create({
          trigger: colorSection,
          scroller: scrollEl,
          start: 'top 50%',
          onEnter: () =>
            gsap.to('body', {
              backgroundColor: (colorSection as HTMLElement).dataset.bgcolor,
              overwrite: 'auto',
            }),
          onLeaveBack: () =>
            gsap.to('body', {
              backgroundColor: prevBg,
              overwrite: 'auto',
            }),
        });
      });

        // --- ANCHOR LINKS ---
        const anchorLinks = document.querySelectorAll('a[data-scroll-to]');
        anchorLinks.forEach(anchor => {
            const targetAttr = anchor.getAttribute('href');
            if (targetAttr) {
                const targetEl = document.querySelector(targetAttr);
                if (targetEl) {
                    anchor.addEventListener('click', (e) => {
                        e.preventDefault();
                        scroller.scrollTo(targetEl);
                    })
                }
            }
        });
    });


    return () => {
      if (scroller) {
        ScrollTrigger.removeEventListener('refresh', () => scroller.update());
        scroller.destroy();
      }
    };
  }, []);

  return (
    <main ref={containerRef} data-scroll-container>
      {children}
    </main>
  );
}
