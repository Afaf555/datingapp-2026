import { Component, inject, Input, signal } from '@angular/core';
import { Register } from '../account/register/register';
import { User } from '../../types/user';
import { AccountService } from '../../core/services/account-service';

@Component({
  imports: [Register],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  protected registerMode = signal(true);
  protected  accountService=inject(AccountService);

  showRegister(value: boolean) {
    this.registerMode.set(value);
  }
}
