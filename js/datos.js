// =========================================================
//  datos.js — Datos de prueba y ubicaciones predefinidas
//  Constantes estáticas, sin dependencias.
// =========================================================

const TALLERES_INICIALES = [
  {
    id: 1,
    colaborador: { nombre: "Laura Méndez", telefono: "1155234567", mail: "laura@mail.com" },
    nombre: "Taller de Arcilla",
    descripcion: "Aprendé a moldear y crear tus propias figuras de arcilla desde cero. Para todas las edades.",
    actividad: "Cerámica y modelado",
    rubro: "Artesanías",
    contacto: "@taller_arcilla_laura | 1155234567",
    lat: -34.52264,
    lng: -58.70040,
    ubicacionNombre: "Juan M. Gutiérrez 1150",
    logo: null
  },
  {
    id: 2,
    colaborador: { nombre: "Marcos Soria", telefono: "1166345678", mail: "marcos@mail.com" },
    nombre: "Taller de Herrería",
    descripcion: "Construí tus propios objetos metálicos. Técnicas básicas y avanzadas de soldadura y forja.",
    actividad: "Herrería y forja",
    rubro: "Oficios",
    contacto: "1166345678",
    lat: -34.52180,
    lng: -58.70321,
    ubicacionNombre: "José León Suárez 800",
    logo: null
  },
  {
    id: 3,
    colaborador: { nombre: "Ana García", telefono: "1177456789", mail: "ana@mail.com" },
    nombre: "Taller de Jabones Artesanales",
    descripcion: "Creá tus propios jabones naturales con ingredientes ecológicos. Incluye fragancias y colores.",
    actividad: "Jabonería artesanal",
    rubro: "Cosmética Natural",
    contacto: "@jabones_ana",
    lat: -34.52405,
    lng: -58.69850,
    ubicacionNombre: "Verdi 920",
    logo: null
  },
  {
    id: 4,
    colaborador: { nombre: "Carlos Benitez", telefono: "1188567890", mail: "carlos@mail.com" },
    nombre: "Taller de Sahumerios",
    descripcion: "Elaborá los mejores sahumerios y varillas de incienso con hierbas y resinas naturales.",
    actividad: "Aromaterapia y sahumerios",
    rubro: "Bienestar",
    contacto: "1188567890 | @sahumerios_cb",
    lat: -34.52330,
    lng: -58.70200,
    ubicacionNombre: "Centro Cultural (sede)",
    logo: null
  },
  {
    id: 5,
    colaborador: { nombre: "Valeria Torres", telefono: "1199678901", mail: "valeria@mail.com" },
    nombre: "Taller de Pintura",
    descripcion: "Explorá distintas técnicas: acrílico, acuarela, óleo. Grupos reducidos, nivel inicial y avanzado.",
    actividad: "Pintura y dibujo",
    rubro: "Arte",
    contacto: "@pintura_con_vale | valtorres@mail.com",
    lat: -34.52050,
    lng: -58.69980,
    ubicacionNombre: "Plaza J.M. Gutiérrez",
    logo: null
  }
];

// Ubicaciones predefinidas usadas en el formulario de registro
const UBICACIONES = [
  { id: "ubi-centro",    nombre: "Centro Cultural (sede)",    dir: "Av. Principal S/N, Los Polvorines",            lat: -34.5230, lng: -58.7020 },
  { id: "ubi-plaza",     nombre: "Plaza J.M. Gutiérrez",      dir: "Plaza Juan María Gutiérrez, Los Polvorines",   lat: -34.5205, lng: -58.6998 },
  { id: "ubi-ruta",      nombre: "Ruta 202 / J.M. Gutiérrez", dir: "Ruta 202 y Juan M. Gutiérrez, Los Polvorines", lat: -34.5233, lng: -58.7020 },
  { id: "ubi-suarez",    nombre: "José León Suárez 800",      dir: "José León Suárez 800, Los Polvorines",         lat: -34.5218, lng: -58.7032 },
  { id: "ubi-verdi",     nombre: "Verdi 920",                 dir: "Verdi 920, Los Polvorines",                    lat: -34.5240, lng: -58.6985 },
  { id: "ubi-gutierrez", nombre: "Juan M. Gutiérrez 1150",    dir: "Juan María Gutiérrez 1150, Los Polvorines",    lat: -34.5226, lng: -58.7004 }
];
