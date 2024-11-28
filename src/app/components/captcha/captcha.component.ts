import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-captcha',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './captcha.component.html',
  styleUrl: './captcha.component.scss',
})
export class CaptchaComponent implements OnInit {
  @Output() resultadoCaptcha: EventEmitter<any> = new EventEmitter<any>();
  characters: any = [];
  captcha: string = '';
  captchaParaVerificar: string = '';
  checkBtn = document.querySelector('.check-btn');
  statusTxt = document.querySelector('.status-text');
  captchaResult: boolean = false;

  constructor() {
    this.characters = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
      'l',
      'm',
      'n',
      'o',
      'p',
      'q',
      'r',
      's',
      't',
      'u',
      'v',
      'w',
      'x',
      'y',
      'z',
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
    ];
    this.getCaptcha();
  }

  ngOnInit() {}

  getCaptcha() {
    this.captcha = '';
    for (let i = 0; i < 6; i++) {
      //getting 6 random characters from the array
      let randomCharacter =
        this.characters[Math.floor(Math.random() * this.characters.length)];
      this.captcha += randomCharacter; //passing 6 random characters inside captcha innerText
    }
  }

  verificarCaptcha() {
    if (this.captcha == this.captchaParaVerificar) {
      this.captchaResult = true;
    } else {
      this.captchaParaVerificar = '';
      this.getCaptcha();
    }
    this.resultadoCaptcha.emit(this.captchaResult);
  }
}
