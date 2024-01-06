// https://youtu.be/1lNy2mhvLFk?si=mHFGJ5_cgaY6h8gy
import BLOCKS from "./block.js"

const playGroundUl = document.querySelector(".playGround > ul");
const gameTxt = document.querySelector(".gameTxt");
const scoreDisplay = document.querySelector(".score");
const 다시시작버튼 = document.querySelector(".gameTxt > button");

// 변수
const GAME_ROWS = 20; //세로 20
const GAME_COLS = 10; //가로 10

let score = 0;
let 하강시간 = 500;
let 하강인터벌;
let tempMovingItem;


const movingItem = {
  type: "",
  direction: 0,
  top: 0,
  left: 0,
};

// 함수
init();

function init() {
  tempMovingItem = { ...movingItem };
  for (let i = 0; i < GAME_ROWS; i++) {
    라인추가();
  }
  새블록제작();
}

function 라인추가() {
  const li = document.createElement("li");
  const ul = document.createElement("ul");
  for (let j = 0; j < GAME_COLS; j++) {
    const matrix = document.createElement("li");
    ul.prepend(matrix);
  }
  li.prepend(ul);
  playGroundUl.prepend(li);
}

function 블록제작(방향="") {
  const { type, direction, top, left } = tempMovingItem;
  document.querySelectorAll(".moving").forEach((m) => {
    m.classList.remove(type, "moving");
  });

  BLOCKS[type][direction].some((block) => {
    const x = block[0] + left;
    const y = block[1] + top;
    const target = playGroundUl.childNodes[y]
      ? playGroundUl.childNodes[y].childNodes[0].childNodes[x]
      : null;
    const 이동가능여부 = checkEmpty(target);
    if (이동가능여부) target.classList.add(type, "moving");
    else {
      tempMovingItem = { ...movingItem };
      if(방향 === 'retry'){
        clearInterval(하강인터벌)
        show게임오버()
      }
      setTimeout(() => {
        블록제작('retry');
        if (방향 === "top") seizeBlock();
      }, 0);
      return true;
    }
  });
  movingItem.left = left;
  movingItem.top = top;
  movingItem.direction = direction;
}

function seizeBlock() {
  document.querySelectorAll(".moving").forEach((m) => {
    m.classList.remove("moving");
    m.classList.add("seized");
  });
  한줄완성체크()

}

function 한줄완성체크() {
  const childNodes = playGroundUl.childNodes;
  childNodes.forEach(c => {
    let 한줄완성 = true;
    c.children[0].childNodes.forEach(li => {
      if(!li.classList.contains('seized')){
        한줄완성 = false
      }
    })
    if(한줄완성){
      c.remove();
      라인추가();
      score++;
      scoreDisplay.innerText = score;
    }
  })

  새블록제작()
}

function 새블록제작() {
  clearInterval(하강인터벌);
  하강인터벌 = setInterval(() => {
    블록이동('top',1)
  },하강시간)

  const 블록배열 = Object.entries(BLOCKS)
  const 랜덤숫자 = Math.floor(Math.random()* 블록배열.length)
  
  movingItem.type = 블록배열[랜덤숫자][0]
  movingItem.top = 0;
  movingItem.left = 3;
  movingItem.direction = 0;
  tempMovingItem = { ...movingItem };
  블록제작();
}

function checkEmpty(target) {
  if (!target || target.classList.contains("seized")) return false;
  else return true;
}

function 블록이동(방향, 키) {
  tempMovingItem[방향] += 키;
  블록제작(방향);
}

function 방향변경() {
  tempMovingItem.direction == 3 ? 
  tempMovingItem.direction = 0
  : tempMovingItem.direction += 1
  블록제작()
}

function 드랍블록() {
  clearInterval(하강인터벌)
  하강인터벌 = setInterval(() => {
    블록이동('top',1)
  },20)
}

function show게임오버() {
  gameTxt.style.display = "flex"
}

다시시작버튼.addEventListener("click", () => {
  playGroundUl.innerHTML = "";
  gameTxt.style.display = "none"
  init()
})

// 방향키로 블록 이동
document.addEventListener("keydown", (e) => {
  switch (e.keyCode) {
    case 39: // 아래
      블록이동("left", 1);
      break;
    case 37: // 오른쪽
      블록이동("left", -1);
      break;
    case 40: // 왼쪽
      블록이동("top", 1);
      break;
    case 38: // 위
      방향변경();
      break;
    case 32: // 스페이스
      드랍블록();
      break;
    default:
      break;
  }
});
