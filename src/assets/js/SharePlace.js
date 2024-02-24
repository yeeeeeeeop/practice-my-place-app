class PlaceFinder {
  constructor() {
    const addressForm = document.querySelector('form');
    const locateUserBtn = document.getElementById('locate-btn');

    locateUserBtn.addEventListener('click', this.locateUserHandler);
    addressForm.addEventListener('submit', this.findAddressHandler);
  }

  locateUserHandler() {
    // 지원하는 브라우저 확인
    if (!navigator.geolocation) {
      alert('현재 브라우저에서 지원하지 않는 기능을 사용합니다!');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (successResult) => {
        const coordinates = {
          lat: successResult.coords.latitude,
          lng: successResult.coords.longitude,
        };

        console.log(coordinates);
      },
      (error) => {
        alert('위치를 파악할 수 없습니다. 주소를 직접 입력해주세요.');
      },
    );
  }

  findAddressHandler() {}
}

const placeFinder = new PlaceFinder();
