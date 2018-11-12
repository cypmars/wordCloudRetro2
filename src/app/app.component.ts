import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AgWordCloudData, AgWordCloudDirective, AgWordCloudModule } from 'angular6-word-cloud-evolution';
import { CompleterService, CompleterData } from 'ng2-completer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  @ViewChild('word_cloud_chart') word_cloud_chart: AgWordCloudDirective;
  @ViewChild('myIdentifier') myIdentifier: ElementRef;

  // Variables angular6-word-cloud-evolution NOT WORKING
  public isPanEnable = false;
  public isZoomEnable = false;
  public isDragEnable = false;
  public isRotationEnable = false;

  // Variables globales
  public title = 'Nuage de mots';
  public newWord = '';
  public activeViewIndex = 0;

  // Theme choice and suggestions
  public theme = '';
  public itemsTheme = [];
  public grpTheme = [];

  // Importance choice and selection
  public importanceArray = [1, 2, 3, 5, 8];
  public impIndex = -1;
  public sizeArray = [5, 10, 15, 25, 40];

  // Color choice and selection
  public colorArray = [
    { text: 'Motivation', code: '#00b9e8'},
    { text: 'Echec', code: '#f44236'},
    { text: 'Réussite', code: '#4aaf4f'},
    { text: 'Frustration', code: '#ffdd37'}
  ];
  public colorIndex = -1;

  // Auto complete input vars
  public completeService;
  public dataService: CompleterData;

  // WordCloud controls
  public canvasWidth: number;
  public canvasHeight: number;

  public word_cloud: Array<AgWordCloudData> = [];

  public options = {
    settings: {
        minFontSize: 30,
        maxFontSize: 110,
        fontFace: 'arial'
    },
    margin: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
    },
    labels: true // false to hide hover labels
  };

  constructor(completerService: CompleterService) {
    this.completeService = completerService;
    this.dataService = this.completeService.local(this.itemsTheme);
    this.grpTheme = new Array();
  }
  public ngOnInit() {
    // console.log(this.myIdentifier.nativeElement.offsetWidth);
    // console.log(this.myIdentifier.nativeElement.offsetWidth);
    // this.canvasWidth = this.myIdentifier.nativeElement.offsetWidth - 65;
  }

  public chooseImportance(index: number) {
    this.impIndex = index;
  }

  public chooseColor(index: number) {
    this.colorIndex = index;
  }

  public randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
 }

  public update() {
    if (this.newWord !== '' && this.theme !== '' && this.impIndex !== -1 && this.colorIndex !== -1) {
      const word = {
        text: this.newWord,
        size: this.sizeArray[this.impIndex],
        color: this.colorArray[this.colorIndex].code,
        theme: this.theme
      };
      if (this.itemsTheme.indexOf(this.theme) === -1) {
        this.itemsTheme.push(this.theme);
        this.dataService = this.completeService.local(this.itemsTheme);
      }
      this.word_cloud.push(word);
      if (this.activeViewIndex === 0) {
        this.word_cloud_chart.update();
      }

      this.newWord = '';
      this.theme = '';

      if (this.activeViewIndex === 3) {
        for (const i in this.itemsTheme) {
          if (true) {
            const i4 = Number(i) / 4;
            let i5 = -1;
            console.log('i4: ', i4);
            if (Number.isInteger(i4)) {
              i5 = Math.ceil(i4);
              console.log('i5: ', i5);
              this.grpTheme[i5] = new Array();
            } else {
              i5 = Math.ceil(i4) - 1;
              console.log('i5: ', i5);
            }
            console.log('grptheme: ', this.grpTheme);
            this.grpTheme[i5].push(this.itemsTheme[i]);
          }
        }
      }
    }
  }

  public changeView() {
    this.activeViewIndex = (this.activeViewIndex + 1) % 4;
    if (this.activeViewIndex === 3) {
      for (const i in this.itemsTheme) {
        if (true) {
          const i4 = Number(i) / 4;
          let i5 = -1;
          console.log('i4: ', i4);
          if (Number.isInteger(i4)) {
            i5 = Math.ceil(i4);
            console.log('i5: ', i5);
            this.grpTheme[i5] = new Array();
          } else {
            i5 = Math.ceil(i4) - 1;
            console.log('i5: ', i5);
          }
          console.log('grptheme: ', this.grpTheme);
          this.grpTheme[i5].push(this.itemsTheme[i]);
        }
      }
    }
  }

  public reload() {
    if (this.activeViewIndex === 0) {
      this.word_cloud_chart.update();
    }
  }

  public removeAll() {
      this.word_cloud = [];
      this.itemsTheme = [];
      this.grpTheme = [];
      if (this.activeViewIndex === 0) {
        this.word_cloud_chart.wordData = [];
        this.word_cloud_chart.update();
      }
  }

  public exportPNG() {
    const svg = document.querySelector('#my-svg');
    const canvas = document.createElement('canvas');

    const svgSize = svg.getBoundingClientRect();
    canvas.width = svgSize.width;
    canvas.height = svgSize.height;

    const ctx = canvas.getContext('2d');
    const data = new XMLSerializer().serializeToString(svg);

    const DOMURL = window.URL;

    const img = new Image();
    const svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
    const url = DOMURL.createObjectURL(svgBlob);

    img.onload = function () {
        ctx.drawImage(img, 0, 0);
        DOMURL.revokeObjectURL(url);

        const imgURI = canvas
            .toDataURL('image/png')
            .replace('image/png', 'image/octet-stream');

        triggerDownload(imgURI);

        function triggerDownload(imageURI: string) {
          const evt = new MouseEvent('click', {
            view: window,
            bubbles: false,
            cancelable: true
         });
          const a = document.createElement('a');
          a.setAttribute('download', 'wordcloud.png');
          a.setAttribute('href', imgURI);
          a.setAttribute('target', '_blank');
          a.setAttribute('style', 'font-family: arial');
          a.dispatchEvent(evt);
        }
    };
    img.src = url;
  }
}
