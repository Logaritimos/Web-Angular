import { Component, OnDestroy, OnInit } from '@angular/core';
import { Estados } from '../../estados';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';


@Component({
  selector: 'app-relatorio',
  standalone: true,
imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './relatorio.html',
  styleUrl: './relatorio.css'
})
export class Relatorio implements OnInit, OnDestroy {
  constructor(public estados: Estados, public http: HttpClient) {}

  mesSelecionado: string = '';  

  tipoPeriodo: string = '';

 
anoSelecionado: string = '';
nomeArquivo: string = '';

mostrarModalRelatorio: boolean = false;
carregandoRelatorio: boolean = false;
voos: any[] = [];


meses = [
  { valor: `Janeiro`, nome: 'Janeiro' },
  { valor: 'Fevereiro', nome: 'Fevereiro' },
  { valor: 'Março', nome: 'Março' },
  { valor: 'Abril', nome: 'Abril' },
  { valor: 'Maio', nome: 'Maio' },
  { valor: 'Junho', nome: 'Junho' },
  { valor: 'Julho', nome: 'Julho' },
  { valor: 'Agosto', nome: 'Agosto' },
  { valor: 'Setembro', nome: 'Setembro' },
  { valor: 'Outubro', nome: 'Outubro' },
  { valor: 'Novembro', nome: 'Novembro' },
  { valor: 'Dezembro', nome: 'Dezembro' },
];

  mostrarModalCriacao: boolean = false;

  abrirModalCriacao() {
  this.mostrarModalCriacao = true;
}

fecharModalCriacao() {
  this.mostrarModalCriacao = false;
}

  AlterarEstados() {
    this.estados.Alterar();  
  }

  selecionados: number[] = []; 

  relatorios: any[] = []

    dataInicio: string = "";
dataFim: string = "";
destino: string = "";

 openedMenuIndex: number | null = null;

pesquisa: string = '';
relatoriosFiltrados: any[] = [];

buscarRelatorios() {
  const params = new HttpParams()
    .set('dataInicio', this.dataInicio || '')
    .set('dataFim', this.dataFim || '')
    .set('destino', this.destino || '');

  this.http
    .get<any>('http://localhost:3333/relatorios/ListarRelatorios', { params })
    .subscribe((res) => {
      this.relatorios = res.mensagem;
      this.aplicarFiltro(); 
    });
}


aplicarFiltro() {
  const termo = (this.pesquisa || '').toLowerCase();

  this.relatoriosFiltrados = this.relatorios.filter((relatorio) => {
    const nome = (relatorio.nome || '').toLowerCase();
    const data = relatorio.dtHoraCriacao
      ? new Date(relatorio.dtHoraCriacao).toLocaleString().toLowerCase()
      : '';
    return nome.includes(termo) || data.includes(termo);
  });
}

  ngOnInit(): void {
  console.log('INICIANDO RELATORIOS');

  document.addEventListener('click', this.handleClickOutside);

  this.buscarRelatorios(); 
}

   ngOnDestroy(): void {
    document.removeEventListener('click', this.handleClickOutside);
  }


toggleMenu(index: number, event: MouseEvent) {
  event.stopPropagation();
  this.openedMenuIndex = this.openedMenuIndex === index ? null : index;
}

baixar(relatorio: any) {
}

favoritar(relatorio: any) {
  const id = relatorio.idRelatorio; 

  novoFavorito: String

  if (relatorio.favorito === 1) {
   const novoFavorito =  0; 
  } else {
    const novoFavorito = 1;
  }

  const novoFavorito = relatorio.favorito === 1 ? 0 : 1;

  this.http
    .patch(`http://localhost:3333/relatorios/FavoritarRelatorios/${id}`, {
      favorito: novoFavorito,
    })
    .subscribe({
      next: (res) => {
        relatorio.favorito = novoFavorito;
        this.buscarRelatorios()
      },
      error: (err) => {
        console.error('Erro ao favoritar relatório', err);
      },
    });
}



favoritarSelecionados() {
  if (this.selecionados.length === 0) {
    return; 
  }

  const relatoriosSelecionados = this.relatoriosFiltrados.filter(r =>
    this.selecionados.includes(r.idRelatorio)
  );

  const existeNaoFavorito = relatoriosSelecionados.some(r => r.favorito === 0);

  const novoFavorito = existeNaoFavorito ? 1 : 0;

  relatoriosSelecionados.forEach(relatorio => {
    const id = relatorio.idRelatorio;

    this.http
      .patch(`http://localhost:3333/relatorios/FavoritarRelatorios/${id}`, {
        favorito: novoFavorito,
      })
      .subscribe({
        next: () => {
          relatorio.favorito = novoFavorito;

          const idx = this.relatorios.findIndex(r => r.idRelatorio === id);
          if (idx !== -1) {
            this.relatorios[idx].favorito = novoFavorito;
          }
        },
        error: (err) => {
          console.error('Erro ao favoritar relatório em lote', err);
        },
      });
  });
}

excluir(relatorio: any) {
  const id = relatorio.idRelatorio;
  console.log(id)

  this.http
    .delete(`http://localhost:3333/relatorios/DeletarRelatorios/${id}`)
    .subscribe({
      next: (res) => {
       this.relatoriosFiltrados = this.relatoriosFiltrados.filter(r => r.id !== id);
       this.buscarRelatorios()
       
      },
      error: (err) => {
        console.error('Erro ao excluir relatório', err);
      },
    });
}

excluirSelecionados() {
  if (this.selecionados.length === 0) {
    return;
  }

  const idsParaExcluir = [...this.selecionados];

  idsParaExcluir.forEach(id => {
    this.http
      .delete(`http://localhost:3333/relatorios/DeletarRelatorios/${id}`)
      .subscribe({
        next: () => {
          
          this.relatorios = this.relatorios.filter(
            r => r.idRelatorio !== id
          );
          this.relatoriosFiltrados = this.relatoriosFiltrados.filter(
            r => r.idRelatorio !== id
          );

          this.selecionados = this.selecionados.filter(selId => selId !== id);
        },
        error: (err) => {
          console.error('Erro ao excluir relatório', err);
        },
      });
  });
}

CriarRelatorios() {
  const payload = {
    ano: this.anoSelecionado,       
    mes: this.mesSelecionado,         
    nome: this.nomeArquivo?.trim() || '' 
  };

  console.log('Payload para criacao', payload);

  this.http
    .post('http://localhost:3333/relatorios/CriarRelatorio', payload)
    .subscribe({
      next: (res) => {
        console.log('criacao solicitado com sucesso', res);
        this.fecharModalCriacao();
        this.buscarRelatorios();
      },
      error: (err) => {
        console.error('Erro ao criacao de relatórios', err);
      },
    });
}

  handleClickOutside = (event: MouseEvent) => {
    this.openedMenuIndex = null;
  };

toggleSelecionado(relatorio: any, event: Event) {
  const input = event.target as HTMLInputElement;
  const id = relatorio.idRelatorio;

  if (input.checked) {
    if (!this.selecionados.includes(id)) {
      this.selecionados.push(id);
    }
  } else {
    this.selecionados = this.selecionados.filter(selId => selId !== id);
  }

  console.log('Selecionados agora:', this.selecionados);
}

abrirModalRelatorio(relatorio: any) {
  this.mostrarModalRelatorio = true;
  this.carregandoRelatorio = true;
  this.voos = [];

  const id = relatorio.idRelatorio;

  this.http
    .get<any>(`http://localhost:3333/relatorios/BuscarDadosVoo/${id}`)
    .subscribe({
      next: (res) => {
    
        this.voos = res.mensagem || res;
        this.carregandoRelatorio = false;
      },
      error: (err) => {
        console.error('Erro ao buscar dados de voo', err);
        this.carregandoRelatorio = false;
      },
    });
}

fecharModalRelatorio() {
  this.mostrarModalRelatorio = false;
}
  
}
