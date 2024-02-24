export async function getAddressFromCoords(coords) {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${
      coords.lng
    }&key=${import.meta.env.VITE_GOOGLE_MAP_API_KEY}`,
  );

  if (!response.ok) {
    throw new Error('주소 불러오기에 실패했습니다. 다시 시도해주세요.');
  }

  const data = await response.json();
  if (data.error_message) {
    throw new Error(data.error_message);
  }

  const address = data.results[0].formatted_address;
  return address;
}

export async function getCoordsFromAddress(address) {
  const urlAddress = encodeURI(address);

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${urlAddress}&key=${
      import.meta.env.VITE_GOOGLE_MAP_API_KEY
    }`,
  );

  if (!response.ok) {
    throw new Error('좌표 불러오기에 실패했습니다. 다시 시도해주세요.');
  }

  const data = await response.json();
  if (data.error_message) {
    throw new Error(data.error_message);
  }

  const coordinates = data.results[0].geometry.location;
  return coordinates;
}
