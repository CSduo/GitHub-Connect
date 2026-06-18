export const dynamic = "force-dynamic";
import Link from "next/link";
import { Emblem } from "@/components/brand/Emblem";
import { DomainGrid } from "@/components/shared/DomainGrid";
import { prisma } from "@/lib/db";

export default async function AboutPage() {
  let categories: any[] = [];
  try {
    categories = await prisma.category.findMany({
      where: { visible: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch categories for about page:", error);
  }

  return (
    <div className="min-h-[100dvh] pb-24" style={{ background: "var(--bg)" }}>
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80')",
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to right, var(--bg) 30%, rgba(7,17,21,0.8) 100%)" }}
        />
        <div className="container-anv relative py-16 md:py-20">
          <h1 className="font-display text-4xl md:text-6xl" style={{ color: "var(--ink)" }}>
            About Anvikshiki
          </h1>
          <p className="font-body mt-4 max-w-lg text-lg" style={{ color: "var(--muted)" }}>
            A platform for thoughtful inquiry across timeless disciplines.
          </p>
        </div>
      </div>

      <div className="container-anv py-10">
        {/* Mission */}
        <div className="card-anv p-6 md:p-10">
          <div className="flex items-start gap-6">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "rgba(220, 88, 124, 0.1)" }}
            >
              <Emblem size={40} />
            </div>
            <div>
              <span className="font-ui text-xs font-semibold tracking-[0.15em] uppercase" style={{ color: "var(--rose)" }}>
                Our Mission
              </span>
              <h2 className="font-display text-2xl md:text-3xl mt-2" style={{ color: "var(--ink)" }}>
                Cultivate clarity.<br />Inspire understanding.
              </h2>
              <p className="font-body mt-4" style={{ color: "var(--muted)" }}>
                We publish rigorous, reflective, and timeless ideas that deepen understanding and elevate discourse.
                Anvikshiki is the science of inquiry — a tradition of critical reflection, reasoned exploration, 
                and the pursuit of truth.
              </p>
            </div>
          </div>
        </div>

        {/* What is Anvikshiki */}
        <div className="mt-8 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="font-ui text-xs font-semibold tracking-[0.15em] uppercase" style={{ color: "var(--gold)" }}>
              What is Anvikshiki?
            </span>
            <p className="font-body mt-4 leading-relaxed" style={{ color: "var(--ink)" }}>
              Anvikshiki (आन्वीक्षिकी) is the science of inquiry — a tradition of critical reflection, 
              reasoned exploration, and the pursuit of truth. Rooted in classical wisdom, it embraces 
              all disciplines that illuminate how we think, understand, and live.
            </p>
            <p className="font-body mt-4 leading-relaxed" style={{ color: "var(--muted)" }}>
              This platform serves as a living journal where contemporary thinkers, scholars, and 
              writers contribute to the ongoing discourse on civilisation, consciousness, statecraft, 
              and the human condition.
            </p>
          </div>
          <div
            className="rounded-2xl h-64 md:h-80 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&q=80')",
            }}
          />
        </div>

        {/* Disciplines */}
        <div className="mt-10">
          <span className="font-ui text-xs font-semibold tracking-[0.15em] uppercase" style={{ color: "var(--gold)" }}>
            Disciplines We Explore
          </span>
          <div className="mt-4">
            <DomainGrid categories={categories} />
          </div>
        </div>

        {/* Quote */}
        <div
          className="mt-10 p-8 rounded-2xl text-center"
          style={{ background: "var(--surface-soft)", border: "1px solid var(--border)" }}
        >
          <span className="font-display text-3xl" style={{ color: "var(--gold)" }}>&ldquo;</span>
          <p className="font-display text-xl md:text-2xl italic max-w-2xl mx-auto" style={{ color: "var(--ink)" }}>
            Inquiry is the lamp that dispels the shadows of ignorance.
          </p>
          <p className="font-ui text-xs mt-4 uppercase tracking-wider" style={{ color: "var(--muted)" }}>
            — Traditional Proverb
          </p>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link href="/submit" className="btn-primary">
            Contribute to Anvikshiki
          </Link>
        </div>
      </div>
    </div>
  );
}
