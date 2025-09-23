import { Component } from '@angular/core';
import { Header } from '../header/header';
import { Conteudo } from '../conteudo/conteudo';
import { Relatorio } from '../relatorio/relatorio';
import { Alerta } from '../alerta/alerta';
import { Estados } from '../../estados';
import { CommonModule } from '@angular/common';




@Component({
  selector: 'app-principal',
  imports: [Header, Conteudo, Relatorio, Alerta, CommonModule],
  templateUrl: './principal.html',
  styleUrl: './principal.css'
  
})



export class Principal {
  constructor(public estados: Estados) {

  }

  AlterarEstados() {
    this.estados.Alterar()
  }
}
