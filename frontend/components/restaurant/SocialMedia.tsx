
"use client";

import type { Restaurant } from "@/types/menu";

interface SocialMediaProps {
  restaurant: Restaurant;
}

function GoogleIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      className="h-8 w-8"
      aria-hidden="true"
    >
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 10-2 13.6-5.3l-6.3-5.2C29.7 35.1 27 36 24 36c-5.2 0-9.6-3.3-11.2-8l-6.5 5C9.6 39.4 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.7 5.5-7 6.5l6.3 5.2C38.3 36.1 44 30.5 44 24c0-1.3-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-8 w-8"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="instagram-gradient"
          x1="0%"
          y1="100%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#FFDD55" />
          <stop offset="25%" stopColor="#FF543E" />
          <stop offset="55%" stopColor="#C837AB" />
          <stop offset="100%" stopColor="#405DE6" />
        </linearGradient>
      </defs>

      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="6"
        fill="url(#instagram-gradient)"
      />

      <circle
        cx="12"
        cy="12"
        r="4.5"
        fill="none"
        stroke="white"
        strokeWidth="2"
      />

      <circle
        cx="17.3"
        cy="6.8"
        r="1.25"
        fill="white"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-8 w-8"
      aria-hidden="true"
    >
      <path
        fill="#25D366"
        d="M12 2C6.48 2 2 6.48 2 12c0 1.77.46 3.43 1.27 4.87L2 22l5.29-1.24A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"
      />
      <path
        fill="white"
        d="M16.55 13.94c-.25-.13-1.48-.73-1.71-.81-.23-.08-.4-.13-.57.13-.17.25-.65.81-.8.98-.15.17-.3.19-.55.06-.25-.13-1.04-.38-1.98-1.22-.73-.65-1.22-1.45-1.36-1.7-.14-.25-.01-.39.11-.52.11-.11.25-.29.38-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.57-1.37-.78-1.88-.21-.5-.42-.43-.57-.44h-.49c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.43 1.03 2.6.13.17 1.77 2.71 4.29 3.8.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.48-.61 1.69-1.2.21-.59.21-1.09.15-1.2-.06-.11-.23-.17-.48-.3z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-8 w-8"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="#1877F2"
      />
      <path
        fill="white"
        d="M13.4 20v-7h2.35l.35-2.7H13.4V8.58c0-.78.22-1.31 1.35-1.31h1.44V4.86c-.25-.03-1.1-.1-2.1-.1-2.08 0-3.5 1.27-3.5 3.6v1.94H8.24V13h2.35v7h2.81z"
      />
    </svg>
  );
}

export default function SocialMedia({
  restaurant,
}: SocialMediaProps) {
  const socialLinks = [
    {
      name: "Google",
      url: restaurant.google_url,
      icon: <GoogleIcon />,
    },
    {
      name: "Instagram",
      url: restaurant.instagram_url,
      icon: <InstagramIcon />,
    },
    {
      name: "WhatsApp",
      url: restaurant.whatsapp_url,
      icon: <WhatsAppIcon />,
    },
    {
      name: "Facebook",
      url: restaurant.facebook_url,
      icon: <FacebookIcon />,
    },
  ].filter((social) => social.url);

  if (socialLinks.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mb-7 text-center sm:mb-9">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400 sm:text-xs">
            Stay Connected
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
            Follow Us
          </h2>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className="
                group
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-full
                border
                border-[#F4C542]/45
                bg-white
                shadow-[0_0_8px_rgba(244,197,66,0.08)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-[#F4C542]
                hover:shadow-[0_0_10px_rgba(244,197,66,0.25),0_0_24px_rgba(244,197,66,0.10)]
                active:scale-95
              "
            >
              <span className="transition-transform duration-300 group-hover:scale-110">
                {social.icon}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

