import { Modal } from './UI/Modal';
import { Map } from './UI/Map';

class PlaceFinder {
  constructor() {
    const addressForm = document.querySelector('form');
    const locateUserBtn = document.getElementById('locate-btn');

    locateUserBtn.addEventListener('click', this.locateUserHandler.bind(this));
    addressForm.addEventListener('submit', this.findAddressHandler.bind(this));
  }

  selectPlace(coordinates) {
    if (this.map) {
      this.map.render(coordinates);
    } else {
      this.map = new Map(coordinates);
    }
  }

  locateUserHandler() {
    // 지원하는 브라우저 확인
    if (!navigator.geolocation) {
      alert('현재 브라우저에서 지원하지 않는 기능을 사용합니다!');
      return;
    }

    const modal = new Modal('loading-modal-content', '로딩중입니다.');
    modal.show();

    navigator.geolocation.getCurrentPosition(
      (successResult) => {
        modal.hide();
        const coordinates = {
          lat: successResult.coords.latitude,
          lng: successResult.coords.longitude,
        };

        this.selectPlace(coordinates);
      },
      (error) => {
        modal.hide();
        alert('위치를 파악할 수 없습니다. 주소를 직접 입력해주세요.');
      },
    );
  }

  findAddressHandler() {}
}

const placeFinder = new PlaceFinder();
