import React, { createContext, useContext, useState, ReactNode } from "react";

export type Language = "ca" | "en" | "es";

const translations = {
  ca: {
    // Header
    nav_drop: "Col·lecció",
    nav_access: "Accés",
    nav_logout: "Sortir",

    hero_est: "Born in Barcelona",
    hero_title: "La muntanya és el patró.",
    hero_subtitle: "Cada drop és un territori. Cada peça en conserva la forma.",
    hero_cta: "Entrar al drop",
    
    manifesto_label: "Manifest",
    manifesto_text: "pdra. neix de la roca, de la ciutat i de tot el que passa entre les dues.",
    manifesto_body: "No fem pantalons per semblar escaladors. Fem peces que porten territori a sobre. La muntanya no decora la roba: la construeix.",
    
    concept_label: "El concepte",
    concept_title: "Del relleu a la peça.",
    concept_p1: "Cada col·lecció parteix d’una serralada catalana. N’estudiem el perfil, les arestes, la tensió visual i la manera com el paisatge cau, talla i s’enfila.",
    concept_p2: "Després, tot això es tradueix en patronatge, volum i costures. No és outdoor convencional. No és streetwear buit. És escalada amb cultura.",
    
    drop_label: "Drop 001",
    drop_name: "MONTSERRAT",
    drop_subtitle: "La primera muntanya. El primer gest.",
    drop_elevation: "Altitud — 1.236 m",
    drop_units: "Edició limitada — {count} peces",
    drop_status_label: "Estat",
    drop_view: "Veure el drop",
    
    philosophy_label: "Filosofia",
    philosophy_title: "No parlem de rendiment. Parlem de connexió.",
    philosophy_body: "Escalar també és una manera de pertànyer a un lloc. pdra. converteix aquesta relació en roba que pots portar de la roca al carrer sense canviar de pell.",
    
    email_label: "Accés anticipat",
    email_title: "Entra abans que la resta.",
    email_on_list: "Ja formes part de la llista.",
    email_cta: "Sol·licitar accés",
    
    footer_location: "pdra. — Born in BCN. Made for the mountains.",

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

    hero_est: "Born in Barcelona",
    hero_title: "The mountain is the pattern.",
    hero_subtitle: "Each drop is a territory. Each piece carries its shape.",
    hero_cta: "Enter the drop",
    
    manifesto_label: "Manifesto",
    manifesto_text: "pdra. is born from rock, from the city, and from everything that lives between the two.",
    manifesto_body: "We do not make climbing pants to look like climbers. We make garments that carry territory. The mountain is not decoration — it builds the piece.",
    
    concept_label: "The Concept",
    concept_title: "From landscape to garment.",
    concept_p1: "Each collection begins with a Catalan mountain range. We study its profile, ridgelines, visual tension, and the way the land rises, cuts, and falls.",
    concept_p2: "Then we translate it into pattern, volume, and seam construction. It is not conventional outdoor wear. It is not empty streetwear. It is climbing with culture.",
    
    drop_label: "Drop 001",
    drop_name: "MONTSERRAT",
    drop_subtitle: "The first mountain. The first gesture.",
    drop_elevation: "Elevation — 1,236 m",
    drop_units: "Limited edition — {count} pieces",
    drop_status_label: "Status",
    drop_view: "View the drop",
    
    philosophy_label: "Philosophy",
    philosophy_title: "This is not about performance. It is about connection.",
    philosophy_body: "Climbing is also a way of belonging to a place. pdra. turns that relationship into clothing you can carry from rock to city without changing your skin.",
    
    email_label: "Early access",
    email_title: "Enter before everyone else.",
    email_on_list: "You are already on the list.",
    email_cta: "Request access",
    
    footer_location: "pdra. — Born in BCN. Made for the mountains.",

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

    hero_est: "Born in Barcelona",
    hero_title: "La montaña es el patrón.",
    hero_subtitle: "Cada drop es un territorio. Cada pieza conserva su forma.",
    hero_cta: "Entrar al drop",
    
    manifesto_label: "Manifiesto",
    manifesto_text: "pdra. nace de la roca, de la ciudad y de todo lo que ocurre entre las dos.",
    manifesto_body: "No hacemos pantalones para parecer escaladores. Hacemos prendas que llevan territorio encima. La montaña no decora la ropa: la construye.",
    
    concept_label: "El concepto",
    concept_title: "Del relieve a la prenda.",
    concept_p1: "Cada colección parte de una sierra catalana. Estudiamos su perfil, sus aristas, su tensión visual y la forma en que el paisaje sube, corta y cae.",
    concept_p2: "Después, todo eso se traduce en patronaje, volumen y costuras. No es outdoor convencional. No es streetwear vacío. Es escalada con cultura.",
    
    drop_label: "Drop 001",
    drop_name: "MONTSERRAT",
    drop_subtitle: "La primera montaña. El primer gesto.",
    drop_elevation: "Altitud — 1.236 m",
    drop_units: "Edición limitada — {count} piezas",
    drop_status_label: "Estado",
    drop_view: "Ver el drop",
    
    philosophy_label: "Filosofía",
    philosophy_title: "No hablamos de rendimiento. Hablamos de conexión.",
    philosophy_body: "Escalar también es una forma de pertenecer a un lugar. pdra. convierte esa relación en ropa que puedes llevar de la roca a la ciudad sin cambiar de piel.",
    
    email_label: "Acceso anticipado",
    email_title: "Entra antes que el resto.",
    email_on_list: "Ya formas parte de la lista.",
    email_cta: "Solicitar acceso",
    
    footer_location: "pdra. — Born in BCN. Made for the mountains.",

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
    let text: string = translations[language][key] || translations.ca[key] || key;
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
