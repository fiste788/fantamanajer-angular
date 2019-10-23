import { Component, forwardRef, Output, Input, EventEmitter, OnInit, ChangeDetectorRef, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Member } from '@app/core/models';
import { createBoxAnimation } from '@app/core/animations';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MemberSelectionComponent),
  multi: true
};

@Component({
  selector: 'fm-member-selection',
  templateUrl: './member-selection.component.html',
  styleUrls: ['./member-selection.component.scss'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
  animations: [createBoxAnimation],
})
export class MemberSelectionComponent implements ControlValueAccessor, OnInit {
  @HostBinding('@createBox') createBox = '';
  @Input() value: Member;
  @Input() name: string;
  @Input() disabled: boolean;
  @Input() required: boolean;
  @Input() placeholder: string;
  @Input() memberList: Member[] = [];
  @Input() memberMap: Map<string, Member[]>;
  @Input() size = 100;
  @Input() isMemberDisabled: (m: Member) => boolean;
  @Output() selectionChange: EventEmitter<MatSelectChange> = new EventEmitter<MatSelectChange>();

  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {

  }

  get val() {
    return this.value;
  }

  set val(val) {
    this.value = val;
    this.onChange(val);
    this.onTouched();
    this.cd.detectChanges();
  }

  change(event: MatSelectChange) {
    this.selectionChange.emit(event);
  }

  registerOnChange(fn: (_: any) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: (_: any) => void) {
    this.onTouched = fn;
  }

  writeValue(value: Member) {
    this.value = value;
  }

  setDisabledState?(isDisabled: boolean): void;

}
