import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {

  constructor() { }

  trim(str: string, num: number): string {
    return str.length > num ? (str.slice(0, num) + '...') : str;
  }
}
