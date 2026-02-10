import type { Quiz } from '@/types';

export const quizzes: Quiz[] = [
  {
    id: '1',
    question: 'Berapa hasil dari 2 + 2?',
    answer: '4',
    options: ['3', '4', '5', '6'],
  },
  {
    id: '2',
    question: 'Apa warna bendera Indonesia?',
    answer: 'Merah Putih',
    options: ['Merah Putih', 'Merah Kuning', 'Biru Putih', 'Hijau Kuning'],
  },
  {
    id: '3',
    question: 'Berapa jumlah huruf dalam kata "DANA"?',
    answer: '4',
    options: ['3', '4', '5', '6'],
  },
  {
    id: '4',
    question: 'Apa ibu kota Indonesia?',
    answer: 'Jakarta',
    options: ['Bandung', 'Jakarta', 'Surabaya', 'Yogyakarta'],
  },
  {
    id: '5',
    question: 'Berapa hasil dari 10 - 5?',
    answer: '5',
    options: ['4', '5', '6', '7'],
  },
  {
    id: '6',
    question: 'Apa nama aplikasi ini?',
    answer: 'AdsDanaID',
    options: ['AdsDanaID', 'DanaID', 'AdsID', 'DanaAds'],
  },
  {
    id: '7',
    question: 'Berapa jumlah hari dalam seminggu?',
    answer: '7',
    options: ['5', '6', '7', '8'],
  },
  {
    id: '8',
    question: 'Apa lambang mata uang Indonesia?',
    answer: 'Rp',
    options: ['$', '€', '£', 'Rp'],
  },
  {
    id: '9',
    question: 'Berapa hasil dari 5 x 2?',
    answer: '10',
    options: ['8', '9', '10', '11'],
  },
  {
    id: '10',
    question: 'Apa warna langit saat cerah?',
    answer: 'Biru',
    options: ['Merah', 'Biru', 'Hijau', 'Kuning'],
  },
  {
    id: '11',
    question: 'Berapa jumlah bulan dalam setahun?',
    answer: '12',
    options: ['10', '11', '12', '13'],
  },
  {
    id: '12',
    question: 'Apa yang kita gunakan untuk menelepon?',
    answer: 'HP',
    options: ['Buku', 'HP', 'Pensil', 'Meja'],
  },
  {
    id: '13',
    question: 'Berapa hasil dari 100 : 10?',
    answer: '10',
    options: ['5', '10', '15', '20'],
  },
  {
    id: '14',
    question: 'Apa warna daun yang sehat?',
    answer: 'Hijau',
    options: ['Merah', 'Kuning', 'Hijau', 'Coklat'],
  },
  {
    id: '15',
    question: 'Siapa presiden pertama Indonesia?',
    answer: 'Soekarno',
    options: ['Soekarno', 'Soeharto', 'Habibie', 'Megawati'],
  },
];

export function getRandomQuiz(): Quiz {
  return quizzes[Math.floor(Math.random() * quizzes.length)];
}
