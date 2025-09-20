import { Routes } from '@angular/router';
import { Header } from './component/header/header';
import { Alerta } from './component/alerta/alerta';
import { Relatorio } from './component/relatorio/relatorio';

export const routes: Routes = [
    {
        path:  '',
        component: Alerta
    }, {
        path: 'relatorios',
        component: Relatorio
    }
];
