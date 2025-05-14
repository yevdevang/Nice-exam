import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { SwiperComponent } from '../../ui/swiper.component';
import { Button } from 'primeng/button';
import { QuestionResponse, Result } from '../../core/models/question-response';
import { DataService } from '../../core/services/data.service';
import { timer } from 'rxjs';
import { JsonPipe } from '@angular/common';

interface DecodedQuestion {
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
}

@Component({
  selector: 'app-home',
  imports: [MatProgressSpinner, SwiperComponent, Button, JsonPipe],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  amount = 20;
  data = signal<QuestionResponse | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  decodedQuestions = signal<DecodedQuestion[]>([]);
  #dataService = inject(DataService);
  #cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    // Wait for 300ms before fetching data
    timer(300).subscribe(() => {
      this.fetchData();
    });
  }

  fetchData() {
    this.loading.set(true);
    this.error.set(null);

    this.#dataService
      .request<QuestionResponse>({
        url: `?amount=${this.amount}&encode=base64&type=multiple`,
        method: 'GET',
      })
      .subscribe({
        next: (response: QuestionResponse) => {
          const decodedQuestions = response.results.map((item: Result) => ({
            question: atob(item.question),
            correctAnswer: atob(item.correct_answer),
            incorrectAnswers: item.incorrect_answers.map(answer => atob(answer))
          }));
          
          this.decodedQuestions.set(decodedQuestions);
          this.data.set(response);
          this.loading.set(false);
          this.#cdr.detectChanges();
        },
        error: (err) => {
          this.error.set('Failed to fetch data');
          this.loading.set(false);
          this.#cdr.detectChanges();
        },
      });
  }
}
