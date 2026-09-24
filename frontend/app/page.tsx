"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMouse({
        x: (event.clientX / window.innerWidth - 0.5) * 2,
        y: (event.clientY / window.innerHeight - 0.5) * 2,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white selection:bg-white selection:text-black">
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-14px);
          }
        }

        @keyframes pulseGlow {
          0%,
          100% {
            opacity: 0.35;
            transform: scale(1);
          }
          50% {
            opacity: 0.65;
            transform: scale(1.08);
          }
        }

        @keyframes scan {
          0% {
            transform: translateY(-120px);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translateY(120px);
            opacity: 0;
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .float {
          animation: float 5s ease-in-out infinite;
        }

        .pulse-glow {
          animation: pulseGlow 4s ease-in-out infinite;
        }

        .scan-line {
          animation: scan 3s ease-in-out infinite;
        }

        .shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
      `}</style>

      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute left-1/2 top-[-20%] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[140px] transition-transform duration-700"
          style={{
            transform: `translate(calc(-50% + ${mouse.x * 25}px), ${
              mouse.y * 25
            }px)`,
          }}
        />

        <div
          className="absolute right-[-10%] top-[25%] h-[400px] w-[400px] rounded-full bg-cyan-400/10 blur-[120px] transition-transform duration-700"
          style={{
            transform: `translate(${mouse.x * -20}px, ${mouse.y * -20}px)`,
          }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_75%)]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="relative z-10">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
          <a href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-white text-black">
              <span className="text-sm font-black">T</span>
            </div>

            <span className="text-sm font-semibold tracking-tight sm:text-base">
              TapForMenu
            </span>
          </a>

          <div className="hidden items-center gap-8 text-sm text-white/45 md:flex">
            <a
              href="#how"
              className="transition hover:text-white"
            >
              How it works
            </a>

            <a
              href="#restaurants"
              className="transition hover:text-white"
            >
              For restaurants
            </a>
          </div>

          <a
            href="/seaking-seafood-restaurant/"
            className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-medium backdrop-blur-xl transition hover:border-white/20 hover:bg-white/10 sm:px-5 sm:py-2.5 sm:text-sm"
          >
            View demo
          </a>
        </nav>

        <section className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl flex-col items-center px-5 pb-20 pt-20 text-center sm:px-8 sm:pt-28 lg:px-10 lg:pt-32">
          <div className="mb-7 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 backdrop-blur-xl">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>

            <span className="text-[11px] font-medium text-white/55">
              The new way to experience menus
            </span>
          </div>

          <h1 className="max-w-5xl text-[3.5rem] font-semibold leading-[0.92] tracking-[-0.065em] sm:text-7xl lg:text-[7.5rem]">
            Your menu
            <br />
            <span className="bg-gradient-to-r from-white via-white to-white/35 bg-clip-text text-transparent">
              starts with a tap.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-sm leading-6 text-white/40 sm:text-base sm:leading-7">
            A digital menu experience built for the way people discover
            restaurants today. Tap, scan, and explore.
          </p>

          <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a
              href="/seaking-seafood-restaurant/"
              className="group flex h-12 items-center justify-center gap-3 rounded-full bg-white px-7 text-sm font-semibold text-black transition hover:scale-[1.02] hover:bg-white/90"
            >
              Explore a real menu

              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>

            <a
              href="#how"
              className="flex h-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-7 text-sm font-medium text-white/70 backdrop-blur-xl transition hover:bg-white/[0.07] hover:text-white"
            >
              See how it works
            </a>
          </div>

          <div className="relative mt-20 w-full max-w-4xl sm:mt-28">
            <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/20 blur-[100px] pulse-glow" />

            <div
              className="float relative mx-auto w-[270px] sm:w-[310px]"
              style={{
                transform: `perspective(1000px) rotateY(${
                  mouse.x * 4
                }deg) rotateX(${mouse.y * -4}deg)`,
              }}
            >
              <div className="rounded-[38px] border border-white/15 bg-[#111]/90 p-2 shadow-[0_30px_100px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
                <div className="overflow-hidden rounded-[30px] bg-[#f7f7f5] text-left text-black">
                  <div className="relative h-28 bg-gradient-to-br from-slate-900 via-slate-700 to-cyan-900">
                    <div className="absolute inset-0 bg-black/20" />

                    <div className="absolute bottom-3 left-4">
                      <div className="text-[9px] font-medium uppercase tracking-widest text-white/50">
                        Restaurant
                      </div>

                      <div className="mt-0.5 text-lg font-semibold text-white">
                        SeaKing
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="mb-4 flex gap-2 overflow-hidden">
                      <span className="rounded-full bg-black px-3 py-1.5 text-[9px] font-semibold text-white">
                        Popular
                      </span>

                      <span className="rounded-full bg-black/5 px-3 py-1.5 text-[9px] font-medium text-black/45">
                        Starters
                      </span>

                      <span className="rounded-full bg-black/5 px-3 py-1.5 text-[9px] font-medium text-black/45">
                        Seafood
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 rounded-2xl bg-white p-2.5 shadow-sm">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-200 to-orange-500" />

                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold">
                            Fish Fry
                          </div>

                          <div className="mt-1 text-[9px] text-black/40">
                            Fresh catch · signature
                          </div>
                        </div>

                        <span className="text-[10px] font-semibold">
                          ₹240
                        </span>
                      </div>

                      <div className="flex items-center gap-3 rounded-2xl bg-white p-2.5 shadow-sm">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-200 to-red-500" />

                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold">
                            Prawns
                          </div>

                          <div className="mt-1 text-[9px] text-black/40">
                            Chef's selection
                          </div>
                        </div>

                        <span className="text-[10px] font-semibold">
                          ₹320
                        </span>
                      </div>

                      <div className="flex items-center gap-3 rounded-2xl bg-white p-2.5 shadow-sm">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-yellow-100 to-yellow-500" />

                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold">
                            Calamari
                          </div>

                          <div className="mt-1 text-[9px] text-black/40">
                            Crispy · house special
                          </div>
                        </div>

                        <span className="text-[10px] font-semibold">
                          ₹280
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-7 top-20 hidden rounded-2xl border border-white/10 bg-white/[0.07] p-3 text-left shadow-2xl backdrop-blur-xl sm:block">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-black">
                    <span className="text-sm">⌁</span>
                  </div>

                  <div>
                    <div className="text-[9px] font-medium text-white/35">
                      NFC
                    </div>

                    <div className="text-[10px] font-semibold">
                      Tap to open
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -left-8 bottom-20 hidden rounded-2xl border border-white/10 bg-white/[0.07] px-3 py-2.5 text-left shadow-2xl backdrop-blur-xl sm:block">
                <div className="text-[9px] text-white/35">
                  No app
                </div>

                <div className="mt-0.5 text-[10px] font-semibold">
                  Opens instantly
                </div>
              </div>
            </div>

            <div className="mx-auto mt-12 max-w-md">
              <div className="flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.22em] text-white/20">
                <span className="h-px w-10 bg-white/10" />
                tap
                <span className="h-px w-10 bg-white/10" />
              </div>
            </div>
          </div>
        </section>

        <section
          id="how"
          className="mx-auto max-w-7xl px-5 py-28 sm:px-8 lg:px-10"
        >
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <div className="mb-5 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/30">
                The experience
              </div>

              <h2 className="max-w-lg text-4xl font-semibold leading-tight tracking-[-0.05em] sm:text-6xl">
                Less friction.
                <br />
                <span className="text-white/30">More discovery.</span>
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-7 text-white/35 lg:ml-auto">
              TapForMenu removes the friction between your guest and your
              menu. No application. No login. No unnecessary steps. Just a
              beautifully designed digital experience.
            </p>
          </div>

          <div className="mt-16 grid gap-3 md:grid-cols-3">
            <div className="group relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.035] p-7 transition duration-500 hover:-translate-y-1 hover:bg-white/[0.06]">
              <div className="mb-16 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-sm">
                01
              </div>

              <h3 className="text-xl font-semibold tracking-tight">
                Tap or scan
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/35">
                A simple NFC tap or QR scan opens your restaurant instantly.
              </p>

              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet-500/10 blur-3xl transition duration-500 group-hover:bg-violet-500/20" />
            </div>

            <div className="group relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.035] p-7 transition duration-500 hover:-translate-y-1 hover:bg-white/[0.06]">
              <div className="mb-16 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-sm">
                02
              </div>

              <h3 className="text-xl font-semibold tracking-tight">
                Open instantly
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/35">
                Your menu loads directly in the browser. Nothing to install.
              </p>

              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl transition duration-500 group-hover:bg-cyan-500/20" />
            </div>

            <div className="group relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.035] p-7 transition duration-500 hover:-translate-y-1 hover:bg-white/[0.06]">
              <div className="mb-16 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-sm">
                03
              </div>

              <h3 className="text-xl font-semibold tracking-tight">
                Explore
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/35">
                Guests discover your dishes through a fast, modern interface.
              </p>

              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl transition duration-500 group-hover:bg-blue-500/20" />
            </div>
          </div>
        </section>

        <section
          id="restaurants"
          className="mx-auto max-w-7xl px-5 pb-28 sm:px-8 lg:px-10"
        >
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.09] to-white/[0.02] px-6 py-16 sm:px-12 sm:py-20">
            <div className="absolute right-[-10%] top-[-50%] h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-[100px]" />

            <div className="relative max-w-2xl">
              <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/30">
                For restaurants
              </div>

              <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.05em] sm:text-6xl">
                Your restaurant
                <br />
                <span className="text-white/30">
                  deserves a better menu.
                </span>
              </h2>

              <p className="mt-6 max-w-lg text-sm leading-7 text-white/35">
                Build a digital menu that feels like your restaurant. Keep
                your dishes updated, showcase your brand, and give guests a
                better way to explore.
              </p>

              <a
                href="/seaking-seafood-restaurant/"
                className="mt-8 inline-flex h-12 items-center gap-3 rounded-full bg-white px-7 text-sm font-semibold text-black transition hover:scale-[1.02]"
              >
                See the experience
                <span>→</span>
              </a>
            </div>
          </div>
        </section>

        <section className="relative mx-auto max-w-7xl px-5 pb-28 text-center sm:px-8 lg:px-10">
          <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-600/10 blur-[100px]" />

          <div className="relative">
            <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/25">
              TapForMenu
            </div>

            <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              The menu is no longer
              <br />
              <span className="text-white/30">just a menu.</span>
            </h2>

            <a
              href="/seaking-seafood-restaurant/"
              className="mt-9 inline-flex h-12 items-center rounded-full bg-white px-7 text-sm font-semibold text-black transition hover:scale-[1.02]"
            >
              Experience TapForMenu
            </a>
          </div>
        </section>

        <footer className="border-t border-white/[0.07]">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-xs text-white/25 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white text-[10px] font-black text-black">
                T
              </div>

              <span className="font-medium text-white/50">
                TapForMenu
              </span>
            </div>

            <span>
              Digital menus for the next generation of restaurants.
            </span>
          </div>
        </footer>
      </div>
    </main>
  );
}