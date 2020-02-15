import { ChangeDetectorRef, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { createBoxAnimation } from '@app/core/animations';
import { Member, Role } from '@app/core/models';

@Component({
  selector: 'fm-member-selection',
  templateUrl: './member-selection.component.html',
  styleUrls: ['./member-selection.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: MemberSelectionComponent,
    multi: true
  }],
  animations: [createBoxAnimation]
})
export class MemberSelectionComponent implements ControlValueAccessor {
  @HostBinding('@createBox') createBox = '';
  @Input() value: Member;
  @Input() name: string;
  @Input() disabled: boolean;
  @Input() required: boolean;
  @Input() placeholder: string;
  @Input() memberList: Array<Member> = [];
  @Input() memberMap: Map<Role, Array<Member>>;
  @Input() size = 100;
  @Input() width = 100;
  @Input() height = 100;
  @Input() captain = false;
  @Input() isMemberDisabled: (m: Member) => boolean;
  @Output() readonly selectionChange: EventEmitter<MatSelectChange> = new EventEmitter<MatSelectChange>();

  // tslint:disable-next-line: no-empty
  onChange: Function = () => { };
  // tslint:disable-next-line: no-empty
  onTouched: Function = () => { };

  constructor(
    private readonly cd: ChangeDetectorRef
  ) { }

  get val(): Member {
    return this.value;
  }

  set val(val) {
    this.value = val;
    this.onChange(val);
    this.onTouched();
    this.cd.detectChanges();
  }

  change(event: MatSelectChange): void {
    this.selectionChange.emit(event);
  }

  registerOnChange(fn: (_: Function) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (_: Function) => void): void {
    this.onTouched = fn;
  }

  writeValue(value: Member): void {
    this.value = value;
  }

  setDisabledState?(isDisabled: boolean): void;

  track(_: number, member: Member): number {
    return member.id;
  }

}
