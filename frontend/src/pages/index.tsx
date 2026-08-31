import * as React from "react";
import {
  Accordion,
  BlogCard,
  Breadcrumbs,
  EmptyState,
  Field,
  FilterModal,
  Footer,
  GameListItem,
  Header,
  InputField,
  Navbar,
  type NavbarVariant,
  Pagination,
  Pill,
  PricingCard,
  ProductCard,
  SectionHeader,
  Sidebar,
  StatCard,
  Tabs,
  TestimonialCard,
  Toast,
  UserRank,
} from "@/components/ui";

const CrossIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export default function Home() {
  const [activeTab, setActiveTab] = React.useState("tab1");
  const [activeSidebarItem, setActiveSidebarItem] = React.useState("toko");
  const [activeNavId, setActiveNavId] = React.useState("home");
  const [navbarVariant, setNavbarVariant] = React.useState<NavbarVariant>("guest");
  const [currentPage, setCurrentPage] = React.useState(1);

  const tabItems = [
    { id: "tab1", label: "Deskripsi Game" },
    { id: "tab2", label: "Requirements" },
    { id: "tab3", label: "Lainnya" },
  ];

  const accordionText =
    '"gue gatau ada berapa org dibalik bisnis ini, 1 atau seberapapun org terlibat, gue mengapresiasi sebesar besarnya udah ada jasa kaya gini. in this economy, harga game mahal bgt? dan buat gue yg butuh " test drive " buat game yg harganya mahal itu kayanya ini jadi solusi terbaik...';

  return (
    <main className="bg-deep-blue-950 min-h-screen text-white p-8 flex flex-col gap-10">
      {/* 0. Navbar Showcase */}
      <section className="flex flex-col gap-6 border border-dashed border-purple-500/40 p-6 rounded-2xl bg-deep-blue-900/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-sm font-semibold tracking-wider text-purple-400">
            ❖ Navbar (4 Varian: Guest, Login, Private, Back)
          </h2>
          <div className="flex items-center gap-2 bg-deep-blue-950 p-1 rounded-lg border border-white/10">
            {(["guest", "login", "private", "back"] as NavbarVariant[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setNavbarVariant(v)}
                className={`px-3 py-1.5 rounded-md text-label-xs font-semibold capitalize transition-colors cursor-pointer ${
                  navbarVariant === v
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Navbar */}
        <div className="w-full">
          <Navbar
            variant={navbarVariant}
            activeNavId={activeNavId}
            onNavItemClick={(item) => setActiveNavId(item.id)}
            user={{ name: "Gamer User" }}
          />
        </div>

        {/* Static All 4 Variants Preview */}
        <div className="flex flex-col gap-6 pt-4 border-t border-white/10">
          <span className="text-label-xs text-gray-400 font-semibold tracking-wider uppercase">
            All Variants Preview:
          </span>
          <div className="flex flex-col gap-6">
            <Navbar variant="guest" activeNavId="home" />
            <Navbar variant="login" activeNavId="home" user={{ name: "Gamer User" }} />
            <Navbar variant="private" user={{ name: "Gamer User" }} />
            <Navbar variant="back" backTitle="Artikel" />
          </div>
        </div>
      </section>

      {/* 0. Sidebar Showcase */}
      <section className="flex flex-col gap-4 border border-dashed border-purple-500/40 p-6 rounded-2xl bg-deep-blue-900/70 w-fit">
        <h2 className="text-sm font-semibold tracking-wider text-purple-400">❖ Sidebar</h2>
        <Sidebar
          activeId={activeSidebarItem}
          onItemClick={(item) => setActiveSidebarItem(item.id)}
        />
      </section>

      {/* 0. Pricing Card Showcase */}
      <section className="flex flex-col gap-8 border border-dashed border-purple-500/40 p-6 rounded-2xl bg-[#18181F]/70">
        <h2 className="text-sm font-semibold tracking-wider text-purple-400">❖ Pricing Card</h2>

        {/* Row 1: Vertical Cards (Primary & Secondary) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6  w-fit">
          <PricingCard
            type="primary"
            direction="vertical"
            title="Paket 2"
            price="IDR 150,000"
            period="/ Month"
            features={[
              "Mainkan Game Lebih Banyak",
              "Mainkan Game Lebih Banyak",
              "Mainkan Game Lebih Banyak",
              "Mainkan Game Lebih Banyak",
            ]}
          />

          <PricingCard
            type="secondary"
            direction="vertical"
            title="Paket 2"
            price="IDR 150,000"
            period="/ Month"
            features={[
              "Mainkan Game Lebih Banyak",
              "Mainkan Game Lebih Banyak",
              "Mainkan Game Lebih Banyak",
              "Mainkan Game Lebih Banyak",
            ]}
          />
        </div>

        {/* Row 2: Horizontal Primary Card */}
        <div className="">
          <PricingCard
            type="primary"
            direction="horizontal"
            title="Paket 2"
            price="IDR 150,000"
            period="/ Month"
            features={[
              "Mainkan Game Lebih Banyak",
              "Mainkan Game Lebih Banyak",
              "Mainkan Game Lebih Banyak",
              "Mainkan Game Lebih Banyak",
            ]}
          />
        </div>

        {/* Row 3: Horizontal Secondary Card */}
        <div className="">
          <PricingCard
            type="secondary"
            direction="horizontal"
            title="Paket 1"
            price="IDR 50,000"
            period="/ Month"
            features={[
              "Mainkan Game Lebih Banyak",
              "Mainkan Game Lebih Banyak",
              "Mainkan Game Lebih Banyak",
              "Mainkan Game Lebih Banyak",
            ]}
          />
        </div>

        {/* Row 4: Paid Subs Card */}
        <div className="w-full">
          <PricingCard
            type="paid"
            title="Paket 2"
            price="IDR 150,000"
            period="/ Month"
            expiryInfo="Berakhir dalam 30 hari"
            dateRangeInfo="22/07/2026 - 22/08/2026"
            actionText="Perbarui Sekarang"
            secondaryActionText="Hubungi Admin"
          />
        </div>
      </section>

      {/* 1. Header Showcase */}
      <section className="flex flex-col gap-4 border border-dashed border-purple-500/40 p-6 rounded-2xl bg-[#18181F]/70">
        <h2 className="text-sm font-semibold tracking-wider text-purple-400">❖ Header</h2>
        <Header
          pillText="Promo Musim Panas Telah Datang!"
          title="Pemilik Koleksi Game Terbesar Saat Ini!"
          subtitle="Ingin Langsung Buka Semua? Beli Premium!"
          actionLabel="Lihat Premium"
        />
      </section>

      {/* 2. Empty State Showcase */}
      <section className="flex flex-col gap-4 border border-dashed border-purple-500/40 p-6 rounded-2xl bg-[#18181F]/70">
        <h2 className="text-sm font-semibold tracking-wider text-purple-400">❖ Empty State</h2>
        <EmptyState
          title="Ups!... Hasil tidak ditemukan"
          description="Coba cari hal lain!"
          backLabel="Kembali"
          searchLabel="Search"
        />
      </section>

      {/* 3. Accordion Showcase */}
      <section className="flex flex-col gap-4 border border-dashed border-purple-500/40 p-6 rounded-2xl bg-[#18181F]/70 ">
        <h2 className="text-sm font-semibold tracking-wider text-purple-400">❖ Accordion</h2>
        <div className="flex flex-col gap-3">
          {/* Interactive Accordion */}
          <Accordion
            defaultOpenId="acc2"
            items={[
              {
                id: "acc1",
                title: "Bagaimana cara kerja Gamezygo?",
                content: accordionText,
              },
              {
                id: "acc2",
                title: "Bagaimana cara kerja Gamezygo?",
                content: accordionText,
              },
            ]}
          />
        </div>
      </section>

      {/* 2. Pagination Showcase */}
      <section className="flex flex-col gap-4 border border-dashed border-purple-500/40 p-6 rounded-2xl bg-[#18181F]/70 w-fit">
        <h2 className="text-sm font-semibold tracking-wider text-purple-400">❖ Pagination</h2>
        <Pagination
          currentPage={currentPage}
          totalPages={25}
          onPageChange={setCurrentPage}
        />
      </section>

      {/* 3. User Rank Showcase */}
      <section className="flex flex-col gap-4 border border-dashed border-purple-500/40 p-6 rounded-2xl bg-[#18181F]/70 ">
        <h2 className="text-sm font-semibold tracking-wider text-purple-400">❖ User Rank</h2>
        <UserRank
          rank={1}
          name="Dyven Siauw"
          points="999 pts"
        />
      </section>
      {/* 1. Breadcrumbs Showcase */}
      <section className="flex flex-col gap-4 border border-dashed border-purple-500/40 p-6 rounded-2xl bg-[#18181F]/70">
        <h2 className="text-sm font-semibold tracking-wider text-purple-400">❖ Breadcrumbs</h2>
        <Breadcrumbs
          items={[
            { label: "Home", href: "#" },
            { label: "Toko", href: "#" },
            { label: "Toko", href: "#" },
            { label: "Assassin's Creed : Black Flag Resynced" },
          ]}
        />
      </section>

      {/* 2. Tabs Showcase */}
      <section className="flex flex-col gap-6 border border-dashed border-purple-500/40 p-6 rounded-2xl bg-[#18181F]/70 w-fit">
        <h2 className="text-sm font-semibold tracking-wider text-purple-400">❖ Tabs</h2>
        <div className="flex flex-col gap-4">
          {/* Interactive tabs */}
          <Tabs
            items={tabItems}
            activeId={activeTab}
            onChange={setActiveTab}
          />

          {/* Preview rows matching Figma */}
          <Tabs
            items={tabItems}
            activeId="tab2"
          />
          <Tabs
            items={tabItems}
            activeId="tab3"
          />
        </div>
      </section>

      {/* 3. Stat Card Showcase */}
      <section className="flex flex-col gap-4 border border-dashed border-purple-500/40 p-6 rounded-2xl bg-[#18181F]/70 w-fit">
        <h2 className="text-sm font-semibold tracking-wider text-purple-400">❖ Stat Card</h2>
        <StatCard
          label="Total Payment"
          value="IDR 350,000"
        />
      </section>

      {/* 4. Input Field Component Showcase */}
      <section className="flex flex-col gap-4 border border-dashed border-purple-500/40 p-6 rounded-2xl bg-[#18181F]/70">
        <h2 className="text-sm font-semibold tracking-wider text-purple-400">❖ Input Field</h2>

        <InputField
          size="lg"
          label="Buka game yang kamu mau di Steam Store, copy URL-nya, lalu paste di sini."
          placeholder="Cari di toko"
          errorMessage="*Link steam salah silahkan masukan kembali"
          leftIcon={<SearchIcon />}
          rightIcon={<SearchIcon />}
        />
      </section>

      {/* 2. Field Component Showcase */}
      <section className="flex flex-col gap-4 border border-dashed border-purple-500/40 p-6 rounded-2xl bg-[#18181F]/70">
        <h2 className="text-sm font-semibold tracking-wider text-purple-400">❖ Field</h2>

        <div className="flex flex-col gap-4">
          {/* 1. Unfilled */}
          <Field
            size="lg"
            forceState="unfilled"
            placeholder="Cari di toko"
            leftIcon={<SearchIcon />}
          />

          {/* 6. Disabled */}
          <Field
            size="lg"
            forceState="disabled"
            placeholder="Cari di toko"
            leftIcon={<SearchIcon />}
            rightIcon={<SearchIcon />}
          />
        </div>
      </section>

      {/* 2. Toast Component Showcase */}
      <section className="flex flex-col gap-4 border border-dashed border-purple-500/40 p-6 rounded-2xl bg-[#18181F]/70 ">
        <h2 className="text-sm font-semibold tracking-wider text-purple-400">❖ Toast</h2>

        <div className="flex flex-col gap-3">
          {/* Default / Secondary */}
          <Toast
            variant="default"
            title="Congratulations!"
            description="Your OS has been updated to the latest version."
          />

          {/* Error */}
          <Toast
            variant="error"
            title="Congratulations!"
            description="Your OS has been updated to the latest version."
          />

          {/* Success */}
          <Toast
            variant="success"
            title="Congratulations!"
            description="Your OS has been updated to the latest version."
          />

          {/* Warning */}
          <Toast
            variant="warning"
            title="Congratulations!"
            description="Your OS has been updated to the latest version."
          />
        </div>
      </section>

      {/* 2. Pill Component Showcase */}
      <section className="flex flex-col gap-4 border border-dashed border-purple-500/40 p-6 rounded-2xl bg-[#18181F]/70">
        <h2 className="text-sm font-semibold tracking-wider text-purple-400">❖ Pill</h2>
        
        <div className="grid grid-cols-5 gap-6 items-start w-fit">
          {/* Primary */}
          <div className="flex flex-col gap-3">
            <Pill variant="primary" size="md" leftIcon={<CrossIcon />} rightIcon={<CrossIcon />}>
              NSFW
            </Pill>
            <Pill variant="primary" size="sm" leftIcon={<CrossIcon />} rightIcon={<CrossIcon />}>
              NSFW
            </Pill>
            <Pill variant="primary" size="xs" leftIcon={<CrossIcon />} rightIcon={<CrossIcon />}>
              NSFW
            </Pill>
          </div>

          {/* Error */}
          <div className="flex flex-col gap-3">
            <Pill variant="error" size="md" leftIcon={<CrossIcon />} rightIcon={<CrossIcon />}>
              NSFW
            </Pill>
            <Pill variant="error" size="sm" leftIcon={<CrossIcon />} rightIcon={<CrossIcon />}>
              NSFW
            </Pill>
            <Pill variant="error" size="xs" leftIcon={<CrossIcon />} rightIcon={<CrossIcon />}>
              NSFW
            </Pill>
          </div>

          {/* Success */}
          <div className="flex flex-col gap-3">
            <Pill variant="success" size="md" leftIcon={<CrossIcon />} rightIcon={<CrossIcon />}>
              NSFW
            </Pill>
            <Pill variant="success" size="sm" leftIcon={<CrossIcon />} rightIcon={<CrossIcon />}>
              NSFW
            </Pill>
            <Pill variant="success" size="xs" leftIcon={<CrossIcon />} rightIcon={<CrossIcon />}>
              NSFW
            </Pill>
          </div>

          {/* Secondary */}
          <div className="flex flex-col gap-3">
            <Pill variant="secondary" size="md" leftIcon={<CrossIcon />} rightIcon={<CrossIcon />}>
              NSFW
            </Pill>
            <Pill variant="secondary" size="sm" leftIcon={<CrossIcon />} rightIcon={<CrossIcon />}>
              NSFW
            </Pill>
            <Pill variant="secondary" size="xs" leftIcon={<CrossIcon />} rightIcon={<CrossIcon />}>
              NSFW
            </Pill>
          </div>

          {/* Warning */}
          <div className="flex flex-col gap-3">
            <Pill variant="warning" size="md" leftIcon={<CrossIcon />} rightIcon={<CrossIcon />}>
              NSFW
            </Pill>
            <Pill variant="warning" size="sm" leftIcon={<CrossIcon />} rightIcon={<CrossIcon />}>
              NSFW
            </Pill>
            <Pill variant="warning" size="xs" leftIcon={<CrossIcon />} rightIcon={<CrossIcon />}>
              NSFW
            </Pill>
          </div>
        </div>
      </section>

      {/* 4. Game List Item Component Showcase */}
      <section className="flex flex-col gap-6 border border-dashed border-purple-500/40 p-6 rounded-2xl bg-deep-blue-900/70">
        <h2 className="text-sm font-semibold tracking-wider text-purple-400">
          ❖ Game List Item (States: Default, Hover, Focus, Pressed, Disabled)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
          {/* Interactive */}
          <div className="flex flex-col gap-2">
            <span className="text-label-xs text-gray-400 font-semibold">Interactive (Default):</span>
            <GameListItem
              title="Grand Theft Auto V"
              discount="-30%"
              originalPrice="Rp 439.000,00"
              price="Rp 219.500"
            />
          </div>

          {/* Hover */}
          <div className="flex flex-col gap-2">
            <span className="text-label-xs text-gray-400 font-semibold">Hover State:</span>
            <GameListItem
              title="Grand Theft Auto V"
              discount="-30%"
              originalPrice="Rp 439.000,00"
              price="Rp 219.500"
              forceState="hover"
            />
          </div>

          {/* Pressed */}
          <div className="flex flex-col gap-2">
            <span className="text-label-xs text-gray-400 font-semibold">Pressed State:</span>
            <GameListItem
              title="Grand Theft Auto V"
              discount="-30%"
              originalPrice="Rp 439.000,00"
              price="Rp 219.500"
              forceState="pressed"
            />
          </div>

          {/* Focus */}
          <div className="flex flex-col gap-2">
            <span className="text-label-xs text-gray-400 font-semibold">Focus State:</span>
            <GameListItem
              title="Grand Theft Auto V"
              discount="-30%"
              originalPrice="Rp 439.000,00"
              price="Rp 219.500"
              forceState="focus"
            />
          </div>

          {/* Disabled */}
          <div className="flex flex-col gap-2">
            <span className="text-label-xs text-gray-400 font-semibold">Disabled State:</span>
            <GameListItem
              title="Grand Theft Auto V"
              discount="-30%"
              originalPrice="Rp 439.000,00"
              price="Rp 219.500"
              forceState="disabled"
            />
          </div>
        </div>
      </section>

      {/* 5. Blog Card Component Showcase */}
      <section className="flex flex-col gap-6 border border-dashed border-purple-500/40 p-6 rounded-2xl bg-deep-blue-900/70">
        <h2 className="text-sm font-semibold tracking-wider text-purple-400">
          ❖ Blog Card
        </h2>

        <div className="w-full md:w-1/2 gap-6">
          <BlogCard
            date="1 BULAN LALU"
            title="Pratinjau langsung Star Wars Zero Company: Attack Astromech, permadeath, dan taktik Rube Goldberg yang mematikan dan memuaskan."
            category="Review & Rekomendasi"
            description="Timku yang beranggotakan empat orang tersebar di halaman merah berdebu di daerah terpencil tak bernama di Anaxes, bersembunyi di balik peti baja dan dinding beton yan..."
          />
        </div>
      </section>

      {/* 6. Testimonial Card Component Showcase */}
      <section className="flex flex-col gap-6 border border-dashed border-purple-500/40 p-6 rounded-2xl bg-deep-blue-900/70">
        <h2 className="text-sm font-semibold tracking-wider text-purple-400">
          ❖ Testimonial Card
        </h2>

        <div className="w-80 sm:w-90">
          <TestimonialCard
            rating="5 Star"
            review='“gue gatau ada berapa org dibalik bisnis ini, 1 atau seberapapun org terlibat, gue mengapresiasi sebesar besarnya udah ada jasa kaya gini. in this economy, harga game mahal bgt? dan buat gue yg butuh " test drive " buat game yg harganya mahal itu kayanya ini jadi solusi terbaik...'
            userName="Dyven Siauw"
            gameName="Black Myth Wukong, 2+"
          />
        </div>
      </section>

      {/* 7. Product Card Component Showcase (Vertical & Horizontal x Default, Unavailable, Pre-order) */}
      <section className="flex flex-col gap-6 border border-dashed border-purple-500/40 p-6 rounded-2xl bg-deep-blue-900/70">
        <h2 className="text-sm font-semibold tracking-wider text-purple-400">
          ❖ Product Card (Vertical & Horizontal / Default, Unavailable, Pre-order)
        </h2>

        {/* 1. Vertical Cards */}
        <div className="flex flex-col gap-3">
          <span className="text-label-xs font-semibold text-gray-400 uppercase tracking-wider">
            1. Vertical Layout (Default, Unavailable, Pre-order):
          </span>
          <div className="flex gap-4 ">
            {/* Vertical Default */}
            <ProductCard
              orientation="vertical"
              state="default"
              genres={["Action", "Adventure"]}
              title="Assassin's Creed Black Flag Resynced"
              originalPrice="Rp 439.000,00"
              price="Rp 219.500"
              discount="-30%"
            />

            {/* Vertical Unavailable */}
            <ProductCard
              orientation="vertical"
              state="unavailable"
              genres={["Action", "NSFW"]}
              title="Assassin's Creed Black Flag Resynced"
              originalPrice="Rp 439.000,00"
              price="Rp 219.500"
              discount="-30%"
            />

            {/* Vertical Pre-order */}
            <ProductCard
              orientation="vertical"
              state="pre-order"
              genres={["Action", "NSFW"]}
              title="Assassin's Creed Black Flag Resynced"
              originalPrice="Rp 439.000,00"
              price="Rp 219.500"
              discount="-30%"
              releaseDate="Release at 5 July"
            />
          </div>
        </div>

        {/* 2. Horizontal Cards */}
        <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
          <span className="text-label-xs font-semibold text-gray-400 uppercase tracking-wider">
            2. Horizontal Layout (Default, Unavailable, Pre-order):
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Horizontal Default */}
            <ProductCard
              orientation="horizontal"
              state="default"
              genres={["Action", "NSFW"]}
              title="Assassin's Creed Black Flag Resynced"
              originalPrice="Rp 439.000,00"
              price="Rp 219.500"
              discount="-30%"
              isBestSeller={true}
            />

            {/* Horizontal Unavailable */}
            <ProductCard
              orientation="horizontal"
              state="unavailable"
              genres={["Action", "NSFW"]}
              title="Assassin's Creed Black Flag Resynced"
              originalPrice="Rp 439.000,00"
              price="Rp 219.500"
              discount="-30%"
              isBestSeller={true}
            />

            {/* Horizontal Pre-order */}
            <ProductCard
              orientation="horizontal"
              state="pre-order"
              genres={["Action", "NSFW"]}
              title="Assassin's Creed Black Flag Resynced"
              originalPrice="Rp 439.000,00"
              price="Rp 219.500"
              discount="-30%"
              releaseDate="Release at 5 July"
              isBestSeller={true}
            />
          </div>
        </div>
      </section>

      {/* 8. Section Header Component Showcase (Outer & Nested) */}
      <section className="flex flex-col gap-8 border border-dashed border-purple-500/40 p-6 rounded-2xl bg-deep-blue-900/70">
        <h2 className="text-sm font-semibold tracking-wider text-purple-400">
          ❖ Section Header (Outer & Nested)
        </h2>

        {/* 1. Outer Variant */}
        <div className="flex flex-col gap-2">
          <span className="text-label-xs font-semibold text-gray-400 uppercase tracking-wider">
            1. Outer Variant (text-h3 font-semibold, lihat semua ghost sm):
          </span>
          <SectionHeader
            type="outer"
            title="Tawaran Khusus!"
            actionLabel="Lihat Semua"
          />
        </div>

        {/* 2. Nested Variant */}
        <div className="flex flex-col gap-2">
          <span className="text-label-xs font-semibold text-gray-400 uppercase tracking-wider">
            2. Nested Variant (left arrow secondary button, gap-6, text-h5 font-semibold):
          </span>
          <SectionHeader
            type="nested"
            title="Tawaran Khusus!"
            actionLabel="Lihat Semua"
          />
        </div>
      </section>

      {/* 9. Filter & Sort Modal Component Showcase */}
      <section className="flex flex-col gap-6 border border-dashed border-purple-500/40 p-6 rounded-2xl bg-deep-blue-900/70">
        <h2 className="text-sm font-semibold tracking-wider text-purple-400">
          ❖ Filter & Sort Modal
        </h2>

        <div className="flex justify-center w-full">
          <FilterModal
            title="Filter & Sort"
            minPrice={0}
            maxPrice={200000}
          />
        </div>
      </section>

      {/* 10. Footer Component Showcase */}
      <section className="flex flex-col gap-4 border border-dashed border-purple-500/40 p-0 rounded-2xl overflow-hidden bg-deep-blue-900/70">
        <div className="p-6 pb-0">
          <h2 className="text-sm font-semibold tracking-wider text-purple-400">❖ Footer</h2>
        </div>
        <Footer />
      </section>
    </main>
  );
}
