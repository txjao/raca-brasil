import { useState } from "react";
import "./App.css";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'

import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import { distanceInMeters } from './utils/handleRadiusIntersection'

const defaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Map />
    </QueryClientProvider>
  );
}

function Map() {
  const [inputCep, setInputCep] = useState("");
  const [inputNumero, setInputNumero] = useState("");
  const [enableQuery, setEnableQuery] = useState(false);

  const [itemLista, setItemLista] = useState("")
  const [lista, setLista] = useState<string[]>([])

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["cep-geocode", inputCep, inputNumero],
    enabled: enableQuery,
    queryFn: async () => {
      const res = await fetch(`https://viacep.com.br/ws/${inputCep}/json/`);
      const cepData = await res.json();

      if (cepData.erro) throw new Error("CEP não encontrado");

      const endereco = `${cepData.logradouro}, ${inputNumero}, ${cepData.bairro}, ${cepData.localidade}, ${cepData.uf}`;

      const geoResp = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          endereco
        )}&addressdetails=1`
      );

      const geoData = await geoResp.json();
      if (geoData.length === 0) throw new Error("Endereço não encontrado");

      return {
        lat: Number(geoData[0].lat),
        lng: Number(geoData[0].lon),
      };
    },
  });

  const geoLocs = data
    ? [
      { lat: data.lat, long: data.lng },
      { lat: -19.878144, long: -43.901221 },
      { lat: -19.892017, long: -43.920884 },
      { lat: -19.874566, long: -43.912778 },
      { lat: -19.880941, long: -43.929103 },
      { lat: -19.901214, long: -43.910334 },
      { lat: -19.900882, long: -43.894021 },
      { lat: -19.867932, long: -43.898441 },
      { lat: -19.871554, long: -43.917805 },
      { lat: -19.897334, long: -43.906512 },
    ]
    : [];

  return (
    <>
      <div style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          value={inputCep}
          onChange={(e) => setInputCep(e.target.value)}
          placeholder="Digite o CEP"
        />

        <input
          type="text"
          value={inputNumero}
          onChange={(e) => setInputNumero(e.target.value)}
          placeholder="Número"
        />

        <input
          type="text"
          onChange={(e) => setLista(prev => [...prev, e.target.value])}
          placeholder="Número"
        />


        <button
          onClick={() => {
            setEnableQuery(true);
            refetch();
          }}
        >
          Buscar
        </button>
      </div>

      {isFetching && <p>Buscando endereço...</p>}
      {lista.map((v) => (
        <>{v}<br /></>
      ))
      }
      {
        data && (
          <>
            <p>latitude: {data.lat}</p>
            <p>longitude: {data.lng}</p>

            <MapContainer
              center={[data.lat, data.lng]}
              zoom={14}
              style={{
                height: "500px",
                width: "100%",
                marginTop: "20px",
                border: "solid 1px black",
              }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              <Marker position={[data.lat, data.lng]} icon={defaultIcon}>
                <Popup>Endereço encontrado</Popup>
              </Marker>

              <Circle
                center={[data.lat, data.lng]}
                radius={1000}
                pathOptions={{
                  color: "blue",
                  fillColor: "blue",
                  fillOpacity: 0.2,
                }}
              />

              {geoLocs.map((loc, index) => {
                if (!loc.lat || !loc.long) return null;

                const dist = distanceInMeters(data.lat, data.lng, loc.lat, loc.long);

                const intersects = dist <= 1000 + 1000;

                const circleColor = intersects ? "red" : "green";

                return (
                  <div key={index}>
                    <Marker position={[loc.lat, loc.long]} icon={defaultIcon}>
                      <Popup>
                        Ponto {index + 1}
                        <br />
                        Distância: {dist.toFixed(0)}m
                        <br />
                        {intersects ? "🔴 Intersecta" : "🟢 Não intersecta"}
                      </Popup>
                    </Marker>

                    <Circle
                      center={[loc.lat, loc.long]}
                      radius={1000}
                      pathOptions={{
                        color: circleColor,
                        fillColor: circleColor,
                        fillOpacity: 0.25,
                      }}
                    />
                  </div>
                );
              })}
            </MapContainer>

          </>
        )
      }
    </>
  );
}

export default App;
