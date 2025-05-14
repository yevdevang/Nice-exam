import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Carousel } from 'primeng/carousel';
import { Button } from 'primeng/button';

interface DecodedQuestion {
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
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
export class SwiperComponent {
  @Input() results: DecodedQuestion[] = [];

  getAllAnswers(question: DecodedQuestion): string[] {
    return [question.correctAnswer, ...question.incorrectAnswers];
  }
}
