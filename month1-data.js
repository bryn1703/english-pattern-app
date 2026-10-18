const lessonData = [
  {
    "day": 1,
    "title": "좋아하는 음식 말하기",
    "focus": "I like + 음식",
    "guide": "I like 뒤에 좋아하는 음식을 넣어 말해 봅시다.",
    "sentences": [
      {
        "english": "I like apples.",
        "korean": "나는 사과를 좋아해요.",
        "distractors": []
      },
      {
        "english": "I like pizza.",
        "korean": "나는 피자를 좋아해요.",
        "distractors": []
      },
      {
        "english": "I like strawberries.",
        "korean": "나는 딸기를 좋아해요.",
        "distractors": []
      }
    ]
  },
  {
    "day": 2,
    "title": "좋아하는 대상 말하기",
    "focus": "I like + 사물 또는 동물",
    "guide": "음식뿐 아니라 좋아하는 동물이나 사물을 넣어 봅시다.",
    "sentences": [
      {
        "english": "I like cats.",
        "korean": "나는 고양이를 좋아해요.",
        "distractors": []
      },
      {
        "english": "I like dogs.",
        "korean": "나는 강아지를 좋아해요.",
        "distractors": []
      },
      {
        "english": "I like music.",
        "korean": "나는 음악을 좋아해요.",
        "distractors": []
      }
    ]
  },
  {
    "day": 3,
    "title": "좋아하는 활동 말하기",
    "focus": "I like + 동사-ing",
    "guide": "좋아하는 활동을 -ing 형태로 넣어 말해 봅시다.",
    "sentences": [
      {
        "english": "I like reading.",
        "korean": "나는 책 읽는 것을 좋아해요.",
        "distractors": []
      },
      {
        "english": "I like drawing.",
        "korean": "나는 그림 그리는 것을 좋아해요.",
        "distractors": []
      },
      {
        "english": "I like swimming.",
        "korean": "나는 수영하는 것을 좋아해요.",
        "distractors": []
      }
    ]
  },
  {
    "day": 4,
    "title": "활동의 대상 붙이기",
    "focus": "I like + 활동 + 대상",
    "guide": "좋아하는 활동 뒤에 그 활동의 대상을 붙여 봅시다.",
    "sentences": [
      {
        "english": "I like reading books.",
        "korean": "나는 책 읽는 것을 좋아해요.",
        "distractors": []
      },
      {
        "english": "I like drawing animals.",
        "korean": "나는 동물 그리는 것을 좋아해요.",
        "distractors": []
      },
      {
        "english": "I like watching cartoons.",
        "korean": "나는 만화 보는 것을 좋아해요.",
        "distractors": []
      }
    ]
  },
  {
    "day": 5,
    "title": "장소 붙이기",
    "focus": "I like + 활동 + 장소",
    "guide": "좋아하는 활동을 어디에서 하는지 말해 봅시다.",
    "sentences": [
      {
        "english": "I like reading at home.",
        "korean": "나는 집에서 책 읽는 것을 좋아해요.",
        "distractors": []
      },
      {
        "english": "I like drawing in my room.",
        "korean": "나는 내 방에서 그림 그리는 것을 좋아해요.",
        "distractors": []
      },
      {
        "english": "I like playing soccer at school.",
        "korean": "나는 학교에서 축구하는 것을 좋아해요.",
        "distractors": []
      }
    ]
  },
  {
    "day": 6,
    "title": "함께하는 사람 붙이기",
    "focus": "I like + 활동 + with + 사람",
    "guide": "누구와 함께 활동하는 것을 좋아하는지 말해 봅시다.",
    "sentences": [
      {
        "english": "I like reading with my mom.",
        "korean": "나는 엄마와 책 읽는 것을 좋아해요.",
        "distractors": []
      },
      {
        "english": "I like cooking with my dad.",
        "korean": "나는 아빠와 요리하는 것을 좋아해요.",
        "distractors": []
      },
      {
        "english": "I like playing with my friends.",
        "korean": "나는 친구들과 노는 것을 좋아해요.",
        "distractors": []
      }
    ]
  },
  {
    "day": 7,
    "title": "시간 붙이기",
    "focus": "I like + 활동 + 시간",
    "guide": "좋아하는 활동을 언제 하는지 말해 봅시다.",
    "sentences": [
      {
        "english": "I like reading after school.",
        "korean": "나는 방과 후에 책 읽는 것을 좋아해요.",
        "distractors": []
      },
      {
        "english": "I like swimming in the morning.",
        "korean": "나는 아침에 수영하는 것을 좋아해요.",
        "distractors": []
      },
      {
        "english": "I like watching movies on weekends.",
        "korean": "나는 주말에 영화 보는 것을 좋아해요.",
        "distractors": []
      }
    ]
  },
  {
    "day": 8,
    "title": "좋아하는지 질문하기",
    "focus": "Do you like + 대상 또는 활동?",
    "guide": "Do you like를 사용해 상대방에게 질문해 봅시다.",
    "sentences": [
      {
        "english": "Do you like apples?",
        "korean": "너는 사과를 좋아하니?",
        "distractors": []
      },
      {
        "english": "Do you like reading?",
        "korean": "너는 책 읽는 것을 좋아하니?",
        "distractors": []
      },
      {
        "english": "Do you like playing soccer?",
        "korean": "너는 축구하는 것을 좋아하니?",
        "distractors": []
      }
    ]
  },
  {
    "day": 9,
    "title": "질문에 대답하기",
    "focus": "Yes, I do. / No, I don't.",
    "guide": "좋아하는지 묻는 질문에 긍정이나 부정으로 답해 봅시다.",
    "sentences": [
      {
        "english": "Yes, I do.",
        "korean": "네, 좋아해요.",
        "distractors": []
      },
      {
        "english": "No, I don't.",
        "korean": "아니요, 좋아하지 않아요.",
        "distractors": []
      },
      {
        "english": "Yes, I do. I like reading.",
        "korean": "네, 좋아해요. 나는 책 읽는 것을 좋아해요.",
        "distractors": []
      }
    ]
  },
  {
    "day": 10,
    "title": "좋아하지 않는 것 말하기",
    "focus": "I don't like + 대상 또는 활동",
    "guide": "I don't like를 사용해 좋아하지 않는 것을 말해 봅시다.",
    "sentences": [
      {
        "english": "I don't like spiders.",
        "korean": "나는 거미를 좋아하지 않아요.",
        "distractors": []
      },
      {
        "english": "I don't like running.",
        "korean": "나는 달리는 것을 좋아하지 않아요.",
        "distractors": []
      },
      {
        "english": "I don't like getting up early.",
        "korean": "나는 일찍 일어나는 것을 좋아하지 않아요.",
        "distractors": []
      }
    ]
  },
  {
    "day": 11,
    "title": "주어 바꾸기",
    "focus": "I / You / We / They + like",
    "guide": "주어를 바꾸면서 like의 형태를 관찰해 봅시다.",
    "sentences": [
      {
        "english": "I like reading.",
        "korean": "나는 책 읽는 것을 좋아해요.",
        "distractors": []
      },
      {
        "english": "We like reading.",
        "korean": "우리는 책 읽는 것을 좋아해요.",
        "distractors": []
      },
      {
        "english": "They like reading.",
        "korean": "그들은 책 읽는 것을 좋아해요.",
        "distractors": []
      }
    ]
  },
  {
    "day": 12,
    "title": "다른 사람이 좋아하는 것",
    "focus": "He / She / 이름 + likes",
    "guide": "한 사람을 주어로 사용하면 like가 likes로 바뀝니다.",
    "sentences": [
      {
        "english": "He likes soccer.",
        "korean": "그는 축구를 좋아해요.",
        "distractors": []
      },
      {
        "english": "She likes reading.",
        "korean": "그녀는 책 읽는 것을 좋아해요.",
        "distractors": []
      },
      {
        "english": "Mina likes drawing.",
        "korean": "미나는 그림 그리는 것을 좋아해요.",
        "distractors": []
      }
    ]
  },
  {
    "day": 13,
    "title": "다른 사람에게 질문하기",
    "focus": "Does + he / she / 이름 + like?",
    "guide": "Does가 앞에 나오면 likes가 아니라 like를 사용합니다.",
    "sentences": [
      {
        "english": "Does he like soccer?",
        "korean": "그는 축구를 좋아하나요?",
        "distractors": []
      },
      {
        "english": "Does she like reading?",
        "korean": "그녀는 책 읽는 것을 좋아하나요?",
        "distractors": []
      },
      {
        "english": "Does Mina like drawing?",
        "korean": "미나는 그림 그리는 것을 좋아하나요?",
        "distractors": []
      }
    ]
  },
  {
    "day": 14,
    "title": "다른 사람의 부정문",
    "focus": "He / She + doesn't like",
    "guide": "Doesn't 뒤에서도 likes가 아니라 like를 사용합니다.",
    "sentences": [
      {
        "english": "He doesn't like spiders.",
        "korean": "그는 거미를 좋아하지 않아요.",
        "distractors": []
      },
      {
        "english": "She doesn't like running.",
        "korean": "그녀는 달리는 것을 좋아하지 않아요.",
        "distractors": []
      },
      {
        "english": "Mina doesn't like swimming.",
        "korean": "미나는 수영하는 것을 좋아하지 않아요.",
        "distractors": []
      }
    ]
  },
  {
    "day": 15,
    "title": "정말 좋아한다고 강조하기",
    "focus": "주어 + really + like / likes",
    "guide": "Really를 like 앞에 넣어 정말 좋아한다는 뜻을 나타냅니다.",
    "sentences": [
      {
        "english": "I really like reading.",
        "korean": "나는 책 읽는 것을 정말 좋아해요.",
        "distractors": []
      },
      {
        "english": "I really like this song.",
        "korean": "나는 이 노래를 정말 좋아해요.",
        "distractors": []
      },
      {
        "english": "She really likes animals.",
        "korean": "그녀는 동물을 정말 좋아해요.",
        "distractors": []
      }
    ]
  },
  {
    "day": 16,
    "title": "또 좋아하는 것 말하기",
    "focus": "주어 + also + like / likes",
    "guide": "Also를 사용해 다른 것도 좋아한다고 말해 봅시다.",
    "sentences": [
      {
        "english": "I also like drawing.",
        "korean": "나는 그림 그리는 것도 좋아해요.",
        "distractors": []
      },
      {
        "english": "She also likes music.",
        "korean": "그녀는 음악도 좋아해요.",
        "distractors": []
      },
      {
        "english": "We also like playing outside.",
        "korean": "우리는 밖에서 노는 것도 좋아해요.",
        "distractors": []
      }
    ]
  },
  {
    "day": 17,
    "title": "좋아하는 이유 말하기",
    "focus": "I like + 대상 + because + 이유",
    "guide": "Because 뒤에 좋아하는 이유를 붙여 봅시다.",
    "sentences": [
      {
        "english": "I like reading because it is fun.",
        "korean": "나는 재미있어서 책 읽는 것을 좋아해요.",
        "distractors": []
      },
      {
        "english": "I like swimming because it is exciting.",
        "korean": "나는 신나서 수영하는 것을 좋아해요.",
        "distractors": []
      },
      {
        "english": "She likes music because it is relaxing.",
        "korean": "그녀는 편안한 느낌을 주어서 음악을 좋아해요.",
        "distractors": []
      }
    ]
  },
  {
    "day": 18,
    "title": "좋아하는 것과 싫어하는 것",
    "focus": "like + 대상, but + don't like + 대상",
    "guide": "But을 사용해 좋아하는 것과 좋아하지 않는 것을 연결합니다.",
    "sentences": [
      {
        "english": "I like cats, but I don't like spiders.",
        "korean": "나는 고양이를 좋아하지만 거미는 좋아하지 않아요.",
        "distractors": []
      },
      {
        "english": "He likes soccer, but he doesn't like baseball.",
        "korean": "그는 축구를 좋아하지만 야구는 좋아하지 않아요.",
        "distractors": []
      },
      {
        "english": "We like reading, but we don't like writing.",
        "korean": "우리는 읽기를 좋아하지만 쓰기는 좋아하지 않아요.",
        "distractors": []
      }
    ]
  },
  {
    "day": 19,
    "title": "두 가지를 함께 좋아하기",
    "focus": "like + A + and + B",
    "guide": "And를 사용해 좋아하는 두 가지를 연결해 봅시다.",
    "sentences": [
      {
        "english": "I like reading and drawing.",
        "korean": "나는 책 읽기와 그림 그리기를 좋아해요.",
        "distractors": []
      },
      {
        "english": "She likes singing and dancing.",
        "korean": "그녀는 노래와 춤을 좋아해요.",
        "distractors": []
      },
      {
        "english": "They like apples and bananas.",
        "korean": "그들은 사과와 바나나를 좋아해요.",
        "distractors": []
      }
    ]
  },
  {
    "day": 20,
    "title": "둘 중 더 좋아하는 것",
    "focus": "like + A + better than + B",
    "guide": "Better than을 사용해 둘 중 무엇을 더 좋아하는지 말합니다.",
    "sentences": [
      {
        "english": "I like cats better than dogs.",
        "korean": "나는 개보다 고양이를 더 좋아해요.",
        "distractors": []
      },
      {
        "english": "She likes reading better than writing.",
        "korean": "그녀는 쓰기보다 읽기를 더 좋아해요.",
        "distractors": []
      },
      {
        "english": "Do you like summer better than winter?",
        "korean": "너는 겨울보다 여름을 더 좋아하니?",
        "distractors": []
      }
    ]
  },
  {
    "day": 21,
    "title": "무엇을 좋아하는지 질문하기",
    "focus": "What do you like?",
    "guide": "What을 사용해 상대방이 좋아하는 것을 물어봅시다.",
    "sentences": [
      {
        "english": "What do you like?",
        "korean": "너는 무엇을 좋아하니?",
        "distractors": []
      },
      {
        "english": "What food do you like?",
        "korean": "너는 어떤 음식을 좋아하니?",
        "distractors": []
      },
      {
        "english": "What do you like doing after school?",
        "korean": "너는 방과 후에 무엇을 하는 것을 좋아하니?",
        "distractors": []
      }
    ]
  },
  {
    "day": 22,
    "title": "다른 사람의 취향 질문하기",
    "focus": "What does + 사람 + like?",
    "guide": "Does를 사용하면 뒤에는 likes가 아닌 like가 옵니다.",
    "sentences": [
      {
        "english": "What does she like?",
        "korean": "그녀는 무엇을 좋아하나요?",
        "distractors": []
      },
      {
        "english": "What sport does he like?",
        "korean": "그는 어떤 운동을 좋아하나요?",
        "distractors": []
      },
      {
        "english": "What does Mina like doing?",
        "korean": "미나는 무엇을 하는 것을 좋아하나요?",
        "distractors": []
      }
    ]
  },
  {
    "day": 23,
    "title": "활동의 빈도 말하기",
    "focus": "always / usually / sometimes + 일반동사",
    "guide": "얼마나 자주 활동하는지 말할 때 빈도부사를 일반동사 앞에 놓습니다.",
    "sentences": [
      {
        "english": "I always read before bed.",
        "korean": "나는 항상 자기 전에 책을 읽어요.",
        "distractors": []
      },
      {
        "english": "I usually play soccer after school.",
        "korean": "나는 보통 방과 후에 축구를 해요.",
        "distractors": []
      },
      {
        "english": "I sometimes draw with my sister.",
        "korean": "나는 가끔 여동생과 그림을 그려요.",
        "distractors": []
      }
    ]
  },
  {
    "day": 24,
    "title": "다양한 빈도부사 사용하기",
    "focus": "often / rarely / never + 일반동사",
    "guide": "Often, rarely, never를 사용해 활동의 빈도를 표현합니다.",
    "sentences": [
      {
        "english": "I often listen to music.",
        "korean": "나는 자주 음악을 들어요.",
        "distractors": []
      },
      {
        "english": "I rarely watch TV.",
        "korean": "나는 텔레비전을 거의 보지 않아요.",
        "distractors": []
      },
      {
        "english": "I never play games before school.",
        "korean": "나는 학교에 가기 전에 절대 게임을 하지 않아요.",
        "distractors": []
      }
    ]
  },
  {
    "day": 25,
    "title": "얼마나 자주 하는지 질문하기",
    "focus": "How often do / does + 주어 + 동사?",
    "guide": "How often을 사용해 활동을 얼마나 자주 하는지 물어봅시다.",
    "sentences": [
      {
        "english": "How often do you read?",
        "korean": "너는 얼마나 자주 책을 읽니?",
        "distractors": []
      },
      {
        "english": "How often do you play soccer?",
        "korean": "너는 얼마나 자주 축구를 하니?",
        "distractors": []
      },
      {
        "english": "How often does she draw?",
        "korean": "그녀는 얼마나 자주 그림을 그리나요?",
        "distractors": []
      }
    ]
  },
  {
    "day": 26,
    "title": "과거에 좋아했던 것",
    "focus": "주어 + liked + 대상",
    "guide": "과거에 좋아했던 것을 말할 때 like를 liked로 바꿉니다.",
    "sentences": [
      {
        "english": "I liked the movie.",
        "korean": "나는 그 영화를 좋아했어요.",
        "distractors": []
      },
      {
        "english": "I liked reading this book.",
        "korean": "나는 이 책을 읽는 것이 좋았어요.",
        "distractors": []
      },
      {
        "english": "She liked the school lunch.",
        "korean": "그녀는 학교 급식을 좋아했어요.",
        "distractors": []
      }
    ]
  },
  {
    "day": 27,
    "title": "과거 질문과 부정 비교하기",
    "focus": "Did + 주어 + like? / 주어 + didn't like",
    "guide": "Did와 didn't 뒤에는 liked가 아니라 동사원형 like를 사용합니다.",
    "sentences": [
      {
        "english": "Did you like the movie?",
        "korean": "너는 그 영화를 좋아했니?",
        "distractors": [
          "Do",
          "Does",
          "liked",
          "likes",
          "she",
          "didn't"
        ]
      },
      {
        "english": "I didn't like the movie.",
        "korean": "나는 그 영화를 좋아하지 않았어요.",
        "distractors": [
          "don't",
          "doesn't",
          "liked",
          "likes",
          "Did",
          "She"
        ]
      },
      {
        "english": "Did she like the book?",
        "korean": "그녀는 그 책을 좋아했나요?",
        "distractors": [
          "Do",
          "Does",
          "likes",
          "liked",
          "I",
          "They"
        ]
      },
      {
        "english": "She didn't like the book.",
        "korean": "그녀는 그 책을 좋아하지 않았어요.",
        "distractors": [
          "don't",
          "doesn't",
          "likes",
          "liked",
          "Did",
          "They"
        ]
      }
    ]
  },
  {
    "day": 28,
    "title": "복습 1: 주어와 현재형",
    "focus": "I like / She likes / Does she like?",
    "guide": "한국어를 보고 주어와 동사 형태에 맞는 블록을 고르세요. 복습일에는 영어 문장이 자동으로 가려집니다.",
    "sentences": [
      {
        "english": "I like reading.",
        "korean": "나는 책 읽는 것을 좋아해요.",
        "distractors": [
          "She",
          "We",
          "likes",
          "liked",
          "do",
          "does"
        ]
      },
      {
        "english": "We like reading.",
        "korean": "우리는 책 읽는 것을 좋아해요.",
        "distractors": [
          "I",
          "She",
          "likes",
          "liked",
          "does",
          "did"
        ]
      },
      {
        "english": "She likes reading.",
        "korean": "그녀는 책 읽는 것을 좋아해요.",
        "distractors": [
          "I",
          "They",
          "like",
          "liked",
          "Does",
          "Do"
        ]
      },
      {
        "english": "Does she like reading?",
        "korean": "그녀는 책 읽는 것을 좋아하나요?",
        "distractors": [
          "Do",
          "Did",
          "likes",
          "liked",
          "I",
          "They"
        ]
      },
      {
        "english": "She doesn't like reading.",
        "korean": "그녀는 책 읽는 것을 좋아하지 않아요.",
        "distractors": [
          "don't",
          "didn't",
          "likes",
          "liked",
          "I",
          "They"
        ]
      }
    ]
  },
  {
    "day": 29,
    "title": "복습 2: 과거 질문과 부정",
    "focus": "Did + 주어 + like? / 주어 + didn't like",
    "guide": "과거의 질문에는 Did를, 과거의 부정에는 didn't를 사용합니다. 두 표현 뒤에는 모두 like를 사용합니다.",
    "sentences": [
      {
        "english": "Did she like the movie?",
        "korean": "그녀는 그 영화를 좋아했나요?",
        "distractors": [
          "Do",
          "Does",
          "liked",
          "likes",
          "I",
          "They",
          "didn't"
        ]
      },
      {
        "english": "She didn't like the movie.",
        "korean": "그녀는 그 영화를 좋아하지 않았어요.",
        "distractors": [
          "don't",
          "doesn't",
          "liked",
          "likes",
          "Did",
          "I",
          "They"
        ]
      },
      {
        "english": "Did they like the game?",
        "korean": "그들은 그 게임을 좋아했나요?",
        "distractors": [
          "Do",
          "Does",
          "likes",
          "liked",
          "she",
          "we",
          "didn't"
        ]
      },
      {
        "english": "They didn't like the game.",
        "korean": "그들은 그 게임을 좋아하지 않았어요.",
        "distractors": [
          "don't",
          "doesn't",
          "likes",
          "liked",
          "Did",
          "She",
          "We"
        ]
      },
      {
        "english": "I liked the book.",
        "korean": "나는 그 책을 좋아했어요.",
        "distractors": [
          "like",
          "likes",
          "didn't",
          "Does",
          "She",
          "We"
        ]
      }
    ]
  },
  {
    "day": 30,
    "title": "복습 3: 한 달 종합",
    "focus": "주어, 강조, 빈도, 질문, 부정, 과거 종합",
    "guide": "지금까지 배운 내용을 섞어서 복습합니다. 한국어를 읽고 필요한 영어 블록만 선택하세요.",
    "sentences": [
      {
        "english": "I really like reading at home.",
        "korean": "나는 집에서 책 읽는 것을 정말 좋아해요.",
        "distractors": [
          "She",
          "likes",
          "liked",
          "usually",
          "in",
          "school",
          "Does"
        ]
      },
      {
        "english": "She usually reads after school.",
        "korean": "그녀는 보통 방과 후에 책을 읽어요.",
        "distractors": [
          "I",
          "read",
          "reading",
          "always",
          "before",
          "Does",
          "did"
        ]
      },
      {
        "english": "How often do you play soccer?",
        "korean": "너는 얼마나 자주 축구를 하니?",
        "distractors": [
          "does",
          "did",
          "she",
          "plays",
          "played",
          "What",
          "Where"
        ]
      },
      {
        "english": "Does he like playing soccer?",
        "korean": "그는 축구하는 것을 좋아하나요?",
        "distractors": [
          "Do",
          "Did",
          "likes",
          "liked",
          "she",
          "I",
          "play"
        ]
      },
      {
        "english": "He doesn't like playing soccer.",
        "korean": "그는 축구하는 것을 좋아하지 않아요.",
        "distractors": [
          "don't",
          "didn't",
          "likes",
          "liked",
          "she",
          "They",
          "play"
        ]
      },
      {
        "english": "Did he like the movie?",
        "korean": "그는 그 영화를 좋아했나요?",
        "distractors": [
          "Do",
          "Does",
          "likes",
          "liked",
          "she",
          "They",
          "didn't"
        ]
      },
      {
        "english": "He didn't like the movie.",
        "korean": "그는 그 영화를 좋아하지 않았어요.",
        "distractors": [
          "don't",
          "doesn't",
          "likes",
          "liked",
          "Did",
          "She",
          "They"
        ]
      },
      {
        "english": "I liked swimming before, but I don't like it now.",
        "korean": "나는 전에는 수영을 좋아했지만 지금은 좋아하지 않아요.",
        "distractors": [
          "like",
          "likes",
          "doesn't",
          "didn't",
          "after",
          "and",
          "She"
        ]
      }
    ]
  }
];