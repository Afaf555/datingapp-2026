import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { EditableMember, Member, Photo } from '../../types/member';
import { tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MemberService {
    private http=inject(HttpClient);
    member=signal<Member | null>(null);
    private baseUrl=environment.apiUrl;
    editMode=signal(false)

    getMembers(){
        return this.http.get<Member []>(this.baseUrl + 'members')
    }
    getMember(id:string){
        return this.http.get<Member >(this.baseUrl + 'members/'+id).pipe(
            tap(member =>{
                this.member.set(member)
            })
        );
    }
    getMemberPhotos(id:string){
        return this.http.get<Photo[]>(this.baseUrl+'members/'+id+'/photos')
    }
    updateMember(member:EditableMember){
        return this.http.put(this.baseUrl+'members',member);

    }


}
