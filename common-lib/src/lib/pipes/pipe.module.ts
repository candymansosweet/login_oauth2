import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArrayJoinTextPipe } from './array-join-text-pipe';
import { RemoveHtmlTagPipe } from './remove-html-tag.pipe';
import { GetValueByKeyPipe } from './get-value-by-key.pipe';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    ArrayJoinTextPipe,
    RemoveHtmlTagPipe,
    GetValueByKeyPipe,
  ],
  exports: [
    ArrayJoinTextPipe,
    RemoveHtmlTagPipe,
    GetValueByKeyPipe,
  ],
  providers: []
})
export class PipeModule { }
