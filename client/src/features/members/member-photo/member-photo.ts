import { Component, inject } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Photo } from '../../../types/member';
import { AsyncPipe } from '@angular/common';

@Component({
  imports: [AsyncPipe],
  selector: 'app-member-photo',
  styleUrl: './member-photo.css',
  templateUrl: './member-photo.html',
})
export class MemberPhoto {
  private memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  protected photos$?: Observable<Photo[]>;

  constructor() {
    const memberID = this.route.parent?.snapshot.paramMap.get('id');
    if (memberID) {
      this.photos$ = this.memberService.getMemberPhotos(memberID);
    }
  }

  get photoMocks(){
    return Array.from({length:20},(_, i)=>({
      url:'/user.png'
    }))
  }
}
