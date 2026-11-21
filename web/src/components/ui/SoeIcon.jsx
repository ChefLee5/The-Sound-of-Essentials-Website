import React, { useId, useMemo } from 'react';
import { SOE_ICONS, SOE_BRANDS } from './soeIcons.generated';

const LAND_ICON_CONFIG = {
  harmonia: {
    icon: 'playback-volume-2',
    glass: 'glass-volume-full-2',
    color: '#d4a843',
  },
  numeria: {
    icon: 'layouts-grid-3x3',
    glass: 'glass-pie-chart-1-2',
    color: '#7fb685',
  },
  vitalis: {
    icon: 'metrics-activity',
    glass: 'glass-zap-2',
    color: '#c4785a',
  },
  celestia: {
    icon: 'schedule-clock',
    glass: 'glass-clock-1',
    color: '#9678c4',
  },
  luminosity: {
    icon: 'documents-book-bookmark',
    glass: 'glass-sparkle-3-2',
    color: '#d4897a',
  },
  aquaria: {
    icon: 'nature-cloud-rain',
    glass: 'glass-rainy-2',
    color: '#5ba4c9',
  },
  terrasol: {
    icon: 'nature-earth',
    glass: 'glass-earth-2',
    color: '#5fb685',
  },
};

function scopeSvgIds(markup, uid) {
  if (!markup.includes('id="')) return markup;
  const ids = [];
  const idRegex = /id="([^"]+)"/g;
  let match;
  while ((match = idRegex.exec(markup)) !== null) {
    ids.push(match[1]);
  }
  if (ids.length === 0) return markup;
  let scoped = markup;
  for (const id of ids) {
    const next = `${uid}-${id}`;
    scoped = scoped.split(`id="${id}"`).join(`id="${next}"`);
    scoped = scoped.split(`url(#${id})`).join(`url(#${next})`);
    scoped = scoped.split(`xlink:href="#${id}"`).join(`xlink:href="#${next}"`);
  }
  return scoped;
}

/**
 * SoeIcon — Lightweight, tree-shaken Rune Icons renderer aligned to SOE themes.
 * Supports normal, duotone, fill, pixelated, and glass variants.
 */
export const SoeIcon = ({
  name,
  type = 'normal',
  size = 20,
  className = '',
  style,
  title,
}) => {
  const rawUid = useId();
  const uid = rawUid.replace(/:/g, '');

  const variant = useMemo(() => {
    const entry = SOE_ICONS[name];
    if (!entry) return null;
    if (entry[type]) return entry[type];
    if (entry.glass) return entry.glass;
    if (entry.duotone) return entry.duotone;
    if (entry.normal) return entry.normal;
    const firstKey = Object.keys(entry)[0];
    return firstKey ? entry[firstKey] : null;
  }, [name, type]);

  const markup = useMemo(() => {
    if (!variant) return '';
    return scopeSvgIds(variant.markup, uid);
  }, [variant, uid]);

  if (!variant) return null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={variant.viewBox}
      fill="none"
      className={`soe-icon ${className}`.trim()}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        ...style,
      }}
      role={title ? 'img' : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
};

/**
 * SoeBrandLogo — Renders curated verified brand logos from runeicons-brands.
 */
export const SoeBrandLogo = ({
  name,
  size = 20,
  className = '',
  style,
  title,
}) => {
  const rawUid = useId();
  const uid = rawUid.replace(/:/g, '');
  const brand = SOE_BRANDS[name];

  const markup = useMemo(() => {
    if (!brand) return '';
    return scopeSvgIds(brand.markup, uid);
  }, [brand, uid]);

  if (!brand) return null;

  const [, , vbW, vbH] = brand.viewBox.split(/\s+/).map(Number);
  const aspect = vbW && vbH ? vbW / vbH : 1;
  const width = aspect >= 1 ? size : Math.round(size * aspect);
  const height = aspect >= 1 ? Math.round(size / aspect) : size;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={brand.viewBox}
      className={`soe-brand-logo ${className}`.trim()}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        ...style,
      }}
      role={title ? 'img' : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
};

/**
 * LandIcon — Renders the canonical Rune Icon for any of the 7 SOE Lands.
 */
export const LandIcon = ({
  landId,
  variant = 'duotone',
  size = 22,
  tinted = true,
  className = '',
  style,
  title,
}) => {
  const config = LAND_ICON_CONFIG[String(landId || '').toLowerCase()];
  if (!config) return null;

  const isGlass = variant === 'glass';
  const iconName = isGlass ? config.glass : config.icon;
  const resolvedStyle = tinted && !isGlass ? { color: config.color, ...style } : style;

  return (
    <SoeIcon
      name={iconName}
      type={isGlass ? 'glass' : variant}
      size={size}
      className={className}
      style={resolvedStyle}
      title={title}
    />
  );
};

export default SoeIcon;
