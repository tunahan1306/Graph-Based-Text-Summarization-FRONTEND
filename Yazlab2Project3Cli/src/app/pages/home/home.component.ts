import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as go from 'gojs'

//Services
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

  fileReader: FileReader = new FileReader();

  constructor(private dataService:DataService)
  {
  }

  grapButtonDisplay = false
  grapButtonLoading = false
  tum:any
  baslik:String = ""
  icerik:String = ""
  gelen_benzerlik:Number = 0.00
  gelen_skor:Number = 0.00
  ozet:String = ""
  asil_ozet:String = ""
  cumleler:Array<any> = [] 
  graphDisplay = false
  ozetButtonLoading = false
  ozetBenzerlik = ""

  public ngOnInit(): void {
    //this.initDiagram();
  }

  uploadFile(event: any) {
    const file: File = event.target.files[0];
    this.fileReader.onload = (e) => {
    const fileContent = this.fileReader?.result;
    //console.log('Dosya içeriği:', fileContent);
    this.tum = fileContent;
  }
  this.fileReader?.readAsText(file);

  this.grapButtonDisplay = true
  }

  createGraph(){
    //console.log(this.tum);
    

    this.grapButtonLoading = true
    var tumArray = this.tum?.toString().split('\n')

    var filteredArr = tumArray?.filter(function(element:any) {
      return element !== "" && element !== null && element !== undefined && element !== "\r";
    });

    var bir : any , gerikalan : any
    filteredArr?.map(function(item:any , i:Number){
      if(i === 0){
        bir = item
      }else{
        gerikalan += item
      }
    })

    var icerik = ""

    tumArray.map(function(item:String , i:Number){
      if(i != 0){
        icerik += item
      }
    })

    this.baslik = bir
    this.icerik = icerik
    //console.log(this.tum);
    

    var tumcumleler = icerik.split('.')
    

    this.cumleler = tumcumleler?.filter(function(element:any) {
      return element !== "" && element !== null && element !== undefined && element !== "\r";
    });

    //console.log(this.cumleler);
   /**
    * [
          { key: 1 , name:"deneme", color: "lightblue" },
          { key: 2, name:"Alpha", color: "orange" },
          { key: 3, name:"Alpha", color: "lightgreen" },
          { key: 4, name:"tunahan", color: "pink" }
        ]
    * 
        [
          { from: 1, to: 2 },
          { from: 1, to: 3 },
          { from: 1, to: 4 },
          { from:2, to: 3 },
          { from: 2, to: 4 },
        ]
    */
   /*
   
   const texts:Array<any> = []
   const dialogs:Array<any> = []

   this.cumleler.map(function(item , i){
    texts.push({key:i , name:item , color:'cyan'})
   })

   for (let i = 0; i < this.cumleler.length - 1; i++) {
      for (let j = i + 1; j < this.cumleler.length; j++) {
        dialogs.push({ from: i, to: j , text:0 })
      }    
   }
   
   */
   

  this.dataService.sendArray(this.cumleler , this.baslik , this.gelen_skor , this.gelen_benzerlik).subscribe((res) => {
    console.log(res);
    
    this.initDiagram(res['texts'] , res['dialogs']);
    this.ozet = res['ozet']
    this.graphDisplay = true
    this.grapButtonLoading = false
  })
   

  }

  ozetKiyasla(){
    this.ozetButtonLoading = true
    this.dataService.sendOzet(this.ozet , this.asil_ozet).subscribe((res) =>{
      console.log(res);
      this.ozetBenzerlik = res['deger']
      this.ozetButtonLoading = false
      
    })
  }

  initDiagram(texts:Array<any> , dialogs:Array<any>) {
    const $ = go.GraphObject.make;
  
    const diagram = $(go.Diagram,"myDiagramDiv",
    {
      layout:
        $(go.TreeLayout,
          {
            angle:90,
            layerSpacing:120,
            nodeSpacing:100,
            alignment:go.TreeLayout.AlignmentCenterChildren,

          }),
          

    });
  
    diagram.nodeTemplate =
    $(go.Node, "Auto",
    $(go.Shape, "Rectangle", new go.Binding("fill", "color")),
    $(go.Panel, "Vertical",
      $(go.Panel, "Auto",
        { stretch: go.GraphObject.Horizontal },  // İç panelin yatay genişlemesini sağlar
        $(go.Shape, "Rectangle", { fill: "yellow", stroke: null }),
        $(go.TextBlock, { margin: 2, font: "bold 12px sans-serif" },
          new go.Binding("text", "dugumSayisi"))
      ),
      $(go.Panel, "Auto",
        { stretch: go.GraphObject.Horizontal },  // İç panelin yatay genişlemesini sağlar
        $(go.Shape, "Rectangle", { fill: "pink", stroke: null }),
        $(go.TextBlock, { margin: 2, font: "bold 12px sans-serif" },
          new go.Binding("text", "cumleSkor"))
      ),
      $(go.Panel, "Auto",
        { stretch: go.GraphObject.Horizontal },  // İç panelin yatay genişlemesini sağlar
        $(go.TextBlock, { margin: 2, font: "bold 14px sans-serif" },
          new go.Binding("text", "name"))
      )
    )
  );
   

      diagram.linkTemplate =
        $(go.Link,  // the whole link panel
          $(go.Shape,  // the link shape
            { stroke: "black" }),
          $(go.Shape,  // the arrowhead
            { toArrow: "standard", stroke: null }),
          $(go.Panel, "Auto",
            $(go.Shape,  // the label background, which becomes transparent around the edges
              {
                fill: $(go.Brush, "Radial", { 0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)" }),
                
              } , new go.Binding('fill', 'color')),
            $(go.TextBlock,  // the label text
              {
                textAlign: "center",
                font: "8pt helvetica, arial, sans-serif",
                stroke: "#fff",
                margin: 4
              },
              new go.Binding("text", "text")),
              
          )
        );

  
      diagram.model = new go.GraphLinksModel( texts , dialogs );

    return diagram;
  }


}
