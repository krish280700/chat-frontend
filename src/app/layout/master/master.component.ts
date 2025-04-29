import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { ChatComponent } from "../../pages/chat/chat.component";

@Component({
  selector: 'app-master',
  standalone: true,
  imports: [NavbarComponent, ChatComponent],
  templateUrl: './master.component.html',
  styleUrl: './master.component.scss'
})
export class MasterComponent {

}
