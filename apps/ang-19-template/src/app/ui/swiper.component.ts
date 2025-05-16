import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
  OnDestroy,
  signal,
  viewChild,
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

interface ResponsiveOptions {
  breakpoint: string;
  numVisible: number;
  numScroll: number;
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
  isCorrect = signal(false);
  isSelected = false;
  timeLeft = signal(20);
  timerDuration = TIMER_DURATION;
  carousel = viewChild(Carousel);
  responsiveOptions: Array<ResponsiveOptions> = [];
  private randomizedAnswers = new Map<string, string[]>();
  #timerSubscription?: Subscription;

  constructor() {
    this.startTimer();
  }

  private _results: DecodedQuestion[] = [];

  get results(): DecodedQuestion[] {
    return this._results;
  }

  @Input() set results(value: DecodedQuestion[]) {
    this._results = value;
    this.initializeRandomizedAnswers();
  }

  ngOnInit() {
    this.responsiveOptions = [
      {
        breakpoint: '1400px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1,
      },
      {
        breakpoint: '767px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '575px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
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
    return this.randomizedAnswers.get(question.question) || [];
  }

  insertCorrectAnswerAtRandomIndex(
    correctAnswer: string,
    incorrectAnswers: string[],
  ): string[] {
    const answers = [...incorrectAnswers];
    const randomIndex = Math.floor(Math.random() * (answers.length + 1));
    answers.splice(randomIndex, 0, correctAnswer);
    return answers;
  }

  handleAnswer(question: DecodedQuestion, answer: string) {
    if (question.disabled) return;

    question.selectedAnswer = answer;
    question.disabled = true;
    this.isSelected = true;
    const currentPage = this.carousel()?.page;
    setTimeout(() => {
      this.carousel()!.page = currentPage! + 1;
      this.getAnswer(question, answer);
      this.startTimer();
    }, 1000);
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

  private initializeRandomizedAnswers() {
    this.randomizedAnswers.clear();
    this._results.forEach((question) => {
      const allAnswers = this.insertCorrectAnswerAtRandomIndex(
        question.correctAnswer,
        question.incorrectAnswers,
      );
      this.randomizedAnswers.set(question.question, allAnswers);
    });
  }
}
