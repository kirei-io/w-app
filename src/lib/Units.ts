export class Units {
  public static hPa_to_mmHg(hPa: number) {
    return hPa/1.333;
  }

  static deg_to_direction(deg: number) {
    const north 		= 0;
    const northEast = 45;
    const east 			= 90;
    const southEast = 135;
    const south 		= 180;
    const southWest = 225;
    const west 			= 270;
    const northWest = 315;
    const north2 		= 360;

    if(deg>=north2-20 && deg<=north2 || deg>=north && deg<=north+20) {
      return 'n';
    } else if(deg>northEast-25 && deg<northEast+25) {
      return 'ne';
    } else if(deg>=east-20 && deg<=east+20) {
      return 'e';
    } else if(deg>southEast-25 && deg<southEast+25) {
      return 'se';
    } else if(deg>=south-20 && deg<=south+20) {
      return 's';
    } else if(deg>southWest-25 && deg<southWest+25) {
      return 'sw';
    } else if(deg>=west-20 && deg<=west+20) {
      return 'w';
    } else if(deg>northWest-25 && deg<northWest+25) {
      return 'nw';
    } else {
      'NONE'
    }
  }
}