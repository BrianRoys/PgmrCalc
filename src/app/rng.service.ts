import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RNGService {

  constructor() { }

  getRandomInt(min: number, max: number): number {

    // The production version calls a secure/real RNG API
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
