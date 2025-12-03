import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Estados } from '../../estados';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alerta',
  imports: [FormsModule, CommonModule, HttpClientModule],
  standalone: true,
  templateUrl: './alerta.html',
  styleUrl: './alerta.css'
})
export class Alerta implements OnInit {
  constructor(public estados: Estados, public http: HttpClient) {}

  alertas: any[] = [];

  dataInicio: string = "";
  dataFim: string = "";
  destino: string = "";
  destinos: string[] = []; 

  AlterarEstados() {
    this.estados.Alterar();
  }

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
      console. log('🔍 FILTROS ENVIADOS:', { destino, dataInicio, dataFim });
    this.http.get<any>('http://localhost:3333/alertas/ListarAlertas', {
      params: {
        destino: destino || '',
        dataInicio: dataInicio || '',
        dataFim: dataFim || '',
      }
    })
    .subscribe(res => {
      this.alertas = res.mensagem;
      console.log(this.alertas);

    
      this.preencherDestinosAPartirDasDescricoes(this.alertas);
    });
  }

  
  private preencherDestinosAPartirDasDescricoes(alertas: any[]) {
    const estadosSet = new Set<string>();

    alertas.forEach(alerta => {
      const descricao: string = alerta.descricao || '';

    
      const match = descricao.match(/estado\s+d[eo]\s+([A-Z]{2})/i);

      if (match && match[1]) {
        const sigla = match[1].toUpperCase();
        estadosSet.add(sigla);
      }
    });

    this.destinos = Array.from(estadosSet).sort();
    console.log('Destinos extraídos:', this.destinos);
  }
}
