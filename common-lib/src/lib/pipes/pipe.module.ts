import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArrayJoinTextPipe } from './array-join-text-pipe';
import { RemoveHtmlTagPipe } from './remove-html-tag.pipe';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    ArrayJoinTextPipe,
    RemoveHtmlTagPipe
  ],
  exports: [
    ArrayJoinTextPipe,
    RemoveHtmlTagPipe
  ],
  providers: []
})
export class PipeModule { }
