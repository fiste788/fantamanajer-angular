import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-content-loader',
  templateUrl: './content-loader.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { display: 'block' },
})
export class ContentLoaderComponent {
  public readonly animate = input(true);
  public readonly backgroundColor = input('#f5f6f7');
  public readonly backgroundOpacity = input(1);
  public readonly baseUrl = input('');
  public readonly foregroundColor = input('#eee');
  public readonly foregroundOpacity = input(1);
  public readonly gradientRatio = input(2);
  public readonly interval = input(0.25);
  public readonly rtl = input(false);
  public readonly speed = input(1.2);
  public readonly style = input({});
  public readonly viewBox = input('0 0 400 130');

  protected fixedId = this.#uid();
  protected idAria = `${this.fixedId}-aria`;
  protected idClip = `${this.fixedId}-diff`;
  protected idGradient = `${this.fixedId}-animated-diff`;

  protected readonly animationValues = computed(() => [
    `${-this.gradientRatio()}; ${-this.gradientRatio()}; 1`,
    `${-this.gradientRatio() / 2}; ${-this.gradientRatio() / 2}; ${1 + this.gradientRatio() / 2}`,
    `0; 0; ${1 + this.gradientRatio()}`,
  ]);
  protected readonly clipPath = computed(() => `url(${this.baseUrl()}#${this.idClip})`);
  protected readonly duration = computed(() => `${this.speed()}s`);
  protected readonly fillStyle = computed(() => ({ fill: `url(${this.baseUrl()}#${this.idGradient})` }));
  protected readonly keyTimes = computed(() => `0; ${this.interval()}; 1`);

  #uid(): string {
    return Math.random().toString(36).slice(2);
  }
}
