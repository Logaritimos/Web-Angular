import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Estados {
  public estado: string = 'ativo';

  Alterar() {
     if (this.estado === 'ativo') {
      this.estado = 'inativo'
    } else if (this.estado === 'inativo') {
      this.estado = 'ativo'
    }
  }
}
