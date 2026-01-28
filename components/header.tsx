"use client";

import Image from "next/image";
import Link from "next/link";
import { useAccessibility } from "./accessibility-provider";
import { Eye, Type, FileText, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { highContrast, largeText, toggleHighContrast, toggleLargeText } =
    useAccessibility();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-[#1a5396] text-white sticky top-0 z-40 shadow-md" role="banner">
      <div className="container mx-auto px-3 sm:px-4 py-2">
        <div className="flex items-center justify-between gap-2">
          {/* Logos */}
          <Link 
            href="/" 
            className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity focus-visible-ring rounded p-1 -m-1 shrink-0"
            aria-label="Ir para página inicial"
          >
            <Image
              src="/images/participadf-branca.png"
              alt="Participa DF"
              width={120}
              height={36}
              className="h-7 sm:h-9 w-auto"
              priority
            />
            <div className="w-px h-5 sm:h-7 bg-white/40 hidden xs:block" aria-hidden="true" />
            <Image
              src="/images/logo-gdf-branca.png"
              alt="GDF"
              width={100}
              height={36}
              className="h-6 sm:h-8 w-auto hidden xs:block"
              priority
            />
          </Link>

          {/* Botoes Desktop */}
          <div className="hidden sm:flex items-center gap-1">
            <Link
              href="/protocolos"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-[#f5a623] hover:bg-[#e09000] text-[#1a5396] transition-colors focus-visible-ring"
              aria-label="Ver meus registros"
            >
              <FileText className="w-4 h-4" aria-hidden="true" />
              <span className="text-xs">Meus Registros</span>
            </Link>

            <button
              onClick={toggleHighContrast}
              className={`flex items-center gap-1 px-2 py-2 rounded-lg text-xs font-medium transition-colors focus-visible-ring ${
                highContrast ? "bg-white text-[#1a5396]" : "bg-white/20 hover:bg-white/30 text-white"
              }`}
              aria-pressed={highContrast}
              aria-label={highContrast ? "Desativar contraste" : "Ativar contraste"}
            >
              <Eye className="w-4 h-4" aria-hidden="true" />
              <span className="hidden md:inline">Contraste</span>
            </button>

            <button
              onClick={toggleLargeText}
              className={`flex items-center gap-1 px-2 py-2 rounded-lg text-xs font-medium transition-colors focus-visible-ring ${
                largeText ? "bg-white text-[#1a5396]" : "bg-white/20 hover:bg-white/30 text-white"
              }`}
              aria-pressed={largeText}
              aria-label={largeText ? "Desativar texto grande" : "Ativar texto grande"}
            >
              <Type className="w-4 h-4" aria-hidden="true" />
              <span className="hidden md:inline">A+</span>
            </button>
          </div>

          {/* Botao Mobile */}
          <div className="flex sm:hidden items-center gap-2">
            <Link
              href="/protocolos"
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#f5a623] text-[#1a5396] focus-visible-ring"
              aria-label="Meus registros"
            >
              <FileText className="w-5 h-5" aria-hidden="true" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/20 text-white focus-visible-ring"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="sm:hidden mt-3 pb-2 border-t border-white/20 pt-3">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => { toggleHighContrast(); setMobileMenuOpen(false); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  highContrast ? "bg-white text-[#1a5396]" : "bg-white/20 text-white"
                }`}
                aria-pressed={highContrast}
              >
                <Eye className="w-5 h-5" aria-hidden="true" />
                {highContrast ? "Desativar Alto Contraste" : "Ativar Alto Contraste"}
              </button>

              <button
                onClick={() => { toggleLargeText(); setMobileMenuOpen(false); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  largeText ? "bg-white text-[#1a5396]" : "bg-white/20 text-white"
                }`}
                aria-pressed={largeText}
              >
                <Type className="w-5 h-5" aria-hidden="true" />
                {largeText ? "Desativar Texto Grande" : "Ativar Texto Grande"}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
