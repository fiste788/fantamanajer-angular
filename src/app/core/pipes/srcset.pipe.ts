import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'srcset' })
export class SrcsetPipe implements PipeTransform {
    transform(sizes: any): string {
        if (sizes) {
            const srcset = [];
            if (typeof sizes !== 'string') {
                const keys = Object.keys(sizes);
                keys.forEach(key => {
                    srcset.push(sizes[key] + ' ' + key);
                });
            } else {
                srcset.push(sizes);
            }
            return srcset.join(',');
        } else {
            return '';
        }
    }
}
