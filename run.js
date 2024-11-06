// ゲームのシーンデータ
const scenes = function* () {
    yield "(アナザールート)"
    yield "「20歳になる前に」"
    yield ["fadeOut"]
    yield ["image", "./images/school.png"]
    yield ["bgm", "./sounds/シーンと静まり返る教室.mp3"]
    yield ["fadeIn"]
    yield "眠い..."
    yield "夢を見ていたような気がする"
    yield "或いは別世界の私"
    yield "先生:;〇〇! 起きろ!"
    yield "寝起き、机の木の香りがした"
    yield ["fadeOut"]
    yield ["image", "./images/veranda.png"]
    yield ["bgm", "./sounds/天候・荒野の風.mp3"]
    yield ["fadeIn"]
    yield "超高層ビル群の間の僅かな日の光を浴びにベランダへ向かう"
    yield "放送:;本日の大気中プラスチック濃度は3000μg/m3;外出はお控えください;風向きは--"
    yield "ビル風が皮膚を切り裂くように吹く"
    yield "高度600m;下を見れば遥か下方でオートマタが躍っている"
    yield "今日はお父さんと会う日だった"
    yield "エレベータは15分待ち;予約しててよかった"
    yield ["fadeOut"]
    yield ["image", "./images/car.png"]
    yield ["bgm", "./sounds/道路.mp3"]
    document.getElementById("gameImage").classList.toggle("vibrating-image")
    yield ["fadeIn"]
    yield "半自動運転車が荒れた道を走る"
    yield "お父さん:;..."
    yield "お父さん:;久しぶり、元気か?"
    yield ["question", ["元気", "そこそこ"]]
    yield "お父さん:;そうか"
    yield ["sleep", 2000]
    yield "お父さん:;お母さんとは仲良くやってるか?"
    yield ["question", ["うん", "そこそこ"]]
    yield "お父さん:;そうか"
    yield ["sleep", 2000]
    yield "お父さん:;なんか食べたいものあるか?"
    const meal = yield ["question", ["ラーメン", "寿司"]]
    if (meal == 0) yield "お父さん:;ラーメンか、いいな"
    else if (meal == 1) yield "お父さん:;寿司か、いいな"
    yield "時速60kmでコンクリート色の風景が通り過ぎて行った"
    yield ["fadeOut"]
    document.getElementById("gameImage").classList.toggle("vibrating-image")
    yield ["bgm", "./sounds/大都会.mp3"]
    yield ["image", "./images/apart.png"]
    yield ["fadeIn"]
    yield "共用部分の蛍光灯が切れかけている"
    yield "誰もそんなこと気にしないけど"
    yield "廊下の隅でオートマタが躍っている"
    yield "取っ手を握ると独りでに鍵が開き、電子音声が既に意味を失った挨拶を述べた"
    yield "お母さん:;お帰り〇〇ちゃん"
    yield "お母さん:;ごはん何食べたの?"
    yield ["question", ["ラーメン", "寿司"]]
    yield "お母さん:;良かったわね"
    yield "お母さん:;今日夜勤だから、ご飯作ってあるから、食べてね"
    yield ["question", ["はい"]]
    yield ["fadeOut"]
    yield ["image", "./images/my_room.png"]
    BGM.pause()
    yield ["fadeIn"]
    yield "机から紙の束を取り出す"
    yield "自分の字が紙面をのたくっていた"
    yield "小学2年生の手が私の首を絞め続けている"
    yield "小学2年生の手が私の首を絞め続けている"
    yield "今日だと決めたのはその頃だったかなあ"
    yield "飲み干したヒドラが最後の抵抗をする"
    yield "意味もないのに片づけた"
    yield "椅子に座ってペンを握った"
    yield ["bgm", "./sounds/シャーペンで字を書く.mp3"]
    yield "「午後9時 入れた」"
    yield "私はこの世界が嫌いなわけじゃない"
    yield "「午後10時 意識ははっきりしている」"
    yield "だけど生き続けることを想像できなかった"
    yield "「11時 ふわふわしている」"
    yield "私には難しかった"
    yield "「午後1 私は2時」"
    document.getElementById("gameImage").style.display = "none"
    BGM.pause()
    yield "ただそれだけなんだ"
}

const story = scenes()

let intervalId
let canNext = true
let BGM

const textArea = document.getElementById("gameText")

const nextText = (result) => {
    if (!canNext) return

    clearInterval(intervalId)

    const next = story.next(result)
    const command = next.value

    if (next.done) {
        textArea.textContent = "終わり"
        return
    }

    textArea.textContent = "" // テキストエリアを一旦クリア

    if (typeof command == "string") solveText(command)
    else solveCommand(command)
}

// テキストを表示
const solveText = (text) => {
    canNext = false
    // 文字を徐々に表示する処理
    let index = 0
    intervalId = setInterval(() => {
        if (index < text.length) {
            const char = text.charAt(index)

            if (char == ";") textArea.innerHTML += "<br />"
            else textArea.innerHTML += char
            index++
        } else {
            canNext = true
            clearInterval(intervalId) // すべて表示したら停止
        }
    }, 16) // 50msごとに1文字表示
}

// 特殊処理コマンド
const solveCommand = async (command) => {
    const [commandType, ...args] = command

    canNext = false

    let result

    if (commandType === "fadeOut") await fadeOut()
    else if (commandType === "fadeIn") await fadeIn()
    else if (commandType === "question") result = await question(args[0])
    else if (commandType === "sleep") await sleep(args[0])
    else if (commandType === "image") await image(args[0])
    else if (commandType === "bgm") await bgm(args[0])

    canNext = true

    nextText(result)
}

// フェードアウト処理（画面を徐々に暗くする）
const fadeOut = async () => {
    return new Promise((resolve) => {
        const gameContainer = document.querySelector(".game-container")
        let opacity = 1.0

        // 透明度を徐々に下げる
        intervalId = setInterval(() => {
            if (opacity > 0) {
                opacity -= 0.05
                gameContainer.style.opacity = opacity
            } else {
                resolve()
                clearInterval(intervalId)
            }
        }, 30) // 30msごとに透明度を減少
    })
}

// フェードイン処理（画面を徐々に明るくする）
const fadeIn = async () => {
    return new Promise((resolve) => {
        const gameContainer = document.querySelector(".game-container")
        let opacity = 0

        // 透明度を徐々に上げる
        intervalId = setInterval(() => {
            if (opacity < 1) {
                opacity += 0.05
                gameContainer.style.opacity = opacity
            } else {
                resolve()
                clearInterval(intervalId)
            }
        }, 30) // 30msごとに透明度を増加
    })
}

// 質問
const question = async (options) => {
    textArea.style.textAlign = "center"

    return new Promise((resolve) => {
        const questionArea = document.createElement("div")
        questionArea.className = "question-buttons"

        textArea.appendChild(questionArea)

        // 選択肢を生成
        options.forEach((option, i) => {
            const button = document.createElement("button")
            button.className = "option"
            button.textContent = option

            // 選択肢がクリックされたら解決
            button.addEventListener("click", () => {
                resolve(i) // 選択された値を返す
                textArea.style.textAlign = "left"
            })

            questionArea.appendChild(button)
        })
    })
}

const sleep = async (ms) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, ms)
    })
}

const image = async (path) => {
    return new Promise((resolve, reject) => {
        const image = document.getElementById("gameImage")
        image.onload = () => {
            resolve()
        }
        image.src = path
    })
}

const bgm = async (path) => {
    if (BGM) BGM.pause()

    BGM = new Audio(path)
    BGM.loop = true
    BGM.volume = 0.5

    return BGM.play()
}

// テキストエリアをクリックで進むようにイベントリスナーを追加
textArea.addEventListener("click", (e) => {
    // クリックされた要素がボタン以外の場合のみnextTextを実行
    if (canNext && e.target.tagName !== "BUTTON") {
        nextText()
    }
})

document.addEventListener("keydown", (e) => {
    if (canNext && ["KeyZ", "Enter", "Space"].includes(e.code)) {
        nextText()
    }
})

document.oncontextmenu = () => false
