export class Map {
  constructor(coords) {
    this.render(coords);
  }

  render(coordinates) {
    // 구글 API 사용 가능한 지 확인
    if (!google) {
      alert('구글 API를 사용할 수 없습니다!');
      return;
    }

    const map = new google.maps.Map(document.getElementById('map'), {
      center: coordinates,
      zoom: 16,
    });

    new google.maps.Marker({
      position: coordinates,
      map: map,
    });
  }
}
