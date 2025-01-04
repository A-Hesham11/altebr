import { useState, useEffect } from "react";
import { useIsRTL } from "../../hooks";

// Constants
const ARABIC_NUMBERS = [
  "الأولى",
  "الثانية",
  "الثالثة",
  "الرابعة",
  "الخامسة",
  "السادسة",
  "السابعة",
  "الثامنة",
  "التاسعة",
  "العاشرة",
  "الحادية عشر",
  "الثانية عشر",
  "الثالثة عشر",
  "الرابعة عشر",
  "الخامسة عشر",
  "السادسة عشر",
  "السابعة عشر",
  "الثامنة عشر",
  "التاسعة عشر",
  "العشرون",
];

const ENGLISH_NUMBERS = [
  "first",
  "second",
  "third",
  "fourth",
  "fifth",
  "sixth",
  "seventh",
  "eighth",
  "ninth",
  "tenth",
  "eleventh",
  "twelfth",
  "thirteenth",
  "fourteenth",
  "fifteenth",
  "sixteenth",
  "seventeenth",
  "eighteenth",
  "nineteenth",
  "twentieth",
];

const ARABIC_TENS = [
  "",
  "عشر",
  "العشرون",
  "الثلاثون",
  "الأربعون",
  "الخمسون",
  "الستون",
  "السبعون",
  "الثمانون",
  "التسعون",
  "المئة",
];

const ENGLISH_TENS = [
  "",
  "ten",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
  "one hundred",
];

const ARABIC_UNITS = [
  "",
  "الحادية",
  "الثانية",
  "الثالثة",
  "الرابعة",
  "الخامسة",
  "السادسة",
  "السابعة",
  "الثامنة",
  "التاسعة",
];

const ENGLISH_UNITS = [
  "",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

// Utility Functions
const getNumberInWords = (n: number, isRTL: boolean): string => {
  const numbers = isRTL ? ARABIC_NUMBERS : ENGLISH_NUMBERS;
  const tens = isRTL ? ARABIC_TENS : ENGLISH_TENS;
  const units = isRTL ? ARABIC_UNITS : ENGLISH_UNITS;

  if (n <= 20) return numbers[n - 1];
  if (n <= 99) {
    const tensPart = tens[Math.floor(n / 10)];
    const unitsPart = units[n % 10];
    const connector = isRTL ? "و" : "and";
    return `${unitsPart} ${unitsPart && connector} ${tensPart}`.trim();
  }
  if (n <= 200) {
    const hundredsPart = isRTL ? "المئة" : "one hundred";
    const remainder = n - 100;
    if (remainder === 0) return hundredsPart;

    const tensPart = tens[Math.floor(remainder / 10)];
    const unitsPart = units[remainder % 10];
    const connector = isRTL ? "و" : "and";
    return `${hundredsPart} ${connector} ${unitsPart} ${tensPart}`.trim();
  }

  throw new Error("Number out of range");
};

const generateNumbers = (isRTL: boolean): string[] => {
  const baseNumbers = isRTL ? ARABIC_NUMBERS : ENGLISH_NUMBERS;
  const numbers = [...baseNumbers];
  for (let i = 21; i <= 200; i++) {
    numbers.push(getNumberInWords(i, isRTL));
  }
  return numbers;
};

// Component
const ConvertNumberToWordGroup = () => {
  const [numbers, setNumbers] = useState<string[]>([]);
  const isRTL = useIsRTL();

  useEffect(() => {
    setNumbers(generateNumbers(isRTL));
  }, [isRTL]);

  return numbers;
};

export default ConvertNumberToWordGroup;
