import { sortStyles, regexps } from './utils';

describe('sortStyles', () => {
  it('基本的なスタイルは太さ順に並ぶ', () => {
    const input = ['Black', 'Bold', 'Regular', 'Thin'];
    const output = ['Thin', 'Regular', 'Bold', 'Black'];
    expect(sortStyles(input)).toStrictEqual(output);
  });

  it('空白付きのスタイルも適切な太さ順に並ぶ', () => {
    const input = ['Extra Bold', 'Bold', 'Regular', 'Semi Bold'];
    const output = ['Regular', 'Semi Bold', 'Bold', 'Extra Bold'];
    expect(sortStyles(input)).toStrictEqual(output);
  });

  it('斜体（Italic）が含まれる場合、斜体ではないスタイルのあとに並ぶ', () => {
    const input = ['Bold', 'Regular', 'Heavy Italic', 'Light Italic'];
    const output = ['Regular', 'Bold', 'Light Italic', 'Heavy Italic'];
    expect(sortStyles(input)).toStrictEqual(output);
  });

  it('ヒラギノ角ゴシックのようなWX形式のスタイルは数字順に並ぶ', () => {
    const input = ['W8', 'W6', 'W0', 'W3'];
    const output = ['W0', 'W3', 'W6', 'W8'];
    expect(sortStyles(input)).toStrictEqual(output);
  });

  it('事前に想定されていないスタイルはRegular扱いされて並ぶ', () => {
    const input = ['Medium', 'Light', 'Unknown'];
    const output = ['Light', 'Unknown', 'Medium'];
    expect(sortStyles(input)).toStrictEqual(output);
  });
});

describe('regexps', () => {
  const text = 'ある晴れた日のこと。';
  const text2 = 'あるsunny日のこと。';

  it('かなでマッチすること', () => {
    const matches = Array.from(text.matchAll(regexps.kana));
    expect(matches.map((match) => match[0])).toStrictEqual([
      'ある',
      'れた',
      'のこと',
    ]);
  });

  it('漢字でマッチすること', () => {
    const matches = Array.from(text.matchAll(regexps.kanji));
    expect(matches.map((match) => match[0])).toStrictEqual(['晴', '日']);
  });

  it('約物でマッチすること', () => {
    const matches = Array.from(text.matchAll(regexps.yakumono));
    expect(matches.map((match) => match[0])).toStrictEqual(['。']);
  });

  it('日本語でマッチすること', () => {
    const matches = Array.from(text.matchAll(regexps.japanese));
    const matches2 = Array.from(text2.matchAll(regexps.japanese));
    expect(matches.map((match) => match[0])).toStrictEqual([text]);
    expect(matches2.map((match) => match[0])).toStrictEqual([
      'ある',
      '日のこと。',
    ]);
  });
});
