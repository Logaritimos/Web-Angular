import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Principal } from './component/principal/principal';
import { Alerta } from "./component/alerta/alerta";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Principal, Alerta],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('telaMensagem');

  public estado = 'Alertas'
}
