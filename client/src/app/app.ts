import { Component, inject, OnInit } from '@angular/core';
import { Nav } from '../layout/nav/nav';
import { Router, RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import { ConfirmDialog } from '../shared/confirm-dialog/confirm-dialog';

@Component({
  imports: [Nav, RouterOutlet, ConfirmDialog],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
  standalone: true
})
export class App  {
  protected router=inject(Router)



}
