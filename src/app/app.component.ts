import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BinaryPipe } from "./binary.pipe";
import { HexPipe } from "./hex.pipe";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BinaryPipe, HexPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {
  title = 'PgmrCalc';
  calcMode: ('Binary' | 'Hex') | 'Decimal' = 'Decimal';
  calcValue: bigint = 0n;
  calcStack: bigint[] = [];

  setModeToBinary() {
    this.calcMode = 'Binary';
  }
  setModeToHex() {
    this.calcMode = 'Hex';
  }
  setModeToDecimal() {
    this.calcMode = 'Decimal';
  }
  
  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    console.log(`Key released globally: ${event.key}`);
    const keystroke = event.key;
    const key = event.key.substring(0, 1);

    switch(keystroke) {
      case 'Enter':
        this.calcStack.push(this.calcValue);
        this.calcValue = 0n;
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
        let q = this.calcStack.pop() ?? 0n;
        this.calcValue = q / this.calcValue;
        break;

    }
    switch (this.calcMode) {
      case 'Decimal':
        if (keystroke === 'Backspace') {
          this.calcValue /= 10n;
        } else {
          if (key >= '0' && key <= '9') {
            this.calcValue = this.calcValue * 10n + BigInt(key);
          } 
        }
        break;
      case 'Hex':
        if (keystroke === 'Backspace') {
          this.calcValue /= 16n;
        } else {
          if ((key >= '0' && key <= '9') || (key >= 'a' && key <= 'f') || (key >= 'A' && key <= 'F')) {
            this.calcValue = this.calcValue * 16n + BigInt(parseInt(key, 16));
          }
        } 
        break;
      case 'Binary':
        if (keystroke === 'Backspace') {
          this.calcValue /= 2n;
        } else {
          if (key === '0' || key === '1') {
            this.calcValue = this.calcValue * 2n + BigInt(key);
          } 
        }
        break;
    }
  }
}
