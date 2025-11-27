import { Component } from '@angular/core';
import { Estados } from '../../estados';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';


@Component({
  selector: 'app-relatorio',
imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './relatorio.html',
  styleUrl: './relatorio.css'
})
export class Relatorio {
 constructor(public estados: Estados, public http: HttpClient) {}

  AlterarEstados() {
    this.estados.Alterar();  
  }

  relatorios: any[] = []

    dataInicio: string = "";
dataFim: string = "";
destino: string = "";


  ngOnInit(): void {
    console.log('INICIANDO RELATORIOS');

     const params = new HttpParams()
    .set('dataInicio', this.dataInicio)
    .set('dataFim', this.dataFim)
    .set('destino', this.destino);

     this.http.get<any>(`http://localhost:3333/relatorios/ListarRelatorios`, {params} )

    .subscribe(res => {
           console.log(params)
      this.relatorios = res.mensagem;
      console.log(this.relatorios)
    });
  }
}
