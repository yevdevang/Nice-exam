import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './core/common/header/header.component';
import { FooterComponent } from './core/common/footer/footer.component';

@Component({
  imports: [HeaderComponent, RouterModule,FooterComponent],
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ang-19-template';
}
