import { Component } from '@angular/core';
import ePub from 'epubjs';
import { Rendition } from 'epubjs';

@Component({
  selector: 'app-libros',
  templateUrl: './libros.component.html',
  styleUrls: ['./libros.component.scss'],
})
export class LibrosComponent {
  rendition!: Rendition;

  constructor() {
    var book = ePub('https://s3.amazonaws.com/epubjs/books/alice.epub');
    this.rendition = book.renderTo('area', {
      width: 800,
      height: 700,
    });

    this.rendition.display();
  }

  next() {
    this.rendition.next();
  }

  previous() {
    this.rendition.prev();
  }
}
