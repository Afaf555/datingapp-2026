import { Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { EditableMember, Member } from '../../../types/member';
import { DatePipe } from '@angular/common';
import { MemberService } from '../../../core/services/member-service';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from '../../../core/services/toast-service';
import { AccountService } from '../../../core/services/account-service';
import { TimeAgoPipe } from '../../../core/pipes/time-ago-pipe';

@Component({
  imports: [DatePipe, FormsModule,TimeAgoPipe],
  selector: 'app-member-profile',
  styleUrl: './member-profile.css',
  templateUrl: './member-profile.html',
})
export class MemberProfile implements OnInit {

  @ViewChild('editForm') editForm?: NgForm;
  @HostListener('window:beforeunload',['$event']) notify($event:BeforeUnloadEvent){
    if(this.editForm?.dirty){
      $event.preventDefault();
    }
  }
  private accountService=inject(AccountService)
  protected memberService = inject(MemberService)
  protected editableMember: EditableMember = {
    displayName:'',
    desrciption:'',
    city:'',
    country:''
  };
  private toast = inject(ToastService)
  
  ngOnInit(): void {
     this.editableMember = {
      displayName: this.memberService.member()?.displayName || '',
      desrciption: this.memberService.member()?.description || '',
      city: this.memberService.member()?.city || '',
      country: this.memberService.member()?.country || '',
    }
  }

  updateProfile() {
    if (!this.memberService.member()) return;
    const updatedMember = { ...this.memberService.member(), ...this.editableMember }
    this.memberService.updateMember(this.editableMember).subscribe(
      {
        next:()=>{
          const currentUser=this.accountService.currentUser()
          if(currentUser&&updatedMember.displayName !== currentUser?.displayName){
            currentUser.displayName=updatedMember.displayName;
            this.accountService.setCurrentUser(currentUser);
          }
          this.toast.success('Profile updated successfully');
          this.memberService.editMode.set(false);
          this.memberService.member.set(updatedMember as Member)
          this.editForm?.reset(updatedMember);
        }
      }
    )
    this.toast.success('Profile updated successfully')
    this.memberService.editMode.set(false);

  }

  ngOnDestroy(): void {
    if (this.memberService.editMode()) {
      this.memberService.editMode.set(false);
    }
  }
}
