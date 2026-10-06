import { Component, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { ActivatedRoute } from '@angular/router';
import { Member, Photo } from '../../../types/member';
import { AsyncPipe } from '@angular/common';
import { ImageUpload } from '../../../shared/image-upload/image-upload';
import { AccountService } from '../../../core/services/account-service';
import { User } from '../../../types/user';
import { StarButton } from '../../../shared/star-button/star-button';
import { DeleteButton } from '../../../shared/delete-button/delete-button';

@Component({
  imports: [ImageUpload, StarButton, DeleteButton],
  selector: 'app-member-photo',
  styleUrl: './member-photo.css',
  templateUrl: './member-photo.html',
})
export class MemberPhoto implements OnInit {
  protected memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  protected photos = signal<Photo[]>([])
  protected loading = signal(false);
  protected accountService = inject(AccountService);

  ngOnInit(): void {
    const memberID = this.route.parent?.snapshot.paramMap.get('id');
    if (memberID) {
      this.memberService.getMemberPhotos(memberID).subscribe({
        next: photos => this.photos.set(photos)
      });
    }
  }

  get photoMocks() {
    return Array.from({ length: 20 }, (_, i) => ({
      url: '/user.png'
    }))
  }

  onUploadImage(file: File) {
    this.loading.set(true);
    this.memberService.uploadPhoto(file).subscribe({
      next: photo => {
        this.memberService.editMode.set(false);
        this.loading.set(false);
        this.photos.update(photos => [...photos, photo])
        if(!this.memberService.member()?.imageUrl){
          this.setMainLocalPhoto(photo)
        }
      },
      error: error => {
        console.log('Error uploading image: ', error);
        this.loading.set(false);
      }
    })

  }
  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo).subscribe({
      next: () => {
        this.setMainLocalPhoto(photo)
      }
    })
  }
  deletePhoto(photoId:number){
    this.memberService.deletePhoto(photoId).subscribe({
      next: ()=>{
        this.photos.update(photos=>photos.filter(x=>x.id!==photoId))
      }
    })
  }
  private setMainLocalPhoto(photo:Photo){
     const currentUser = this.accountService.currentUser();
        if (currentUser) currentUser.imageUrl = photo.url;
        this.accountService.setCurrentUser(currentUser as User)
        this.memberService.member.update(member=>({
          ...member,
          imageUrl: photo.url
        }) as Member)
  }

}
