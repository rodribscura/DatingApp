import { HttpClient} from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../_models/member';
import { of, tap } from 'rxjs';
import { Photo } from '../_models/photo';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  members = signal<Member[]>([]);

  getMembers() {
    return this.http.get<Member[]>(this.baseUrl + 'users').subscribe({
      next: members => this.members.set(members)
    })
  }

  getMember(username: string) {
    const member = this.members().find(x => x.username === username);
    if(member != undefined) return of(member);

    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      tap(() => {
        this.members.update(members => members.map(m => m.username === member.username 
          ? member: m))
      })
    )
  }

  setMainPhoto(photo: Photo) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photo.id, {}).pipe(
      tap(() => {
        this.members.update(members => members.map(m => {
          if(m.photos.includes(photo)) {
            m.photoUrl = photo.url
          }
          return m;
        }))
      })
    )
  }

  deletePhoto(photo: Photo) { // Realiza una solicitud HTTP DELETE a la URL construida con el id de la foto
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photo.id).pipe( // Utiliza el método pipe para encadenar operadores
      tap(() => { // Utiliza el operador tap para realizar efectos secundarios sin modificar los datos que pasan a través del observable.
        this.members.update(members => members.map(m => { // Actualiza la lista de miembros
          if(m.photos.includes(photo)) { // Si la foto está en la lista de fotos
            m.photos = m.photos.filter(x => x.id !== photo.id); // Filtra la lista de fotos para eliminar la foto actual
          }
          return m; // Devuelve el miembro actualizado
        }))
      })
    )
  }


}
