import React, { createContext, useContext, useState, ReactNode } from "react";

export type Language = "ca" | "en" | "es";

const translations = {
  ca: {
    // Header
    nav_drop: "Col·lecció",
    nav_access: "Accés",
    nav_logout: "Sortir",

    // Hero
    hero_est: "Est. Barcelona",
    hero_title: "La muntanya és el patró.",
    hero_subtitle: "Cada peça segueix un cim. Cada tall segueix un penya-segat.",
    hero_cta: "Sol·licitar Accés Anticipat",

    // Manifesto
    manifesto_label: "Manifest",
    manifesto_text: "pdra. és un estudi del paisatge català. No escalem per conquerir; escalem per pertànyer.",
    manifesto_body: "Cada costura segueix una carena. Cada tall segueix un penya-segat. La muntanya no és decoració — defineix l'estructura de la peça.",

    // Concept
    concept_label: "El Concepte",
    concept_title: "De la muntanya a la peça.",
    concept_p1: "Cada col·lecció comença amb una serralada catalana — Montserrat, Pedraforca, Montsant. Estudiem la topografia, tracem les línies de cresta i les traduïm en l'arquitectura de cada peça.",
    concept_p2: "El resultat és roba que pertany a un lloc. No és roba esportiva. No és moda. Quelcom entremig.",

    // Drop Preview
    drop_label: "Col·lecció 001",
    drop_name: "MONT SERRAT",
    drop_subtitle: "Una muntanya que portes posada.",
    drop_elevation: "Altitud — 1.236 m",
    drop_units: "Unitats — {count} peces",
    drop_status_label: "Estat",
    drop_coming_soon: "Pròximament",
    drop_open: "Obert",
    drop_sold_out: "Esgotat",
    drop_view: "Veure Col·lecció",

    // Philosophy
    philosophy_label: "Filosofia",
    philosophy_title: "Connexió, no rendiment.",
    philosophy_body: "Creiem que escalar és un acte d'escoltar. La roca parla a través de la textura, el pes i la forma. pdra. tradueix aquesta conversa en roba que pots portar amb tu — de la paret al carrer.",

    // Email Capture
    email_label: "Mantén-te a prop",
    email_title: "Sigues el primer en saber-ho.",
    email_on_list: "Ets a la llista.",
    email_placeholder: "el-teu@email.com",
    email_cta: "Sol·licitar Accés",

    // Footer
    footer_location: "pdra. — Barcelona",

    // Drop Page
    drop_collection_label: "La Col·lecció",
    drop_collection_desc: "Nascuda de les crestes serrades de Montserrat, aquesta col·lecció tradueix la geometria impossible de la muntanya en forma vestible.",
    drop_back_cut: "El Tall de Muntanya Posterior — una línia de costura traçada des del perfil topogràfic del cim — defineix la silueta de cada peça.",
    drop_technical: "Tècnic",
    drop_fit: "Tall",
    drop_fit_value: "Ample",
    drop_composition: "Composició",
    drop_composition_value: "95% Cotó / 5% Elastà",
    drop_weight: "Gramatge",
    drop_weight_value: "280 gsm",
    drop_origin: "Origen",
    drop_origin_value: "Barcelona, ES",
    drop_elevation_label: "Altitud",
    drop_elevation_value: "1.236 m",
    drop_availability: "Disponibilitat",
    drop_units_remaining: "Unitats restants",
    drop_prebook: "Prereservar",
    drop_confirm_reservation: "Confirmar reserva — Talla {size}",
    drop_confirm: "Confirmar",
    drop_back: "Enrere",
    drop_reserved: "Reservat — Talla {size}",
    drop_production_soon: "La producció comença aviat.",
    drop_secured: "Has assegurat la teva peça.",
    drop_access_required: "Cal accés anticipat per prereservar.",
    drop_request_access: "Sol·licitar Accés",

    // Access Page
    access_granted: "Accés Concedit",
    access_welcome: "Benvingut/da.",
    access_early: "Tens accés anticipat a totes les col·leccions.",
    access_enter: "Entrar a la Col·lecció",
    access_requested: "Sol·licitat",
    access_reviewing: "La teva sol·licitud s'està revisant.",
    access_reach_out: "Et contactarem quan el teu accés estigui llest.",
    access_simulate: "(Simular aprovació)",
    access_request: "Sol·licitar Accés",
    access_login: "Entrar",
    access_enter_btn: "Entrar",

    // Admin
    admin_title: "Admin — Panell de Prova",
    admin_drop_status: "Estat de la Col·lecció",
    admin_current_state: "Estat Actual",
    admin_status: "Estat",
    admin_units: "Unitats",
    admin_user: "Usuari",
    admin_access: "Accés",
  },

  en: {
    nav_drop: "Drop",
    nav_access: "Access",
    nav_logout: "Logout",

    hero_est: "Est. Barcelona",
    hero_title: "The mountain is the pattern.",
    hero_subtitle: "Each garment follows a ridge. Each cut follows a cliff.",
    hero_cta: "Request Early Access",

    manifesto_label: "Manifesto",
    manifesto_text: "pdra. is a study of the Catalan landscape. We do not climb to conquer; we climb to belong.",
    manifesto_body: "Every stitch follows a ridge. Every cut follows a cliff. The mountain is not decoration — it defines the structure of the garment.",

    concept_label: "The Concept",
    concept_title: "From mountain to garment.",
    concept_p1: "Each collection begins with a Catalan mountain range — Montserrat, Pedraforca, Montsant. We study the topography, trace the ridgelines, and translate them into the architecture of each piece.",
    concept_p2: "The result is clothing that belongs to a place. Not performance wear. Not fashion. Something in between.",

    drop_label: "Drop 001",
    drop_name: "MONT SERRAT",
    drop_subtitle: "A mountain you wear.",
    drop_elevation: "Elevation — 1,236m",
    drop_units: "Units — {count} pieces",
    drop_status_label: "Status",
    drop_coming_soon: "Coming Soon",
    drop_open: "Open",
    drop_sold_out: "Sold Out",
    drop_view: "View Drop",

    philosophy_label: "Philosophy",
    philosophy_title: "Connection, not performance.",
    philosophy_body: "We believe climbing is an act of listening. The rock speaks through texture, weight, and form. pdra. translates that conversation into clothing you can carry with you — off the wall, into the city.",

    email_label: "Stay Close",
    email_title: "Be the first to know.",
    email_on_list: "You're on the list.",
    email_placeholder: "your@email.com",
    email_cta: "Request Access",

    footer_location: "pdra. — Barcelona",

    drop_collection_label: "The Collection",
    drop_collection_desc: "Born from the serrated ridges of Montserrat, this collection translates the mountain's impossible geometry into wearable form.",
    drop_back_cut: "The Back Mountain Cut — a single seam line traced from the peak's topographic profile — defines the silhouette of each piece.",
    drop_technical: "Technical",
    drop_fit: "Fit",
    drop_fit_value: "Wide",
    drop_composition: "Composition",
    drop_composition_value: "95% Cotton / 5% Elastane",
    drop_weight: "Weight",
    drop_weight_value: "280 gsm",
    drop_origin: "Origin",
    drop_origin_value: "Barcelona, ES",
    drop_elevation_label: "Elevation",
    drop_elevation_value: "1,236 m",
    drop_availability: "Availability",
    drop_units_remaining: "Units remaining",
    drop_prebook: "Prebook",
    drop_confirm_reservation: "Confirm reservation — Size {size}",
    drop_confirm: "Confirm",
    drop_back: "Back",
    drop_reserved: "Reserved — Size {size}",
    drop_production_soon: "Production starts soon.",
    drop_secured: "You secured your piece.",
    drop_access_required: "Early access required to prebook.",
    drop_request_access: "Request Access",

    access_granted: "Access Granted",
    access_welcome: "Welcome back.",
    access_early: "You have early access to all drops.",
    access_enter: "Enter Drop",
    access_requested: "Requested",
    access_reviewing: "Your request is being reviewed.",
    access_reach_out: "We'll reach out when your access is ready.",
    access_simulate: "(Simulate approval)",
    access_request: "Request Access",
    access_login: "Login",
    access_enter_btn: "Enter",

    admin_title: "Admin — Mock Panel",
    admin_drop_status: "Drop Status",
    admin_current_state: "Current State",
    admin_status: "Status",
    admin_units: "Units",
    admin_user: "User",
    admin_access: "Access",
  },

  es: {
    nav_drop: "Colección",
    nav_access: "Acceso",
    nav_logout: "Salir",

    hero_est: "Est. Barcelona",
    hero_title: "La montaña es el patrón.",
    hero_subtitle: "Cada prenda sigue una cresta. Cada corte sigue un acantilado.",
    hero_cta: "Solicitar Acceso Anticipado",

    manifesto_label: "Manifiesto",
    manifesto_text: "pdra. es un estudio del paisaje catalán. No escalamos para conquistar; escalamos para pertenecer.",
    manifesto_body: "Cada costura sigue una cresta. Cada corte sigue un acantilado. La montaña no es decoración — define la estructura de la prenda.",

    concept_label: "El Concepto",
    concept_title: "De la montaña a la prenda.",
    concept_p1: "Cada colección comienza con una sierra catalana — Montserrat, Pedraforca, Montsant. Estudiamos la topografía, trazamos las líneas de cresta y las traducimos en la arquitectura de cada pieza.",
    concept_p2: "El resultado es ropa que pertenece a un lugar. No es ropa deportiva. No es moda. Algo intermedio.",

    drop_label: "Colección 001",
    drop_name: "MONT SERRAT",
    drop_subtitle: "Una montaña que llevas puesta.",
    drop_elevation: "Altitud — 1.236 m",
    drop_units: "Unidades — {count} piezas",
    drop_status_label: "Estado",
    drop_coming_soon: "Próximamente",
    drop_open: "Abierto",
    drop_sold_out: "Agotado",
    drop_view: "Ver Colección",

    philosophy_label: "Filosofía",
    philosophy_title: "Conexión, no rendimiento.",
    philosophy_body: "Creemos que escalar es un acto de escuchar. La roca habla a través de la textura, el peso y la forma. pdra. traduce esa conversación en ropa que puedes llevar contigo — del muro a la ciudad.",

    email_label: "Mantente cerca",
    email_title: "Sé el primero en saberlo.",
    email_on_list: "Estás en la lista.",
    email_placeholder: "tu@email.com",
    email_cta: "Solicitar Acceso",

    footer_location: "pdra. — Barcelona",

    drop_collection_label: "La Colección",
    drop_collection_desc: "Nacida de las crestas serradas de Montserrat, esta colección traduce la geometría imposible de la montaña en forma vestible.",
    drop_back_cut: "El Corte de Montaña Posterior — una línea de costura trazada desde el perfil topográfico del pico — define la silueta de cada pieza.",
    drop_technical: "Técnico",
    drop_fit: "Corte",
    drop_fit_value: "Amplio",
    drop_composition: "Composición",
    drop_composition_value: "95% Algodón / 5% Elastano",
    drop_weight: "Gramaje",
    drop_weight_value: "280 gsm",
    drop_origin: "Origen",
    drop_origin_value: "Barcelona, ES",
    drop_elevation_label: "Altitud",
    drop_elevation_value: "1.236 m",
    drop_availability: "Disponibilidad",
    drop_units_remaining: "Unidades restantes",
    drop_prebook: "Prereservar",
    drop_confirm_reservation: "Confirmar reserva — Talla {size}",
    drop_confirm: "Confirmar",
    drop_back: "Atrás",
    drop_reserved: "Reservado — Talla {size}",
    drop_production_soon: "La producción comienza pronto.",
    drop_secured: "Has asegurado tu pieza.",
    drop_access_required: "Se requiere acceso anticipado para prereservar.",
    drop_request_access: "Solicitar Acceso",

    access_granted: "Acceso Concedido",
    access_welcome: "Bienvenido/a.",
    access_early: "Tienes acceso anticipado a todas las colecciones.",
    access_enter: "Entrar a la Colección",
    access_requested: "Solicitado",
    access_reviewing: "Tu solicitud está siendo revisada.",
    access_reach_out: "Te contactaremos cuando tu acceso esté listo.",
    access_simulate: "(Simular aprobación)",
    access_request: "Solicitar Acceso",
    access_login: "Entrar",
    access_enter_btn: "Entrar",

    admin_title: "Admin — Panel de Prueba",
    admin_drop_status: "Estado de la Colección",
    admin_current_state: "Estado Actual",
    admin_status: "Estado",
    admin_units: "Unidades",
    admin_user: "Usuario",
    admin_access: "Acceso",
  },
} as const;

type TranslationKey = keyof typeof translations.ca;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("ca");

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    let text = translations[language][key] || translations.ca[key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

export const languageLabels: Record<Language, string> = {
  ca: "CA",
  en: "EN",
  es: "ES",
};
