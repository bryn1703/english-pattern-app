const lessonData = [
  {
    "day": 1,
    "title": "원하는 음식과 음료 말하기",
    "focus": "I want + 음식 또는 음료",
    "guide": "I want 뒤에 원하는 음식이나 음료를 넣어 말해 봅시다.",
    "sentences": [
      {
        "english": "I want some water.",
        "korean": "나는 물을 좀 원해요.",
        "distractors": []
      },
      {
        "english": "I want some juice.",
        "korean": "나는 주스를 좀 원해요.",
        "distractors": []
      },
      {
        "english": "I want an apple.",
        "korean": "나는 사과 한 개를 원해요.",
        "distractors": []
      }
    ]
  },
  {
    "day": 2,
    "title": "원하는 물건 말하기",
    "focus": "I want + 물건",
    "guide": "가지고 싶은 물건을 I want 뒤에 넣어 말해 봅시다.",
    "sentences": [
      {
        "english": "I want a new pencil.",
        "korean": "나는 새 연필을 원해요.",
        "distractors": []
      },
      {
        "english": "I want a blue backpack.",
        "korean": "나는 파란색 가방을 원해요.",
        "distractors": []
      },
      {
        "english": "I want that book.",
        "korean": "나는 저 책을 원해요.",
        "distractors": []
      }
    ]
  },
  {
    "day": 3,
    "title": "하고 싶은 활동 말하기",
    "focus": "I want to + 동사원형",
    "guide": "하고 싶은 활동을 말할 때 want 뒤에 to와 동사원형을 사용합니다.",
    "sentences": [
      {
        "english": "I want to read.",
        "korean": "나는 책을 읽고 싶어요.",
        "distractors": []
      },
      {
        "english": "I want to draw.",
        "korean": "나는 그림을 그리고 싶어요.",
        "distractors": []
      },
      {
        "english": "I want to swim.",
        "korean": "나는 수영하고 싶어요.",
        "distractors": []
      }
    ]
  },
  {
    "day": 4,
    "title": "활동의 대상 붙이기",
    "focus": "I want to + 활동 + 대상",
    "guide": "하고 싶은 활동 뒤에 그 활동의 대상을 붙여 봅시다.",
    "sentences": [
      {
        "english": "I want to read this book.",
        "korean": "나는 이 책을 읽고 싶어요.",
        "distractors": []
      },
      {
        "english": "I want to draw a cat.",
        "korean": "나는 고양이를 그리고 싶어요.",
        "distractors": []
      },
      {
        "english": "I want to play soccer.",
        "korean": "나는 축구를 하고 싶어요.",
        "distractors": []
      }
    ]
  },
  {
    "day": 5,
    "title": "가고 싶은 장소 말하기",
    "focus": "I want to go to + 장소",
    "guide": "가고 싶은 장소를 go to 뒤에 붙여 말해 봅시다.",
    "sentences": [
      {
        "english": "I want to go to the park.",
        "korean": "나는 공원에 가고 싶어요.",
        "distractors": []
      },
      {
        "english": "I want to go to the library.",
        "korean": "나는 도서관에 가고 싶어요.",
        "distractors": []
      },
      {
        "english": "I want to go to the beach.",
        "korean": "나는 해변에 가고 싶어요.",
        "distractors": []
      }
    ]
  },
  {
    "day": 6,
    "title": "함께하고 싶은 사람 말하기",
    "focus": "I want to + 활동 + with + 사람",
    "guide": "누구와 함께 활동하고 싶은지 말해 봅시다.",
    "sentences": [
      {
        "english": "I want to play with my friends.",
        "korean": "나는 친구들과 놀고 싶어요.",
        "distractors": []
      },
      {
        "english": "I want to cook with my dad.",
        "korean": "나는 아빠와 요리하고 싶어요.",
        "distractors": []
      },
      {
        "english": "I want to read with my mom.",
        "korean": "나는 엄마와 책을 읽고 싶어요.",
        "distractors": []
      }
    ]
  },
  {
    "day": 7,
    "title": "하고 싶은 시간 말하기",
    "focus": "I want to + 활동 + 시간",
    "guide": "언제 활동하고 싶은지 시간을 붙여 말해 봅시다.",
    "sentences": [
      {
        "english": "I want to play after school.",
        "korean": "나는 방과 후에 놀고 싶어요.",
        "distractors": []
      },
      {
        "english": "I want to read before bed.",
        "korean": "나는 자기 전에 책을 읽고 싶어요.",
        "distractors": []
      },
      {
        "english": "I want to swim this weekend.",
        "korean": "나는 이번 주말에 수영하고 싶어요.",
        "distractors": []
      }
    ]
  },
  {
    "day": 8,
    "title": "원하는 물건 질문하기",
    "focus": "Do you want + 명사?",
    "guide": "상대방이 무엇을 원하는지 Do you want를 사용해 물어봅시다.",
    "sentences": [
      {
        "english": "Do you want some water?",
        "korean": "너는 물을 좀 원하니?",
        "distractors": []
      },
      {
        "english": "Do you want an apple?",
        "korean": "너는 사과 한 개를 원하니?",
        "distractors": []
      },
      {
        "english": "Do you want this book?",
        "korean": "너는 이 책을 원하니?",
        "distractors": []
      }
    ]
  },
  {
    "day": 9,
    "title": "하고 싶은 활동 질문하기",
    "focus": "Do you want to + 동사원형?",
    "guide": "상대방이 무엇을 하고 싶은지 질문해 봅시다.",
    "sentences": [
      {
        "english": "Do you want to read?",
        "korean": "너는 책을 읽고 싶니?",
        "distractors": []
      },
      {
        "english": "Do you want to play soccer?",
        "korean": "너는 축구를 하고 싶니?",
        "distractors": []
      },
      {
        "english": "Do you want to go outside?",
        "korean": "너는 밖에 나가고 싶니?",
        "distractors": []
      }
    ]
  },
  {
    "day": 10,
    "title": "질문에 대답하기",
    "focus": "Yes, I do. / No, I don't.",
    "guide": "Do you want로 시작하는 질문에 긍정이나 부정으로 대답해 봅시다.",
    "sentences": [
      {
        "english": "Yes, I do.",
        "korean": "네, 그래요.",
        "distractors": []
      },
      {
        "english": "No, I don't.",
        "korean": "아니요, 그렇지 않아요.",
        "distractors": []
      },
      {
        "english": "Yes, I do. I want to play.",
        "korean": "네, 그래요. 나는 놀고 싶어요.",
        "distractors": []
      }
    ]
  },
  {
    "day": 11,
    "title": "원하지 않는 것 말하기",
    "focus": "I don't want + 명사",
    "guide": "원하지 않는 것을 I don't want 뒤에 넣어 말해 봅시다.",
    "sentences": [
      {
        "english": "I don't want milk.",
        "korean": "나는 우유를 원하지 않아요.",
        "distractors": []
      },
      {
        "english": "I don't want that book.",
        "korean": "나는 저 책을 원하지 않아요.",
        "distractors": []
      },
      {
        "english": "I don't want a new bag.",
        "korean": "나는 새 가방을 원하지 않아요.",
        "distractors": []
      }
    ]
  },
  {
    "day": 12,
    "title": "하고 싶지 않은 활동 말하기",
    "focus": "I don't want to + 동사원형",
    "guide": "하고 싶지 않은 활동을 don't want to 뒤에 넣어 봅시다.",
    "sentences": [
      {
        "english": "I don't want to run.",
        "korean": "나는 달리고 싶지 않아요.",
        "distractors": []
      },
      {
        "english": "I don't want to wait.",
        "korean": "나는 기다리고 싶지 않아요.",
        "distractors": []
      },
      {
        "english": "I don't want to go home.",
        "korean": "나는 집에 가고 싶지 않아요.",
        "distractors": []
      }
    ]
  },
  {
    "day": 13,
    "title": "주어 바꾸기",
    "focus": "I / You / We / They + want",
    "guide": "주어를 바꾸면서 want의 모양을 관찰해 봅시다.",
    "sentences": [
      {
        "english": "I want to read.",
        "korean": "나는 책을 읽고 싶어요.",
        "distractors": []
      },
      {
        "english": "We want to read.",
        "korean": "우리는 책을 읽고 싶어요.",
        "distractors": []
      },
      {
        "english": "They want to read.",
        "korean": "그들은 책을 읽고 싶어 해요.",
        "distractors": []
      }
    ]
  },
  {
    "day": 14,
    "title": "다른 사람이 원하는 것",
    "focus": "He / She / 이름 + wants",
    "guide": "한 사람을 주어로 사용하면 want가 wants로 바뀝니다.",
    "sentences": [
      {
        "english": "He wants some water.",
        "korean": "그는 물을 좀 원해요.",
        "distractors": []
      },
      {
        "english": "She wants to read.",
        "korean": "그녀는 책을 읽고 싶어 해요.",
        "distractors": []
      },
      {
        "english": "Mina wants to play soccer.",
        "korean": "미나는 축구를 하고 싶어 해요.",
        "distractors": []
      }
    ]
  },
  {
    "day": 15,
    "title": "다른 사람이 원하는지 질문하기",
    "focus": "Does + 사람 + want?",
    "guide": "Does로 질문하면 wants가 아니라 want를 사용합니다.",
    "sentences": [
      {
        "english": "Does he want some water?",
        "korean": "그는 물을 좀 원하나요?",
        "distractors": []
      },
      {
        "english": "Does she want to read?",
        "korean": "그녀는 책을 읽고 싶어 하나요?",
        "distractors": []
      },
      {
        "english": "Does Mina want to play soccer?",
        "korean": "미나는 축구를 하고 싶어 하나요?",
        "distractors": []
      }
    ]
  },
  {
    "day": 16,
    "title": "다른 사람의 부정문",
    "focus": "He / She + doesn't want",
    "guide": "Doesn't 뒤에는 wants가 아니라 want를 사용합니다.",
    "sentences": [
      {
        "english": "He doesn't want milk.",
        "korean": "그는 우유를 원하지 않아요.",
        "distractors": []
      },
      {
        "english": "She doesn't want to wait.",
        "korean": "그녀는 기다리고 싶어 하지 않아요.",
        "distractors": []
      },
      {
        "english": "Mina doesn't want to go home.",
        "korean": "미나는 집에 가고 싶어 하지 않아요.",
        "distractors": []
      }
    ]
  },
  {
    "day": 17,
    "title": "정말 원한다고 강조하기",
    "focus": "really + want / wants",
    "guide": "Really를 want 앞에 넣어 정말 원한다는 뜻을 나타냅니다.",
    "sentences": [
      {
        "english": "I really want some juice.",
        "korean": "나는 주스를 정말 원해요.",
        "distractors": []
      },
      {
        "english": "I really want to play.",
        "korean": "나는 정말 놀고 싶어요.",
        "distractors": []
      },
      {
        "english": "She really wants a new bike.",
        "korean": "그녀는 새 자전거를 정말 원해요.",
        "distractors": []
      }
    ]
  },
  {
    "day": 18,
    "title": "또 원하는 것 말하기",
    "focus": "also + want / wants",
    "guide": "Also를 사용하여 다른 것도 원한다고 말해 봅시다.",
    "sentences": [
      {
        "english": "I also want some water.",
        "korean": "나는 물도 좀 원해요.",
        "distractors": []
      },
      {
        "english": "I also want to draw.",
        "korean": "나는 그림도 그리고 싶어요.",
        "distractors": []
      },
      {
        "english": "She also wants to play.",
        "korean": "그녀는 놀기도 하고 싶어 해요.",
        "distractors": []
      }
    ]
  },
  {
    "day": 19,
    "title": "원하는 이유 말하기",
    "focus": "want + 내용 + because + 이유",
    "guide": "Because 뒤에 원하는 이유를 붙여 봅시다.",
    "sentences": [
      {
        "english": "I want some water because I am thirsty.",
        "korean": "나는 목이 말라서 물을 좀 원해요.",
        "distractors": []
      },
      {
        "english": "I want to go home because I am tired.",
        "korean": "나는 피곤해서 집에 가고 싶어요.",
        "distractors": []
      },
      {
        "english": "She wants to eat because she is hungry.",
        "korean": "그녀는 배가 고파서 먹고 싶어 해요.",
        "distractors": []
      }
    ]
  },
  {
    "day": 20,
    "title": "원하는 것을 연결하기",
    "focus": "and / but으로 문장 연결하기",
    "guide": "And와 but을 사용해 원하는 것과 원하지 않는 것을 연결합니다.",
    "sentences": [
      {
        "english": "I want apples and bananas.",
        "korean": "나는 사과와 바나나를 원해요.",
        "distractors": []
      },
      {
        "english": "I want juice, but I don't want milk.",
        "korean": "나는 주스를 원하지만 우유는 원하지 않아요.",
        "distractors": []
      },
      {
        "english": "She wants to play, but she has homework.",
        "korean": "그녀는 놀고 싶지만 숙제가 있어요.",
        "distractors": []
      }
    ]
  },
  {
    "day": 21,
    "title": "무엇을 원하는지 질문하기",
    "focus": "What do you want?",
    "guide": "What을 사용해 상대방이 무엇을 원하는지 물어봅시다.",
    "sentences": [
      {
        "english": "What do you want?",
        "korean": "너는 무엇을 원하니?",
        "distractors": []
      },
      {
        "english": "What do you want to eat?",
        "korean": "너는 무엇을 먹고 싶니?",
        "distractors": []
      },
      {
        "english": "What do you want to do?",
        "korean": "너는 무엇을 하고 싶니?",
        "distractors": []
      }
    ]
  },
  {
    "day": 22,
    "title": "다른 사람이 원하는 것 질문하기",
    "focus": "What does + 사람 + want?",
    "guide": "Does가 사용되므로 뒤에는 wants가 아니라 want가 옵니다.",
    "sentences": [
      {
        "english": "What does she want?",
        "korean": "그녀는 무엇을 원하나요?",
        "distractors": []
      },
      {
        "english": "What does he want to eat?",
        "korean": "그는 무엇을 먹고 싶어 하나요?",
        "distractors": []
      },
      {
        "english": "What does Mina want to draw?",
        "korean": "미나는 무엇을 그리고 싶어 하나요?",
        "distractors": []
      }
    ]
  },
  {
    "day": 23,
    "title": "어디에 가고 싶은지 질문하기",
    "focus": "Where do / does + 주어 + want to go?",
    "guide": "Where를 사용해 가고 싶은 장소를 물어봅시다.",
    "sentences": [
      {
        "english": "Where do you want to go?",
        "korean": "너는 어디에 가고 싶니?",
        "distractors": []
      },
      {
        "english": "Where does she want to go?",
        "korean": "그녀는 어디에 가고 싶어 하나요?",
        "distractors": []
      },
      {
        "english": "I want to go to the park.",
        "korean": "나는 공원에 가고 싶어요.",
        "distractors": []
      }
    ]
  },
  {
    "day": 24,
    "title": "누구와 언제 하고 싶은지 질문하기",
    "focus": "Who / When + do / does",
    "guide": "Who와 When을 사용해 함께할 사람이나 시간을 질문해 봅시다.",
    "sentences": [
      {
        "english": "Who do you want to play with?",
        "korean": "너는 누구와 놀고 싶니?",
        "distractors": []
      },
      {
        "english": "When do you want to go?",
        "korean": "너는 언제 가고 싶니?",
        "distractors": []
      },
      {
        "english": "Who does she want to sit with?",
        "korean": "그녀는 누구와 함께 앉고 싶어 하나요?",
        "distractors": []
      }
    ]
  },
  {
    "day": 25,
    "title": "정중하게 원하는 것 말하기",
    "focus": "would like + 명사 / would like to + 동사",
    "guide": "Would like를 사용하면 원하는 것을 더 정중하게 말할 수 있습니다.",
    "sentences": [
      {
        "english": "I would like some juice.",
        "korean": "주스를 좀 주세요.",
        "distractors": [
          "want",
          "wants",
          "wanted",
          "Do",
          "Does"
        ]
      },
      {
        "english": "I'd like to read this book.",
        "korean": "나는 이 책을 읽고 싶어요.",
        "distractors": [
          "I",
          "want",
          "wants",
          "liked",
          "reading"
        ]
      },
      {
        "english": "Would you like to play with me?",
        "korean": "나와 함께 놀고 싶니?",
        "distractors": [
          "Do",
          "Does",
          "Did",
          "want",
          "wants"
        ]
      }
    ]
  },
  {
    "day": 26,
    "title": "과거에 원했던 것 말하기",
    "focus": "주어 + wanted",
    "guide": "과거에 원했던 것을 말할 때 want를 wanted로 바꿉니다.",
    "sentences": [
      {
        "english": "I wanted a new bike.",
        "korean": "나는 새 자전거를 원했어요.",
        "distractors": []
      },
      {
        "english": "She wanted to go home.",
        "korean": "그녀는 집에 가고 싶어 했어요.",
        "distractors": []
      },
      {
        "english": "We wanted to play outside.",
        "korean": "우리는 밖에서 놀고 싶었어요.",
        "distractors": []
      }
    ]
  },
  {
    "day": 27,
    "title": "과거 질문과 부정 비교하기",
    "focus": "Did + 주어 + want? / 주어 + didn't want",
    "guide": "Did와 didn't 뒤에는 wanted가 아니라 동사원형 want를 사용합니다.",
    "sentences": [
      {
        "english": "Did you want some water?",
        "korean": "너는 물을 좀 원했니?",
        "distractors": [
          "Do",
          "Does",
          "wanted",
          "wants",
          "she",
          "didn't"
        ]
      },
      {
        "english": "I didn't want milk.",
        "korean": "나는 우유를 원하지 않았어요.",
        "distractors": [
          "don't",
          "doesn't",
          "wanted",
          "wants",
          "Did",
          "She"
        ]
      },
      {
        "english": "Did she want to play?",
        "korean": "그녀는 놀고 싶어 했나요?",
        "distractors": [
          "Do",
          "Does",
          "wants",
          "wanted",
          "I",
          "They"
        ]
      },
      {
        "english": "She didn't want to play.",
        "korean": "그녀는 놀고 싶어 하지 않았어요.",
        "distractors": [
          "don't",
          "doesn't",
          "wants",
          "wanted",
          "Did",
          "They"
        ]
      }
    ]
  },
  {
    "day": 28,
    "title": "복습 1: 주어와 현재형",
    "focus": "want / wants / does / doesn't",
    "guide": "한국어를 보고 주어에 맞는 동사와 조동사를 선택하세요.",
    "sentences": [
      {
        "english": "I want to read.",
        "korean": "나는 책을 읽고 싶어요.",
        "distractors": [
          "She",
          "We",
          "wants",
          "wanted",
          "Does",
          "reading"
        ]
      },
      {
        "english": "We want to read.",
        "korean": "우리는 책을 읽고 싶어요.",
        "distractors": [
          "I",
          "She",
          "wants",
          "wanted",
          "Does",
          "reads"
        ]
      },
      {
        "english": "She wants to read.",
        "korean": "그녀는 책을 읽고 싶어 해요.",
        "distractors": [
          "I",
          "They",
          "want",
          "wanted",
          "Does",
          "reading"
        ]
      },
      {
        "english": "Does she want to read?",
        "korean": "그녀는 책을 읽고 싶어 하나요?",
        "distractors": [
          "Do",
          "Did",
          "wants",
          "wanted",
          "I",
          "They"
        ]
      },
      {
        "english": "She doesn't want to read.",
        "korean": "그녀는 책을 읽고 싶어 하지 않아요.",
        "distractors": [
          "don't",
          "didn't",
          "wants",
          "wanted",
          "I",
          "They"
        ]
      }
    ]
  },
  {
    "day": 29,
    "title": "복습 2: 과거 질문과 부정",
    "focus": "wanted / did / didn't",
    "guide": "과거 긍정문, 질문, 부정문에 알맞은 형태를 선택하세요.",
    "sentences": [
      {
        "english": "I wanted to go home.",
        "korean": "나는 집에 가고 싶었어요.",
        "distractors": [
          "want",
          "wants",
          "didn't",
          "Does",
          "She",
          "going"
        ]
      },
      {
        "english": "Did you want to go home?",
        "korean": "너는 집에 가고 싶었니?",
        "distractors": [
          "Do",
          "Does",
          "wanted",
          "wants",
          "she",
          "didn't"
        ]
      },
      {
        "english": "I didn't want to go home.",
        "korean": "나는 집에 가고 싶지 않았어요.",
        "distractors": [
          "don't",
          "doesn't",
          "wanted",
          "wants",
          "Did",
          "She"
        ]
      },
      {
        "english": "Did she want the book?",
        "korean": "그녀는 그 책을 원했나요?",
        "distractors": [
          "Do",
          "Does",
          "wants",
          "wanted",
          "I",
          "They"
        ]
      },
      {
        "english": "She didn't want the book.",
        "korean": "그녀는 그 책을 원하지 않았어요.",
        "distractors": [
          "don't",
          "doesn't",
          "wants",
          "wanted",
          "Did",
          "They"
        ]
      }
    ]
  },
  {
    "day": 30,
    "title": "복습 3: 한 달 종합",
    "focus": "주어, 질문, 부정, 과거, 정중한 표현 종합",
    "guide": "지금까지 배운 내용을 섞어서 복습합니다. 필요한 영어 블록만 선택하세요.",
    "sentences": [
      {
        "english": "I really want to read this book.",
        "korean": "나는 이 책을 정말 읽고 싶어요.",
        "distractors": [
          "She",
          "wants",
          "wanted",
          "reading",
          "Does",
          "usually"
        ]
      },
      {
        "english": "She also wants to play outside.",
        "korean": "그녀는 밖에서 놀기도 하고 싶어 해요.",
        "distractors": [
          "I",
          "want",
          "wanted",
          "playing",
          "Do",
          "Did"
        ]
      },
      {
        "english": "Where do you want to go?",
        "korean": "너는 어디에 가고 싶니?",
        "distractors": [
          "What",
          "Who",
          "does",
          "did",
          "wants",
          "went"
        ]
      },
      {
        "english": "Does he want to play with us?",
        "korean": "그는 우리와 함께 놀고 싶어 하나요?",
        "distractors": [
          "Do",
          "Did",
          "wants",
          "wanted",
          "she",
          "playing"
        ]
      },
      {
        "english": "He doesn't want to play with us.",
        "korean": "그는 우리와 함께 놀고 싶어 하지 않아요.",
        "distractors": [
          "don't",
          "didn't",
          "wants",
          "wanted",
          "she",
          "playing"
        ]
      },
      {
        "english": "Did he want to go home?",
        "korean": "그는 집에 가고 싶어 했나요?",
        "distractors": [
          "Do",
          "Does",
          "wants",
          "wanted",
          "she",
          "went"
        ]
      },
      {
        "english": "He didn't want to go home.",
        "korean": "그는 집에 가고 싶어 하지 않았어요.",
        "distractors": [
          "don't",
          "doesn't",
          "wants",
          "wanted",
          "Did",
          "She"
        ]
      },
      {
        "english": "Would you like to play with me?",
        "korean": "나와 함께 놀고 싶니?",
        "distractors": [
          "Do",
          "Does",
          "Did",
          "want",
          "wants",
          "wanted"
        ]
      }
    ]
  }
];