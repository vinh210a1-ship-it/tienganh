// Đáp án GÕ TAY để kiểm chính bộ đổi số (doc-so.mjs). Không sinh từ doc-so.mjs, vì như vậy sẽ tự khen mình.
// DUNG: [chữ hiển thị, cách đọc] phải khớp.  SAI: [chữ hiển thị, cách đọc] phải KHÔNG khớp.
// Gõ theo cách đọc tiếng Anh chuẩn; mỗi dòng nên là một thứ có thể nghe thấy ngoài đời.

export const DUNG = [
  // số đếm
  ['0', 'zero'], ['7', 'seven'], ['12', 'twelve'], ['13', 'thirteen'], ['15', 'fifteen'], ['19', 'nineteen'],
  ['20', 'twenty'], ['21', 'twenty-one'], ['30', 'thirty'], ['40', 'forty'], ['50', 'fifty'], ['80', 'eighty'], ['99', 'ninety-nine'],
  ['100', 'one hundred'], ['101', 'one hundred and one'], ['101', 'one hundred one'], ['250', 'two hundred fifty'], ['999', 'nine hundred ninety-nine'],
  ['1,000', 'one thousand'], ['1,250', 'one thousand two hundred fifty'], ['1,250', 'one thousand two hundred and fifty'],
  ['10,000', 'ten thousand'], ['50,000', 'fifty thousand'], ['100,000', 'one hundred thousand'], ['1,000,000', 'one million'],
  // số thứ tự
  ['1st', 'first'], ['2nd', 'second'], ['3rd', 'third'], ['4th', 'fourth'], ['5th', 'fifth'], ['8th', 'eighth'], ['9th', 'ninth'],
  ['12th', 'twelfth'], ['13th', 'thirteenth'], ['20th', 'twentieth'], ['21st', 'twenty-first'], ['22nd', 'twenty-second'],
  ['23rd', 'twenty-third'], ['25th', 'twenty-fifth'], ['30th', 'thirtieth'], ['31st', 'thirty-first'],
  // năm
  ['1999', 'nineteen ninety-nine'], ['1905', 'nineteen oh five'], ['2000', 'two thousand'], ['2005', 'two thousand five'],
  ['2010', 'twenty ten'], ['2010', 'two thousand ten'], ['2026', 'twenty twenty-six'], ['2026', 'two thousand twenty-six'], ['1900', 'nineteen hundred'],
  // giờ
  ['3:00', "three o'clock"], ['7:05', 'seven oh five'], ['7:05', 'five past seven'], ['3:10', 'three ten'], ['3:10', 'ten past three'],
  ['3:15', 'three fifteen'], ['3:15', 'a quarter past three'], ['3:20', 'twenty past three'], ['3:30', 'three thirty'], ['3:30', 'half past three'],
  ['3:40', 'three forty'], ['3:40', 'twenty to four'], ['3:45', 'three forty-five'], ['3:45', 'a quarter to four'], ['3:50', 'ten to four'], ['3:55', 'five to four'],
  ['12:45', 'a quarter to one'], ['11:50', 'ten to twelve'], ['9:30 a.m.', 'nine thirty a.m.'], ['2:30 p.m.', 'two thirty p.m.'],
  // tiền
  ['$0.99', 'ninety-nine cents'], ['$1', 'one dollar'], ['$2', 'two dollars'], ['$25', 'twenty-five dollars'], ['$100', 'one hundred dollars'],
  ['$4.50', 'four fifty'], ['$4.50', 'four dollars and fifty cents'], ['$4.05', 'four oh five'], ['$4.05', 'four dollars and five cents'],
  ['$10.99', 'ten ninety-nine'], ['$1,250', 'one thousand two hundred fifty dollars'],
  ['$1,250.50', 'one thousand two hundred fifty dollars and fifty cents'], ['$1.01', 'one dollar and one cent'],
  ['£20', 'twenty pounds'], ['€5', 'five euros'], ['50,000 VND', 'fifty thousand dong'], ['20%', 'twenty percent'],
  // ngày kiểu Anh
  ['5 May', 'the fifth of May'], ['12 June', 'the twelfth of June'], ['1 March', 'the first of March'],
  // số điện thoại: từng chữ số; 0 là zero hoặc oh
  ['0123 456 789', 'zero one two three, four five six, seven eight nine'],
  ['0123 456 789', 'oh one two three, four five six, seven eight nine'],
  ['+84 123 456 789', 'plus eight four, one two three, four five six, seven eight nine'],
  ['(212) 555-0147', 'two one two, five five five, zero one four seven'],
  ['(212) 555-0147', 'two one two, five five five, oh one four seven'],
  // câu có nhiều số và chữ xen
  ["It's 3:15.", "It's a quarter past three."], ['It starts at 9:30 a.m.', 'It starts at nine thirty a.m.'],
  ["I work from 8 to 5.", "I work from eight to five."], ["It's $4.50.", "It's four fifty."], ['Is that 15 or 50?', 'Is that fifteen or fifty?'],
  ["It's on June 12th.", "It's on June twelfth."], ["So that's 0123 456 789. Is that right?", "So that's zero one two three, four five six, seven eight nine. Is that right?"],
];

export const SAI = [
  ['3:15', 'a quarter to three'], ['3:15', 'half past three'], ['3:45', 'a quarter past three'], ['3:45', 'a quarter to three'],
  ['3:40', 'twenty past three'], ['3:10', 'ten to four'], ['7:05', 'seven five'],
  ['$4.50', 'four point fifty'], ['$4.50', 'forty-five'], ['$1', 'one dollars'], ['$2', 'two dollar'], ['$0.99', 'ninety-nine dollars'],
  ['5th', 'five'], ['5th', 'fiveth'], ['22nd', 'twenty-two'], ['3rd', 'threeth'], ['12th', 'twelveth'],
  ['2026', 'two thousand twenty'], ['2026', 'twenty twenty-five'], ['1999', 'nineteen nine nine'],
  ['101', 'one hundred ten'], ['1,250', 'one thousand twenty-five'], ['13', 'thirty'], ['15', 'fifty'], ['40', 'fourteen'],
  ['0123 456 789', 'zero one two three, four five six, seven nine eight'], ['0123 456 789', 'one hundred twenty-three'],
  ['+84 123 456 789', 'eight four, one two three, four five six, seven eight nine'],
  ['5 May', 'May fifth'], ['5 May', 'the fifth of June'],
  ["It's 3:15.", "It's a quarter to three."], ["It's $4.50.", "It's four fifteen."], ['Is that 15 or 50?', 'Is that fifty or fifteen?'],
  // thiếu chữ hoặc thừa chữ so với câu hiển thị
  ['It starts at 9:30 a.m.', 'It starts at nine thirty.'], ["I work from 8 to 5.", "I work from eight to six."],
];
