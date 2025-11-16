import countries from "i18n-iso-countries";
import pt from "i18n-iso-countries/langs/pt.json";

countries.registerLocale(pt);

export function ListarPaises() {
  const nomes = countries.getNames("pt", { select: "official" });

  return Object.entries(nomes).map(([codigo, nome]) => ({
    value: nome,
    label: nome,
  }));
}
