export function fetchCountries(name) {
  const url = 'https://restcountries.com/v3.1/name/';
  const input = 'fields=name,capital,population,flags,languages';

  return fetch(`${url}${name}?${input}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
