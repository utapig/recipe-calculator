import type { Recipe } from '../hooks/useData';

export const INITIAL_RECIPES: Recipe[] = [
    {
        id: 'recipe_cake_60',
        name: '【スタンダード喫食ケーキ】 1段サンド',
        basePortions: 60,
        ingredients: [
            { ingredientId: '117', amountG: 840 },
            { ingredientId: '118', amountG: 190 },
            { ingredientId: '119', amountG: 450 },
            { ingredientId: '120', amountG: 45 },
            { ingredientId: '121', amountG: 500 },
            { ingredientId: '122', amountG: 75 },
            { ingredientId: '123', amountG: 125 },
            { ingredientId: '124', amountG: 86 },
            { ingredientId: '125', amountG: 43 },
            { ingredientId: '126', amountG: 43 },
            { ingredientId: '127', amountG: 128 },
            { ingredientId: '128', amountG: 540 },
            { ingredientId: '129', amountG: 540 },
            { ingredientId: '126', amountG: 86 },
            { ingredientId: '130', amountG: 800 },
        ],
    },
    {
        id: 'recipe_hibiscus_mousse',
        name: 'ハイビスカス香る アールグレイとミルクショコラのムース',
        basePortions: 1,
        ingredients: [
            { ingredientId: '183', amountG: 10 },
            { ingredientId: '131', amountG: 10 },
            { ingredientId: '132', amountG: 20 },
            { ingredientId: '133', amountG: 50 },
            { ingredientId: '134', amountG: 10 },
            { ingredientId: '135', amountG: 5 },
            { ingredientId: '136', amountG: 5 },
            { ingredientId: '137', amountG: 10 },
            { ingredientId: '138', amountG: 20 },
        ],
    },
    {
        id: 'recipe_earl',
        name: 'アールグレイムース',
        basePortions: 1,
        ingredients: [
            { ingredientId: '139', amountG: 556 },
            { ingredientId: '140', amountG: 18 },
            { ingredientId: '141', amountG: 400 },
            { ingredientId: '142', amountG: 54 },
            { ingredientId: '143', amountG: 760 },
        ],
    },
    {
        id: 'recipe_hibiscus_center',
        name: 'ハイビスカスセンター',
        basePortions: 1,
        ingredients: [
            { ingredientId: '144', amountG: 336 },
            { ingredientId: '145', amountG: 12 },
            { ingredientId: '140', amountG: 10 },
            { ingredientId: '126', amountG: 50 },
            { ingredientId: '146', amountG: 50 },
        ],
    },
    {
        id: 'recipe_cheese_source',
        name: 'チーズソース',
        basePortions: 1,
        ingredients: [
            { ingredientId: '147', amountG: 220 },
            { ingredientId: '148', amountG: 292.6 },
            { ingredientId: '149', amountG: 72.6 },
            { ingredientId: '150', amountG: 4.62 },
        ],
    },
    {
        id: 'recipe_choc_comp',
        name: 'ショコラとグリオットチェリーのコンポジション',
        basePortions: 100,
        ingredients: [
            { ingredientId: '151', amountG: 52 },
            { ingredientId: '152', amountG: 22 },
            { ingredientId: '153', amountG: 7 },
            { ingredientId: '154', amountG: 4 },
            { ingredientId: '155', amountG: 15 },
            { ingredientId: '156', amountG: 3 },
            { ingredientId: '157', amountG: 2 },
        ],
    },
    {
        id: 'recipe_dessert1',
        name: 'デセールセット①',
        basePortions: 1,
        ingredients: [
            { ingredientId: '158', amountG: 1445 },
            { ingredientId: '1', amountG: 296 },
            { ingredientId: '144', amountG: 828 },
            { ingredientId: '159', amountG: 425 },
        ],
    },
    {
        id: 'recipe_dessert_kiji',
        name: 'デセールルセット① 生地',
        basePortions: 1,
        ingredients: [
            { ingredientId: '160', amountG: 159 },
            { ingredientId: '1', amountG: 106 },
            { ingredientId: '161', amountG: 79 },
            { ingredientId: '162', amountG: 13 },
            { ingredientId: '163', amountG: 26 },
            { ingredientId: '164', amountG: 12.5 },
        ],
    },
    {
        id: 'recipe_dessert_center',
        name: 'デセールルセット センター',
        basePortions: 1,
        ingredients: [
            { ingredientId: '165', amountG: 432 },
            { ingredientId: '166', amountG: 1000 },
            { ingredientId: '1', amountG: 260 },
            { ingredientId: '167', amountG: 13 },
        ],
    },
    {
        id: 'recipe_dessert3_mousse',
        name: 'デセールルセット③ チョコレートムース',
        basePortions: 1,
        ingredients: [
            { ingredientId: '168', amountG: 756 },
            { ingredientId: '169', amountG: 378 },
            { ingredientId: '164', amountG: 655 },
            { ingredientId: '170', amountG: 655 },
            { ingredientId: '171', amountG: 328 },
            { ingredientId: '1', amountG: 88 },
            { ingredientId: '170', amountG: 1424 },
            { ingredientId: '172', amountG: 38 },
        ],
    },
    {
        id: 'recipe_dessert_comp',
        name: 'デセールセット チェリーコンポート',
        basePortions: 1,
        ingredients: [
            { ingredientId: '173', amountG: 300 },
            { ingredientId: '1', amountG: 100 },
            { ingredientId: '144', amountG: 200 },
            { ingredientId: '174', amountG: 50 },
        ],
    },
    {
        id: 'recipe_dessert_choco_deco',
        name: 'デセールセット飾りチョコ',
        basePortions: 1,
        ingredients: [
            { ingredientId: '84', amountG: 50 },
            { ingredientId: '175', amountG: 100 },
            { ingredientId: '176', amountG: 35 },
            { ingredientId: '177', amountG: 10 },
        ],
    },
    {
        id: 'recipe_dessert_cherry_source',
        name: 'デセールセット チェリーソース',
        basePortions: 1,
        ingredients: [
            { ingredientId: '178', amountG: 64 },
            { ingredientId: '174', amountG: 256 },
            { ingredientId: '1', amountG: 32 },
            { ingredientId: '179', amountG: 3.2 },
            { ingredientId: '14', amountG: 160 },
        ],
    },
    {
        id: 'recipe_dessert_white_powder',
        name: 'デセールセット ホワイトチョコパウダー',
        basePortions: 1,
        ingredients: [
            { ingredientId: '175', amountG: 50 },
            { ingredientId: '83', amountG: 15 },
        ],
    },
    {
        id: 'recipe_dessert1_v2',
        name: 'デセールセット① (Ver.2)',
        basePortions: 1,
        ingredients: [
            { ingredientId: '180', amountG: 1000 },
            { ingredientId: '1', amountG: 400 },
            { ingredientId: '181', amountG: 100 },
            { ingredientId: '182', amountG: 50 },
            { ingredientId: '144', amountG: 2000 },
        ],
    },
    // --- ここから追加レシピ ---
    {
        id: 'mousse_peche_13',
        name: '￥13ムースペシェ',
        basePortions: 100,
        ingredients: [
            { ingredientId: '69', amountG: 400 }, // ホワイトピーチピューレ（ﾌﾙﾃｨｴ）
            { ingredientId: '68', amountG: 314 }, // ブラットピーチピューレ（ﾌﾙﾃｨｴ）
            { ingredientId: '140', amountG: 22.3 }, // 板ゼラチンゴールド
            { ingredientId: '8', amountG: 69 }, // 卵白
            { ingredientId: '1', amountG: 138 }, // グラニュー糖
            { ingredientId: '143', amountG: 543 }, // 35%
        ],
    },
    {
        id: 'aka_momo_sauce_13',
        name: '￥13赤桃ソース',
        basePortions: 100,
        ingredients: [
            { ingredientId: '68', amountG: 245 }, // ブラッドピーチピューレ（ﾌﾙﾃｨｴ）
            { ingredientId: '74', amountG: 70 }, // フランボワーズピューレ
            { ingredientId: '1', amountG: 13 }, // グラニュー糖
            { ingredientId: '12', amountG: 3.8 }, // ペクチン
        ],
    },
    {
        id: 'pingre_granite_13',
        name: '￥13ピングレグラニテ',
        basePortions: 100,
        ingredients: [
            { ingredientId: '186', amountG: 1000 }, // ピングレジュース（ｳｪﾙﾁ）
            { ingredientId: '1', amountG: 120 }, // グラニュー糖
            { ingredientId: '11', amountG: 20 }, // イナアガーF
            { ingredientId: '70', amountG: 20 }, // フランボワーズブリゼ
        ],
    },
    {
        id: 'matcha_mousse_19',
        name: '￥19抹茶ムース/ホテルパン1枚104名',
        basePortions: 104,
        ingredients: [
            { ingredientId: '141', amountG: 104 }, // 牛乳
            { ingredientId: '140', amountG: 13 }, // 板ゼラチンゴールド
            { ingredientId: '97', amountG: 15 }, // 抹茶パウダー
            { ingredientId: '19', amountG: 182 }, // キャラットホワイト
            { ingredientId: '143', amountG: 271 }, // 35%
        ],
    },
    {
        id: 'framboise_mousse_19',
        name: '￥19フランボワーズムース/ホテルパン1枚104名',
        basePortions: 104,
        ingredients: [
            { ingredientId: '74', amountG: 273 }, // フランボワーズピューレ
            { ingredientId: '1', amountG: 49 }, // グラニュー糖
            { ingredientId: '140', amountG: 14 }, // 板ゼラチンゴールド
            { ingredientId: '143', amountG: 238 }, // 35%
        ],
    },
    {
        id: 'apricot_mousse_19',
        name: '￥19アプリコットムース/ホテルパン1枚104名',
        basePortions: 104,
        ingredients: [
            { ingredientId: '98', amountG: 193 }, // アプリコットピューレ
            { ingredientId: '1', amountG: 65 }, // グラニュー糖
            { ingredientId: '140', amountG: 14 }, // 板ゼラチンゴールド
            { ingredientId: '143', amountG: 230 }, // 35%
            { ingredientId: '99', amountG: 74 }, // トックアプリコット
            { ingredientId: '20', amountG: 9 }, // プルコレモン
        ],
    },
    {
        id: 'azuki_mousse_19',
        name: '￥19小豆ムース/ホテルパン1枚104名',
        basePortions: 104,
        ingredients: [
            { ingredientId: '141', amountG: 166 }, // 牛乳
            { ingredientId: '1', amountG: 16 }, // グラニュー糖
            { ingredientId: '9', amountG: 32 }, // 卵黄
            { ingredientId: '140', amountG: 12 }, // 板ゼラチンゴールド
            { ingredientId: '143', amountG: 166 }, // 35%
            { ingredientId: '100', amountG: 190 }, // 粒餡
        ],
    },
    {
        id: 'strawberry_mousse_19',
        name: '￥19ストロベリームース/ホテルパン1枚104名',
        basePortions: 104,
        ingredients: [
            { ingredientId: '101', amountG: 242 }, // フレーズピューレ
            { ingredientId: '1', amountG: 35 }, // グラニュー糖
            { ingredientId: '140', amountG: 13 }, // 板ゼラチンゴールド
            { ingredientId: '143', amountG: 295 }, // 35%
        ],
    },
    // ...（続きのレシピも同様に追加可能）
];