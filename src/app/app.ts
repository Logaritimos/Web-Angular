import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./component/header/header";
import { Conteudo } from "./component/conteudo/conteudo";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Conteudo],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('telaMensagem');
}
