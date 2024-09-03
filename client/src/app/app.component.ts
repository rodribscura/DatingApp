 import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  http = inject(HttpClient);
  title = 'DatingApp';
  users: any;
  

ngOnInit(): void {
  this.http.get('https://localhost:5001/api/users').subscribe({
    next: Response => this.users = Response,
    error: Error => console.log(Error),
    complete: () => console.log('Request has completed')
  })
}
  


}
