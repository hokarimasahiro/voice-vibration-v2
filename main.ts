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
        受信文字列 = "" + 受信文字列 + "V"
    } else if (モード == 2) {
        v = "V"
    }
})
function panic (回数: number) {
    モーターON()
    for (let index = 0; index < 回数; index++) {
        LED点灯()
        basic.pause(100)
    }
    strip.showColor(neopixel.colors(NeoPixelColors.Black))
    モーターOFF(音量閾値)
}
radio.onReceivedString(function (receivedString) {
    受信文字列 = receivedString
    limittime = input.runningTime() + ideltime
})
function LED点灯 () {
    strip.setPixelColor((input.runningTime() / 200 + 0) % 4, neopixel.colors(NeoPixelColors.Red))
    strip.setPixelColor((input.runningTime() / 200 + 1) % 4, neopixel.colors(NeoPixelColors.Orange))
    strip.setPixelColor((input.runningTime() / 200 + 2) % 4, neopixel.colors(NeoPixelColors.Green))
    strip.setPixelColor((input.runningTime() / 200 + 3) % 4, neopixel.colors(NeoPixelColors.Yellow))
    strip.show()
}
function モーターOFF (閾値: number) {
    pins.digitalWritePin(DigitalPin.P2, 0)
    basic.pause(100)
    input.setSoundThreshold(SoundThreshold.Loud, 閾値)
}
let b = ""
let a = ""
let limittime = 0
let v = ""
let 受信文字列 = ""
let ideltime = 0
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
ideltime = 300
ICON表示(モード)
while (input.buttonIsPressed(Button.A) || input.buttonIsPressed(Button.B)) {
	
}
basic.forever(function () {
    if (input.runningTime() > limittime) {
        受信文字列 = ""
    }
    if (受信文字列.includes("A")) {
        LED点灯()
    } else {
        strip.showColor(neopixel.colors(NeoPixelColors.Black))
    }
    if (受信文字列.includes("B")) {
        モーターON()
    } else {
        モーターOFF(音量閾値)
    }
    if (受信文字列.includes("V") && モード != 2) {
        panic(4)
    }
    if (input.buttonIsPressed(Button.A)) {
        a = "A"
    } else {
        a = ""
    }
    if (input.buttonIsPressed(Button.B)) {
        b = "B"
    } else {
        b = ""
    }
    if ("" + a + b + v != "" && モード != 1) {
        radio.sendString("" + a + b + v)
        v = ""
    }
    basic.pause(ideltime / 10)
})
