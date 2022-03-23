import { colors } from "../../config/colors";

export enum LetterGrade {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
  F = "F",
}

export const fGrade = { letter: LetterGrade.F, score: 0 };

export const gradeMaps = [
  { letter: LetterGrade.A, score: 90 },
  { letter: LetterGrade.B, score: 80 },
  { letter: LetterGrade.C, score: 70 },
  { letter: LetterGrade.D, score: 60 },
  fGrade,
];

export const gradeColorMap: Record<LetterGrade, string> = {
  [LetterGrade.A]: colors.success[500],
  [LetterGrade.B]: colors.success[400],
  [LetterGrade.C]: colors.tertiary[500],
  [LetterGrade.D]: colors.danger[400],
  [LetterGrade.F]: colors.danger[500],
};

export function scoreToGrade(score: number) {
  const grade = gradeMaps.find((gradeMap) => score >= gradeMap.score) || fGrade;
  return grade.letter;
}
