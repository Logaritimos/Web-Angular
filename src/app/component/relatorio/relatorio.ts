import { Component } from '@angular/core';
import { Estados } from '../../estados';


@Component({
  selector: 'app-relatorio',
  imports: [],
  templateUrl: './relatorio.html',
  styleUrl: './relatorio.css'
})
export class Relatorio {
  constructor(public estados: Estados) {}

  AlterarEstados() {
    this.estados.Alterar();  
  }
}
