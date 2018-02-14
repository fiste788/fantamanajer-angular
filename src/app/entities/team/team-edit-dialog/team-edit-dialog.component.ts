import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FileSelectDirective,
  FileDropDirective,
  FileUploader
} from 'ng2-file-upload';
import { environment } from 'environments/environment';

@Component({
  selector: 'fm-team-edit-dialog',
  templateUrl: './team-edit-dialog.component.html',
  styleUrls: ['./team-edit-dialog.component.scss']
})
export class TeamEditDialogComponent {
  public uploader: FileUploader;
  public hasBaseDropZoneOver = false;
  public hasAnotherDropZoneOver = false;

  constructor(
    public dialogRef: MatDialogRef<TeamEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const h = [
      { name: 'X-Http-Method-Override', value: 'PUT' },
      { name: 'Accept', value: 'application/json' }
    ];
    this.uploader = new FileUploader({
      url: environment.apiEndpoint + 'teams/' + data.team.id,
      authToken: 'Bearer ' + localStorage.getItem('token'),
      headers: h
    });
    this.uploader.autoUpload = true;
    this.uploader.options.itemAlias = 'photo';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  upload(): void {
    this.uploader.uploadAll();
    this.uploader.onCompleteAll = () => this.dialogRef.close();
  }

  public fileOver(e: any): void {
    this.hasBaseDropZoneOver = e;
  }
}
