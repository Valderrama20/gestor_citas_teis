import i18n from '../config/i18n';

function normalize(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');
}

const CATALOG_GROUPS = {
  course: {
    peluqueria: 'catalog.courses.peluqueria',
    cuidado_facial: 'catalog.courses.cuidado_facial',
    tratamiento_corporal: 'catalog.courses.tratamiento_corporal',
    manicura: 'catalog.courses.manicura',
    maquillaje_artistico: 'catalog.courses.maquillaje_artistico',
    spa_y_bienestar: 'catalog.courses.spa_y_bienestar',
  },
  workshop: {
    corte_y_peinado: 'catalog.workshops.corte_y_peinado',
    colorimetria: 'catalog.workshops.colorimetria',
    limpieza_facial: 'catalog.workshops.limpieza_facial',
    manicura_y_pedicura: 'catalog.workshops.manicura_y_pedicura',
    maquillaje_social: 'catalog.workshops.maquillaje_social',
    maquillaje_de_fantasia: 'catalog.workshops.maquillaje_de_fantasia',
    pestanas_y_cejas: 'catalog.workshops.pestanas_y_cejas',
    masaje_relajante: 'catalog.workshops.masaje_relajante',
    aromaterapia: 'catalog.workshops.aromaterapia',
    hidroterapia: 'catalog.workshops.hidroterapia',
  },
};

export function translateCatalogLabel(rawLabel, group) {
  if (!rawLabel) {
    return rawLabel;
  }

  const key = CATALOG_GROUPS[group]?.[normalize(rawLabel)];
  if (!key || !i18n.exists(key)) {
    return rawLabel;
  }

  const translated = i18n.t(key);
  return translated || rawLabel;
}

export const translateCourseName = (rawLabel) => translateCatalogLabel(rawLabel, 'course');
export const translateWorkshopName = (rawLabel) => translateCatalogLabel(rawLabel, 'workshop');