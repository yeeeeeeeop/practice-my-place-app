import { Modal } from './UI/Modal';
import { Map } from './UI/Map';
import { getCoordsFromAddress, getAddressFromCoords } from './Utility/Location';

class PlaceFinder {
  constructor() {
    const addressForm = document.querySelector('form');
    const locateUserBtn = document.getElementById('locate-btn');
    this.shareBtn = document.getElementById('share-btn');

    locateUserBtn.addEventListener('click', this.locateUserHandler.bind(this));
    this.shareBtn.addEventListener('click', this.sharePlaceHandler);
    addressForm.addEventListener('submit', this.findAddressHandler.bind(this));
  }

  sharePlaceHandler() {
    const sharedLinkInputElement = document.getElementById('share-link');
    if (!navigator.clipboard) {
      sharedLinkInputElement.select();
      return;
    }

    navigator.clipboard
      .writeText(sharedLinkInputElement.value)
      .then(() => {
        alert('복사에 성공했습니다!');
      })
      .catch((err) => {
        console.log(err);
        sharedLinkInputElement.select();
      });
  }

  selectPlace(coordinates, address) {
    if (this.map) {
      this.map.render(coordinates);
    } else {
      this.map = new Map(coordinates);
    }

    fetch('http://localhost:3000/add-location', {
      method: 'POST',
      body: JSON.stringify({
        address,
        lat: coordinates.lat,
        lng: coordinates.lng,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const locationId = data.locId;
        this.shareBtn.disabled = false;
        const sharedLinkInputElement = document.getElementById('share-link');
        sharedLinkInputElement.value = `${location.origin}/my-place.html?location=${locationId}`;
      });
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
      async (successResult) => {
        const coordinates = {
          lat: successResult.coords.latitude,
          lng: successResult.coords.longitude,
        };

        const address = await getAddressFromCoords(coordinates);
        modal.hide();
        this.selectPlace(coordinates, address);
      },
      (error) => {
        modal.hide();
        alert('위치를 파악할 수 없습니다. 주소를 직접 입력해주세요.');
      },
    );
  }

  async findAddressHandler(event) {
    event.preventDefault();
    const address = event.target.querySelector('input').value;

    if (!address || address.trim().length === 0) {
      alert('유효하지 않은 주소입니다.');
      return;
    }

    const modal = new Modal('loading-modal-content', '로딩중입니다.');
    modal.show();

    try {
      const coordinates = await getCoordsFromAddress(address);
      this.selectPlace(coordinates, address);
    } catch (error) {
      alert(error.message);
    }

    modal.hide();
  }
}

const placeFinder = new PlaceFinder();
