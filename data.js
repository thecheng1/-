const GAME_DATA = {
    locations: [
        { id: 0, name: "高陞店", type: "start", description: "起點：老殘在濟南住的客店。", price: 0, rent: 0 },
        { id: 1, name: "芙蓉街", type: "property", description: "濟南著名的老街，泉水與美食匯聚。", price: 120, rent: 25 },
        { id: 2, name: "油旋鋪", type: "property", description: "酥脆可口的油旋，濟南特色小吃。", price: 100, rent: 20 },
        { id: 3, name: "小布政司街", type: "property", description: "熱鬧的街道，老殘在此覓得客店。", price: 140, rent: 28 },
        { id: 4, name: "命運", type: "chance", description: "命運", price: 0, rent: 0 },
        { id: 5, name: "珍珠泉", type: "view", description: "泉水如串串珍珠上湧，庭院深深。", price: 180, rent: 35 },
        { id: 6, name: "王府池子", type: "view", description: "濯纓泉，舊時王府院內清泉。", price: 160, rent: 30 },
        { id: 7, name: "鵲華橋", type: "property", description: "雇船的地方，通往歷下亭。", price: 150, rent: 30 },
        { id: 8, name: "甜沫鋪", type: "property", description: "鹹香適口的甜沫，最受歡迎的早餐。", price: 100, rent: 20 },
        { id: 9, name: "歷下亭", type: "property", description: "古亭，懸掛杜甫對聯。", price: 220, rent: 50, special: "歷下此亭古，濟南名士多" },
        { id: 10, name: "機會", type: "chance", description: "機會", price: 0, rent: 0 },
        { id: 11, name: "鐵公祠", type: "property", description: "紀念鐵鉉的祠堂。", price: 240, rent: 60, special: "四面荷花三面柳，一城山色半城湖" },
        { id: 12, name: "古玩店", type: "property", description: "雅致的店鋪，陳列著金石字畫。", price: 200, rent: 40 },
        { id: 13, name: "千佛山", type: "view", description: "遠眺千佛山，梵宇僧樓。", price: 200, rent: 40 },
        { id: 14, name: "黑虎泉", type: "view", description: "水聲喧騰，如虎嘯風生。", price: 210, rent: 45 },
        { id: 15, name: "古水仙祠", type: "property", description: "祠前有破匾，對聯雅致。", price: 180, rent: 35, special: "一盞寒泉薦秋菊，三更畫舫穿藕花" },
        { id: 16, name: "大明湖", type: "property", description: "湖光山色，美不勝收。", price: 300, rent: 80 },
        { id: 17, name: "文廟", type: "view", description: "祭祀孔子之地，莊嚴肅穆。", price: 260, rent: 55 }
    ],
    questions: [
        { q: "「歷下此亭古，濟南名士多」這副對聯是誰寫的？", options: ["杜工部(杜甫)", "何紹基", "鐵鉉", "老殘"], answer: 1, explanation: "上聯寫著'杜工部句'，但下聯寫著'道州何紹基書'，整副字是何紹基寫的。" },
        { q: "鐵公祠祭祀的是明初哪位忠義之士？", options: ["岳飛", "文天祥", "鐵鉉", "史可法"], answer: 2, explanation: "文中提到：'你道鐵公是誰？就是明初與燕王為難的那個鐵鉉。'" },
        { q: "文中形容大明湖的蘆葦在斜陽下好似什麼？", options: ["一塊碧玉", "一條粉紅絨毯", "一道金光", "一片雪白"], answer: 1, explanation: "文中寫道：'一片白花映著帶水氣的斜陽，好似一條粉紅絨毯'。" },
        { q: "「一盞寒泉薦秋菊，三更畫舫穿藕花」是在哪裡的對聯？", options: ["歷下亭", "鐵公祠", "古水仙祠", "高陞店"], answer: 2, explanation: "這是古水仙祠前的舊對聯。" },
        { q: "老殘在遊湖時聽到的聲音除了漁唱，還有什麼？", options: ["鳥鳴", "雷聲", "船擦荷葉聲", "琴聲"], answer: 2, explanation: "文中提到：'那荷葉初枯，擦的船嗤嗤價響'。" },
        { q: "「四面荷花三面柳」的下聯是？", options: ["一城山色半城湖", "濟南名士多", "三更畫舫穿藕花", "半城山色一城湖"], answer: 0, explanation: "這是鐵公祠的著名對聯。" },
        { q: "老殘遊記的作者是誰？", options: ["劉鶚", "曹雪芹", "魯迅", "吳敬梓"], answer: 0, explanation: "老殘遊記為清末劉鶚(字鐵雲)所著。" },
        { q: "文中描述千佛山的倒影在湖中顯得如何？", options: ["模模糊糊", "極其清楚", "隨波逐流", "看不見"], answer: 1, explanation: "文中寫道：'彷彿有一張水墨畫卷...極其清楚'。" },
        { q: "老殘到達濟南府時，覺得這裡的人家怎麼樣？", options: ["窮困潦倒", "家家泉水，戶戶垂楊", "喧鬧吵雜", "破敗不堪"], answer: 1, explanation: "文中形容濟南風景：'家家泉水，戶戶垂楊'。" },
        { q: "文中提到「梵宇僧樓」是指哪裡的建築？", options: ["歷下亭", "千佛山", "鐵公祠", "古水仙祠"], answer: 1, explanation: "這是形容千佛山上的寺廟建築。" },
        { q: "老殘僱的是什麼船遊湖？", options: ["大畫舫", "小舢板", "烏篷船", "竹筏"], answer: 1, explanation: "文中提到老殘僱了一隻小舢板。" },
        { q: "文中描述哪種花正在盛開或剛過花期？", options: ["荷花", "菊花", "梅花", "牡丹"], answer: 0, explanation: "文中多次描寫荷花(蓮花)和荷葉的景色。" }
    ],
    chanceCards: [
        { text: "在路邊攤吃了美味的油旋，精神百倍！", effect: "money", value: 50 },
        { text: "船被厚厚的荷葉夾住，動彈不得。", effect: "skip_turn", value: 1 },
        { text: "欣賞千佛山在湖中的倒影，心情大好。", effect: "money", value: 30 },
        { text: "在芙蓉街偶遇濟南名士，相談甚歡。", effect: "money", value: 100 },
        { text: "歷下亭油漆剝蝕，捐款修繕亭子。", effect: "money", value: -40 },
        { text: "被驚起的水鳥嚇了一跳，掉了一個銅板。", effect: "money", value: -20 },
        { text: "品嚐了甜沫，暖胃又暖心。", effect: "money", value: 40 },
        { text: "在小布政司街買了一些土產。", effect: "money", value: -30 }
    ],
    destinyCards: [
        { text: "秋山紅葉，景色宜人，獲得一次擲骰機會。", effect: "roll_again", value: 0 },
        { text: "客店客滿，只好多付房錢。", effect: "money", value: -50 },
        { text: "在古玩店發現古人墨寶，價值連城！", effect: "money", value: 300 },
        { text: "天色已晚，回高陞店休息。", effect: "teleport", value: 0 },
        { text: "參觀文廟，獲得智慧啟發。", effect: "money", value: 80 },
        { text: "突然下起大雨，在古水仙祠躲雨。", effect: "stop", value: 1 }
    ]
};
