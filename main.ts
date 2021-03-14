function ICON表示 (No: number) {
    if (No == 1) {
        basic.showLeds(`
            . . # . .
            . . # . .
            # . # . #
            . # # # .
            . . # . .
            `)
    } else if (No == 2) {
        basic.showLeds(`
            . . # . .
            . # # # .
            # . # . #
            . . # . .
            . . # . .
            `)
    } else if (No == 3) {
        basic.showLeds(`
            . # . # .
            # # # # #
            # # # # #
            . # # # .
            . . # . .
            `)
    } else {
        basic.showLeds(`
            . . # . .
            . # # # .
            . . # . .
            . # # # .
            . . # . .
            `)
    }
}
function モーターON () {
    input.setSoundThreshold(SoundThreshold.Loud, 255)
    pins.digitalWritePin(DigitalPin.P2, 1)
}
input.onSound(DetectedSound.Loud, function () {
    if (モード == 0) {
        LED点灯()
        モーターON()
        motorlimit = input.runningTime() + 200
    } else if (モード == 2) {
        v = "V"
    }
})
radio.onReceivedString(function (receivedString) {
    radiolimit = input.runningTime() + radioidel
    if (receivedString.includes("A")) {
        LED点灯()
    } else {
        strip.showColor(neopixel.colors(NeoPixelColors.Black))
    }
    if (モード != 2) {
        if (receivedString.includes("B") && motorlimit == 0) {
            モーターON()
        } else {
            モーターOFF()
        }
    }
})
function LED点灯 () {
    strip.setPixelColor((input.runningTime() / 200 + 0) % 4, neopixel.colors(NeoPixelColors.Red))
    strip.setPixelColor((input.runningTime() / 200 + 1) % 4, neopixel.colors(NeoPixelColors.Orange))
    strip.setPixelColor((input.runningTime() / 200 + 2) % 4, neopixel.colors(NeoPixelColors.Green))
    strip.setPixelColor((input.runningTime() / 200 + 3) % 4, neopixel.colors(NeoPixelColors.Yellow))
    strip.show()
}
function モーターOFF () {
    pins.digitalWritePin(DigitalPin.P2, 0)
    voicelimit = input.runningTime() + voiceidel
}
let 今回送信文字列 = ""
let voicelimit = 0
let v = ""
let motorlimit = 0
let radiolimit = 0
let voiceidel = 0
let radioidel = 0
let モード = 0
let 音量閾値 = 0
let strip: neopixel.Strip = null
strip = neopixel.create(DigitalPin.P1, 4, NeoPixelMode.RGB)
strip.showColor(neopixel.colors(NeoPixelColors.Black))
radio.setGroup(33)
if (input.buttonIsPressed(Button.A)) {
    音量閾値 = 255
    モード = 1
} else if (input.buttonIsPressed(Button.B)) {
    音量閾値 = 128
    モード = 2
} else {
    音量閾値 = 128
    モード = 0
}
input.setSoundThreshold(SoundThreshold.Loud, 音量閾値)
radio.setGroup(33)
radioidel = 100
voiceidel = 200
radiolimit = 0
motorlimit = 0
let 前回送信文字列 = ""
ICON表示(モード)
while (input.buttonIsPressed(Button.A) || input.buttonIsPressed(Button.B)) {
	
}
basic.forever(function () {
    let vlimit = 0
    if (input.runningTime() > motorlimit) {
        motorlimit = 0
        モーターOFF()
        strip.showColor(neopixel.colors(NeoPixelColors.Black))
    }
    if (input.runningTime() > voicelimit) {
        input.setSoundThreshold(SoundThreshold.Loud, 音量閾値)
    }
    今回送信文字列 = ""
    if (input.buttonIsPressed(Button.A)) {
        今回送信文字列 = "" + 今回送信文字列 + "A"
    }
    if (input.buttonIsPressed(Button.B)) {
        今回送信文字列 = "" + 今回送信文字列 + "B"
    }
    if (input.logoIsPressed()) {
        今回送信文字列 = "" + 今回送信文字列 + "AB"
    }
    今回送信文字列 = "" + 今回送信文字列 + v
    if (input.runningTime() > vlimit) {
        v = ""
    }
    if (モード != 1) {
        if (今回送信文字列 != "" || 前回送信文字列 != "") {
            radio.sendString(今回送信文字列)
            前回送信文字列 = 今回送信文字列
        }
    }
    basic.pause(radioidel / 10)
})
