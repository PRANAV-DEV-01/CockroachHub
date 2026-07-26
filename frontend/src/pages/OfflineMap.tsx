import { MapPin, Download } from "lucide-react";
import { SEO } from "../components/SEO";
import { useLocale } from "../hooks/useLocale";

const CITIES = [
  { name: "Delhi", x: 438, y: 218, region: "NCR" },
  { name: "Mumbai", x: 305, y: 420, region: "West" },
  { name: "Kolkata", x: 580, y: 340, region: "East" },
  { name: "Chennai", x: 430, y: 490, region: "South" },
  { name: "Bangalore", x: 390, y: 475, region: "South" },
  { name: "Hyderabad", x: 400, y: 430, region: "South" },
  { name: "Ahmedabad", x: 290, y: 335, region: "West" },
  { name: "Pune", x: 325, y: 400, region: "West" },
  { name: "Jaipur", x: 365, y: 265, region: "North" },
  { name: "Lucknow", x: 470, y: 265, region: "North" },
  { name: "Patna", x: 530, y: 270, region: "East" },
  { name: "Bhopal", x: 400, y: 335, region: "Central" },
  { name: "Chandigarh", x: 395, y: 185, region: "North" },
  { name: "Amritsar", x: 370, y: 165, region: "North" },
  { name: "Kochi", x: 385, y: 520, region: "South" },
  { name: "Guwahati", x: 635, y: 260, region: "NE" },
  { name: "Bhubaneswar", x: 560, y: 370, region: "East" },
  { name: "Indore", x: 360, y: 345, region: "Central" },
];

export default function OfflineMap() {
  const { t } = useLocale();

  return (
    <div className="min-h-screen bg-ph-light dark:bg-ph-black">
      <SEO title={`${t("offlineMap.title")} — CockroachHub`} desc={t("offlineMap.seoDesc")} />
      <div className="mx-auto max-w-5xl px-4 py-6 pb-24 md:pb-6">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-ph-text-dark dark:text-white flex items-center gap-2">
            <MapPin className="h-6 w-6 text-ph-orange" />{t("offlineMap.title")}
          </h1>
          <p className="text-sm text-ph-text-muted mt-1">{t("offlineMap.subtitle")}</p>
        </div>

        <div className="bg-white dark:bg-ph-dark-2 border border-ph-border-light dark:border-ph-border p-4 mb-6 overflow-x-auto">
          <svg viewBox="0 0 800 600" className="w-full min-w-[500px]" xmlns="http://www.w3.org/2000/svg">
            <rect width="800" height="600" fill="none" />
            <path d="M350,80 L420,75 L480,100 L530,90 L580,110 L620,100 L670,120 L700,160 L720,200 L730,250 L720,300 L710,340 L690,370 L650,390 L620,410 L590,420 L560,430 L530,450 L500,460 L470,480 L440,490 L410,500 L380,510 L350,500 L320,480 L300,460 L280,430 L260,400 L250,370 L240,340 L230,310 L220,280 L230,250 L240,220 L260,190 L280,160 L300,130 L320,100 Z"
              fill="none" stroke="currentColor" strokeWidth="2" className="text-ph-orange/30" />
            <text x="400" y="580" textAnchor="middle" className="fill-current text-ph-text-muted text-[10px]">
              Simplified outline — for reference only
            </text>
            {CITIES.map((city) => (
              <g key={city.name}>
                <circle cx={city.x} cy={city.y} r="4" className="fill-ph-orange" />
                <circle cx={city.x} cy={city.y} r="7" className="fill-ph-orange/20" />
                <text x={city.x + 10} y={city.y + 4} className="fill-current text-ph-text-dark dark:fill-white text-[11px] font-bold">
                  {city.name}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
          {CITIES.map((city) => (
            <div key={city.name} className="bg-white dark:bg-ph-dark-2 border border-ph-border-light dark:border-ph-border p-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-ph-orange rounded-full shrink-0" />
              <div>
                <p className="text-xs font-bold text-ph-text-dark dark:text-white">{city.name}</p>
                <p className="text-[10px] text-ph-text-muted">{city.region}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-ph-orange/10 border border-ph-orange/20">
          <p className="text-sm text-ph-text-secondary">
            <strong className="text-ph-text-dark dark:text-white">{t("offlineMap.tipTitle")}</strong>{" "}
            {t("offlineMap.tip")}
          </p>
        </div>
      </div>
    </div>
  );
}
