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
  styleUrl: './alerta.css',
})
export class Alerta implements OnInit {
  constructor(public estados: Estados, public http: HttpClient) {}

  dadosDoStorage: string | null = null;

  alertas: any[] = [];
  dataInicio: string = '';
  dataFim: string = '';
  destino: string = '';
  destinosBase: string[] = [];
  destinos: string[] = [];

  loadingAlertas = false;

  AlterarEstados() {
    this.estados.Alterar();
  }

  ngOnInit(): void {
    console.log('INICIANDO ALERTAS');

    const params = new URLSearchParams(window.location.search);
    const userIdFromUrl = params.get('userId');
    const fkEmpresaFromUrl = params.get('fkEmpresa');

    if (userIdFromUrl) {
      sessionStorage.setItem('ID_USUARIO', userIdFromUrl);
    }
    if (fkEmpresaFromUrl) {
      sessionStorage.setItem('FK_EMPRESA', fkEmpresaFromUrl);
    }

    this.dadosDoStorage = sessionStorage.getItem('ID_USUARIO');
    console.log('AQUI DEVERIA ESTAR O SESSION ' + this.dadosDoStorage);

    this.loadingAlertas = true;

    this.GerarAlertas().subscribe({
      next: () => {
        this.ListarAlertasInicial();
      },
      error: (err) => {
        console.error('Erro ao gerar alertas', err);
        this.loadingAlertas = false;
      },
    });
  }

  GerarAlertas() {
    const fkEmpresa = sessionStorage.getItem('FK_EMPRESA');
    console.log('FK_EMPRESA ENVIADA PARA O BACK:', fkEmpresa);

    return this.http.get<any[]>('http://localhost:3333/alertas/GerarAlertas', {
      params: {
        fkEmpresa: fkEmpresa || '',
      },
    });
  }

  private ListarAlertasInicial() {
    const fkEmpresa = sessionStorage.getItem('FK_EMPRESA');

    this.http
      .get<any>('http://localhost:3333/alertas/ListarAlertas', {
        params: {
          destino: '',
          dataInicio: '',
          dataFim: '',
          fkEmpresa: fkEmpresa || '',
        },
      })
      .subscribe({
        next: (res) => {
          this.alertas = res.mensagem || [];
          console.log('Alertas iniciais:', this.alertas);

          this.preencherDestinosAPartirDasDescricoes(this.alertas);

          this.loadingAlertas = false;
        },
        error: (err) => {
          console.error('Erro ao listar alertas iniciais', err);
          this.loadingAlertas = false;
        },
      });
  }

  ListarAlertas(destino?: string, dataInicio?: string, dataFim?: string) {
    const fkEmpresa = sessionStorage.getItem('FK_EMPRESA');

    console.log('FILTROS ENVIADOS:', { destino, dataInicio, dataFim, fkEmpresa });

    this.loadingAlertas = true;

    this.http
      .get<any>('http://localhost:3333/alertas/ListarAlertas', {
        params: {
          destino: destino || '',
          dataInicio: dataInicio || '',
          dataFim: dataFim || '',
          fkEmpresa: fkEmpresa || '',
        },
      })
      .subscribe({
        next: (res) => {
          this.alertas = res.mensagem || [];
          console.log('Alertas filtrados:', this.alertas);
          this.loadingAlertas = false;
        },
        error: (err) => {
          console.error('Erro ao listar alertas filtrados', err);
          this.loadingAlertas = false;
        },
      });
  }

  private preencherDestinosAPartirDasDescricoes(alertas: any[]) {
    const estadosSet = new Set<string>();

    alertas.forEach((alerta) => {
      const descricao: string = alerta.descricao || '';
      const match = descricao.match(/estado\s+d[eo]\s+([A-Z]{2})/i);

      if (match && match[1]) {
        const sigla = match[1].toUpperCase();
        estadosSet.add(sigla);
      }
    });

    this.destinosBase = Array.from(estadosSet).sort();
    this.destinos = [...this.destinosBase];

    console.log('Destinos extraídos:', this.destinos);
  }
}
