import { Component } from '@angular/core';
import { Estados } from '../../estados';

@Component({
  selector: 'app-alerta',
  imports: [],
  templateUrl: './alerta.html',
  styleUrl: './alerta.css'
})
export class Alerta {
  constructor(public estados: Estados) {

  }

  AlterarEstados() {
    this.estados.Alterar()
  }
}
