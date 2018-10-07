import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  title = 'Supermarket Shopping Site';
  isCollapsed = true;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onLoginButtonClicked() {
    this.router.navigate(['/login']);
  }

}
