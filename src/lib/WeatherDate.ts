export class WeatherDate {
  private readonly date: Date;
  
  constructor(time?: number, timezoneOffset?: number) {
    this.date = new Date((time??Date.now())+(timezoneOffset??0));
  }
  public get day() {
    const day = this.date.getUTCDate()
    return day<10 ? '0'+day.toString() : day.toString();
  }
  public get dayOfWeek() {
    return this.date.getUTCDay().toString();
  }
  public get month() {
    const month = this.date.getUTCMonth()+1
    return month<10 ? '0'+month.toString() : month.toString();
  }
  public get year() {
    const y = this.date.getUTCFullYear().toString()
    return [y[0]+y[1], y[2]+y[3]];
  }
  public get stringTime() {
    const d = this.date
      .toUTCString()
      .split(' ')[4]
      .split(':');
    return [d[0], d[1]].join(':');
  }
}