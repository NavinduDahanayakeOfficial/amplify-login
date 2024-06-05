import { Component, OnInit } from '@angular/core';

import { getCurrentUser } from 'aws-amplify/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{

  public userName: string = '';

  async ngOnInit(){
    this.currentAuthenticatedUser();
  }


  async currentAuthenticatedUser(){
    try {
      const { username, userId } = await getCurrentUser();
      this.userName = username;
      console.log('userId:', userId);
    } catch (error) {
      console.error('error fetching current authenticated user...', error);
    }
  }
}
