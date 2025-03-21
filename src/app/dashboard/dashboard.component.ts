import { Component, ElementRef, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import type { ColDef } from 'ag-grid-community'; // Column Definition Type Interface
import { AllCommunityModule, ModuleRegistry,themeQuartz } from 'ag-grid-community';
import { StatusCellRenderer } from './status-cell-renderer.component';
import { Router } from '@angular/router';
import { ActionsButtonsRenderer } from './actions-buttons-renderer/actions-buttons-renderer.component';
import { ApiService } from '@services/api.service';
import { AuthService } from '@services/auth.service';
import { IRow } from '@data/interfaces';
ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AgGridAngular,StatusCellRenderer,],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent {
  @ViewChild('search') input!: ElementRef;
  rowData: IRow[] = [];
  constructor(private router:Router, private auth:AuthService, private api:ApiService){}

  ngOnInit(): void 
  {
    //const user = this.auth.getUserData();
    this.api.getGames().subscribe((res)=>{
      this.rowData = res;
    });
  }

  colDefs: ColDef<IRow>[] = [
    { field: "name" },
    { field: "author",
      headerName: 'Author',
      valueFormatter: (params: any) => params.value ?? 'UNKNOWN' },
    { field: "release_date",
      headerName: 'Release Date',
      valueFormatter: (params: any) => {
        const date = new Date(params.value);
        return date.toISOString().split('T')[0];
      }
    },
    { field: "price" },
    { field: "views" },
    {
      field: 'status',
      cellRenderer: StatusCellRenderer,
      filter: true,
    },
    { headerName: 'Actions',
      cellRenderer: ActionsButtonsRenderer,
      width: 150
    }
  ];

  defaultColDef: ColDef = { flex: 1, };

  myTheme = themeQuartz
	.withParams({
        accentColor: "#FFCF0D",
        backgroundColor: "#21222C",
        borderColor: "#FFCF0D",
        borderRadius: 0,
        browserColorScheme: "dark",
        cellHorizontalPaddingScale: 0.8,
        cellTextColor: "#FFCF0D",
        columnBorder: true,
        fontFamily: {
          googleFont: "Open Sans"
        },
        fontSize: 12,
        foregroundColor: "#FFCF0D",
        headerBackgroundColor: "#21222C",
        headerFontSize: 14,
        headerFontWeight: 700,
        headerTextColor: "#FFCF0D",
        headerVerticalPaddingScale: 1.5,
        oddRowBackgroundColor: "#21222C",
        rangeSelectionBackgroundColor: "#FFFF0020",
        rangeSelectionBorderColor: "yellow",
        rangeSelectionBorderStyle: "dashed",
        rowBorder: true,
        rowVerticalPaddingScale: 1.5,
        sidePanelBorder: true,
        spacing: 4,
        wrapperBorder: true,
        wrapperBorderRadius: 0
    });

    goTo(ruta:string){
      this.router.navigate([ruta])
    }

    refresh(){
      this.api.getGames().subscribe((res)=>{
      this.rowData = res;
    });}

    searchGame(){
      this.api.searchGame(this.input.nativeElement.value).subscribe((res)=>{
        this.rowData = res;
      })
    }
}


/*
INFO
npm install ag-grid-angular
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import type { ColDef } from 'ag-grid-community'; // Column Definition Type Interface
*/