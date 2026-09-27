import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { View, ActivityIndicator, Platform } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import { Ride } from "../../constants/types";
import { TILE_PROVIDERS } from "../../lib/tiles";

export interface LiveMapHandle {
  post: (msg: any) => void;
}

interface Props {
  ride: Ride;
  onReady?: () => void;
  onMessage?: (msg: any) => void;
}

const html = (ride: Ride) => {
  const osm = TILE_PROVIDERS.osm;
  const esri = TILE_PROVIDERS.esri;

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
<style>
  html,body,#map{height:100%;margin:0;background:#1a2028;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;}
  #map { position: absolute; top: 0; left: 0; right: 0; bottom: 0; }
  .leaflet-control-attribution{display:none!important;}
  .leaflet-container{background:#1a2028;}
  .leaflet-tile-pane { filter: invert(1) hue-rotate(180deg) brightness(0.85) contrast(0.9) saturate(0.7); }
  .gm-user-marker{position:relative;width:22px;height:22px;}
  .gm-user-marker .dot{width:22px;height:22px;border-radius:50%;background:#4285F4;border:3px solid #fff;box-shadow:0 0 0 2px rgba(66,133,244,0.35),0 4px 12px rgba(0,0,0,0.5);position:relative;z-index:2;}
  .gm-user-marker .pulse{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:60px;height:60px;border-radius:50%;background:rgba(66,133,244,0.25);animation:gp 2s ease-out infinite;z-index:1;}
  @keyframes gp{0%{transform:translate(-50%,-50%) scale(0.5);opacity:1;}100%{transform:translate(-50%,-50%) scale(1);opacity:0;}}
  .gm-dest .pin{width:36px;height:36px;background:#EA4335;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 6px 16px rgba(0,0,0,0.5);}
  .gm-rider{position:relative;}
  .gm-rider .bubble{width:32px;height:32px;border-radius:50%;background:#1D242F;border:3px solid #FF7B6B;display:flex;align-items:center;justify-content:center;font-size:14px;color:#fff;font-weight:900;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.6);}
  .gm-rider.head .bubble{border-color:#FFB454;box-shadow:0 0 20px rgba(255,180,84,0.7);}
  .gm-rider.tail .bubble{border-color:#FF5C7A;box-shadow:0 0 20px rgba(255,92,122,0.7);}
  .gm-rider .tag{position:absolute;top:-22px;left:50%;transform:translateX(-50%);padding:2px 8px;border-radius:8px;background:rgba(11,14,21,0.9);font-size:10px;font-weight:800;white-space:nowrap;border:1px solid rgba(255,255,255,0.14);color:#F0F3F8;}
  .gm-cp .cp{width:24px;height:24px;border-radius:50%;background:#FFB454;border:3px solid #fff;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:900;color:#000;box-shadow:0 4px 12px rgba(0,0,0,0.5);}
</style>
</head>
<body>
<div id="map"></div>
<script>
  function rn(type, payload) { if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify({type:type, ...(payload||{})})); }
  function showErr(m) { rn('error', {message: String(m)}); }
  window.onerror = function(m){ showErr(m); };

  (function () {
    var s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
    s.async = true;
    s.onload = function () { setTimeout(bootMap, 60); };
    s.onerror = function () { showErr('Leaflet CDN failed'); };
    document.body.appendChild(s);
  })();

  function bootMap() {
    if (typeof L === 'undefined') { showErr('L undefined'); return; }
    try {
      var map = L.map('map', {zoomControl:false, attributionControl:false, preferCanvas:true}).setView([${ride.from.lat}, ${ride.from.lng}], 8);

      var osmLayer = L.tileLayer('${osm.url}', {maxZoom: ${osm.maxZoom}, crossOrigin:true}).addTo(map);
      var esriLayer = L.tileLayer('${esri.url}', {maxZoom: ${esri.maxZoom}, crossOrigin:true, opacity:0}).addTo(map);
      var swapped = false;
      osmLayer.on('tileerror', function(){ if(!swapped){ swapped=true; esriLayer.setOpacity(1); osmLayer.setOpacity(0);} });

      var riderMarkers = {};
      var routeLine = null;
      var userPanned = false;
      map.on('dragstart', function () { userPanned = true; });

      L.marker([${ride.to.lat}, ${ride.to.lng}], {
        icon: L.divIcon({ className:'', html:'<div class="gm-dest"><div class="pin"></div></div>', iconSize:[36,40], iconAnchor:[18,40] })
      }).addTo(map);

      var cps = ${JSON.stringify(
        ride.checkpoints.filter((c) => c.lat && c.lng).map((c, i) => ({ lat: c.lat, lng: c.lng, name: c.name, i }))
      )};
      cps.forEach(function (c) {
        L.marker([c.lat, c.lng], {
          icon: L.divIcon({ className:'gm-cp', html:'<div class="cp">'+(c.i+1)+'</div>', iconSize:[24,24], iconAnchor:[12,12] })
        }).addTo(map).bindPopup('<b>'+c.name+'</b>');
      });

      function setRoute(coords) {
        if (routeLine) map.removeLayer(routeLine);
        if (!coords || !coords.length) return;
        routeLine = L.polyline(coords, {color:'#7CE5B0', weight:5, opacity:0.95, lineCap:'round', lineJoin:'round'}).addTo(map);
        map.fitBounds(routeLine.getBounds(), {padding:[80,80], maxZoom:12});
      }

      function updateRiders(positions, headName, tailName) {
        Object.keys(positions).forEach(function (name) {
          var p = positions[name];
          if (!p.lat || !p.lng) return;
          var isHead = name === headName, isTail = name === tailName;
          var short = name.split(' ')[0];
          var cls = 'gm-rider '+(isHead?'head ':'')+(isTail?'tail ':'');
          var badge = isHead ? ' ▲' : isTail ? ' ▼' : '';
          var icon = L.divIcon({
            className:'',
            html: '<div class="'+cls+'"><div class="tag">'+short+badge+'</div><div class="bubble">'+short[0]+'</div></div>',
            iconSize:[32,48], iconAnchor:[16,32]
          });
          if (riderMarkers[name]) riderMarkers[name].setLatLng([p.lat, p.lng]).setIcon(icon);
          else riderMarkers[name] = L.marker([p.lat, p.lng], {icon:icon}).addTo(map);
        });
      }

      function updateUser(lat, lng) {
        var icon = L.divIcon({
          className:'',
          html:'<div class="gm-user-marker"><div class="pulse"></div><div class="dot"></div></div>',
          iconSize:[22,22], iconAnchor:[11,11]
        });
        if (!riderMarkers['__me__']) riderMarkers['__me__'] = L.marker([lat, lng], {icon:icon}).addTo(map);
        else riderMarkers['__me__'].setLatLng([lat, lng]);
        if (!userPanned) map.setView([lat, lng], Math.max(map.getZoom(), 13), {animate:true});
      }

      function recenter(lat, lng) { userPanned = false; map.setView([lat, lng], 15, {animate:true}); }
      function follow(lat, lng) { userPanned = false; map.setView([lat, lng], 16, {animate:true}); }

      function handler(e) {
        try {
          var m = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
          if (m.type === 'route') setRoute(m.coords);
          if (m.type === 'riders') updateRiders(m.positions, m.headName, m.tailName);
          if (m.type === 'me') updateUser(m.lat, m.lng);
          if (m.type === 'recenter') recenter(m.lat, m.lng);
          if (m.type === 'follow') follow(m.lat, m.lng);
        } catch (err) {}
      }
      window.addEventListener('message', handler);
      document.addEventListener('message', handler);
      rn('ready');
    } catch (e) { showErr(e.message || String(e)); }
  }
</script>
</body>
</html>
`;
};

export const LiveMap = forwardRef<LiveMapHandle, Props>(({ ride, onReady, onMessage }, ref) => {
  const wv = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);

  useImperativeHandle(ref, () => ({
    post: (msg: any) => wv.current?.postMessage(JSON.stringify(msg)),
  }));

  return (
    <View style={{ flex: 1, backgroundColor: "#1a2028" }}>
      <WebView
        ref={wv}
        originWhitelist={["*"]}
        source={{ html: html(ride), baseUrl: "https://tile.openstreetmap.org" }}
        onLoadEnd={() => setLoading(false)}
        onMessage={(e: WebViewMessageEvent) => {
          try {
            const data = e.nativeEvent.data;
            const parsed = typeof data === "string" && data.startsWith("{") ? JSON.parse(data) : data;
            if (parsed?.type === "ready") onReady?.();
            if (parsed?.type === "error") console.warn("[LiveMap]", parsed.message);
            onMessage?.(parsed);
          } catch { onMessage?.(e.nativeEvent.data); }
        }}
        javaScriptEnabled domStorageEnabled geolocationEnabled
        allowFileAccess allowFileAccessFromFileURLs allowUniversalAccessFromFileURLs
        javaScriptCanOpenWindowsAutomatically setSupportMultipleWindows={false}
        mixedContentMode="always" allowsInlineMediaPlayback mediaPlaybackRequiresUserAction={false}
        cacheEnabled androidLayerType={Platform.OS === "android" ? "hardware" : undefined}
        style={{ flex: 1, backgroundColor: "#1a2028" }}
      />
      {loading && (
        <View pointerEvents="none" style={{ position:"absolute", top:0, left:0, right:0, bottom:0, alignItems:"center", justifyContent:"center", backgroundColor:"#1a2028" }}>
          <ActivityIndicator color="#FF7B6B" size="large" />
        </View>
      )}
    </View>
  );
});