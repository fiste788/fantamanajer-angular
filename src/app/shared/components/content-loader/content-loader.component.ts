import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

function uid(): string {
  return Math.random().toString(36).slice(2);
}

@Component({
  selector: 'app-content-loader',
  imports: [NgStyle],
  host: { display: 'block' },
  templateUrl: './content-loader.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentLoaderComponent {
  public animate = input(true);

  public baseUrl = input('');

  public speed = input(1.2);

  public viewBox = input('0 0 400 130');

  public gradientRatio = input(2);

  public backgroundColor = input('#f5f6f7');
  public backgroundOpacity = input(1);

  public foregroundColor = input('#eee');
  public foregroundOpacity = input(1);

  public rtl = input(false);

  public interval = input(0.25);

  public style = input({});

  protected fixedId = uid();

  protected idClip = `${this.fixedId}-diff`;
  protected idGradient = `${this.fixedId}-animated-diff`;
  protected idAria = `${this.fixedId}-aria`;

  protected animationValues = computed(() => [
    `${-this.gradientRatio()}; ${-this.gradientRatio()}; 1`,
    `${-this.gradientRatio() / 2}; ${-this.gradientRatio() / 2}; ${1 + this.gradientRatio() / 2}`,
    `0; 0; ${1 + this.gradientRatio()}`,
  ]);

  protected clipPath = computed(() => `url(${this.baseUrl()}#${this.idClip})`);
  protected fillStyle = computed(() => ({ fill: `url(${this.baseUrl()}#${this.idGradient})` }));
  protected duration = computed(() => `${this.speed()}s`);
  protected keyTimes = computed(() => `0; ${this.interval()}; 1`);
}
