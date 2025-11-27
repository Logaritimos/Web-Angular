import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Estados } from '../../estados';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-alerta',
  imports: [FormsModule, CommonModule, HttpClientModule],
    standalone: true,
  templateUrl: './alerta.html',
  styleUrl: './alerta.css'
})
export class Alerta implements OnInit {
  constructor(public estados: Estados, public http: HttpClient) {}

  alertas: any[] = []

  AlterarEstados() {
    this.estados.Alterar()
  }

  dataInicio: string = "";
dataFim: string = "";
destino: string = "";

   ngOnInit(): void {
    console.log('INICIANDO ALERTAS');

 
    this.GerarAlertas().subscribe({
      next: () => {
        this.ListarAlertas(this.destino, this.dataInicio, this.dataFim);
      },
      error: (err) => console.error("Erro ao gerar alertas", err)
    });
  }
  

  GerarAlertas() {
    return this.http.get<any[]>('http://localhost:3333/alertas/GerarAlertas');
  }

    ListarAlertas(destino?: string, dataInicio?: string, dataFim?: string) {
    this.http.get<any>('http://localhost:3333/alertas/ListarAlertas', {
      params: {
        destino: destino || '',
        dataInicio: dataInicio || '',
        dataFim: dataFim || '',
      }
    })
    .subscribe(res => {
      this.alertas = res.mensagem;
      console.log(this.alertas)
    })
    
  }
}
