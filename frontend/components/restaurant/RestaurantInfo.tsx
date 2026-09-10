
import type { Restaurant } from "@/types/menu";

interface RestaurantInfoProps {
  restaurant: Restaurant;
}


/* =========================================================
   GRADIENT BORDER CARD
========================================================= */

function GradientBorderCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`
        rounded-2xl
        bg-gradient-to-b
        from-sky-200/80
        via-sky-100/45
        to-sky-50/10
        p-[1px]
        transition-all
        duration-300
        hover:from-sky-300/80
        hover:via-sky-200/60
        hover:to-sky-100/20
        ${className}
      `}
    >
      <div
        className="
          h-full
          w-full
          rounded-[15px]
          bg-white
        "
      >
        {children}
      </div>
    </div>
  );
}


/* =========================================================
   INFO ITEM
========================================================= */

function InfoItem({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <GradientBorderCard>
      <div
        className="
          group
          w-full
          px-4
          py-4
          transition-all
          duration-300
          sm:p-5
        "
      >
        <div
          className="
            flex
            w-full
            items-center
            gap-4
            sm:gap-5
          "
        >

          {/* =================================================
              ICON
          ================================================= */}

          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-gray-100
              text-gray-700
              transition-all
              duration-300
              group-hover:bg-gray-50
              group-hover:scale-[1.03]
            "
          >
            {icon}
          </div>


          {/* =================================================
              CONTENT
          ================================================= */}

          <div
            className="
              min-w-0
              flex-1
            "
          >
            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-gray-400
              "
            >
              {label}
            </p>

            <div
              className="
                mt-1
                break-words
                text-sm
                font-medium
                leading-5
                text-gray-900
                sm:text-[15px]
                sm:leading-6
              "
            >
              {children}
            </div>
          </div>

        </div>
      </div>
    </GradientBorderCard>
  );
}


/* =========================================================
   PHONE ICON
========================================================= */

function PhoneIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 3.07 5.18 2 2 0 0 1 5.06 3h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8.96 10.7a16 16 0 0 0 4.34 4.34l1.24-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 21 15.94l1 .98Z" />
    </svg>
  );
}


/* =========================================================
   CLOCK ICON
========================================================= */

function ClockIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}


/* =========================================================
   GOOGLE MAPS PIN
========================================================= */

function GoogleMapsPin() {
  return (
    <svg
      viewBox="0 0 48 64"
      width="24"
      height="32"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      className="
        block
        shrink-0
        overflow-visible
      "
    >

      {/* RED OUTER PIN */}

      <path
        fill="#EA4335"
        d="
          M24 1
          C11.3 1 1 11.3 1 24
          C1 40 24 63 24 63
          C24 63 47 40 47 24
          C47 11.3 36.7 1 24 1Z
        "
      />


      {/* WHITE CENTER */}

      <circle
        fill="#FFFFFF"
        cx="24"
        cy="24"
        r="11"
      />


      {/* BLUE CENTER */}

      <circle
        fill="#4285F4"
        cx="24"
        cy="24"
        r="6"
      />


      {/* GREEN LOWER SECTION */}

      <path
        fill="#34A853"
        d="
          M5.5 39.5
          C11.7 51.2 24 63 24 63
          C24 63 36.3 51.2 42.5 39.5
          C36.6 43.8 30.4 46 24 46
          C17.6 46 11.4 43.8 5.5 39.5Z
        "
      />


      {/* YELLOW SIDE */}

      <path
        fill="#FBBC04"
        d="
          M8 14.5
          C11.8 6.4 19.3 2 24 2
          C18.2 7.8 15.4 15.2 15.4 23.7
          C15.4 28.2 16.5 32.7 18.6 36.8
          C11.5 32.2 7.5 25.8 7.5 19
          C7.5 17.4 7.7 15.9 8 14.5Z
        "
      />

    </svg>
  );
}


/* =========================================================
   EXTERNAL ARROW
========================================================= */

function ExternalArrow() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}


/* =========================================================
   RESTAURANT INFO
========================================================= */

export default function RestaurantInfo({
  restaurant,
}: {
  restaurant: Restaurant;
}) {
  const hasInfo =
    restaurant.google_maps_url ||
    restaurant.opening_hours ||
    restaurant.phone;

  if (!hasInfo) {
    return null;
  }


  return (
    <section
      className="
        mx-auto
        w-full
        max-w-6xl
        px-4
        py-10
        sm:px-6
        sm:py-14
        lg:px-8
      "
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-6 sm:mb-7">

        <p
          className="
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.2em]
            text-gray-400
            sm:text-xs
          "
        >
          Visit Us
        </p>

      </div>


      {/* =====================================================
          INFORMATION
      ===================================================== */}

      <div
        className="
          grid
          grid-cols-1
          gap-3
          sm:grid-cols-3
          sm:gap-4
        "
      >

        {/* ===================================================
            GOOGLE MAPS
        =================================================== */}

        {restaurant.google_maps_url && (
          <GradientBorderCard>
            <a
              href={restaurant.google_maps_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Find ${restaurant.name} on Google Maps`}
              className="
                group
                flex
                min-h-[72px]
                w-full
                items-center
                gap-4
                rounded-[15px]
                px-4
                py-3
                transition-all
                duration-300
                hover:-translate-y-0.5
                sm:min-h-[76px]
              "
            >

              {/* =================================================
                  GOOGLE MAPS ICON
              ================================================= */}

              <span
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  overflow-visible
                  rounded-xl
                  bg-gray-50
                  p-1
                  transition-transform
                  duration-300
                  group-hover:scale-[1.04]
                "
              >
                <GoogleMapsPin />
              </span>


              {/* =================================================
                  TEXT
              ================================================= */}

              <span
                className="
                  flex
                  min-w-0
                  flex-1
                  flex-col
                  justify-center
                "
              >

                <span
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-gray-400
                  "
                >
                  Find Us
                </span>

                <span
                  className="
                    mt-1
                    text-sm
                    font-semibold
                    leading-5
                    text-gray-900
                  "
                >
                  Google Maps
                </span>

              </span>


              {/* =================================================
                  ARROW
              ================================================= */}

              <span
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  text-gray-400
                  transition-all
                  duration-300
                  group-hover:bg-blue-50
                  group-hover:text-blue-600
                "
              >
                <ExternalArrow />
              </span>

            </a>
          </GradientBorderCard>
        )}


        {/* ===================================================
            OPENING HOURS
        =================================================== */}

        {restaurant.opening_hours && (
          <InfoItem
            label="Opening Hours"
            icon={<ClockIcon />}
          >
            <span className="whitespace-pre-line">
              {restaurant.opening_hours}
            </span>
          </InfoItem>
        )}


        {/* ===================================================
            PHONE
        =================================================== */}

        {restaurant.phone && (
          <InfoItem
            label="Phone"
            icon={<PhoneIcon />}
          >
            <a
              href={`tel:${restaurant.phone}`}
              className="
                inline-block
                min-h-[24px]
                font-medium
                leading-5
                text-gray-900
                transition-colors
                hover:text-gray-600
              "
            >
              {restaurant.phone}
            </a>
          </InfoItem>
        )}

      </div>

    </section>
  );
}

