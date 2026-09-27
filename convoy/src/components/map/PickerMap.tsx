import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { View, ActivityIndicator, Platform } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";

export interface PickerWaypoint {
  lat: number;
  lng: number;
  kind: "from" | "via" | "to";
}

export interface PickerMapHandle {
  setMarkers: (markers: PickerWaypoint[]) => void;
  fit: (markers: PickerWaypoint[]) => void;
}

interface Props {
  center: { lat: number; lng: number };
  onMapTap: (lat: number, lng: number) => void;
  onMarkerTap?: (kind: string, lat: number, lng: number) => void;
  onReady?: () => void;
}

const HTML = (center: { lat: number; lng: number }) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover"/>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"/>
<style>
  html,body,#map{height:100%;margin:0;background:#1a2028;}
  #map{position:absolute;top:0;left:0;right:0;bottom:0;}
  .leaflet-control-attribution{display:none!important;}
  .leaflet-tile-pane{filter:invert(1) hue-rotate(180deg) brightness(0.85) contrast(0.9) saturate(0.7);}
  .pin-a{width:32px;height:32px;border-radius:50%;background:#7CE5B0;border:3px solid #fff;display:flex;align-items:center;justify-content:center;font-weight:900;color:#0B0E15;box-shadow:0 4px 12px rgba(0,0,0,0.6);font-size:13px;}
  .pin-b{width:32px;height:32px;border-radius:50% 50% 50% 0;background:#FF7B6B;border:3px solid #fff;transform:rotate(-45deg);box-shadow:0 4px 12px rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;}
  .pin-b > span{transform:rotate(45deg);color:#fff;font-weight:900;font-size:12px;}
  .pin-v{width:28px;height:28px;border-radius:50%;background:#FFB454;border:3px solid #fff;display:flex;align-items:center;justify-content:center;font-weight:900;color:#000;box-shadow:0 4px 12px rgba(0,0,0,0.6);font-size:12px;}
  #err{position:absolute;top:50%;left:0;right:0;text-align:center;color:#FF5C7A;font-family:monospace;font-size:12px;padding:20px;display:none;z-index:9999;}
</style>
</head>
<body>
<div id="map"></div>
<div id="err"></div>
<script>
  var map = null;
  var markers = {};

  function rn(type, payload) {
    if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify({type:type, ...(payload||{})}));
  }
  function showErr(msg){ var el=document.getElementById('err'); el.style.display='block'; el.textContent=msg; rn('error',{message:String(msg)}); }
  window.onerror = function(m){ showErr(m); };

  function loadLeaflet(){
    var s=document.createElement('script');
    s.src='https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
    s.onload=function(){ setTimeout(boot, 60); };
    s.onerror=function(){ showErr('Leaflet CDN failed'); };
    document.body.appendChild(s);
  }

  function boot(){
    if (typeof L === 'undefined') { showErr('L undefined'); return; }
    try {
      map = L.map('map',{zoomControl:false, attributionControl:false, preferCanvas:true}).setView([${center.lat}, ${center.lng}], 11);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:19, crossOrigin:true}).addTo(map);

      map.on('click', function(e){
        rn('mapTap', { lat: e.latlng.lat, lng: e.latlng.lng });
      });

      window.addEventListener('message', handler);
      document.addEventListener('message', handler);
      rn('ready');
    } catch(e){ showErr(e.message||String(e)); }
  }

  function handler(e){
    try {
      var m = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
      if (m.type === 'setMarkers') setMarkers(m.markers);
      if (m.type === 'fit') fit(m.markers);
    } catch(err){}
  }

  function setMarkers(ws){
    Object.keys(markers).forEach(function(k){ map.removeLayer(markers[k]); delete markers[k]; });
    (ws||[]).forEach(function(w, i){
      var html;
      if (w.kind === 'from') html = '<div class="pin-a">A</div>';
      else if (w.kind === 'to') html = '<div class="pin-b"><span>B</span></div>';
      else html = '<div class="pin-v">'+(i)+'</div>';
      var icon = L.divIcon({className:'', html:html, iconSize:[32,40], iconAnchor:[16,40]});
      var m = L.marker([w.lat, w.lng], {icon:icon}).addTo(map);
      m.on('click', (function(kind, lat, lng){
        return function(ev){
          L.DomEvent.stopPropagation(ev);
          rn('markerTap', {kind:kind, lat:lat, lng:lng});
        };
      })(w.kind, w.lat, w.lng));
      markers[w.kind + '_' + i] = m;
    });
  }

  function fit(ws){
    if (!ws || ws.length < 2) return;
    var pts = ws.map(function(w){ return [w.lat, w.lng]; });
    map.fitBounds(pts, {padding:[80,80], maxZoom:14});
  }

  loadLeaflet();
</script>
</body>
</html>
`;

export const PickerMap = forwardRef<PickerMapHandle, Props>(
  ({ center, onMapTap, onMarkerTap, onReady }, ref) => {
    const wv = useRef<WebView>(null);
    const [loading, setLoading] = useState(true);

    useImperativeHandle(ref, () => ({
      setMarkers: (markers) => wv.current?.postMessage(JSON.stringify({ type: "setMarkers", markers })),
      fit: (markers) => wv.current?.postMessage(JSON.stringify({ type: "fit", markers })),
    }));

    return (
      <View style={{ flex: 1, backgroundColor: "#1a2028" }}>
        <WebView
          ref={wv}
          originWhitelist={["*"]}
          source={{ html: HTML(center), baseUrl: "https://tile.openstreetmap.org" }}
          onLoadEnd={() => setLoading(false)}
          onMessage={(e: WebViewMessageEvent) => {
            try {
              const data = e.nativeEvent.data;
              const parsed = typeof data === "string" && data.startsWith("{") ? JSON.parse(data) : data;
              if (parsed?.type === "ready") onReady?.();
              if (parsed?.type === "mapTap") onMapTap(parsed.lat, parsed.lng);
              if (parsed?.type === "markerTap") onMarkerTap?.(parsed.kind, parsed.lat, parsed.lng);
              if (parsed?.type === "error") console.warn("[PickerMap]", parsed.message);
            } catch {}
          }}
          javaScriptEnabled
          domStorageEnabled
          geolocationEnabled
          allowFileAccess
          allowFileAccessFromFileURLs
          allowUniversalAccessFromFileURLs
          javaScriptCanOpenWindowsAutomatically
          setSupportMultipleWindows={false}
          mixedContentMode="always"
          cacheEnabled
          androidLayerType={Platform.OS === "android" ? "hardware" : undefined}
          style={{ flex: 1, backgroundColor: "#1a2028" }}
        />
        {loading && (
          <View
            pointerEvents="none"
            style={{
              position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
              alignItems: "center", justifyContent: "center", backgroundColor: "#1a2028",
            }}
          >
            <ActivityIndicator color="#FF7B6B" size="large" />
          </View>
        )}
      </View>
    );
  }
);