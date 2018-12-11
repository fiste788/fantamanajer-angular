import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'srcset' })
export class PlaceholderPipe implements PipeTransform {

    private placeholderService = require('placeholder.js');

    opts = {
        size: '512x256',
        bgcolor: '#ccc',
        color: '#969696',
        text: 'Hello World',
        fstyle: 'normal',
        fweight: 'bold',
        fsize: '32',
        ffamily: 'arial'
    };

    transform(size: string, text: string): string {
        this.opts.text = text;
        this.opts.size = size;
        return this.placeholderService.getData(this.opts);
    }
}
