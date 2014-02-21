var digitalClock = function (config) {
    var _arrayNum = [];
    for (var i = 0; i < config.ledNum.length; i++) {
        _arrayNum.push(config.ledNum.substring(i, i + 1));
    }
    var oConfig = {
        oObj: config.element,
        iDigitWidth: (config.iDigitWidth) ? config.iDigitWidth : 50,
        iLineSize: (config.iLineSize) ? config.iLineSize : 8,
        iGap: (config.iGap) ? config.iGap : 1,
        sDigitColor: (config.sDigitColor) ? config.sDigitColor : '#000000'
    },
        arrayNum = _arrayNum;
    aWidths = [],
	    oLefts = {},
	    aDigits = new Array(arrayNum.length * 2),
	    aCanvas = [];
    function Digit(bReal, iPos) {
        var iTotal, i, iLeft,
            iLineSize = oConfig.iLineSize,
            iDigitWidth = oConfig.iDigitWidth;
        aWidths.push(iDigitWidth);
        var iA = iLineSize / 2,
		    iB = iLineSize + oConfig.iGap,
		    iC = iDigitWidth - iB,
		    iD = iDigitWidth - iLineSize,
		    iN = iA + oConfig.iGap,
		    iE = iDigitWidth - iN,
            iF = iDigitWidth - iA,
            iG = iF + oConfig.iGap,
            iH = iDigitWidth - oConfig.iGap,
            iI = iDigitWidth + oConfig.iGap,
            iJ = iC + iD,
            iK = iD * 2,
            iL = iDigitWidth + iC,
            iM = iF * 2,
            iO = iDigitWidth * 2 - iLineSize,
            iP = (oConfig.iDigitWidth - iLineSize) / 2,
            iQ = (oConfig.iDigitWidth * 2 - iLineSize) - (iP + iLineSize),
            eCanvas = document.createElement('CANVAS');

        eCanvas.width = iDigitWidth;
        eCanvas.height = iO;
        eCanvas.id = '_' + (aWidths.length);

        if (!(iPos in oLefts)) {
            iTotal = 0;
            for (i = 0; i < aWidths.length - 1; i++) {
                iTotal = iTotal + aWidths[i];
            }
            iLeft = (aWidths.length == 1) ? 0 : iTotal + (aWidths.length - 1) * oConfig.iLineSize;
            oLefts[iPos] = iLeft;
        }

        eCanvas.style.left = oLefts[iPos] + 'px';
        eCanvas.style.opacity = (bReal) ? '1' : '0.2';

//        var eElem = document.getElementById(oConfig.oObj);
//        eElem.appendChild(eCanvas);
        oConfig.oObj.appendChild(eCanvas);
        if (eCanvas && eCanvas.getContext) {
            this.context = eCanvas.getContext('2d');
            aCanvas.push(this.context);
            if (this.context) {
                this.context.fillStyle = oConfig.sDigitColor;
            }
        }

        this.drawDigit = function (iNum) {
            var positions = {
                0: 'top',
                1: 'topLeft',
                2: 'topRight',
                3: 'middle',
                4: 'bottomLeft',
                5: 'bottomRight',
                6: 'bottom',
                7: 'topDivider',
                8: 'bottomDivider'
            },
			map = [],
			bars, position;
            switch (iNum) {
                case "1":
                    map = [2, 5];
                    break;
                case "2":
                    map = [0, 2, 3, 4, 6];
                    break;
                case "3":
                    map = [0, 2, 3, 5, 6];
                    break;
                case "4":
                    map = [1, 2, 3, 5];
                    break;
                case "5":
                    map = [0, 1, 3, 5, 6];
                    break;
                case "6":
                    map = [0, 1, 3, 4, 5, 6];
                    break;
                case "7":
                    map = [0, 2, 5];
                    break;
                case "8":
                    map = [0, 1, 2, 3, 4, 5, 6];
                    break;
                case "9":
                    map = [0, 1, 2, 3, 5, 6];
                    break;
                case "0":
                    map = [0, 1, 2, 4, 5, 6];
                    break;
                case "-":
                    map = [3];
                    break;
                default:
                    map = [8];
            }

            bars = map.length;
            while (bars--) {
                position = positions[map[bars]];
                this.drawBars(this.getBarPosition(position), this.getBarPath(position));
            }
        };

        this.getBarPosition = function (sPosition) {
            var barPosition = {
                'top': [oConfig.iGap, 0],
                'topLeft': [0, oConfig.iGap],
                'topRight': [iD, iB],
                'middle': [iN, iF],
                'bottomLeft': [0, iI],
                'bottomRight': [iD, iI],
                'bottom': [oConfig.iGap, iM],
                'topDivider': [0, iP],
                'bottomDivider': [0, iQ]
            };
            return barPosition[sPosition];
        };

        this.getBarPath = function (sPosition) {
            var barPath = {
                'top': [[iH, 0], [iC, iLineSize], [iB, iLineSize]],
                'topLeft': [[iLineSize, iB], [iLineSize, iC], [iA, iE], [0, iC]],
                'topRight': [[iDigitWidth, oConfig.iGap], [iDigitWidth, iC], [iF, iE], [iD, iC]],
                'middle': [[iB, iD], [iC, iD], [iE, iF], [iC, iDigitWidth], [iB, iDigitWidth]],
                'bottomLeft': [[iA, iG], [iLineSize, iI], [iLineSize, iJ], [0, iL]],
                'bottomRight': [[iF, iG], [iDigitWidth, iI], [iDigitWidth, iL], [iD, iJ]],
                'bottom': [[iB, iK], [iC, iK], [iH, iM]],
                'topDivider': [[iLineSize, iP], [iLineSize, (iP + iLineSize)], [0, (iP + iLineSize)]],
                'bottomDivider': [[iLineSize, iQ], [iLineSize, (iQ + iLineSize)], [0, (iQ + iLineSize)]]
            };
            return barPath[sPosition];
        };

        this.drawBars = function () {
            var a = arguments,
			    c = this.context,
			    color = this.hexToRGB(oConfig.sDigitColor);
            if (a.length !== 2) { return; }
            c.beginPath();
            c.moveTo(a[0][0], a[0][1]);
            for (var i = 0; i < a[1].length; i++) {
                c.lineTo(a[1][i][0], a[1][i][1]);
            }
            c.shadowOffsetX = -8;
            c.shadowOffsetY = -8;
            c.shadowBlur = 8;
            //c.shadowColor = 'rgba(' + color[0] + ', ' + color[1] + ', ' + color[2] + ', 0.3)';
            c.fill();
            c.closePath();
        };

        this.resetCanvas = function (iNum) {
            if (aCanvas[iNum]) {
                aCanvas[iNum].clearRect(0, 0, eCanvas.width, eCanvas.height);
            }
        };

        this.hexToRGB = function (sHex) {
            var h = (sHex.charAt(0) == "#") ? sHex.substring(1, 7) : sHex,
			r = parseInt(h.substring(0, 2), 16),
			g = parseInt(h.substring(2, 4), 16),
			b = parseInt(h.substring(4, 6), 16),
			rgb = [r, g, b];
            return rgb;
        };

    }

    var initNum = function () {
        for (var i = 0; i < arrayNum.length; i++) {
            aDigits[arrayNum.length + i].drawDigit(arrayNum[i]);
        }
    };
    var initDigits = function () {
        var iPos = 1, t, bReal, n;
        for (t = 0; t < aDigits.length; t++) {
            bReal = (t > arrayNum.length - 1) ? true : false;
            aDigits[t] = new Digit(bReal, iPos);
            if (t < arrayNum.length) {
                //aDigits[t].drawDigit("8");
            }
            iPos = (iPos == arrayNum.length) ? 1 : iPos + 1;
        }
        return true;
    };
    if (initDigits()) {
        initNum();
    }
}
