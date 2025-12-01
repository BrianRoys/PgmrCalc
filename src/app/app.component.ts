import { Component, HostListener, signal } from '@angular/core';
import { BinaryPipe } from "./binary.pipe";
import { HexPipe } from "./hex.pipe";
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "./components/header/header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BinaryPipe, HexPipe, CommonModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})

export class AppComponent {
 
  title = signal('Programmer\'s Calculator');
  calcMode = signal('Decimal');
  calcValue = signal(0n);
  calcStack = signal([0n]);
  calcStackRev = signal([0n]);
  showInstructions = signal(false);
  showStory = signal(false);
  dbzError = signal(false);

  cmdKey(arg0: string) {
    this.processKyestroke(arg0);
  }
 
  showHideText(ID: string) {
    if (ID === 'H') { // "H" for "How to"
      this.showInstructions.set(!this.showInstructions());
    } 
    if (ID === 'S') { // "S" for "Story"
      this.showStory.set(!this.showStory());
    } 
  }

  setMode(mode: 'Binary' | 'Hex' | 'Decimal') {
    this.calcMode.set(mode);
  }
  
  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const keystroke = event.key;
    this.processKyestroke(keystroke);
  }

  processKyestroke(keystroke: string) {
    let p = null;
    switch(keystroke) {
      case 'ArrowLeft':
        switch(this.calcMode()) {
          case 'Decimal':
            this.setMode('Binary');
            break;
          case 'Hex':
            this.setMode('Decimal');
            break;
          case 'Binary':
            this.setMode('Hex');
            break;
        }
        break;
      case 'ArrowRight':
        switch(this.calcMode()) {
          case 'Decimal':
            this.setMode('Hex');
            break;
          case 'Hex':
            this.setMode('Binary');
            break;
          case 'Binary':
            this.setMode('Decimal');
            break;
        }
        break;
      case 'Backspace':
        switch(this.calcMode()) {
          case 'Decimal':
              this.calcValue.update(v => v / 10n);
            break;
          case 'Hex':
              this.calcValue.update (v => v / 16n);
            break;
          case 'Binary':
              this.calcValue.update (v => v / 2n);
            break;
        }
        break;
      case 'Enter':
        this.calcStack().push(this.calcValue());
        this.calcValue.set(0n);
        break;
      case 'Escape':
        this.calcValue.set(this.calcStack().pop() ?? 0n);
        break;
      case '+':
        this.calcValue.update(v => v + (this.calcStack().pop() ?? 0n));
        break;
      case '-':
        this.calcValue.update(v => v - (this.calcStack().pop() ?? 0n));
        break;
      case '*':
        this.calcValue.update(v => v * (this.calcStack().pop() ?? 0n));
        break;
      case '/':
        if (this.calcValue() == 0n) {
          this.dbzError.set(true);
          return;
        }
        this.calcValue.update(v => (this.calcStack().pop() ?? 0n) / v);
        break;
      case '%':
        if (this.calcValue() == 0n) {
          this.dbzError.set(true);
          return;
        }
        this.calcValue.update(v => (this.calcStack().pop() ?? 0n) % v);
        break;
      case '&':
        this.calcValue.update(v => v & (this.calcStack().pop() ?? 0n));
        break;
      case '|':
        this.calcValue.update(v => v | (this.calcStack().pop() ?? 0n));
        break;
      case '^':
        this.calcValue.update(v => v ^ (this.calcStack().pop() ?? 0n));
        break;
      case '<':
        this.calcValue.update(v => 2n * this.calcValue());
        break;
      case '>':
        this.calcValue.update(v => this.calcValue() / 2n);
        break;
      case '!':
        this.calcValue.update(v => ~this.calcValue());
        break;
    }
    
    // For displaying the stack in reverse (LIFO) order.
    this.calcStackRev.set([...this.calcStack()].reverse());

    if(keystroke.length == 1) {
      const key = keystroke;
      switch (this.calcMode()) {
        case 'Decimal':
          if (key >= '0' && key <= '9') {
            this.calcValue.update(v => v * 10n + BigInt(key));
          } 
          break;
        case 'Hex':
          if ((key >= '0' && key <= '9') || (key >= 'a' && key <= 'f') || (key >= 'A' && key <= 'F')) {
            this.calcValue.update(v => v * 16n + BigInt(parseInt(key, 16)));
          } 
          break;
        case 'Binary':
          if (key === '0' || key === '1') {
            this.calcValue.update(v => v * 2n + BigInt(key));
          } 
          break;
      }
    }
  }
}
