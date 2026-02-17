/**
 * Interactive map – deck.gl HeatmapLayer + ScatterplotLayer
 * over a MapLibre GL basemap.
 *
 * Architecture: MapLibre and DeckGL are rendered as SIBLINGS
 * (not parent-child) so the deck.gl WebGL canvas sits on top
 * of the MapLibre canvas. Camera is synced via viewState → jumpTo.
 *
 * Data comes from GDELT GEO 2.0 API (GeoJSON features).
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import { ScatterplotLayer } from '@deck.gl/layers';
import { Map as MapLibreMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useStore } from '../store';
import type { MapViewState, GeoFeature } from '../types';
import './MapView.css';

const INITIAL_VIEW_STATE: MapViewState = {
  longitude: 0,
  latitude: 20,
  zoom: 2,
  pitch: 0,
  bearing: 0,
};

const MAP_STYLES: Record<string, string> = {
  dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  light: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
};

/* ---- colour presets for heatmap ---- */
const HEAT_PALETTES: Record<string, [number, number, number, number][]> = {
  channel: [], // computed at runtime from channel colour
  thermal: [
    [0, 0, 80, 60], [30, 0, 180, 130], [180, 0, 200, 200],
    [255, 100, 50, 220], [255, 255, 80, 240], [255, 255, 255, 255],
  ],
  green: [
    [0, 40, 0, 60], [0, 100, 30, 130], [30, 180, 60, 200],
    [120, 230, 80, 220], [200, 255, 100, 240], [255, 255, 180, 255],
  ],
  plasma: [
    [13, 8, 135, 60], [126, 3, 168, 130], [204, 71, 120, 200],
    [248, 149, 64, 220], [252, 225, 56, 240], [240, 249, 33, 255],
  ],
};

export function MapView() {
  const geoFeatures = useStore((s) => s.geoFeatures);
  const selectedLocation = useStore((s) => s.selectedLocation);
  const setSelectedLocation = useStore((s) => s.setSelectedLocation);
  const activeChannel = useStore((s) => s.activeChannel);
  const theme = useStore((s) => s.theme);

  const [viewState, setViewState] = useState<MapViewState>(INITIAL_VIEW_STATE);
  const mapRef = useRef<MapLibreMap | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  /* layer toggle state */
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showScatter, setShowScatter] = useState(true);
  const [heatPalette, setHeatPalette] = useState<string>('channel');
  const [heatRadius, setHeatRadius] = useState(80);
  const [heatIntensity, setHeatIntensity] = useState(2);
  const [controlsOpen, setControlsOpen] = useState(false);

  /* initialise MapLibre map once */
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = new MapLibreMap({
        container: mapContainerRef.current,
        style: MAP_STYLES[theme],
        interactive: false,      // deck.gl handles input
      });
    }
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* switch basemap when theme changes */
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setStyle(MAP_STYLES[theme]);
    }
  }, [theme]);

  /* keep MapLibre camera in sync with deck.gl */
  const onViewStateChange = useCallback(
    ({ viewState: vs }: { viewState: MapViewState }) => {
      setViewState(vs);
      mapRef.current?.jumpTo({
        center: [vs.longitude, vs.latitude],
        zoom: vs.zoom,
        bearing: vs.bearing,
        pitch: vs.pitch,
      });
    },
    [],
  );

  /* parse channel colour into RGBA tuple */
  const channelRgba = hexToRgba(activeChannel.color, 200);

  /* build colour range for heatmap */
  const getColorRange = (): [number, number, number, number][] => {
    if (heatPalette !== 'channel' && HEAT_PALETTES[heatPalette]) {
      return HEAT_PALETTES[heatPalette];
    }
    return [
      [channelRgba[0], channelRgba[1], channelRgba[2], 60],
      [channelRgba[0], channelRgba[1], channelRgba[2], 130],
      [channelRgba[0], channelRgba[1], channelRgba[2], 200],
      [255, 255, 100, 220],
      [255, 200, 60, 240],
      [255, 80, 40, 255],
    ];
  };

  /* --------------- layers --------------- */
  const layers = [];

  if (showHeatmap) {
    layers.push(
      new HeatmapLayer<GeoFeature>({
        id: 'heatmap',
        data: geoFeatures,
        getPosition: (d) => d.geometry.coordinates as [number, number],
        getWeight: (d) => Math.max(d.properties.count, 1),
        radiusPixels: heatRadius,
        intensity: heatIntensity,
        threshold: 0.03,
        colorRange: getColorRange(),
        updateTriggers: {
          getPosition: [geoFeatures],
          getWeight: [geoFeatures],
          colorRange: [heatPalette, activeChannel.id],
        },
      }),
    );
  }

  if (showScatter) {
    layers.push(
      new ScatterplotLayer<GeoFeature>({
        id: 'scatter',
        data: geoFeatures,
        pickable: true,
        opacity: 0.9,
        stroked: true,
        filled: true,
        radiusScale: 4,
        radiusMinPixels: 3,
        radiusMaxPixels: 14,
        lineWidthMinPixels: 1,
        getPosition: (d) => d.geometry.coordinates as [number, number],
        getRadius: (d) =>
          d.properties.name === selectedLocation
            ? Math.sqrt(d.properties.count) * 3
            : Math.sqrt(d.properties.count) * 1.5,
        getFillColor: (d) =>
          d.properties.name === selectedLocation
            ? [255, 220, 50, 255]
            : channelRgba,
        getLineColor: [255, 255, 255, 60],
        updateTriggers: {
          getRadius: [selectedLocation],
          getFillColor: [selectedLocation, activeChannel.id],
        },
        onClick: (info) => {
          if (info.object) {
            setSelectedLocation(
              info.object.properties.name === selectedLocation
                ? null
                : info.object.properties.name,
            );
          }
        },
      }),
    );
  }

  const paletteNames = Object.keys(HEAT_PALETTES);

  return (
    <div className="map-view">
      {/* MapLibre basemap (z-index: 0) */}
      <div ref={mapContainerRef} className="map-basemap" />

      {/* deck.gl overlay (z-index: 1) */}
      <DeckGL
        viewState={viewState}
        onViewStateChange={onViewStateChange as any}
        controller={true}
        layers={layers}
        style={{ position: 'absolute', inset: '0', zIndex: '1' }}
        getTooltip={({ object }: { object?: GeoFeature }) =>
          object
            ? {
                html: `<div class="map-tt"><strong>${object.properties.name}</strong><br/>${object.properties.count} article${object.properties.count !== 1 ? 's' : ''}</div>`,
                style: {
                  backgroundColor:
                    theme === 'dark'
                      ? 'rgba(15,23,42,0.95)'
                      : 'rgba(255,255,255,0.95)',
                  color: theme === 'dark' ? '#e2e8f0' : '#1e293b',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  border:
                    theme === 'dark'
                      ? '1px solid #334155'
                      : '1px solid #e2e8f0',
                },
              }
            : null
        }
      />

      {/* Floating layer controls */}
      <div className={`map-controls ${controlsOpen ? 'open' : ''}`}>
        <button
          className="mc-toggle"
          onClick={() => setControlsOpen((o) => !o)}
          title="Layer controls"
        >
          ⚙
        </button>

        {controlsOpen && (
          <div className="mc-panel">
            <h4>Layers</h4>

            <label className="mc-row">
              <input
                type="checkbox"
                checked={showHeatmap}
                onChange={() => setShowHeatmap((v) => !v)}
              />
              <span>Heatmap</span>
            </label>

            <label className="mc-row">
              <input
                type="checkbox"
                checked={showScatter}
                onChange={() => setShowScatter((v) => !v)}
              />
              <span>Scatter dots</span>
            </label>

            {showHeatmap && (
              <>
                <h4>Heatmap colour</h4>
                <div className="mc-palette-row">
                  {paletteNames.map((name) => (
                    <button
                      key={name}
                      className={`mc-palette-btn ${heatPalette === name ? 'active' : ''}`}
                      onClick={() => setHeatPalette(name)}
                      title={name}
                    >
                      <span
                        className={`mc-swatch mc-swatch-${name}`}
                        style={
                          name === 'channel'
                            ? { background: activeChannel.color }
                            : undefined
                        }
                      />
                      <span className="mc-palette-label">{name}</span>
                    </button>
                  ))}
                </div>

                <h4>Radius · {heatRadius}px</h4>
                <input
                  type="range"
                  min={20}
                  max={200}
                  step={10}
                  value={heatRadius}
                  onChange={(e) => setHeatRadius(+e.target.value)}
                  className="mc-slider"
                />

                <h4>Intensity · {heatIntensity.toFixed(1)}</h4>
                <input
                  type="range"
                  min={0.5}
                  max={5}
                  step={0.1}
                  value={heatIntensity}
                  onChange={(e) => setHeatIntensity(+e.target.value)}
                  className="mc-slider"
                />
              </>
            )}
          </div>
        )}
      </div>

      {/* Empty-state hint */}
      {geoFeatures.length === 0 && (
        <div className="map-empty">
          No geo data — try a different channel or window
        </div>
      )}
    </div>
  );
}

/* ---- util ---- */
function hexToRgba(hex: string, a: number): [number, number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255, a];
}
