import { Routes } from "@angular/router";
import { GameComponent } from "./game.component";
import { NewComponent } from "./new/new.component";
import { EditComponent } from "./edit/edit.component";

export const GAME_ROUTES: Routes = [
    {path:'',component: GameComponent},
    {path:'id/:id',component: GameComponent},
    {path:'new',component: NewComponent},
    {path:'edit/:id',component: EditComponent},
]