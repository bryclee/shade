export const geolocation = {
  watchers: [],
  lastPosition: {},

  updatePosition(event) {
    const newPosition = Object.assign(this.lastPosition, event);

    this.watchers.forEach(fn => fn(newPosition, this.lastPosition));

    this.lastPosition = newPosition;
  },

  async init() {
    const geolocationSupported = 'geolocation' in window.navigator;
    const permissionsSupported = 'permissions' in window.navigator;
    const deviceOrientationSupported = 'ondeviceorientation' in window;

    const geolocationStatuses = {
      permission: false,
      geolocation: geolocationSupported,
      deviceOrientation: deviceOrientationSupported,
    };

    if (permissionsSupported) {
      geolocationStatuses.permission = (await window.navigator.permissions.query(
        {
          name: 'geolocation',
        },
      )).state;
    }

    // If required props are missing
    if (!geolocationSupported || geolocationStatuses.permission === 'denied') {
      return {
        success: false,
        statuses: geolocationStatuses,
      };
    }

    window.navigator.geolocation.watchPosition(position => {
      const {
        coords: {latitude = 0, longitude = 0},
      } = position;
      const heading =
        position.coords.speed && 'heading' in position.coords
          ? position.coords.heading
          : null;

      this.updatePosition({latitude, longitude, heading});
    });

    const deviceOrientationEvent =
      'ondeviceorientationabsolute' in window
        ? 'deviceorientationabsolute'
        : 'deviceorientation';

    window.addEventListener(deviceOrientationEvent, event => {
      const absolute = event.absolute || false;
      const hasHeading = 'webkitCompassHeading' in event;
      const heading = hasHeading
        ? 360 - event.webkitCompassHeading
        : absolute
          ? event.alpha
          : 0;

      this.updatePosition({
        heading,
        absolute,
        hasHeading,
        alpha: event.alpha,
      });
    });

    return {
      success: true,
      statuses: geolocationStatuses,
    };
  },

  subscribe(fn) {
    this.watchers.push(fn);
  },
};
