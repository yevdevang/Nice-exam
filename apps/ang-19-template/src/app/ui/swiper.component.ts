import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
  OnDestroy,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Carousel } from 'primeng/carousel';
import { Button } from 'primeng/button';
import { Subscription, timer } from 'rxjs';

const TIMER_DURATION = 20000; // 20 seconds in milliseconds

interface DecodedQuestion {
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  selectedAnswer?: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-swiper',
  imports: [CommonModule, Carousel, Button],
  standalone: true,
  templateUrl: './swiper.component.html',
  styleUrl: './swiper.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  host: { ngSkipHydration: 'true' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwiperComponent implements OnDestroy {
  @Input() results: DecodedQuestion[] = [];
  isCorrect = signal(false);
  isSelected = false;
  timeLeft = signal(20);
  timerDuration = TIMER_DURATION;
  #timerSubscription?: Subscription;

  constructor() {
    this.startTimer();
  }

  startTimer() {
    this.timeLeft.set(20);
    this.#timerSubscription?.unsubscribe();
    this.#timerSubscription = timer(0, 1000).subscribe(() => {
      if (this.timeLeft() > 0) {
        this.timeLeft.update((value) => value - 1);
      } else {
        this.#timerSubscription?.unsubscribe();
      }
    });
  }

  ngOnDestroy() {
    this.#timerSubscription?.unsubscribe();
  }

  getAllAnswers(question: DecodedQuestion): string[] {
    return [question.correctAnswer, ...question.incorrectAnswers];
  }

  handleAnswer(question: DecodedQuestion, answer: string) {
    if (question.disabled) return;

    question.selectedAnswer = answer;
    question.disabled = true;
    this.isSelected = true;
    this.getAnswer(question, answer);
    this.#timerSubscription?.unsubscribe();
  }

  getAnswer(question: DecodedQuestion, answer: string) {
    if (answer === question.correctAnswer) {
      this.isCorrect.set(true);
    }

    if (
      answer === question.selectedAnswer &&
      answer !== question.correctAnswer
    ) {
      this.isCorrect.set(false);
    }
  }

  onPageChange() {
    this.isCorrect.set(false);
    this.isSelected = false;
    this.startTimer();
  }
}
