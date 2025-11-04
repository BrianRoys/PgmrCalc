import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BinaryPipe } from "./binary.pipe";
import { HexPipe } from "./hex.pipe";
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BinaryPipe, HexPipe, CommonModule, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})

export class AppComponent {
 
  title = 'PgmrCalc';
  calcMode: ('Binary' | 'Hex') | 'Decimal' = 'Decimal';
  calcValue: bigint = 0n;
  calcStack: bigint[] = [];
  calcStackRev: bigint[] = [];
  binaryClass: string = 'pill';
  hexClass: string = 'pill';
  decimalClass: string = 'pill current-mode';
  showInstructions: boolean = false;
  showStory: boolean = false;

  cmdKey(arg0: string) {
    this.processKyestroke(arg0);
  }
 
  showHideText(ID: string) {
    if (ID === 'H') {
      this.showInstructions = !this.showInstructions;
    } 
    if (ID === 'S') {
      this.showStory = !this.showStory;
    } 
  }
 
  setModeToBinary() {
    this.calcMode = 'Binary';
    this.binaryClass = 'current-mode pill';
    this.hexClass = 'pill';
    this.decimalClass = 'pill';
  }
  setModeToHex() {
    this.calcMode = 'Hex';
    this.hexClass = 'current-mode pill';
    this.binaryClass = 'pill';
    this.decimalClass = 'pill';
  }
  setModeToDecimal() {
    this.calcMode = 'Decimal';
    this.decimalClass = 'current-mode pill';
    this.binaryClass = 'pill';
    this.hexClass = 'pill';
  }
  
  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const keystroke = event.key;
    this.processKyestroke(keystroke);
  }

  processKyestroke(keystroke: string) {
    switch(keystroke) {
      case 'ArrowLeft':
        switch(this.calcMode) {
          case 'Decimal':
            this.setModeToBinary();
            break;
          case 'Hex':
            this.setModeToDecimal();
            break;
          case 'Binary':
            this.setModeToHex();
            break;
        }
        break;
      case 'ArrowRight':
        switch(this.calcMode) {
          case 'Decimal':
            this.setModeToHex();
            break;
          case 'Hex':
            this.setModeToBinary();
            break;
          case 'Binary':
            this.setModeToDecimal();
            break;
        }
        break;
      case 'Backspace':
        switch(this.calcMode) {
          case 'Decimal':
              this.calcValue /= 10n;
            break;
          case 'Hex':
              this.calcValue /= 16n;
            break;
          case 'Binary':
              this.calcValue /= 2n;
            break;
        }
        break;
      case 'Enter':
        this.calcStack.push(this.calcValue);
        this.calcValue = 0n;
        break;
      case 'Escape':
        this.calcValue = this.calcStack.pop() ?? 0n;
        break;
      case '+':
        this.calcValue += this.calcStack.pop() ?? 0n;
        break;
      case '-':
        this.calcValue -= this.calcStack.pop() ?? 0n;
        break;
      case '*':
        this.calcValue *= this.calcStack.pop() ?? 0n;
        break;
      case '/':
        this.calcValue = (this.calcStack.pop() ?? 0n) / this.calcValue;
        break;
      case '%':
        this.calcValue = (this.calcStack.pop() ?? 0n) % this.calcValue;
        break;
      case '&':
        this.calcValue &= this.calcStack.pop() ?? 0n;
        break;
      case '|':
        this.calcValue |= this.calcStack.pop() ?? 0n;
        break;
      case '^':
        this.calcValue ^= this.calcStack.pop() ?? 0n;
        break;
      case '!':
        this.calcValue = ~(this.calcStack.pop() ?? 0n);
        break;
    }
    
    // For displaying the stack in reverse (LIFO) order.
    this.calcStackRev = [...this.calcStack].reverse();

    if(keystroke.length == 1) {
      const key = keystroke;
      switch (this.calcMode) {
        case 'Decimal':
          if (key >= '0' && key <= '9') {
            this.calcValue = this.calcValue * 10n + BigInt(key);
          } 
          break;
        case 'Hex':
          if ((key >= '0' && key <= '9') || (key >= 'a' && key <= 'f') || (key >= 'A' && key <= 'F')) {
            this.calcValue = this.calcValue * 16n + BigInt(parseInt(key, 16));
          } 
          break;
        case 'Binary':
          if (key === '0' || key === '1') {
            this.calcValue = this.calcValue * 2n + BigInt(key);
          } 
          break;
      }
    }
  }
}
